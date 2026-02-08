import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  const Reward = await ethers.getContractFactory("GameRewardToken");
  const reward = await Reward.deploy();
  await reward.waitForDeployment();

  const NFT = await ethers.getContractFactory("GameItemNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  const Staking = await ethers.getContractFactory("GameItemStaking");
  const rewardRatePerSecond = ethers.parseEther("1");
  const staking = await Staking.deploy(
    await nft.getAddress(),
    await reward.getAddress(),
    rewardRatePerSecond
  );
  await staking.waitForDeployment();

  const MINTER_ROLE = await reward.MINTER_ROLE();
  await reward.grantRole(MINTER_ROLE, await staking.getAddress());

  console.log("Reward:", await reward.getAddress());
  console.log("NFT:", await nft.getAddress());
  console.log("Staking:", await staking.getAddress());
}

main().catch(console.error);
