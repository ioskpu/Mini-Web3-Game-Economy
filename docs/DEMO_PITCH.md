# Technical Demo: Live Pitch Script (Blockchain Engineer Focus) 🎤

Este guion está optimizado para una entrevista técnica de **3 a 5 minutos**. El objetivo es proyectar autoridad técnica, claridad en el diseño y pensamiento crítico sobre la arquitectura.

---

## 1. Contexto del Proyecto (30s)
*"Hola, hoy les presento una demo funcional de una economía Web3 modular. El problema que resuelve es la creación de un ciclo de valor descentralizado donde activos ERC-721 (NFTs) generan recompensas ERC-20 (tokens) de forma determinista y sin intervención off-chain. Mi objetivo con este proyecto fue demostrar una arquitectura sólida que soporte seguridad, escalabilidad en el cálculo de recompensas y una integración fluida con el frontend."*

## 2. Arquitectura General (1 min)
*"El sistema se divide en tres capas desacopladas:*
1.  **Capa de Activos (ERC-721):** Los NFTs contienen metadata de rareza inmutable.
2.  **Capa de Lógica (Staking Vault):** Un contrato custodial que actúa como el 'cerebro', gestionando el bloqueo de activos y la contabilidad de tiempo.
3.  **Capa Económica (ERC-20):** Un token de recompensa con `AccessControl` estricto.

*He utilizado **Next.js 14** con **Ethers v6**, implementando una separación clara entre el **Provider** (para lecturas reactivas y optimización de RPC) y el **Signer** (para transacciones de cambio de estado)."*

## 3. Flujo en Vivo (1.5 min)
*(Mientras compartes pantalla y ejecutas las acciones)*

- **Stake:** *"Al conectar mi wallet y seleccionar un NFT, el contrato de Staking requiere una transferencia custodial. Esto garantiza que el activo esté bloqueado mientras se generan los incentivos, evitando ataques de 'flash-utility'."*
- **Rewards:** *"Noten que el contador de recompensas se actualiza en tiempo real. Este cálculo no viene de una base de datos, sino de una consulta directa al contrato que interpola el `lastUpdateTimestamp` con la rareza del NFT."*
- **Claim:** *"Al reclamar, el contrato de Staking invoca el método `mint` del token ERC-20. Aquí es donde la seguridad es crítica: solo el contrato de Staking tiene permisos de `MINTER_ROLE`."*

## 4. Decisiones Clave (1 min)
*"Hay tres decisiones técnicas que quiero resaltar:*
1.  **Custodial Staking:** Elegí el modelo de transferencia para simplificar el estado del contrato y proporcionar una prueba criptográfica absoluta de bloqueo.
2.  **AccessControl:** En lugar de un simple `Ownable`, utilicé roles de OpenZeppelin. Esto permite una granularidad necesaria en producción, como separar los permisos de administración de los de emisión.
3.  **Reward Math O(1):** El cálculo de recompensas es constante. No iteramos sobre bloques o arrays; calculamos la diferencia de tiempo en el momento de la transacción, lo que mantiene el costo de gas bajo y predecible."*

## 5. Extensiones para Producción (30s)
*"Para llevar esto a un producto real, el siguiente paso sería implementar **Batch Operations** vía `multicall` para optimizar el gas al manejar múltiples NFTs, e integrar **EIP-2981** para asegurar que las regalías de los NFTs se respeten en mercados secundarios, cerrando el ciclo económico."*

---

## 💡 Key Talking Points (Puntos de Refuerzo)
- *"Utilicé Ethers v6 por su gestión superior de tipos y su separación nativa de Provider/Signer, lo que mejora la mantenibilidad del frontend."*
- *"La lógica de rareza es on-chain. Esto elimina la dependencia de IPFS o APIs centralizadas para el cálculo de valor de la recompensa."*
- *"El diseño es 'security-first': cada función de estado tiene protecciones contra reentrancia y validaciones de propiedad de assets."*
