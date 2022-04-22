import React, { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { BigNumber, Contract, ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Image, Input, Spin } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
    MINT_CONTRACT
} from '../../../config.js'

import TokenMinter from '../../../artifacts/contracts/TokenMinter.sol/TokenMinter.json'
import { useMoralis } from 'react-moralis';
import { notification } from 'antd';

export const Minter = () => {
    const { user, Moralis } = useMoralis();
    const [contractLoaded, setContractLoaded] = useState<boolean>(false);


    const [mintRate, setMintRate] = useState<number>(0);
    const [mintedPieces, setMintedPieced] = useState<number>(0);
    const [maxSupply, setMaxSupply] = useState<number>(0);
    const [isBlocked, setBlocked] = useState<boolean>(false);
    const [mintedCountByAddress, setMintedCountByAddress] = useState<number>(0);
    const [saleStartedAt, setSaleStartedAt] = useState<number>();
    const [myCount, setMyCount] = useState<number>(0);
    const [myAddress, setMyAddress] = useState<string>()
    const [myTokenIds, setMyTokenIds] = useState<any>();
    const [myNftItems, setMyNftItems] = useState<any>();

    React.useEffect(
        () => {
            async function readContractData() {
                if (!user) {
                    return;
                }
                try {
                    const address = user?.get('ethAddress');
                    setMyAddress(address);
                    const contract = await createContract();
                    const maxSupply = await contract.MAX_SUPPLY();
                    const config = await contract.getSalesData();

                    const tokenIds = await contract.walletOfOwner(address);
                    setMyTokenIds(tokenIds);
                    setMintRate(+Moralis.Units.FromWei(config[0]));
                    setSaleStartedAt(config[1]);
                    setBlocked(config[2]);
                    setMaxSupply(maxSupply.toString());
                    setMyCount((await contract.myMintedNumber()).toString());
                    setMintedPieced((await contract.getMintedCount()).toString());
                    if (tokenIds.length > 0) {
                        var myItems = await generateItems(contract, tokenIds);
                        setMyNftItems(myItems);
                    }

                    setContractLoaded(true);
                } catch (error) {
                    setContractLoaded(false);
                    notification.error({
                        message: `${error}`,
                    });
                }
            }

            readContractData();
        }, [user]
    );

    const createContract = async (): Promise<ethers.Contract> => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = new ethers.Contract(MINT_CONTRACT, TokenMinter.abi, provider.getSigner());
        return contract;
    };

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
        const contract = await createContract();
        await doTransaction(
            async () => await contract.setPause(state),
            () => {
                notification.success({
                    message: `Pause tx completed.`,
                });
            }, (e: any) => {
                notification.error({
                    message: `${e.data?.message ?? e}`,
                });
            });
    };

    async function doMint() {
        const contract = await createContract();
        contract.filters.Transfer(myAddress);
        contract.once("Transfer", async (source, destination, value) => {
            notification.success({
                message: `Minted from contract to ${destination}. TokenID - ${value.toString()}`,
            });
            setMyTokenIds([...myTokenIds, value]);
            setMintedPieced((await contract.totalSupply()).toString());
        });

        await doTransaction(
            async () => await contract.mint({ value: ethers.utils.parseEther("0.3") }),
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

    async function reveal() {
        const contract = await createContract();
        await contract.reveal();
    }

    const addToMetamaskToken = async () => {
        const tokenAddress = MINT_CONTRACT;
        const tokenSymbol = 'ALT';
        const tokenDecimals = 0;

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

    const generateItems = async (contract: ethers.Contract, tokenIds: any[]) => {
        const tokensInfo: any = [];
        await Promise.all(tokenIds.map(async (element: BigNumber, i: number) => {
            const tokenId = element.toString();
            var uri = await contract.tokenURI(element);
            var tokeninfoParagraph = <p key={i}>ID: {tokenId} / URL : {uri}</p>
            tokensInfo.push(tokeninfoParagraph);

        }));

        return tokensInfo;
    };

    const TokenInfo = () => {
        if (contractLoaded)
            return (
                <>
                    <p className='p-1'>Mint you random NFT. One from the 50 token could be you.</p>
                    <h3>Contract: {MINT_CONTRACT}  <PlusCircleOutlined className='text-l' onClick={addToMetamaskToken} /></h3>

                   
                    <h3>Price per mint: {mintRate}</h3>
                    <h3>Started At: {saleStartedAt}</h3>
                    <h3>Minting live: {!isBlocked ? "live" : "paused"}</h3>
                    <h3>Supply: {mintedPieces}/{maxSupply}</h3>
                    <h3>Minted by you account: {myCount}</h3>
                </>
            )
        else return <div className='mt-4'><Spin></Spin></div>
    }

    return (
        <div>
            <div className="grid p-4 grid-cols-2 ">
                <div className='text-center border-4 bg-red-500 p-10 h-full'>
                    <div className='mt-4'>
                        <div>
                            <Image preview={false} height={"50px"} width={"50px"} src='preview.gif' className='block'></Image>
                        </div>
                        <div className='mt-4'   >
                            <Image preview={false} height={"50px"} width={"50px"} src='question-mark.png' className='block'></Image>
                        </div>

                        {TokenInfo()}
                        <Button className="font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={doMint}>Mint you unique NFT</Button>

                    </div>
                </div>
                <div className='text-center border-4 bg-red-300'>
                    <div className=''>
                        My token ids:
                        {
                            myNftItems
                        }

                    </div>

                </div>
                <div className='text-center border-4 bg-red-100  p-10'>
                    <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" disabled={isBlocked} onClick={() => doPause(true)}> Pause off</Button>
                    <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" disabled={!isBlocked} onClick={() => doPause(false)}> Pause on</Button>

                    <div>
                        <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={reveal}> Reveal NFT URI</Button>

                    </div>


                    <div className='grid grid-cols-2'>
                        <div>
                            <p>Add to whitelist</p>
                            <Input size="large" placeholder="Add to whitelist" />
                        </div>
                        <div>
                            <p>Whitelisted addresses:</p>
                        </div>

                    </div>




                </div>
            </div>

        </div>
    )
}