"use client";

import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

type Web3ContextType = {
  provider?: ethers.BrowserProvider;
  signer?: ethers.JsonRpcSigner;
  address?: string;
  connect: () => Promise<void>;
};

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
  const [address, setAddress] = useState<string>();

  async function connect() {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);

    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    setProvider(browserProvider);
    setSigner(signer);
    setAddress(address);
  }

  return (
    <Web3Context.Provider value={{ provider, signer, address, connect }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
