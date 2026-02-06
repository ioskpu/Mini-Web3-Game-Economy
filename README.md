# Mini Web3 Game Economy

A minimal Web3 ecosystem with NFTs, rarity-weighted staking, and an ERC-20 reward token.

## Architecture

| Contract | Type | Description |
|----------|------|-------------|
| GameItemNFT | ERC-721 | NFTs with onchain rarity and game attributes |
| GameRewardToken | ERC-20 | Reward token minted exclusively through staking |
| GameItemStaking | Staking | Custodial NFT staking with time-based, rarity-weighted rewards |

## Project Structure

```
contracts/
  src/
    GameItemNFT.sol
    GameRewardToken.sol
    GameItemStaking.sol
  test/
  scripts/
frontend/
docs/
  architecture.md
  user-guide.md
```

## Quick Start

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat node
```

## Documentation

- [Architecture](docs/architecture.md)
- [User Guide](docs/user-guide.md)

## License

MIT
