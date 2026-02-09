# Economía de Juego Web3 — Showcase de Ingeniería

Una demostración técnica de una arquitectura modular de economía de juegos en Ethereum (Sepolia). Este proyecto implementa un **vault de staking custodial** que conecta **NFTs ERC-721** con un **ecosistema de recompensas ERC-20**, enfocándose en transiciones de estado seguras y lógica de emisión ponderada por rareza.

## 🏗 Vista General de la Arquitectura

El sistema está diseñado como una aplicación descentralizada de tres capas donde se prioriza la seguridad y la consistencia del estado:

1.  **Capa de Activos (ERC-721):** NFTs on-chain con metadata de rareza inmutable.
2.  **Capa de Lógica (Staking Vault):** Un contrato custodial que gestiona el ciclo de vida de los activos stakeados y calcula recompensas ponderadas por tiempo.
3.  **Capa Económica (ERC-20):** Un token de recompensa con permisos de acuñación (minting) controlados por acceso, vinculados a la capa de lógica.

### Responsabilidades de los Contratos

- **`GameItemNFT.sol`**: Gestiona la propiedad de los activos y expone los atributos de rareza utilizados por el motor de staking.
- **`GameItemStaking.sol`**: El "cerebro" central. Maneja las operaciones de `stake()`, `withdraw()` y `claim()`. Utiliza un patrón push/pull para los activos y contabilidad interna para las recompensas.
- **`GameRewardToken.sol`**: Implementa `AccessControl` para asegurar que solo el contrato de Staking pueda acuñar tokens, evitando la inflación no autorizada del suministro.

## ⚙️ Modelo de Recompensas y Control de Emisión

La lógica de emisión sigue una fórmula de **Rareza Ponderada por Tiempo** para asegurar equidad económica y transparencia:

$$ Recompensas = \sum (FactorDeRareza_{i} \times \Delta Tiempo \times TasaBase) $$

- **Nota de Seguridad**: Las recompensas se calculan bajo demanda durante el `claim()` o `withdraw()` para minimizar los costos de gas y evitar desviaciones en el estado.
- **Control de Emisión**: La tasa de recompensa es configurable mediante roles administrativos, permitiendo ajustes en el equilibrio económico sin necesidad de redeplegar la lógica.

## 🚀 Secuencia de Despliegue

Para asegurar la correcta vinculación de permisos, el despliegue sigue un orden estricto:
1. **Desplegar Reward Token**: Inicializar el contrato ERC-20.
2. **Desplegar NFT**: Inicializar el contrato ERC-721.
3. **Desplegar Staking**: Inicializar con las direcciones del NFT y el Token.
4. **Otorgar Roles**: El Reward Token otorga el `MINTER_ROLE` al contrato de Staking.

## 🧠 Decisiones de Diseño

- **Vault Custodial**: Elegimos un modelo custodial (transferencia al contrato) en lugar de uno no custodial para simplificar la gestión del estado y proporcionar una prueba criptográfica absoluta del bloqueo del activo durante el periodo de recompensa.
- **Patrón Provider/Signer de Ethers v6**: El frontend mantiene una separación clara entre la obtención de datos reactivos (Provider) y las operaciones que cambian el estado (Signer), reduciendo solicitudes innecesarias a la wallet.
- **Metadata de Rareza On-chain**: La rareza se almacena directamente en el estado del contrato en lugar de IPFS, asegurando que el motor de staking pueda calcular recompensas en una sola transacción atómica sin depender de oráculos.

## 🛠 Extensiones de Diseño (Roadmap)

Aunque esta demo se enfoca en mecánicas core, la arquitectura es extensible para:
- **Multiplicadores Dinámicos**: Implementar potenciadores basados en estados de contratos externos (ej. poseer un "Pase de Temporada").
- **Operaciones en Lote (Batch)**: Añadir soporte `multicall` para stakear/reclamar múltiples NFTs y optimizar el gas.
- **Integración EIP-2981**: Estandarizar regalías para el mercado secundario de los NFTs.

## 📂 Documentación y Configuración

- [**Arquitectura Detallada**](docs/architecture.md) - Análisis profundo de la lógica, matemáticas y seguridad.
- [**Guía del Desarrollador**](docs/DEV.md) - Variables de entorno, scripts y reproducción local.
- [**User Guide (EN)**](docs/user-guide.md) - Flujo de interacción para revisores internacionales.
- [**Guía de Usuario (ES)**](docs/user-guide-es.md) - Manual de usuario detallado en español.
- [**Pitch Técnico**](docs/DEMO_PITCH.md) - Guion de presentación técnica de 3-5 minutos.
- [**Notas de Desarrollo**](docs/commands.md) - Registro interno y fases de implementación.

---
*Enfoque: Seguridad, Arquitectura y Código Limpio. Desarrollado para revisión de portafolio técnico.*
