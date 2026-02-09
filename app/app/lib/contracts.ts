import { BrowserProvider, Contract, type Provider, type Signer } from "ethers";
import NFT_ABI from "./abis/GameItemNFT.json";
import REWARD_ABI from "./abis/GameRewardToken.json";
import STAKING_ABI from "./abis/Staking.json";

export const NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS || "0xFFEA2387762Fd2368c0CfCD0d2716757003c669a";
export const REWARD_ADDRESS = process.env.NEXT_PUBLIC_REWARD_ADDRESS || "0xB3237f7183A1bAEF1B04C83bC48f88b80d09CfC6";
export const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_ADDRESS || "0xFd554DC848721C89d09Cb51696272EC040c142Ac";

export function getProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }
  return new BrowserProvider(window.ethereum);
}

// Helper to get a contract instance (Read-only by default)
export function getNFTContract(runner: Provider | Signer) {
  return new Contract(NFT_ADDRESS, NFT_ABI.abi, runner);
}

export function getRewardContract(runner: Provider | Signer) {
  return new Contract(REWARD_ADDRESS, REWARD_ABI.abi, runner);
}

export function getStakingContract(provider: BrowserProvider) {
  return new Contract(STAKING_ADDRESS, STAKING_ABI.abi, provider);
}

export function getRewardTokenContract(provider: BrowserProvider) {
  return new Contract(REWARD_ADDRESS, REWARD_ABI.abi, provider);
}

export async function getStakingContractWithSigner() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new Contract(STAKING_ADDRESS, STAKING_ABI.abi, signer);
}

export async function getNFTContractWithSigner() {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new Contract(NFT_ADDRESS, NFT_ABI.abi, signer);
}
