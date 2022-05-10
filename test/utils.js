module.exports = {
    mint: async function (tokenContract, addr, amount, price) {
        console.log('amount of money', ethers.utils.parseEther('' + price * amount));
        await tokenContract.connect(addr).mint(amount, { from: addr.address, value: ethers.utils.parseEther('' + 0.3 * amount) });
    },

    shouldFail: async function (action) {
        try {
            await action();
        } catch (errror) {
            return true;
        }
        return false;
    }

};
