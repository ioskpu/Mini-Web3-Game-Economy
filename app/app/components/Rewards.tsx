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
    <section style={{ marginTop: "2rem" }}>
      <h2>Rewards</h2>
      <p>Pending GGOLD: {pending}</p>

      <button onClick={claim} disabled={loading || pending === "0"}>
        {loading ? "Claiming..." : "Claim"}
      </button>
    </section>
  );
}
