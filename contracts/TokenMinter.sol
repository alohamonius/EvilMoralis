// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract TokenMinter is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public mintRate = 0.1 ether;
    uint256 public MAX_SUPPLY = 300;
    bool public paused = false;
    bool public revealed = false;
    string baseURI;

    constructor(
    ) ERC721("qqwe", "sxz") {
       // baseURI = _initBaseURI;
    }

    function mint(uint256 _count) public payable {
        require(totalSupply() < MAX_SUPPLY, "Can`t mint more");
        require(msg.value <= mintRate, "Check you balance");
        uint256 tokenId = _tokenIdCounter.current();

        _tokenIdCounter.increment();
        for (uint256 i = 0; i < _count; i++) {
            _safeMint(msg.sender, tokenId);
        }
    }

    function helloWorld() public pure returns (string memory) {
        return "HELLO WORLD";
    }

    function reveal() public onlyOwner {
        revealed = true;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setMintRate(uint256 _rate) public onlyOwner {
        mintRate = _rate;
    }
}
