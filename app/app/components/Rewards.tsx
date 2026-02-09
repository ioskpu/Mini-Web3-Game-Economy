"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWeb3 } from "../providers";
import {
  getStakingContract,
  getStakingContractWithSigner,
} from "../lib/contracts";

export default function Rewards() {
  const { provider, address } = useWeb3();
  const [pending, setPending] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !address) return;

    let cancelled = false;

    async function loadRewards() {
      if (!provider) return;
      try {
        const staking = getStakingContract(provider);
        const rewards = await staking.pendingRewards(address);
        if (!cancelled) {
          setPending(formatUnits(rewards, 18));
        }
      } catch (err) {
        console.error("Failed to load rewards", err);
      }
    }

    loadRewards();
    const interval = setInterval(loadRewards, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [provider, address]);

  async function claim() {
    try {
      setLoading(true);
      const staking = await getStakingContractWithSigner();
      const tx = await staking.claim();
      await tx.wait();
    } catch (err) {
      console.error("Claim failed", err);
    } finally {
      setLoading(false);
    }
  }

  if (!address) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--foreground)", letterSpacing: "-0.04em" }}>
          {pending} <span style={{ fontSize: "1rem", color: "var(--secondary-text)", fontWeight: "500", letterSpacing: "normal" }}>GGOLD</span>
        </p>
        <p style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: "600", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#10b981", borderRadius: "50%" }}></span>
          Accruing in real-time
        </p>
      </div>

      <button 
        onClick={claim} 
        disabled={loading || pending === "0"}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: pending === "0" ? "rgba(255,255,255,0.05)" : "var(--accent)",
          color: pending === "0" ? "var(--secondary-text)" : "#fff",
          border: "none",
          borderRadius: "12px",
          fontWeight: "700",
          fontSize: "1rem",
          cursor: pending === "0" ? "not-allowed" : "pointer",
          boxShadow: pending === "0" ? "none" : "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
        }}
      >
        {loading ? "Confirming..." : "Claim Rewards"}
      </button>
    </div>
  );
}
