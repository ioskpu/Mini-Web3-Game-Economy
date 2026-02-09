# Guía de Usuario — Web3 Game Demo 🎮

Bienvenido a la demostración interactiva de **Mini Web3 Game Economy**. Esta guía te explicará cómo interactuar con la plataforma y probar el flujo de staking y recompensas.

## 📌 Requisitos Previos

Para probar esta demo, necesitas:
1.  **MetaMask:** Una wallet instalada en tu navegador.
2.  **Red Sepolia:** La demo opera exclusivamente en la red de prueba **Sepolia (Ethereum)**.
3.  **Sepolia ETH:** Necesitarás una pequeña cantidad de ETH de prueba para pagar las transacciones (gas). Puedes obtenerlo gratuitamente en un [Sepolia Faucet](https://sepolia-faucet.pk910.de/).

---

## 🕹 Cómo probar la Demo paso a paso

### 1. Conexión de Wallet
Haz clic en el botón **"Connect MetaMask"**. 
*   **Nota Técnica:** La aplicación solo solicitará permisos de lectura inicialmente. No se enviará ninguna transacción en este paso.

### 2. Explorar el Inventario
Una vez conectado, verás tu sección de inventario.
*   **Si tienes NFTs del juego:** Aparecerán listados con su rareza (Common, Rare, Epic, Legendary).
*   **Si NO tienes NFTs:** Deberás mintear uno primero (puedes pedirle al administrador del proyecto que te envíe uno o usar el script de deploy si eres desarrollador).

### 3. Staking (Bloquear NFT para generar recompensas)
Para empezar a ganar tokens **GGOLD**, debes "stakear" tu NFT:
1.  Haz clic en **"Stake"** sobre el NFT deseado.
2.  **Aprobación (Transacción 1):** MetaMask te pedirá permiso para que el contrato de Staking pueda manejar tu NFT.
3.  **Stake (Transacción 2):** Confirmarás el depósito del NFT en el contrato inteligente.
*   *El NFT quedará bajo custodia del contrato de forma segura.*

### 4. Generación de Recompensas
Una vez stakeado, verás que el contador de **Pending GGOLD** comienza a subir en tiempo real.
*   **Multiplicador por Rareza:** Los NFTs más raros generan GGOLD a una velocidad mayor. ¡Observa la diferencia entre un NFT Common y uno Legendary!

### 5. Reclamar Tokens (Claim)
Cuando tengas acumulada una cantidad de GGOLD, puedes retirarlos a tu wallet:
1.  Haz clic en **"Claim"**.
2.  Confirma la transacción en MetaMask.
3.  Los tokens **GGOLD** se mintearán directamente en tu wallet y aparecerán en tu balance.

### 6. Recuperar NFT (Unstake)
Si deseas retirar tu NFT del contrato:
1.  Haz clic en **"Unstake"**.
2.  Confirma la transacción. El NFT volverá a tu wallet personal y dejará de generar recompensas.

---

## ⚠️ Advertencia de Seguridad
Esta es una **demo técnica** desplegada en una red de prueba. 
*   Los tokens **GGOLD** y los **NFTs** de esta demo **NO tienen valor real**.
*   Nunca utilices tu clave privada principal o wallets con fondos reales para probar demos de desarrollo.
