// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title GameItemNFT
/// @notice ERC-721 NFT with onchain rarity and game attributes.
/// @dev Owner-controlled minting. Attributes are immutable after mint.
contract GameItemNFT is ERC721Enumerable, Ownable, Pausable {
    enum Rarity {
        Common,
        Rare,
        Epic,
        Legendary
    }

    struct Attributes {
        Rarity rarity;
        uint32 power;
        uint32 agility;
    }

    uint256 public constant MAX_SUPPLY = 10000;

    uint256 private _nextTokenId = 1;
    mapping(uint256 tokenId => Attributes) private _attributes;

    event ItemMinted(address indexed to, uint256 indexed tokenId, Rarity rarity, uint32 power, uint32 agility);

    error MaxSupplyReached();
    error TokenDoesNotExist(uint256 tokenId);

    constructor() ERC721("GameItem", "GITEM") Ownable(msg.sender) {}

    /// @notice Mints a new NFT with the given attributes.
    /// @param to Recipient address.
    /// @param rarity Rarity tier of the item.
    /// @param power Offensive game stat.
    /// @param agility Speed/evasion game stat.
    function mint(
        address to,
        Rarity rarity,
        uint32 power,
        uint32 agility
    ) external onlyOwner whenNotPaused {
        if (_nextTokenId > MAX_SUPPLY) revert MaxSupplyReached();

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _attributes[tokenId] = Attributes({
            rarity: rarity,
            power: power,
            agility: agility
        });

        _safeMint(to, tokenId);

        emit ItemMinted(to, tokenId, rarity, power, agility);
    }

    /// @notice Returns the full attributes of a token.
    /// @param tokenId Token to query.
    function getAttributes(uint256 tokenId) external view returns (Attributes memory) {
        _requireExists(tokenId);
        return _attributes[tokenId];
    }

    /// @notice Returns only the rarity of a token.
    /// @param tokenId Token to query.
    function getRarity(uint256 tokenId) external view returns (Rarity) {
        _requireExists(tokenId);
        return _attributes[tokenId].rarity;
    }

    /// @notice Pauses minting.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses minting.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @dev Reverts if the token does not exist.
    function _requireExists(uint256 tokenId) internal view {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist(tokenId);
    }
}
