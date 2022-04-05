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
    const { user } = useMoralis();
    const [mintRate, setMintRate] = useState();
    const [mintedPieces, setMintedPieced] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);
    const [isBlocked, setBlocked] = useState(false);

    React.useEffect(
        () => {
            async function readContractData() {
                const signer = await Web3Service.getMySigner()
                let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
                setMintRate((await contract.mintRate()).toString());
                setMintedPieced((await contract.totalSupply()).toString())
                setMaxSupply((await contract.MAX_SUPPLY()).toString())
                setBlocked(await contract.getPauseState())
            }

            readContractData();

        }, []
    );

    async function mint() {

        const signer = await Web3Service.getMySigner()
        let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
        contract.filters.Transfer(user?.get('ethAddress'));
        contract.once("Transfer", (source, destination, value) => {
            notification.success({
                message: `Minted from contract to ${destination}. TokenID - ${value.toString()}`,
            });
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


            <div className=''>

                <div className="grid p-4 grid-cols-2 hover:grid-cols-6">
                    <div className=''>
                        <Image className='w-1' src='preview.gif'></Image>
                    </div>

                    <div>
                        <div className='text-center'>
                            <div className='mt-4'>
                                <Image height={"50px"} width={"50px"} src='question-mark.png'></Image>
                                <p>Mint you random NFT. One from the 2222 token could be you.</p>
                                <h3>Price per mint: {mintRate}</h3>
                                <h3>Minting live: {isBlocked}</h3>
                                <h3>Supply: {mintedPieces}/{maxSupply}</h3>

                            </div>

                            <button className="font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={mint}> Mint you unique NFT</button>

                        </div>
                    </div>

                </div>
                <div>

                </div>
                <h2>MINTER</h2>
            </div>
        </div>

    )
}
