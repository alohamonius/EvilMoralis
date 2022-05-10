const assert = require("assert");
const { expect, chai } = require("chai");
const { ethers } = require("hardhat");
const { mint, shouldFail } = require("./utils");

describe('TokenMinter', () => {
    let Minter;
    let tokenContract;
    let maxSupply;
    let mintPrice;
    beforeEach(async function () {
        Minter = await ethers.getContractFactory("TokenMinter");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12] = await ethers.getSigners();
        tokenContract = await Minter.deploy();

        maxSupply = await tokenContract.MAX_SUPPLY();
        let salesData = await tokenContract.getSalesData();
        mintPrice = salesData[0];
        console.log("MINT_PRICE_------", mintPrice);
    });

    it("owner try to mint", async () => {
        await mint(tokenContract, owner, 1, mintPrice);
        await mint(tokenContract, owner, 2, mintPrice);

        const ownerTokens = await tokenContract.walletOfOwner(owner.address);

        expect(ownerTokens.length).to.be.equal(3);
    });


    it("user mint and contract has positive balance ", async () => {
        const addr1BalanceBefore = await addr1.getBalance();
        const ethValueBefore = ethers.utils.formatEther(addr1BalanceBefore);

        await tokenContract.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("1.0") });
        const addr1BalanceAfter = await addr1.getBalance();
        const ethValueAfter = ethers.utils.formatEther(addr1BalanceAfter);

        assert(ethValueAfter < ethValueBefore);
    });

    it('user try mint with low price', async () => {
        let failed = await shouldFail(async () => await tokenContract.connect(addr1).mint(2, { from: addr1.address, value: ethers.utils.parseEther('0.3') }));
        expect(failed).be.true;
    });

    it("user mint few times and check balance", async () => {

        await tokenContract.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });

        await tokenContract.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("0.3") });

        var addr4Tokens = await tokenContract.walletOfOwner(addr4.address);
        const addr1Tokens = await tokenContract.walletOfOwner(addr1.address)
        const addr2Tokens = await tokenContract.walletOfOwner(addr2.address);

        assert(addr4Tokens.length == 3);
        assert(addr1Tokens.length == 1);
        assert(addr2Tokens.length == 2);
    });


    it("maximum amount per one mint", async () => {
        await mint(tokenContract, addr5, 5, mintPrice);

        var tokenIds = await tokenContract.walletOfOwner(addr5.address);

        assert(tokenIds.length == 5);
    });

    it("mint more then maximum per account throw exception", async () => {
        await mint(tokenContract, addr2, 5, mintPrice);
        let isFailed = await shouldFail(async () => await mint(tokenContract, addr2, 1, mintPrice));
        expect(isFailed).to.be.true;
    });


    it("mint more then supply should throw exception", async () => {
        await mint(tokenContract, addr11, 5, mintPrice);
        await mint(tokenContract, addr10, 5, mintPrice);
        await mint(tokenContract, addr9, 5, mintPrice);
        await mint(tokenContract, addr8, 5, mintPrice);
        await mint(tokenContract, addr7, 5, mintPrice);
        await mint(tokenContract, addr6, 5, mintPrice);
        await mint(tokenContract, addr5, 5, mintPrice);
        await mint(tokenContract, addr4, 5, mintPrice);
        await mint(tokenContract, addr3, 5, mintPrice);
        await mint(tokenContract, addr2, 5, mintPrice);

        let failed = await shouldFail(async () => await mint(tokenContract, addr1, 1, mintPrice));

        let totalSupply = await tokenContract.totalSupply();

        var addr1TokenIds = await tokenContract.walletOfOwner(addr1.address);
        expect(addr1TokenIds.length).to.equal(0);
        expect(totalSupply).to.equal(50);
        expect(failed).be.true;
    });

    it("holders count should be correct", async () => {
        await mint(tokenContract, addr1, 1, mintPrice);
        await mint(tokenContract, addr1, 1, mintPrice);
        await mint(tokenContract, addr2, 1, mintPrice);

        let holders = await tokenContract.HOLDERS_COUNT();
        expect(holders).to.equal(2);
    });
});
