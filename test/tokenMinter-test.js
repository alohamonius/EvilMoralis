const assert = require("assert");
const { expect, chai } = require("chai");
const { ethers } = require("hardhat");
const { mint, shouldFail } = require("./utils");

describe('TokenMinter', () => {
    let nft;
    let staker;
    let rewardContract;
    let maxSupply;
    let mintPrice;

    beforeEach(async function () {
        let Minter = await ethers.getContractFactory("TokenMinter");
        let Staker = await ethers.getContractFactory("Staker");
        let Reward = await ethers.getContractFactory("ERC20Rewards");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12] = await ethers.getSigners();

        nft = await Minter.deploy();
        rewardContract = await Reward.deploy();
        staker = await Staker.deploy(nft.address, rewardContract.address);


        let transaction = await nft.setApprovalForAll(staker.address, true);
        await transaction.wait();


        maxSupply = await nft.MAX_SUPPLY();
        let salesData = await nft.getSalesData();
        mintPrice = salesData[0];//parse
    });

    it("owner try to mint", async () => {
        await mint(nft, owner, 1, mintPrice);
        await mint(nft, owner, 2, mintPrice);

        const ownerTokens = await nft.walletOfOwner(owner.address);

        expect(ownerTokens.length).to.be.equal(3);
    });

    it("user mint and contract has positive balance ", async () => {
        const addr1BalanceBefore = await addr1.getBalance();
        const ethValueBefore = ethers.utils.formatEther(addr1BalanceBefore);

        await nft.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("1.0") });
        const addr1BalanceAfter = await addr1.getBalance();
        const ethValueAfter = ethers.utils.formatEther(addr1BalanceAfter);

        assert(ethValueAfter < ethValueBefore);
    });

    it('user try mint with low price', async () => {
        let failed = await shouldFail(async () => await nft.connect(addr1).mint(2, { from: addr1.address, value: ethers.utils.parseEther('0.3') }));
        expect(failed).be.true;
    });

    it("user mint few times and check balance", async () => {

        await nft.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });
        await nft.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });
        await nft.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });

        await nft.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("0.3") });
        await nft.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("0.3") });
        await nft.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("0.3") });

        var addr4Tokens = await nft.walletOfOwner(addr4.address);
        const addr1Tokens = await nft.walletOfOwner(addr1.address)
        const addr2Tokens = await nft.walletOfOwner(addr2.address);

        assert(addr4Tokens.length == 3);
        assert(addr1Tokens.length == 1);
        assert(addr2Tokens.length == 2);
    });


    it("maximum amount per one mint", async () => {
        await mint(nft, addr5, 5, mintPrice);

        var tokenIds = await nft.walletOfOwner(addr5.address);

        assert(tokenIds.length == 5);
    });

    it("mint more then maximum per account throw exception", async () => {
        await mint(nft, addr2, 5, mintPrice);
        let isFailed = await shouldFail(async () => await mint(nft, addr2, 1, mintPrice));
        expect(isFailed).to.be.true;
    });


    it("mint more then supply should throw exception", async () => {
        await mint(nft, addr11, 5, mintPrice);
        await mint(nft, addr10, 5, mintPrice);
        await mint(nft, addr9, 5, mintPrice);
        await mint(nft, addr8, 5, mintPrice);
        await mint(nft, addr7, 5, mintPrice);
        await mint(nft, addr6, 5, mintPrice);
        await mint(nft, addr5, 5, mintPrice);
        await mint(nft, addr4, 5, mintPrice);
        await mint(nft, addr3, 5, mintPrice);
        await mint(nft, addr2, 5, mintPrice);

        let failed = await shouldFail(async () => await mint(nft, addr1, 1, mintPrice));

        let totalSupply = await nft.totalSupply();

        var addr1TokenIds = await nft.walletOfOwner(addr1.address);
        expect(addr1TokenIds.length).to.equal(0);
        expect(totalSupply).to.equal(50);
        expect(failed).be.true;
    });

    it("holders count should be correct", async () => {
        await mint(nft, addr1, 1, mintPrice);
        await mint(nft, addr1, 1, mintPrice);
        await mint(nft, addr2, 1, mintPrice);

        let holders = await nft.HOLDERS_COUNT();
        expect(holders).to.equal(2);
    });

    it("WE  ", async () => {
        await mint(nft, addr1, 1, mintPrice);
        var addr1TokenIds = await nft.walletOfOwner(addr1.address);

        await staker.connect(addr1).stake(addr1TokenIds);

        let stakeValue = staker.walletOfOwner(addr1.address);

        expect(stakeValue).to.eq(1);
    });


});
