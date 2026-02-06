# Architecture

## Overview

The Mini Web3 Game Economy is a closed-loop ecosystem of three smart contracts. Users mint NFTs with rarity attributes, stake them to earn an ERC-20 reward token over time, and claim rewards weighted by rarity. The architecture is designed to be minimal, auditable, and extensible for future game integration.

## Contract Responsibilities

**GameItemNFT** (ERC-721) — Manages the NFT collection. Each token stores onchain attributes: a rarity tier and two game stats (power, agility). Minting is owner-controlled with a hard cap of 10,000 tokens. Extends ERC721Enumerable for easy wallet inventory queries. Attributes are immutable after mint.

**GameRewardToken** (ERC-20) — The reward currency of the ecosystem. Supply starts at zero and grows exclusively through staking rewards. Uses AccessControl with a MINTER_ROLE granted only to the staking contract. No burn, no cap, no transfer restrictions.

**GameItemStaking** — Custodial staking contract. Users transfer NFTs into the contract and accrue rewards per second, weighted by each NFT's rarity multiplier. Reward accounting is O(1) per interaction using a per-user boosted balance model. Implements IERC721Receiver and rejects NFTs from any contract other than GameItemNFT.

## Contract Interactions

The system follows a linear flow with clear boundaries between contracts:

1. Owner calls `GameItemNFT.mint()` to create NFTs with assigned rarity and stats.
2. User approves `GameItemStaking` to transfer their NFTs via `setApprovalForAll`.
3. User calls `GameItemStaking.stake(tokenIds)` — NFTs are transferred into the staking contract, which reads each token's rarity from GameItemNFT and adds the corresponding multiplier to the user's boosted balance.
4. Rewards accrue passively based on elapsed time and boosted balance.
5. User calls `GameItemStaking.claim()` — the staking contract mints GGOLD to the user via `GameRewardToken.mint()`.
6. User calls `GameItemStaking.unstake(tokenIds)` — NFTs are returned, multipliers are subtracted.

| Caller | Function | Target Contract | Effect |
|--------|----------|-----------------|--------|
| Owner | `mint(to, rarity, power, agility)` | GameItemNFT | Creates NFT with attributes |
| User | `setApprovalForAll(staking, true)` | GameItemNFT | Authorizes staking contract |
| User | `stake(tokenIds)` | GameItemStaking | Transfers NFTs in, starts accrual |
| User | `unstake(tokenIds)` | GameItemStaking | Returns NFTs, stops accrual |
| User | `claim()` | GameItemStaking | Mints accrued GGOLD to user |
| Staking | `mint(to, amount)` | GameRewardToken | Issues reward tokens |
| Staking | `getRarity(tokenId)` | GameItemNFT | Reads rarity for multiplier |

## Rarity System

Rarity is assigned by the owner at mint time. Each tier maps to a fixed multiplier that determines reward weight during staking.

| Rarity | Multiplier | Basis Points | Reward Effect |
|--------|------------|--------------|---------------|
| Common | 1.0x | 10,000 | Base rate |
| Rare | 1.5x | 15,000 | 50% more rewards |
| Epic | 2.2x | 22,000 | 120% more rewards |
| Legendary | 3.5x | 35,000 | 250% more rewards |

Multipliers are defined as constants in the staking contract. They are not configurable after deployment.

## Reward Model

Rewards accrue per second using a per-user boosted balance model. On every interaction (stake, unstake, claim), the contract updates the user's accrued rewards before modifying state.

**Formula:**

    accrued += elapsed × rewardRatePerSecond × boostedBalance / 10,000

Where `boostedBalance` is the sum of rarity multipliers (in basis points) across all NFTs the user has staked.

**Example:** A user stakes one Rare NFT (15,000 bps) and one Epic NFT (22,000 bps). Their boosted balance is 37,000. With a reward rate of 1 GGOLD/second (1e18 wei), after 3,600 seconds (1 hour):

    accrued = 3600 × 1e18 × 37000 / 10000 = 13,320 GGOLD

## Access Control

| Contract | Function | Required Role/Modifier |
|----------|----------|------------------------|
| GameItemNFT | `mint` | `onlyOwner` + `whenNotPaused` |
| GameItemNFT | `pause` / `unpause` | `onlyOwner` |
| GameRewardToken | `mint` | `MINTER_ROLE` |
| GameRewardToken | `grantRole` / `revokeRole` | `DEFAULT_ADMIN_ROLE` |
| GameItemStaking | `stake` / `unstake` / `claim` | Any user (public) |
| GameItemStaking | `setRewardRate` | `onlyOwner` |
| GameItemStaking | `pause` / `unpause` | `onlyOwner` |

## Deployment Sequence

Order matters because contracts reference each other.

1. Deploy `GameRewardToken` — deployer receives `DEFAULT_ADMIN_ROLE` only.
2. Deploy `GameItemNFT` — deployer receives ownership.
3. Deploy `GameItemStaking(gameItemNFT, rewardToken, rewardRatePerSecond)` — references both contracts.
4. Grant `MINTER_ROLE` on GameRewardToken to the GameItemStaking address.
5. (Optional) Deployer renounces `DEFAULT_ADMIN_ROLE` on GameRewardToken to lock minting authority permanently.

Step 4 is critical. Until the role is granted, no rewards can be minted. After the grant, the staking contract is the sole token issuer.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rarity assignment | Owner-controlled | Deterministic and auditable. No fake randomness. Documented as centralized. |
| Staking model | Custodial | NFTs transferred into contract. Eliminates edge cases where staked NFTs are sold or transferred. |
| Reward accounting | Per-user update-on-interaction | O(1) per call. No loops over staked tokens. No global accumulator needed at this scale. |
| NFT enumeration | ERC721Enumerable | Simplifies frontend inventory queries. Acceptable gas overhead for a 10,000 supply cap. |
| Reward token supply | Uncapped | Supply is bounded by staking rate and time. No artificial cap needed for a demo economy. |
| Token burning | Not implemented | No current mechanic consumes tokens. Can be added if future game integration requires it. |
| Transfer restrictions | None on GGOLD | Tokens are freely transferable. No pause, no blacklist, no fees. |
| Multiplier storage | Constants | Not configurable post-deploy. Makes the reward model predictable and trustable. |
