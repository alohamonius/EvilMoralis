// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract TokenMinter is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _mintedCount;
    uint256 public MAX_SUPPLY = 50;
    uint32 public HOLDERS_COUNT = 0;
    string private baseExtension = ".json";
    string private notRevealedUri = "";
    string private baseURI = "";
    bool private revealed = false;
    bool private onlyWhitelisted = false;

    SaleConfig public saleConfig;

    struct AddressData {
        uint128 balance;
        uint128 numberMinted;
    }

    struct SaleConfig {
        uint32 saleTime;
        uint256 mintRate;
        bool paused;
        string baseURI;
    }

    address[] public whitelistedAddresses;
    mapping(address => AddressData) private _addressData;

    constructor() ERC721("ALOHATOKEN", "ALT") {
        saleConfig.saleTime = 1640444162;
        saleConfig.mintRate = 0.3 ether;
        saleConfig.paused = false;
        setBaseURI("ipfs://QmXgMDuRGVEwPTWq7NDC2fuyVCQkY9E2gCB3qUKuJ8Hdhw/");
        setNotRevealedURI("");
    }

    function mint() public payable {
        uint256 _saleStartTime = uint256(saleConfig.saleTime);
        uint256 tokenId = _tokenIdCounter.current();
        address to = msg.sender;
        AddressData memory addressData = _addressData[to];

        require(
            _saleStartTime != 0 && block.timestamp >= _saleStartTime,
            "Sale has not started yet"
        );
        if (onlyWhitelisted == true) {
            require(
                isWhitelisted(msg.sender) == true,
                "User is not whitelisted"
            );
        }

        require(totalSupply() < MAX_SUPPLY, "Can`t mint more");
        require(msg.value >= saleConfig.mintRate, "Check you balance");
        require(addressData.numberMinted < 5, "Max per account reached");

        _addressData[to] = AddressData(
            addressData.balance + 1,
            addressData.numberMinted + 1
        );

        _safeMint(to, tokenId);
        _tokenIdCounter.increment();
        _mintedCount.increment();
        refundIfOver(saleConfig.mintRate);
    }

    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        Strings.toString(tokenId),
                        baseExtension
                    )
                )
                : "";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
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

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "Need to send more ETH.");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function getSaleInfo() public view returns (SaleConfig memory) {
        return saleConfig;
    }

    function getSalesData()
        public
        view
        returns (
            uint256,
            uint32,
            bool,
            string memory
        )
    {
        return (
            saleConfig.mintRate,
            saleConfig.saleTime,
            saleConfig.paused,
            saleConfig.baseURI
        );
    }

    function getMintedCount() public view returns (uint256) {
        return _mintedCount.current();
    }

    function reveal() public onlyOwner {
        revealed = true;
    }

    function setPause(bool _state) public onlyOwner {
        saleConfig.paused = _state;
    }

    function setMintRate(uint256 _rate) public onlyOwner {
        saleConfig.mintRate = _rate;
    }

    function setOnlyWhitelisted(bool _state) public onlyOwner {
        onlyWhitelisted = _state;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }
}
