const assert = require("assert");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('TokenMinter', () => {
    let Minter;
    let tokenContract;

    beforeEach(async function () {
        Minter = await ethers.getContractFactory("TokenMinter");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12] = await ethers.getSigners();
        tokenContract = await Minter.deploy();
    });

    it("TwoUsersTryToMintAndCheckBalance", async () => {
        await tokenContract.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr3).mint(1, { from: addr3.address, value: ethers.utils.parseEther("100.0") });

        const numberMinted1 = (await tokenContract.numberMintedByAddress(addr1.address)).toString();

        const numberMinted2 = (await tokenContract.numberMintedByAddress(addr2.address)).toString();

        const contractBalance = ethers.utils.formatEther(await ethers.provider.getBalance(tokenContract.address));
        const addr3Balance = ethers.utils.formatEther(await addr3.getBalance());

        assert(+numberMinted1 === 1, `${numberMinted1}`);
        assert(+numberMinted2 === 2);
        assert(+contractBalance === 1.2);
        assert(+addr3Balance > 9999);
    });

    it("MintedAndBalanced", async () => {
        const addr1Balance = await addr1.getBalance();
        const ethValue = ethers.utils.formatEther(addr1Balance);
        console.log('balance:', ethValue);

        await tokenContract.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });

        const addr1Tokens = (await tokenContract.balanceOf(addr1.address)).toString();

        const addr2Tokens = (await tokenContract.balanceOf(addr2.address)).toString();

        assert(addr1Tokens == 1);
        assert(addr2Tokens == 2);
    });

    it("OwnerTryToMint", async () => {
        const addr1Balance = await owner.getBalance();
        const ethValue = ethers.utils.formatEther(addr1Balance);
        console.log('balance:', ethValue);

        await tokenContract.connect(owner).mint(1, { from: owner.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(owner).mint(1, { from: owner.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(owner).mint(1, { from: owner.address, value: ethers.utils.parseEther("0.3") });

        const addr1Tokens = (await tokenContract.balanceOf(owner.address)).toString();

        assert(addr1Tokens == 3);
    });

    it("MaxPerAccountReached", async () => {
        const addr1Balance = await addr1.getBalance();
        const ethValue = ethers.utils.formatEther(addr1Balance);
        console.log('balance:', ethValue);

        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint(1, { from: addr2.address, value: ethers.utils.parseEther("1.0") });

        let isFailed = false;
        try {
            await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        } catch (e) {
            isFailed = true;
        }
        assert(isFailed == true);

    });

    it("ContractHasMoney", async () => {
        const addr1BalanceBefore = await addr1.getBalance();
        const ethValueBefore = ethers.utils.formatEther(addr1BalanceBefore);

        await tokenContract.connect(addr1).mint(1, { from: addr1.address, value: ethers.utils.parseEther("1.0") });
        const addr1BalanceAfter = await addr1.getBalance();
        const ethValueAfter = ethers.utils.formatEther(addr1BalanceAfter);

        console.log('before', ethValueBefore, 'after', ethValueAfter);
        assert(ethValueAfter < ethValueBefore);
    });

    it("MintWithSmallSendingValue", async () => {
        let isThrowedException = false;
        try {
            await tokenContract.connect(addr1).mint({ from: addr1.address, value: ethers.utils.parseEther("0.1") })
        }
        catch (e) {
            isThrowedException = true;
        }
        assert(isThrowedException == true);
    });

    it("UserDoMintAndCheckTokenId", async () => {
        await tokenContract.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(addr4).mint(1, { from: addr4.address, value: ethers.utils.parseEther("0.3") });

        var tokenIds = await tokenContract.walletOfOwner(addr4.address);

        assert(tokenIds.length == 3);
    });


    it("MaximumPerOneMint", async () => {
        await tokenContract.connect(addr5).mint(5, { from: addr5.address, value: ethers.utils.parseEther('' + 0.3 * 5) });

        var tokenIds = await tokenContract.walletOfOwner(addr5.address);

        assert(tokenIds.length == 5);
    });

    it("MintMoreThenMaximumShouldThrowException", async () => {
        await mint(addr11, 5);
        await mint(addr10, 5);
        await mint(addr9, 5);
        await mint(addr8, 5);
        await mint(addr7, 5);
        await mint(addr6, 5);
        await mint(addr5, 5);
        await mint(addr4, 5);
        await mint(addr3, 5);
        await mint(addr2, 5);

        let failed = false;
        try {
            await mint(addr1, 1);
        } catch (e) {
            failed = true;
        }

        assert(failed == true);
    });

    const price = 0.3;
    async function mint(addr, amount) {
        await tokenContract.connect(addr).mint(amount, { from: addr.address, value: ethers.utils.parseEther('' + price * amount) });
    };
});