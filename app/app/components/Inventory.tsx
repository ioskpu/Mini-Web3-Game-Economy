"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "../providers";
import { getNFTContract } from "../lib/contracts";

type NFTItem = {
  tokenId: number;
  rarity: number;
};

export default function Inventory() {
  const { provider, signer, address } = useWeb3();
  const [items, setItems] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !address) return;

    async function loadNFTs() {
      setLoading(true);

      const nft = getNFTContract(provider);
      const balance = await nft.balanceOf(address);

      const result: NFTItem[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await nft.tokenOfOwnerByIndex(address, i);
        const rarity = await nft.getRarity(tokenId);

        result.push({
          tokenId: Number(tokenId),
          rarity: Number(rarity),
        });
      }

      setItems(result);
      setLoading(false);
    }

    loadNFTs();
  }, [provider, address]);

  if (!address) return null;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Your NFTs</h2>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p>No NFTs found.</p>
      )}

      <ul>
        {items.map((item) => (
          <li key={item.tokenId}>
            NFT #{item.tokenId} — Rarity: {item.rarity}
          </li>
        ))}
      </ul>
    </section>
  );
}
