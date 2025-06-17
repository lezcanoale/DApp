const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const tokenAddress = "0x9Aacc8E04fDc95fACf1A66c6dBFAc79db244465F"; // ← Cambiá por la real
  const CollateralToken = await hre.ethers.getContractAt("CollateralToken", tokenAddress);
  
  const recipient = "0x5Dd97027c9D7d18351A1f0192E07b11CF49e28FC"; // ← Tu cuenta MetaMask
  const amount = hre.ethers.utils.parseUnits("1000", 18);

  const tx = await CollateralToken.mint(recipient, amount);
  await tx.wait();
  console.log("Minted 1000 cUSD to", recipient);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
