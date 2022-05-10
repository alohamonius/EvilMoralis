import Web3Modal from 'web3modal'
import { Contract, ContractInterface, ethers } from 'ethers'
import { Type } from 'tsparticles';

export async function addToMetamaskToken(tokenAddress: string, tokenSymbol: string, tokenDecimals: number) {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
    } catch (error) {
        console.log(error);
    }
}

export const getSigner = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    return provider
}

export async function doTransaction(doTx: any, onSuccess: any, onFail: any) {
    try {
        let transaction = await doTx();

        let tx = await transaction.wait();
        if (tx)
            onSuccess();
    } catch (e: any) {
        onFail(e);
    }
};

export async function createContract(contractAddress: any, abi: ContractInterface, signed: boolean = true): Promise<ethers.Contract> {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(contractAddress, abi,provider.getSigner());

    return contract;
};

export async function lastBlock(){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    return provider.blockNumber;
}