// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AssetVault
 * @dev Main vault contract for managing RWA deposits and yield distribution
 */
contract AssetVault is ReentrancyGuard, Ownable {
    IERC20 public usdc;
    
    struct UserVault {
        uint256 totalDeposited;
        uint256 currentBalance;
        uint256 yieldAccrued;
        string strategy;
        uint256 lastYieldUpdate;
    }
    
    struct Investment {
        address dealToken;
        uint256 amount;
        uint256 percentage;
        uint256 yieldEarned;
    }
    
    mapping(address => UserVault) public vaults;
    mapping(address => Investment[]) public investments;
    mapping(address => bool) public authorizedDeals;
    
    uint256 public platformFeePercentage = 100; // 1% = 100 basis points
    uint256 public totalAssetsManaged;
    
    address public feeRecipient;
    
    event Deposited(address indexed user, uint256 amount, string strategy);
    event Withdrawn(address indexed user, uint256 amount);
    event YieldDistributed(address indexed user, uint256 amount);
    event InvestmentAdded(address indexed user, address indexed deal, uint256 amount);
    event DealAuthorized(address indexed dealToken);
    
    modifier onlyAuthorizedDeal() {
        require(authorizedDeals[msg.sender], "Not authorized deal");
        _;
    }
    
    constructor(address _usdc, address _feeRecipient) {
        usdc = IERC20(_usdc);
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Deposit funds to vault
     * @param amount Amount to deposit
     * @param strategy Investment strategy (conservative, balanced, aggressive)
     */
    function deposit(uint256 amount, string memory strategy) external nonReentrant {
        require(amount > 0, "Deposit amount must be greater than 0");
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        UserVault storage vault = vaults[msg.sender];
        vault.totalDeposited += amount;
        vault.currentBalance += amount;
        vault.strategy = strategy;
        vault.lastYieldUpdate = block.timestamp;
        
        totalAssetsManaged += amount;
        
        emit Deposited(msg.sender, amount, strategy);
    }
    
    /**
     * @dev Withdraw funds from vault
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        UserVault storage vault = vaults[msg.sender];
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(vault.currentBalance >= amount, "Insufficient balance");
        
        uint256 fee = (amount * platformFeePercentage) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        vault.currentBalance -= amount;
        totalAssetsManaged -= amount;
        
        require(usdc.transfer(msg.sender, amountAfterFee), "Transfer failed");
        require(usdc.transfer(feeRecipient, fee), "Fee transfer failed");
        
        emit Withdrawn(msg.sender, amountAfterFee);
    }
    
    /**
     * @dev Add investment to vault from approved deal
     * @param user User address
     * @param dealToken Deal token address
     * @param amount Investment amount
     */
    function addInvestment(
        address user,
        address dealToken,
        uint256 amount,
        uint256 percentage
    ) external onlyAuthorizedDeal nonReentrant {
        Investment memory inv = Investment({
            dealToken: dealToken,
            amount: amount,
            percentage: percentage,
            yieldEarned: 0
        });
        
        investments[user].push(inv);
        emit InvestmentAdded(user, dealToken, amount);
    }
    
    /**
     * @dev Distribute yield to user
     * @param user User address
     * @param yieldAmount Yield amount
     */
    function distributeYield(address user, uint256 yieldAmount) external onlyOwner nonReentrant {
        UserVault storage vault = vaults[user];
        vault.yieldAccrued += yieldAmount;
        vault.currentBalance += yieldAmount;
        
        emit YieldDistributed(user, yieldAmount);
    }
    
    /**
     * @dev Get user vault info
     * @param user User address
     */
    function getVaultInfo(address user) external view returns (UserVault memory) {
        return vaults[user];
    }
    
    /**
     * @dev Get user investments
     * @param user User address
     */
    function getUserInvestments(address user) external view returns (Investment[] memory) {
        return investments[user];
    }
    
    /**
     * @dev Authorize a deal contract
     * @param dealToken Deal token address
     */
    function authorizeDeal(address dealToken) external onlyOwner {
        authorizedDeals[dealToken] = true;
        emit DealAuthorized(dealToken);
    }
    
    /**
     * @dev Update platform fee
     * @param newFee New fee in basis points (100 = 1%)
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFeePercentage = newFee;
    }
}
