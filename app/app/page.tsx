"use client";
import Inventory from "./components/Inventory";
import Rewards from "./components/Rewards";
import GGOLDBalance from "./components/GGOLDBalance";

import { useWeb3 } from "./providers";

export default function Home() {
  const { connect, address } = useWeb3();

  return (
    <main style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "1.5rem 2rem", 
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <header style={{ 
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
      }}>
        <div>
          <h1 style={{ 
            fontSize: "1.75rem", 
            fontWeight: "800",
            letterSpacing: "-0.04em",
            color: "var(--foreground)",
            margin: 0
          }}>
            Game Economy <span style={{
              fontSize: "0.7rem",
              fontWeight: "600",
              color: "var(--accent)",
              border: "1px solid var(--card-border)",
              padding: "2px 8px",
              borderRadius: "4px",
              marginLeft: "8px",
              verticalAlign: "middle"
            }}>SEPOLIA</span>
          </h1>
        </div>

        {address && (
          <div style={{ 
            padding: "0.5rem 1rem", 
            backgroundColor: "var(--card-bg)", 
            borderRadius: "12px", 
            border: "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
            <code style={{ 
              fontWeight: "600", 
              color: "var(--foreground)",
              fontSize: "0.85rem",
            }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </code>
          </div>
        )}
      </header>

      {!address ? (
        <div style={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--card-border)", 
          borderRadius: "24px",
          backgroundColor: "var(--card-bg)",
          textAlign: "center",
        }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>Connect to Dashboard</h2>
          <button
            onClick={connect}
            style={{
              padding: "12px 32px",
              backgroundColor: "var(--accent)",
              color: "#fff",
              borderRadius: "10px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Connect MetaMask
          </button>
        </div>
      ) : (
        <div style={{ 
          flex: 1,
          display: "grid", 
          gridTemplateColumns: "1fr 320px",
          gridTemplateRows: "1fr",
          gap: "1.5rem",
          minHeight: 0
        }}>
          <section style={{ 
            display: "flex", 
            flexDirection: "column", 
            minHeight: 0,
            backgroundColor: "var(--card-bg)",
            borderRadius: "20px",
            border: "1px solid var(--card-border)",
            padding: "1.25rem"
          }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--secondary-text)" }}>Asset Inventory</h2>
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
              <Inventory />
            </div>
          </section>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <section style={{ 
              padding: "1.25rem", 
              border: "1px solid var(--card-border)", 
              borderRadius: "20px",
              backgroundColor: "var(--card-bg)",
            }}>
              <h2 style={{ fontSize: "0.8rem", color: "var(--secondary-text)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Rewards Pipeline</h2>
              <Rewards />
            </section>
            
            <section style={{ 
              padding: "1.25rem", 
              border: "1px solid var(--card-border)", 
              borderRadius: "20px",
              backgroundColor: "var(--card-bg)",
            }}>
              <h2 style={{ fontSize: "0.8rem", color: "var(--secondary-text)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>GGOLD Liquidity</h2>
              <GGOLDBalance />
            </section>

            <div style={{ 
              marginTop: "auto",
              padding: "1rem",
              borderRadius: "16px",
              border: "1px dashed var(--card-border)",
              fontSize: "0.8rem",
              color: "var(--secondary-text)",
              textAlign: "center"
            }}>
              Technical Showcase<br/>
              <span style={{ opacity: 0.7 }}>v1.0.0-stable</span>
            </div>
          </div>
        </div>
      )}
      
      <footer style={{ 
        marginTop: "auto", 
        textAlign: "center", 
        paddingTop: "1rem",
        borderTop: "1px solid var(--card-border)",
        color: "var(--secondary-text)",
        fontSize: "0.75rem",
        fontWeight: "400"
      }}>
        Technical Showcase — Designed Luis Corales
      </footer>
    </main>
  );
}
