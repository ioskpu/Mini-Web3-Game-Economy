"use client";
import Inventory from "./components/Inventory";
import Rewards from "./components/Rewards";
import GGOLDBalance from "./components/GGOLDBalance";

import { useWeb3 } from "./providers";

export default function Home() {
  const { connect, address } = useWeb3();

  return (
    <main style={{ 
      maxWidth: "1100px", 
      margin: "0 auto", 
      padding: "4rem 2rem", 
      minHeight: "100vh"
    }}>
      <header style={{ 
        textAlign: "center", 
        marginBottom: "5rem",
      }}>
        <h1 style={{ 
          fontSize: "3.5rem", 
          fontWeight: "800",
          letterSpacing: "-0.04em",
          marginBottom: "1rem",
          color: "var(--foreground)"
        }}>
          Game Economy
        </h1>
        <p style={{ 
          fontSize: "1.25rem",
          color: "var(--secondary-text)",
          maxWidth: "600px",
          margin: "0 auto",
          fontWeight: "400"
        }}>
          On-chain staking engine with dynamic reward emission.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <span style={{
            display: "inline-block",
            padding: "6px 14px",
            backgroundColor: "var(--card-bg)",
            borderRadius: "100px",
            fontSize: "0.8rem",
            fontWeight: "600",
            color: "var(--accent)",
            border: "1px solid var(--card-border)",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Sepolia Testnet
          </span>
        </div>
      </header>

      {!address ? (
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 2rem", 
          border: "1px solid var(--card-border)", 
          borderRadius: "24px",
          backgroundColor: "var(--card-bg)",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>Connect to Dashboard</h2>
          <p style={{ color: "var(--secondary-text)", marginBottom: "2.5rem", maxWidth: "400px" }}>
            Authorize your wallet to view your assets and manage your staking positions.
          </p>
          <button
            onClick={connect}
            style={{
              padding: "16px 48px",
              backgroundColor: "var(--accent)",
              color: "#fff",
              borderRadius: "12px",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
            }}
          >
            Connect MetaMask
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
          <div style={{ 
            padding: "1rem 1.5rem", 
            backgroundColor: "var(--card-bg)", 
            borderRadius: "16px", 
            border: "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
              <span style={{ color: "var(--secondary-text)", fontSize: "0.9rem", fontWeight: "500" }}>Active Session</span>
            </div>
            <code style={{ 
              fontWeight: "600", 
              color: "var(--foreground)",
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              border: "1px solid var(--card-border)"
            }}>
              {address}
            </code>
          </div>
          
          <div style={{ display: "grid", gap: "4rem" }}>
            <section>
              <h2 style={{ fontSize: "1.75rem", marginBottom: "2rem" }}>Asset Inventory</h2>
              <Inventory />
            </section>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
              gap: "2rem" 
            }}>
              <section style={{ 
                padding: "2.5rem", 
                border: "1px solid var(--card-border)", 
                borderRadius: "24px",
                backgroundColor: "var(--card-bg)",
                position: "relative",
                overflow: "hidden"
              }}>
                <h2 style={{ fontSize: "1.25rem", color: "var(--secondary-text)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2rem" }}>Rewards Pipeline</h2>
                <Rewards />
              </section>
              
              <section style={{ 
                padding: "2.5rem", 
                border: "1px solid var(--card-border)", 
                borderRadius: "24px",
                backgroundColor: "var(--card-bg)",
              }}>
                <h2 style={{ fontSize: "1.25rem", color: "var(--secondary-text)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2rem" }}>GGOLD Liquidity</h2>
                <GGOLDBalance />
              </section>
            </div>
          </div>
        </div>
      )}
      
      <footer style={{ 
        marginTop: "8rem", 
        textAlign: "center", 
        paddingTop: "3rem",
        borderTop: "1px solid var(--card-border)",
        color: "var(--secondary-text)",
        fontSize: "0.9rem",
        fontWeight: "400"
      }}>
        Technical Showcase — Designed by Senior Frontend Engineer
      </footer>
    </main>
  );
}
