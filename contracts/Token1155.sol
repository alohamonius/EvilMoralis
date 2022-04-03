// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin//contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTContract is ERC1155, Ownable {
    using SafeMath for uint256;

    constructor()
        ERC1155(
            "ipfs://QmSAT2RDvEJEQyBHnANjS4sSmxfsrt9qEmKwWs6GAyLdTv/metadata/{id}.json" // You can get this saved in dasboard of your Moralis server instance.
        )
    {
        _mint(msg.sender, 1, 1, "");
    }

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }
    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }
}
