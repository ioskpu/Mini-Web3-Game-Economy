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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--foreground)", letterSpacing: "-0.04em", margin: 0 }}>
        {balance} <span style={{ fontSize: "0.85rem", color: "var(--secondary-text)", fontWeight: "500", letterSpacing: "normal" }}>GGOLD</span>
      </p>
      <div style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: "0.4rem", 
        color: "var(--secondary-text)", 
        fontSize: "0.75rem",
        backgroundColor: "rgba(255,255,255,0.03)",
        padding: "4px 10px",
        borderRadius: "6px",
        border: "1px solid var(--card-border)",
        width: "fit-content"
      }}>
        <span>Wallet Balance</span>
      </div>
    </div>
  );
}
