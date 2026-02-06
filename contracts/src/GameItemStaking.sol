// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./GameItemNFT.sol";

/// @notice Minimal interface for the reward token's mint function.
interface IGameRewardToken {
    function mint(address to, uint256 amount) external;
}

/// @title GameItemStaking
/// @notice Custodial NFT staking with time-based, rarity-weighted ERC-20 rewards.
/// @dev Reward accounting is O(1) per interaction using per-user boosted balance tracking.
contract GameItemStaking is IERC721Receiver, ReentrancyGuard, Ownable, Pausable {
    // --- External contracts ---
    GameItemNFT public immutable gameItemNFT;
    IGameRewardToken public immutable rewardToken;

    // --- Rarity multipliers (basis points, immutable) ---
    uint256 public constant COMMON_MULTIPLIER = 10000;
    uint256 public constant RARE_MULTIPLIER = 15000;
    uint256 public constant EPIC_MULTIPLIER = 22000;
    uint256 public constant LEGENDARY_MULTIPLIER = 35000;
    uint256 private constant BPS_DIVISOR = 10000;

    // --- Reward configuration ---
    uint256 public rewardRatePerSecond;

    // --- Staking state ---
    mapping(uint256 tokenId => address) public stakeOwner;
    mapping(address user => uint256) public stakerBoostedBalance;
    mapping(address user => uint256) public rewardsAccrued;
    mapping(address user => uint256) public lastUpdateTime;

    // --- Events ---
    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    // --- Errors ---
    error EmptyTokenIds();
    error NotStakeOwner(uint256 tokenId);
    error NoRewardsToClaim();
    error NotTokenOwner(uint256 tokenId);
    error InvalidNFTContract();
    error ZeroRewardRate();

    constructor(
        GameItemNFT _gameItemNFT,
        IGameRewardToken _rewardToken,
        uint256 _rewardRatePerSecond
    ) Ownable(msg.sender) {
        gameItemNFT = _gameItemNFT;
        rewardToken = _rewardToken;
        rewardRatePerSecond = _rewardRatePerSecond;
    }

    /// @notice Stakes one or more NFTs into the contract.
    /// @param tokenIds Array of token IDs to stake. Caller must own each and have approved this contract.
    function stake(uint256[] calldata tokenIds) external nonReentrant whenNotPaused {
        if (tokenIds.length == 0) revert EmptyTokenIds();

        _updateRewards(msg.sender);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];

            if (gameItemNFT.ownerOf(tokenId) != msg.sender) revert NotTokenOwner(tokenId);
            gameItemNFT.safeTransferFrom(msg.sender, address(this), tokenId);
            stakeOwner[tokenId] = msg.sender;
            stakerBoostedBalance[msg.sender] += _getMultiplier(gameItemNFT.getRarity(tokenId));

            emit Staked(msg.sender, tokenId);
        }
    }

    /// @notice Unstakes one or more NFTs and returns them to the caller.
    /// @param tokenIds Array of token IDs to unstake. Caller must be the original staker.
    function unstake(uint256[] calldata tokenIds) external nonReentrant whenNotPaused {
        if (tokenIds.length == 0) revert EmptyTokenIds();

        _updateRewards(msg.sender);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];

            if (stakeOwner[tokenId] != msg.sender) revert NotStakeOwner(tokenId);

            stakerBoostedBalance[msg.sender] -= _getMultiplier(gameItemNFT.getRarity(tokenId));
            delete stakeOwner[tokenId];
            gameItemNFT.safeTransferFrom(address(this), msg.sender, tokenId);

            emit Unstaked(msg.sender, tokenId);
        }
    }

    /// @notice Claims all accrued rewards for the caller.
    function claim() external nonReentrant whenNotPaused {
        _updateRewards(msg.sender);

        uint256 amount = rewardsAccrued[msg.sender];
        if (amount == 0) revert NoRewardsToClaim();

        rewardsAccrued[msg.sender] = 0;
        rewardToken.mint(msg.sender, amount);

        emit RewardsClaimed(msg.sender, amount);
    }

    /// @notice Returns the total claimable rewards for a user (accrued + pending).
    /// @dev View-only simulation of _updateRewards. Does not modify state.
    function pendingRewards(address user) external view returns (uint256) {
        if (lastUpdateTime[user] == 0) return 0;
        uint256 elapsed = block.timestamp - lastUpdateTime[user];
        uint256 pending = (elapsed * rewardRatePerSecond * stakerBoostedBalance[user]) / BPS_DIVISOR;
        return rewardsAccrued[user] + pending;
    }

    /// @notice Updates the base reward rate. Only callable by the owner.
    function setRewardRate(uint256 newRate) external onlyOwner {
        if (newRate == 0) revert ZeroRewardRate();
        emit RewardRateUpdated(rewardRatePerSecond, newRate);
        rewardRatePerSecond = newRate;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// @dev Accepts NFTs only from the GameItemNFT contract. Reverts otherwise.
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external view override returns (bytes4) {
        if (msg.sender != address(gameItemNFT)) revert InvalidNFTContract();
        return IERC721Receiver.onERC721Received.selector;
    }

    /// @dev Calculates and stores pending rewards before any boosted balance change.
    function _updateRewards(address user) internal {
        if (lastUpdateTime[user] > 0) {
            uint256 elapsed = block.timestamp - lastUpdateTime[user];
            rewardsAccrued[user] += (elapsed * rewardRatePerSecond * stakerBoostedBalance[user]) / BPS_DIVISOR;
        }
        lastUpdateTime[user] = block.timestamp;
    }

    /// @dev Maps a rarity enum value to its fixed multiplier in basis points.
    function _getMultiplier(GameItemNFT.Rarity rarity) internal pure returns (uint256) {
        if (rarity == GameItemNFT.Rarity.Common) return COMMON_MULTIPLIER;
        if (rarity == GameItemNFT.Rarity.Rare) return RARE_MULTIPLIER;
        if (rarity == GameItemNFT.Rarity.Epic) return EPIC_MULTIPLIER;
        return LEGENDARY_MULTIPLIER;
    }
}
