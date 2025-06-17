const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);
  const CollateralToken = await hre.ethers.getContractFactory("CollateralToken");
  const collateral = await CollateralToken.deploy();
  await collateral.deployed();

  const LoanToken = await hre.ethers.getContractFactory("LoanToken");
  const loan = await LoanToken.deploy();
  await loan.deployed();

  const LendingProtocol = await hre.ethers.getContractFactory("LendingProtocol");
  const protocol = await LendingProtocol.deploy(collateral.address, loan.address);
  await protocol.deployed();

  console.log("CollateralToken:", collateral.address);
  console.log("LoanToken:", loan.address);
  console.log("LendingProtocol:", protocol.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});