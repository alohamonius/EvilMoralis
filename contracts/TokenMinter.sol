// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract TokenMinter is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public MAX_SUPPLY = 300;
    bool public paused = false;
    bool public revealed = false;
    string baseURI;

    SaleConfig public saleConfig;

    struct AddressData {
        uint128 balance;
        uint128 numberMinted;
    }

    struct SaleConfig {
        uint32 saleTime;
        uint256 mintRate;
    }

    mapping(address => AddressData) private _addressData;

    constructor() ERC721("qqwe", "sxz") {
        saleConfig.saleTime = 1640444162;
        saleConfig.mintRate = 0.3 ether;
    }

    function mint() public payable {
        uint256 _saleStartTime = uint256(saleConfig.saleTime);
        require(
            _saleStartTime != 0 && block.timestamp >= _saleStartTime,
            "sale has not started yet"
        );

        uint256 tokenId = _tokenIdCounter.current();
        address to = msg.sender;

        require(totalSupply() < MAX_SUPPLY, "Can`t mint more");
        require(msg.value <= saleConfig.mintRate, "Check you balance");
        require(!paused, "Sale is paused");

        AddressData memory addressData = _addressData[to];

        _addressData[to] = AddressData(
            addressData.balance + 1,
            addressData.numberMinted + 1
        );
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
    }

    function myMintedNumber() public view returns (uint256) {
        require(
            msg.sender != address(0),
            "ERC721A: number minted query for the zero address"
        );
        return uint256(_addressData[msg.sender].numberMinted);
    }

    function numberMintedByAddress(address owner)
        public
        view
        returns (uint256)
    {
        require(
            owner != address(0),
            "ERC721A: number minted query for the zero address"
        );
        return uint256(_addressData[owner].numberMinted);
    }

    function setStartTime(uint32 saleTime) external onlyOwner {
        saleConfig.saleTime = saleTime;
    }

    function getPauseState() public view returns (bool) {
        return paused;
    }

    function setPause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setMintRate(uint256 _rate) public onlyOwner {
        saleConfig.mintRate = _rate;
    }
}
