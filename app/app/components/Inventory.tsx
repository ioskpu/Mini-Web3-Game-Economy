"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useWeb3 } from "../providers";
import { 
  getNFTContract, 
  getStakingContract, 
  getNFTContractWithSigner, 
  getStakingContractWithSigner,
  STAKING_ADDRESS 
} from "../lib/contracts";

type NFTItem = {
  tokenId: number;
  rarity: number;
  isStaked: boolean;
};

export default function Inventory() {
  const { provider, address } = useWeb3();
  const [items, setItems] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const isFetching = useRef(false);

  const loadNFTs = useCallback(async () => {
    if (!provider || !address || isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);

      const nftContract = getNFTContract(provider);
      const stakingContract = getStakingContract(provider);
      
      // 1. Get NFTs in Wallet
      const walletBalance = await nftContract.balanceOf(address);
      const walletItems: NFTItem[] = [];

      for (let i = 0; i < Number(walletBalance); i++) {
        try {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const rarity = await nftContract.getRarity(tokenId);
          walletItems.push({
            tokenId: Number(tokenId),
            rarity: Number(rarity),
            isStaked: false,
          });
        } catch (err) {
          console.error(`Error fetching wallet NFT at index ${i}:`, err);
        }
      }

      // 2. Get NFTs in Staking (custodial)
      // Since it's custodial, we need to find which tokens are owned by the user in the staking contract.
      // Usually, staking contracts have a way to list user tokens. 
      // Based on common custodial patterns and provided ABI, we'll check total supply and stakeOwner.
      // Optimization: In a real app, we'd use events or a specific mapping. 
      // For this demo, we'll assume a range or a known set if the contract doesn't provide a list.
      // However, the provided ABI has `totalSupply` on NFT. Let's check all minted tokens for stakeOwner.
      const totalSupply = await nftContract.totalSupply();
      const stakedItems: NFTItem[] = [];
      
      // Check each token to see if it's staked by the current user
      for (let id = 0; id < Number(totalSupply); id++) {
        try {
          const owner = await stakingContract.stakeOwner(id);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const rarity = await nftContract.getRarity(id);
            stakedItems.push({
              tokenId: id,
              rarity: Number(rarity),
              isStaked: true,
            });
          }
        } catch {
          // Token might not be staked, ignore
        }
      }

      setItems([...walletItems, ...stakedItems]);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [provider, address]);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  const handleStake = async (tokenId: number) => {
    try {
      setActionLoading(tokenId);
      const nft = await getNFTContractWithSigner();
      const staking = await getStakingContractWithSigner();

      // Check approval
      const approved = await nft.getApproved(tokenId);
      if (approved.toLowerCase() !== STAKING_ADDRESS.toLowerCase()) {
        const isApprovedForAll = await nft.isApprovedForAll(address, STAKING_ADDRESS);
        if (!isApprovedForAll) {
          const tx = await nft.approve(STAKING_ADDRESS, tokenId);
          await tx.wait();
        }
      }

      const tx = await staking.stake([tokenId]);
      await tx.wait();
      await loadNFTs();
    } catch (error) {
      console.error("Stake failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnstake = async (tokenId: number) => {
    try {
      setActionLoading(tokenId);
      const staking = await getStakingContractWithSigner();
      const tx = await staking.unstake([tokenId]);
      await tx.wait();
      await loadNFTs();
    } catch (error) {
      console.error("Unstake failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!address) return null;

  return (
    <section>
      {loading && (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--secondary-text)" }}>
          Loading assets...
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ 
          padding: "3rem", 
          textAlign: "center", 
          border: "1px dashed var(--card-border)", 
          borderRadius: "16px",
          color: "var(--secondary-text)"
        }}>
          No NFTs found in wallet or staking.
        </div>
      )}

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {items.map((item) => (
          <div key={item.tokenId} style={{ 
            padding: "1.5rem", 
            border: "1px solid var(--card-border)", 
            borderRadius: "20px",
            backgroundColor: item.isStaked ? "var(--staked-bg)" : "var(--card-bg)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            transition: "transform 0.2s ease, border-color 0.2s ease",
            position: "relative",
            overflow: "hidden"
          }}>
            {item.isStaked && (
              <div style={{ 
                position: "absolute", 
                top: "12px", 
                right: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                padding: "4px 10px",
                borderRadius: "100px",
                fontSize: "0.7rem",
                fontWeight: "700",
                textTransform: "uppercase",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                Staked
              </div>
            )}
            
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--secondary-text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Token ID</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--foreground)" }}>#{item.tokenId}</p>
            </div>

            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--secondary-text)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Rarity</p>
                <p style={{ fontWeight: "600", color: "var(--foreground)" }}>{item.rarity}</p>
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
              {item.isStaked ? (
                <button 
                  onClick={() => handleUnstake(item.tokenId)}
                  disabled={actionLoading !== null}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "var(--foreground)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}
                >
                  {actionLoading === item.tokenId ? "Processing..." : "Unstake Asset"}
                </button>
              ) : (
                <button 
                  onClick={() => handleStake(item.tokenId)}
                  disabled={actionLoading !== null}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    cursor: "pointer",
                    backgroundColor: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)"
                  }}
                >
                  {actionLoading === item.tokenId ? "Processing..." : "Stake Asset"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
