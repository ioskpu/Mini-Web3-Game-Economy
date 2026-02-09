# Guía de Usuario: Demo de Economía Web3 🎮

Esta guía te proporcionará las instrucciones necesarias para interactuar con la demo de economía descentralizada. Aquí aprenderás a gestionar tus activos digitales, bloquearlos para generar incentivos y reclamar tus recompensas en la red de prueba.

---

## 🧐 ¿Qué es esta demo?
Es un ecosistema de juego simplificado que demuestra cómo funcionan los contratos inteligentes en Ethereum. Podrás interactuar con:
- **NFTs (ERC-721):** Activos digitales únicos con diferentes niveles de rareza.
- **Staking:** Un mecanismo para depositar tus NFTs y generar tokens de recompensa.
- **Tokens GGOLD (ERC-20):** La moneda del ecosistema que obtienes al participar.

## 🛠️ Requisitos previos
Para participar, asegúrate de tener lo siguiente:
1.  **Wallet:** Tener instalado [MetaMask](https://metamask.io/) en tu navegador.
2.  **Red de Prueba:** Cambiar la red en MetaMask a **Sepolia Test Network**.
3.  **Fondos de Prueba (Faucet):** Necesitarás una pequeña cantidad de Sepolia ETH para cubrir los costos de transacción (gas). Puedes obtenerlos en un [faucet gratuito](https://sepolia-faucet.pk910.de/).

---

## 🕹️ Guía paso a paso

### 1. Conectar tu Wallet
Al entrar a la aplicación, haz clic en el botón **"Connect MetaMask"**. Esto permitirá que la interfaz lea tus activos y te permita interactuar con los contratos.

### 2. Ver tus NFTs
En la sección de inventario, verás los NFTs que posees. Cada uno muestra su **Rareza** (Common, Rare, Epic o Legendary). La rareza es fundamental, ya que determina cuántas recompensas generarás.

### 3. Realizar Staking (Depositar)
Para empezar a ganar tokens **GGOLD**, debes depositar tus NFTs en el contrato de Staking:
- Haz clic en el botón **"Stake"** de un NFT.
- **Aprobación:** MetaMask te pedirá permiso para que el contrato pueda mover tu NFT.
- **Confirmación:** Una segunda transacción confirmará el depósito definitivo.
- *Una vez completado, el NFT aparecerá con el estado "Staked" y dejará de estar en tu wallet para pasar a estar bajo custodia del contrato.*

### 4. Monitorear Recompensas
Una vez que tengas NFTs en staking, verás el panel de **"Pending Rewards"**. El contador de **GGOLD** aumentará en tiempo real basándose en:
- El tiempo transcurrido desde el último reclamo.
- La suma de las rarezas de todos tus NFTs depositados.

### 5. Reclamar GGOLD (Claim)
Cuando desees retirar tus ganancias acumuladas:
- Haz clic en el botón **"Claim Rewards"**.
- Confirma la transacción en MetaMask.
- Los tokens **GGOLD** se enviarán directamente a tu wallet personal.

---

## ⚠️ Advertencias importantes
- **Red de Prueba:** Esta aplicación funciona exclusivamente en **Sepolia**. No intentes usar fondos reales de la red principal de Ethereum.
- **Sin Valor Real:** Tanto los NFTs como los tokens GGOLD son activos de prueba y **no tienen valor económico real**.
- **Transacciones:** Cada acción (Stake, Unstake, Claim) requiere una transacción en la blockchain que consume una pequeña cantidad de ETH de prueba.

---

## 🔍 Solución de problemas comunes

- **"No veo mis NFTs":** Asegúrate de estar conectado con la cuenta correcta y que estás en la red Sepolia.
- **"La transacción falla":** Verifica que tienes suficiente Sepolia ETH para pagar el gas. A veces, aumentar ligeramente el límite de gas sugerido por MetaMask ayuda.
- **"El contador de recompensas no sube":** Debes tener al menos un NFT en estado "Staked" para generar recompensas.
- **"MetaMask no se abre":** Recarga la página y asegúrate de que la extensión de MetaMask esté desbloqueada.

---
*Documentación creada para la revisión técnica del portafolio.*
