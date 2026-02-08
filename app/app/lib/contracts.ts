import { BrowserProvider, Contract } from "ethers";
import NFT_ABI from "./abis/GameItemNFT.json";
import REWARD_ABI from "./abis/GameRewardToken.json";
import STAKING_ABI from "./abis/Staking.json";

export const NFT_ADDRESS =
  "0xFFEA2387762Fd2368c0CfCD0d2716757003c669a";

export const REWARD_ADDRESS =
  "0xB3237f7183A1bAEF1B04C83bC48f88b80d09CfC6";

export const STAKING_ADDRESS =
  "0xFd554DC848721C89d09Cb51696272EC040c142Ac";

export function getProvider() {
  return new BrowserProvider(window.ethereum);
}

export async function getNFTContract() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new Contract(NFT_ADDRESS, NFT_ABI.abi, signer);
}
