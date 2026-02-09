"use client";
import Inventory from "./components/Inventory";
import Rewards from "./components/Rewards";
import GGOLDBalance from "./components/GGOLDBalance";

import { useWeb3 } from "./providers";

export default function Home() {
  const { connect, address } = useWeb3();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Mini Web3 Game Economy — Demo</h1>

      {!address ? (
        <button
          onClick={connect}
          style={{
            padding: "12px 20px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            marginTop: "16px",
          }}
        >
          Connect Wallet
        </button>

      ) : (
        <>
          <p>
            Connected as: <strong>{address}</strong>
          </p>
          <Inventory />
          <Rewards />
          <GGOLDBalance />
        </>
      )}
    </main>
  );
}
