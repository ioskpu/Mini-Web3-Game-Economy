"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWeb3 } from "../providers";
import { getRewardTokenContract } from "../lib/contracts";

export default function GGOLDBalance() {
  const { provider, address } = useWeb3();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (!provider || !address) return;

    let cancelled = false;

    async function loadBalance() {
      if (!provider) return;
      try {
        const gg = getRewardTokenContract(provider);
        const value = await gg.balanceOf(address);
        if (!cancelled) {
          setBalance(formatUnits(value, 18));
        }
      } catch (err) {
        console.error("Failed to load GGOLD balance", err);
      }
    }

    loadBalance();
    const interval = setInterval(loadBalance, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [provider, address]);

  if (!address) return null;

  return (
    <section style={{ marginTop: "1rem" }}>
      <h2>GGOLD Balance</h2>
      <p>{balance}</p>
    </section>
  );
}
