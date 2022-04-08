import React, { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Contract, ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Image, Radio } from 'antd';
import {
    MINT_CONTRACT
} from '../../../config.js'

import TokenMinter from '../../../artifacts/contracts/TokenMinter.sol/TokenMinter.json'
import { useMoralis } from 'react-moralis';
import { notification } from 'antd';
export const Minter = () => {
    const { user, Moralis } = useMoralis();

    const [mintRate, setMintRate] = useState<number>(0);
    const [mintedPieces, setMintedPieced] = useState<number>(0);
    const [maxSupply, setMaxSupply] = useState<number>(0);
    const [isBlocked, setBlocked] = useState<boolean>(false);
    const [mintedCountByAddress, setMintedCountByAddress] = useState<number>(0);
    const [saleStartedAt, setSaleStartedAt] = useState<number>();


    React.useEffect(
        () => {
            async function readContractData() {
                const web3Provider = await Moralis.enableWeb3();
                const contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, web3Provider);

                let config = await contract.saleConfig();
                debugger;

                setSaleStartedAt(config.saleTime);
                setMintRate(+Moralis.Units.FromWei(config.mintRate));
                setMintedPieced((await contract.totalSupply()).toString())
                setMaxSupply((await contract.MAX_SUPPLY()).toString())
                setBlocked(((await contract.getPauseState()).toString()))

                setMintedCountByAddress((await contract.numberMintedByAddress()).toString())
            }

            readContractData();
        }, []
    );

    async function doTransaction(doTx: any, onSuccess: any, onFail: any) {
        try {
            let transaction = await doTx();

            let tx = await transaction.wait();
            if (tx)
                onSuccess();
        } catch (e: any) {
            onFail(e);
        }
    };

    async function doPause(state: boolean) {
        const signer = await Web3Service.getMySigner()
        let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
        await doTransaction(
            async () => await contract.pause(state),
            () => {
                notification.success({
                    message: `Pause tx completed.`,
                });
            }, (e: any) => {
                notification.error({
                    message: `${e.data.message}`,
                });
            });
    };

    async function doMint() {
        debugger;
        const signer = await Web3Service.getMySigner()
        let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
        contract.filters.Transfer(user?.get('ethAddress'));
        contract.once("Transfer", async (source, destination, value) => {
            notification.success({
                message: `Minted from contract to ${destination}. TokenID - ${value.toString()}`,
            });
            setMintedPieced((await contract.totalSupply()).toString())
        });

        await doTransaction(
            async () => await contract.mint(1),
            () => {
                notification.success({
                    message: `Transaction executed`,
                });
            }, (e: any) => {
                notification.error({
                    message: `Transaction failer ${e.data.message}`,
                });
            });
    };

    return (
        <div>
            <div className="grid p-4 grid-cols-1 hover:grid-cols-6">
                <div className='text-center'>
                    <div className='mt-4'>
                        <div>
                            <Image preview={false} height={"50px"} width={"50px"} src='preview.gif' className='block'></Image>
                        </div>
                        <div className='mt-4'   >
                            <Image preview={false} height={"50px"} width={"50px"} src='question-mark.png' className='block'></Image>
                        </div>
                        <p className='p-1'>Mint you random NFT. One from the 300 token could be you.</p>
                        <h3>Price per mint: {mintRate}</h3>
                        <h3>Started At: {saleStartedAt}</h3>
                        <h3>Minting live: {isBlocked ? "live" : "paused"}</h3>
                        <h3>Supply: {mintedPieces}/{maxSupply}</h3>
                        <h3>Minted by you account :{mintedCountByAddress}</h3>
                        <Button className="font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={doMint}>Mint you unique NFT</Button>

                    </div>

                    <div className=''>
                        {
                            <p>Right now contract sale is : {isBlocked ? 'on' : 'off'}</p>
                        }
                        <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" disabled={!isBlocked} onClick={() => doPause(true)}> Pause off</Button>
                        <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" disabled={isBlocked} onClick={() => doPause(false)}> Pause on</Button>

                    </div>

                </div>
            </div>

        </div>

    )
}

const Web3Service = {
    getMySigner: async function () {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        return provider.getSigner();
    }
};