const assert = require("assert");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('TokenMinter', () => {
    let Minter;
    let tokenContract;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        Minter = await ethers.getContractFactory("TokenMinter");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        tokenContract = await Minter.deploy();
    });

    it("TwoUsersTryToMintAndCheckBalance", async () => {
        await tokenContract.connect(addr1).mint({ from: addr1.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr3).mint({ from: addr3.address, value: ethers.utils.parseEther("100.0") });

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

        await tokenContract.connect(addr1).mint({ from: addr1.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });

        const addr1Tokens = (await tokenContract.balanceOf(addr1.address)).toString();

        const addr2Tokens = (await tokenContract.balanceOf(addr2.address)).toString();

        assert(addr1Tokens == 1);
        assert(addr2Tokens == 2);
    });

    it("OwnerTryToMint", async () => {
        const addr1Balance = await owner.getBalance();
        const ethValue = ethers.utils.formatEther(addr1Balance);
        console.log('balance:', ethValue);

        await tokenContract.connect(owner).mint({ from: owner.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(owner).mint({ from: owner.address, value: ethers.utils.parseEther("0.3") });
        await tokenContract.connect(owner).mint({ from: owner.address, value: ethers.utils.parseEther("0.3") });

        const addr1Tokens = (await tokenContract.balanceOf(owner.address)).toString();

        assert(addr1Tokens == 3);
    });

    it("MaxPerAccountReached", async () => {
        const addr1Balance = await addr1.getBalance();
        const ethValue = ethers.utils.formatEther(addr1Balance);
        console.log('balance:', ethValue);

        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });
        await tokenContract.connect(addr2).mint({ from: addr2.address, value: ethers.utils.parseEther("1.0") });

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

        await tokenContract.connect(addr1).mint({ from: addr1.address, value: ethers.utils.parseEther("1.0") });
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

    it("RetireveSaleInfo", async () => {
        const saleInfo = await tokenContract.getSaleInfo();
        assert(saleInfo[1].toString() == ethers.utils.parseEther("0.3"), saleInfo);

    });

    it("RetireveSaleInfo2", async () => {
        const saleInfo = await tokenContract.getSalesData();
        assert(saleInfo[0].toString() == ethers.utils.parseEther("0.3"), saleInfo);
        
    });

});