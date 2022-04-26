// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC20Rewards.sol";
import "./TokenMinter.sol";

contract Staker is Ownable, IERC721Receiver {
    using Counters for Counters.Counter;

    Counters.Counter public totalStaked;

    struct Stake {
        uint24 tokenId;
        uint48 claimedAt;
        uint48 stakedAt;
        address owner;
    }

    event NFTStaked(address owner, uint256 tokenId, uint256 value);
    event NFTUnstaked(address owner, uint256 tokenId, uint256 value);
    event Claimed(address owner, uint256 amount);

    TokenMinter nft;
    ERC20Rewards token;

    mapping(uint256 => Stake) public vault;

    constructor(TokenMinter _nft, ERC20Rewards _token) {
        nft = _nft;
        token = _token;
    }

    function stake(uint256[] calldata tokenIds) external {
        uint256 tokenId;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];
            require(nft.ownerOf(tokenId) == msg.sender, "not you token");
            require(vault[tokenId].tokenId == 0, "Already staked");

            nft.transferFrom(msg.sender, address(this), tokenId);
            emit NFTStaked(msg.sender, tokenId, block.timestamp);

            totalStaked.increment();

            vault[tokenId] = Stake({
                owner: msg.sender,
                stakedAt: uint48(block.timestamp),
                tokenId: uint24(tokenId),
                claimedAt: vault[tokenId].claimedAt
            });
        }
    }

    function _unstakeMany(address account, uint256[] calldata tokenIds)
        internal
    {}

    function unstake(uint256[] calldata tokenIds) external {}

    function _claim(
        address account,
        uint256[] calldata tokenIds,
        bool _unstake
    ) internal {
        uint256 tokenId;
        uint256 earned = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];
            Stake memory staked = vault[tokenId];
            require(staked.owner == account, "Not you token");

            uint256 startedStakingAt = staked.stakedAt;
            earned += earningCalculator(startedStakingAt);

            vault[tokenId] = Stake({
                owner: msg.sender,
                tokenId: uint24(tokenId),
                stakedAt: uint48(startedStakingAt),
                claimedAt: uint48(block.timestamp)
            });
        }

        if (earned > 0) {
            earned = earned / 10;
            token.mint(account, earned);
        }

        if (_unstake) {
            _unstakeMany(account, tokenIds);
        }
        emit Claimed(account, earned);
    }

    function earningInfo(uint256[] calldata tokenIds)
        external
        view
        returns (uint256[2] memory info)
    {
        uint256 tokenId;
        for (uint256 i = 0; i < tokenIds.length; i++) {}
        Stake memory staked = vault[tokenId];
    }

    function earningCalculator(uint256 startedStakingAt)
        internal
        returns (uint256)
    {
        return (100000 ether * (block.timestamp - startedStakingAt)) / 1 days;
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0), "Cannot send nfts to Vault directly");
        return IERC721Receiver.onERC721Received.selector;
    }
}
