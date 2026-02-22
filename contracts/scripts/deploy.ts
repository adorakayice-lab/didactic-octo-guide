import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting AssetBridge Nexus contract deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, `(ChainID: ${network.chainId})\n`);

  // Mock USDC address (in production, use real USDC)
  const mockUSDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Mainnet USDC
  const feeRecipient = deployer.address;

  try {
    // Deploy AssetVault
    console.log("📦 Deploying AssetVault contract...");
    const AssetVault = await hre.ethers.getContractFactory("AssetVault");
    const vault = await AssetVault.deploy(mockUSDCAddress, feeRecipient);
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log("✅ AssetVault deployed at:", vaultAddress);

    // Deploy CreditToken
    console.log("\n📦 Deploying CreditToken contract...");
    const CreditToken = await hre.ethers.getContractFactory("CreditToken");
    const creditToken = await CreditToken.deploy(
      "Tech Startup Series A",
      12, // 12% APY
      24, // 24 months term
      1000000 // 1M tokens
    );
    await creditToken.waitForDeployment();
    const creditTokenAddress = await creditToken.getAddress();
    console.log("✅ CreditToken deployed at:", creditTokenAddress);

    // Save deployment addresses
    const deploymentAddresses = {
      network: network.name,
      chainId: network.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        AssetVault: vaultAddress,
        CreditToken: creditTokenAddress,
      },
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    fs.writeFileSync(
      path.join(deploymentsDir, `${network.name}-deployment.json`),
      JSON.stringify(deploymentAddresses, null, 2)
    );

    console.log("\n📝 Deployment Summary:");
    console.log("─".repeat(50));
    console.log("Network:", network.name);
    console.log("AssetVault:", vaultAddress);
    console.log("CreditToken:", creditTokenAddress);
    console.log("─".repeat(50));
    console.log("✨ Deployment complete!\n");

    // Verify contracts on Etherscan (if applicable)
    if (network.name !== "hardhat" && network.name !== "localhost") {
      console.log("🔍 Waiting for block confirmations...");
      await vault.waitForDeployment();
      await creditToken.waitForDeployment();

      console.log("📋 Run the following commands to verify contracts on Etherscan:");
      console.log(`
npx hardhat verify --network ${network.name} ${vaultAddress} "${mockUSDCAddress}" "${feeRecipient}"
npx hardhat verify --network ${network.name} ${creditTokenAddress} "Tech Startup Series A" 12 24 1000000
      `);
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
