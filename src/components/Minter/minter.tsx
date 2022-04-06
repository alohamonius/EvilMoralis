import React, { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Image } from 'antd';
import {
    MINT_CONTRACT
} from '../../../config.js'

import TokenMinter from '../../../artifacts/contracts/TokenMinter.sol/TokenMinter.json'
import { useMoralis } from 'react-moralis';
import { notification } from 'antd';
export const Minter = () => {
    const { user, Moralis } = useMoralis();
    const [mintRate, setMintRate] = useState(0);
    const [mintedPieces, setMintedPieced] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);
    const [isBlocked, setBlocked] = useState(false);

    React.useEffect(
        () => {
            async function readContractData() {
                const signer = await Web3Service.getMySigner()
                let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
                let rate = await contract.mintRate();
                setMintRate(+Moralis.Units.FromWei(rate));
                setMintedPieced((await contract.totalSupply()).toString())
                setMaxSupply((await contract.MAX_SUPPLY()).toString())
                setBlocked(((await contract.getPauseState()).toString()))
            }

            readContractData();

        }, []
    );

    async function mint() {

        const signer = await Web3Service.getMySigner()
        let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
        contract.filters.Transfer(user?.get('ethAddress'));
        contract.once("Transfer", async (source, destination, value) => {
            notification.success({
                message: `Minted from contract to ${destination}. TokenID - ${value.toString()}`,
            });
            setMintedPieced((await contract.totalSupply()).toString())
        });

        try {
            let transaction = await contract.mint(1)

            let tx = await transaction.wait();
            if (tx) {
                notification.success({
                    message: `Transaction executed`,
                });
            }
        } catch (e: any) {
            notification.error({
                message: `Transaction failer ${e.data}`,
            });
            console.log(e.data);
        }
    }



    const Web3Service = {
        getMySigner: async function () {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            return provider.getSigner()
        }
    };

    return (
        <div>



            <div className="grid p-4 grid-cols-1 hover:grid-cols-6">
                <div className='text-center'>
                    <div className='mt-4'>
                        <div>
                            <Image preview={false} height={"250px"} width={"250px"} src='preview.gif' className='block'></Image>
                        </div>
                        <div className='mt-4'   >
                            <Image preview={false} height={"50px"} width={"50px"} src='question-mark.png' className='block'></Image>
                        </div>
                        <p className='p-1'>Mint you random NFT. One from the 300 token could be you.</p>
                        <h3>Price per mint: {mintRate}</h3>
                        <h3>Minting live: {isBlocked ? "live" : "paused"}</h3>
                        <h3>Supply: {mintedPieces}/{maxSupply}</h3>
                        <button className="font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={mint}> Mint you unique NFT</button>

                    </div>


                </div>
            </div>

        </div>

    )
}
