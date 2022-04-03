import React from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Alert } from 'antd';
import {
    MINT_CONTRACT
} from '../../../config.js'

import TokenMinter from '../../../artifacts/contracts/TokenMinter.sol/TokenMinter.json'
import { useMoralis } from 'react-moralis';
import { notification } from 'antd';
export const Minter = () => {
    const { user } = useMoralis();
    
    React.useEffect(
         () => {
            let job = setInterval(async () => {
                const signer = await Web3Service.getMySigner()
                let contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, signer);
                debugger;
                console.log(`total supply ${await contract.totalSupply()}`)
            }, 1 * 1000);

            return () => {
                clearInterval(job);
            };
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

        var mintRate = await contract.mintRate();
        var max = await contract.MAX_SUPPLY();

        let transaction = await contract.safeMint(await signer.getAddress())

        let tx = await transaction.wait();
        if(tx){
            notification.success({
                message: `Transaction executed`,
              });
        }
        console.log(tx)

        console.log(`total supply ${await contract.totalSupply()} / from ${max} . Mint rate ${ethers.utils.formatUnits(mintRate, 'ether')} eth`)
    }


    const alert= ()=>  <Alert message="Minted" type="success" />;
    const Web3Service = {
        getMySigner: async function () {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            return provider.getSigner()
        }
    };

    return (
        <div className='text-center'>
            <button className="font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={mint}> MINT</button>

            <h2>MINTER</h2>
        </div>
    )
}
