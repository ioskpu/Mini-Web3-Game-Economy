FASE C — Mostrar balance GGOLD (recomendado)
🎯 Objetivo

Que el usuario vea claramente:

Claim → GGOLD balance aumenta

Sin lógica extra, sin ruido.

🧠 Principio (importante)

El balance es ERC-20 estándar

Solo necesitamos:

balanceOf(address)


Lectura con provider, nada de signer

🧩 1️⃣ contracts.ts — helper para RewardToken (lectura)

Añade esto (no toques lo existente):

export function getRewardTokenContract(provider: BrowserProvider) {
  return new Contract(REWARD_ADDRESS, REWARD_ABI.abi, provider);
}

🧩 2️⃣ Nuevo componente: GGOLDBalance.tsx

Crea:

app/app/components/GGOLDBalance.tsx


Contenido:

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

🧩 3️⃣ Mostrarlo en la página principal

En tu page.tsx (o donde tengas Inventory / Rewards):

<Inventory />
<Rewards />
<GGOLDBalance />


Orden lógico:

NFTs

Rewards

Token balance

✅ Resultado esperado (muy claro)

Después de un Claim:

Pending GGOLD → 0

GGOLD Balance → aumenta

El número sigue actualizándose solo

Eso cierra este flujo:

NFT → Stake → Reward → Claim → Token


💥 Historia completa. Demo completa.