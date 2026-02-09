# Guía del Desarrollador — Arquitectura y Setup 🛠️

Esta documentación técnica está dirigida a desarrolladores que deseen replicar, auditar o extender la funcionalidad de la demo **Mini Web3 Game Economy**.

## 🏗️ Estructura del Proyecto

El repositorio está organizado como un monorepo simplificado:

```text
/
├── app/                # Frontend (Next.js 14 App Router)
│   ├── app/
│   │   ├── components/ # Lógica de UI y Web3 Hooks
│   │   ├── lib/        # Configuración de Contratos y ABIs
│   │   └── providers/  # Contexto Global (Ethers v6)
├── blockchain/         # Smart Contracts (Hardhat)
│   ├── contracts/      # Código Solidity (NFT, Staking, ERC-20)
│   ├── scripts/        # Scripts de Deploy y Configuración
│   └── test/           # Suite de Pruebas Unitarias
└── docs/               # Documentación Técnica y de Usuario
```

---

## ⚙️ Configuración del Entorno

### 1. Requisitos Técnicos
*   **Node.js** v18.0.0 o superior.
*   **NPM** o **Yarn**.
*   **MetaMask** (para interactuar con la UI).

### 2. Variables de Entorno (Blockchain)
Crea un archivo `.env` en el directorio `blockchain/` siguiendo el ejemplo de `.env.example`:
```env
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/tu-api-key"
PRIVATE_KEY="tu-clave-privada-de-pruebas"
ETHERSCAN_API_KEY="tu-api-key-de-etherscan"
```

---

## 🚀 Despliegue de Contratos

Para desplegar la suite completa de contratos en Sepolia:

1.  **Instalar dependencias:**
    ```bash
    cd blockchain && npm install
    ```
2.  **Compilar contratos:**
    ```bash
    npx hardhat compile
    ```
3.  **Ejecutar Script de Deploy:**
    ```bash
    npx hardhat run scripts/deploy.ts --network sepolia
    ```
4.  **Configuración Post-Deploy:**
    El script de deploy generará las direcciones de los contratos. Debes actualizarlas en el frontend en el archivo:
    `app/app/lib/contracts.ts`

---

## 🧠 Decisiones Técnicas Clave

### 1. Integración con Ethers.js v6
Se ha priorizado el uso de la versión más reciente de Ethers para aprovechar el tipado fuerte y la mejor gestión de proveedores.
*   **Provider (Read):** Se usa para cargar datos iniciales sin requerir que el usuario firme nada.
*   **Signer (Write):** Se instancia bajo demanda solo cuando se requiere una transacción, mejorando la seguridad y la UX.

### 2. Lógica de Emisión On-Chain
A diferencia de otros juegos que calculan recompensas en un backend, esta demo realiza todo el cálculo en el Smart Contract de Staking.
*   El contrato consulta la rareza del NFT directamente desde el contrato ERC-721.
*   La emisión de **GGOLD** es controlada: solo el contrato de Staking tiene el rol de `MINTER` sobre el token ERC-20.

### 3. Patrón de Staking Custodial
Se seleccionó este patrón por su robustez técnica en demos. Al transferir el NFT al contrato, se garantiza que el usuario no pueda vender o transferir el asset mientras sigue generando recompensas, eliminando vectores de ataque de "double-utility".

---

## 🛠️ Herramientas de Desarrollo

*   **Verificación de Contratos:**
    ```bash
    npx hardhat verify --network sepolia <DIRECCION_CONTRATO> <ARGUMENTOS_CONSTRUCTOR>
    ```
*   **Tests Unitarios:**
    ```bash
    npx hardhat test
    ```
