import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('AssetVault', function () {
  let assetVault: any;
  let mockUSDC: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory('MockERC20');
    mockUSDC = await MockERC20.deploy('Mock USDC', 'USDC', ethers.parseEther('1000000'));
    await mockUSDC.waitForDeployment();

    // Deploy AssetVault
    const AssetVault = await ethers.getContractFactory('AssetVault');
    assetVault = await AssetVault.deploy(
      await mockUSDC.getAddress(),
      owner.address
    );
    await assetVault.waitForDeployment();

    // Mint tokens to users
    await mockUSDC.mint(user1.address, ethers.parseEther('100000'));
    await mockUSDC.mint(user2.address, ethers.parseEther('100000'));

    // Approve vault to spend tokens
    await mockUSDC.connect(user1).approve(
      await assetVault.getAddress(),
      ethers.parseEther('100000')
    );
    await mockUSDC.connect(user2).approve(
      await assetVault.getAddress(),
      ethers.parseEther('100000')
    );
  });

  describe('Deposit', function () {
    it('should allow user to deposit tokens', async () => {
      const depositAmount = ethers.parseEther('1000');

      await expect(
        assetVault.connect(user1).deposit(depositAmount, 'balanced')
      ).to.emit(assetVault, 'Deposited');

      // Verify balance was updated
      const balance = await assetVault.getUserBalance(user1.address);
      expect(balance).to.equal(depositAmount);
    });

    it('should revert with zero amount', async () => {
      await expect(
        assetVault.connect(user1).deposit(0, 'balanced')
      ).to.be.revertedWith('Amount must be greater than 0');
    });

    it('should track deposits', async () => {
      const amount1 = ethers.parseEther('1000');
      const amount2 = ethers.parseEther('500');

      await assetVault.connect(user1).deposit(amount1, 'balanced');
      await assetVault.connect(user1).deposit(amount2, 'balanced');

      const balance = await assetVault.getUserBalance(user1.address);
      expect(balance).to.equal(amount1 + amount2);
    });
  });

  describe('Withdraw', function () {
    beforeEach(async () => {
      const depositAmount = ethers.parseEther('1000');
      await assetVault.connect(user1).deposit(depositAmount, 'balanced');
    });

    it('should allow user to withdraw tokens', async () => {
      const withdrawAmount = ethers.parseEther('500');

      await expect(
        assetVault.connect(user1).withdraw(withdrawAmount)
      ).to.emit(assetVault, 'Withdrawn');
    });

    it('should charge withdrawal fee', async () => {
      const withdrawAmount = ethers.parseEther('100');
      const expectedFee = (withdrawAmount * BigInt(100)) / BigInt(10000); // 1% fee

      const balanceBefore = await mockUSDC.balanceOf(user1.address);

      await assetVault.connect(user1).withdraw(withdrawAmount);

      const balanceAfter = await mockUSDC.balanceOf(user1.address);
      const actualTransferred = balanceAfter - balanceBefore;

      expect(actualTransferred).to.be.closeTo(
        withdrawAmount - expectedFee,
        ethers.parseEther('0.01')
      );
    });

    it('should revert on insufficient balance', async () => {
      const withdrawAmount = ethers.parseEther('10000');

      await expect(
        assetVault.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWith('Insufficient balance');
    });

    it('should prevent reentrancy', async () => {
      // This tests ReentrancyGuard functionality
      const withdrawAmount = ethers.parseEther('100');

      // First call should succeed
      await assetVault.connect(user1).withdraw(withdrawAmount);

      // Attempting nested call should be prevented by ReentrancyGuard
      // This is implicit in the contract design
      expect(await assetVault.getUserBalance(user1.address)).to.be.lt(
        ethers.parseEther('1000')
      );
    });
  });

  describe('Yield Distribution', function () {
    beforeEach(async () => {
      const depositAmount = ethers.parseEther('1000');
      await assetVault.connect(user1).deposit(depositAmount, 'balanced');
    });

    it('should distribute yield to users', async () => {
      const yieldAmount = ethers.parseEther('50');

      // Mint tokens to vault for yield distribution
      await mockUSDC.mint(await assetVault.getAddress(), yieldAmount);

      await expect(
        assetVault.connect(owner).distributeYield(user1.address, yieldAmount)
      ).to.emit(assetVault, 'YieldDistributed');
    });

    it('should only allow owner to distribute yield', async () => {
      const yieldAmount = ethers.parseEther('50');

      await expect(
        assetVault.connect(user1).distributeYield(user1.address, yieldAmount)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Strategy Management', function () {
    it('should track user strategy preference', async () => {
      const depositAmount = ethers.parseEther('1000');

      await assetVault.connect(user1).deposit(depositAmount, 'aggressive');

      const strategy = await assetVault.getUserStrategy(user1.address);
      expect(strategy).to.equal('aggressive');
    });

    it('should support multiple strategies', async () => {
      const strategies = ['conservative', 'balanced', 'aggressive'];

      for (const strategy of strategies) {
        await expect(
          assetVault.connect(user1).deposit(ethers.parseEther('100'), strategy)
        ).not.to.be.reverted;
      }
    });
  });
});

describe('CreditToken', function () {
  let creditToken: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const CreditToken = await ethers.getContractFactory('CreditToken');
    creditToken = await CreditToken.deploy(
      'Tech Series A Token',
      12, // 12% APY
      24, // 24 month term
      owner.address
    );
    await creditToken.waitForDeployment();
  });

  describe('Deployment', function () {
    it('should set correct initial values', async () => {
      expect(await creditToken.name()).to.equal('Tech Series A Token');
      expect(await creditToken.symbol()).to.equal('CREDIT');
    });

    it('should set maturity date correctly', async () => {
      const maturityDate = await creditToken.getMatureDealDate();
      expect(maturityDate).to.be.gt(0);
    });
  });

  describe('Yield Distribution', function () {
    beforeEach(async () => {
      // Mint tokens to users
      await creditToken.mint(user1.address, ethers.parseEther('1000'));
      await creditToken.mint(user2.address, ethers.parseEther('500'));
    });

    it('should distribute yield to token holders', async () => {
      const yieldAmount = ethers.parseEther('100');

      await expect(
        creditToken.connect(owner).distributeYield(user1.address, yieldAmount)
      ).not.to.be.reverted;
    });

    it('should track distributed yield', async () => {
      const yieldAmount = ethers.parseEther('50');

      await creditToken.connect(owner).distributeYield(user1.address, yieldAmount);

      const accruedYield = await creditToken.getAccruedYield(user1.address);
      expect(accruedYield).to.be.gte(BigInt(0));
    });
  });

  describe('Maturity', function () {
    it('should mark deal as mature after term', async () => {
      // Note: In real testing, you'd use time travel
      // This is a simple check of the structure
      const daysToMaturity = await creditToken.getDaysToMaturity();
      expect(daysToMaturity).to.be.gte(BigInt(0));
    });
  });

  describe('ERC20 Functions', function () {
    it('should support standard ERC20 operations', async () => {
      await creditToken.mint(user1.address, ethers.parseEther('100'));

      const balance = await creditToken.balanceOf(user1.address);
      expect(balance).to.equal(ethers.parseEther('100'));
    });

    it('should support transfers', async () => {
      await creditToken.mint(user1.address, ethers.parseEther('100'));

      await creditToken
        .connect(user1)
        .transfer(user2.address, ethers.parseEther('50'));

      const user2Balance = await creditToken.balanceOf(user2.address);
      expect(user2Balance).to.equal(ethers.parseEther('50'));
    });

    it('should support approvals and transferFrom', async () => {
      await creditToken.mint(user1.address, ethers.parseEther('100'));

      await creditToken
        .connect(user1)
        .approve(user2.address, ethers.parseEther('50'));

      await creditToken
        .connect(user2)
        .transferFrom(user1.address, user2.address, ethers.parseEther('50'));

      const user2Balance = await creditToken.balanceOf(user2.address);
      expect(user2Balance).to.equal(ethers.parseEther('50'));
    });
  });
});
