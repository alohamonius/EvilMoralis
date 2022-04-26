// SPDX-License-Identifier: MIT LICENSE
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ERC20Rewards is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) admins;

    constructor() ERC20("AlohaReward", "ALTR") {}

    function mint(address to, uint256 amount) external {
        require(admins[msg.sender], "Only admins");
        _mint(to, amount);
    }

    function burnFrom(address account, uint256 amount) public override {
        if (admins[msg.sender]) _burn(account, amount);
        else super.burnFrom(account, amount);
    }

    function addController(address controller) external onlyOwner {
        admins[controller] = true;
    }

    function removeController(address controller) external onlyOwner {
        admins[controller] = false;
    }
}
