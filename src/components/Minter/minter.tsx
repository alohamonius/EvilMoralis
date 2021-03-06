import React, { useState } from 'react'
import { BigNumber, Contract, ethers } from 'ethers'
import { Button, Image, Input, InputNumber, Radio, Spin } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
    MINT_CONTRACT
} from '../../../config.js'

import TokenMinter from '../../../artifacts/contracts/TokenMinter.sol/TokenMinter.json'
import { useMoralis } from 'react-moralis';
import { notification } from 'antd';
import Vault from './vault';

import privew from '../../assets/images/preview.gif'
import { addToMetamaskToken, createContract, doTransaction } from '../../Utils/utils';

export const Minter = () => {
    const { user, Moralis } = useMoralis();
    const [contractLoaded, setContractLoaded] = useState<boolean>(false);

    const [mintRate, setMintRate] = useState<number>(0);
    const [mintedPieces, setMintedPieced] = useState<number>(0);
    const [maxSupply, setMaxSupply] = useState<number>(0);
    const [paused, setPaused] = useState<boolean>(false);
    const [saleStartedAt, setSaleStartedAt] = useState<number>();
    const [myCount, setMyCount] = useState<number>(0);
    const [myAddress, setMyAddress] = useState<string>()
    const [myTokenIds, setMyTokenIds] = useState<any>();
    const [myNftItems, setMyNftItems] = useState<any>();

    const [mintCount, setMintCount] = useState<number>(5);

    React.useEffect(
        () => {
            async function readContractData() {
                if (!user) {
                    return;
                }
                try {

                    const address = user?.get('ethAddress');
                    setMyAddress(address);

                    const contract = await initContract();
                    const maxSupply = await contract.MAX_SUPPLY();
                    const config = await contract.getSalesData();

                    const tokenIds = await contract.walletOfOwner(address);
                    setMyTokenIds(tokenIds);

                    setMintRate(+Moralis.Units.FromWei(config[0]));
                    setSaleStartedAt(config[1]);
                    setPaused(config[2]);

                    setMaxSupply(maxSupply.toString());

                    setMyCount(Number(await contract.myMintedNumber()));
                    setMintedPieced(Number(await contract.getMintedCount()));

                    if (tokenIds.length > 0) {
                        var myItems = await generateItems(contract, tokenIds);
                        setMyNftItems(myItems);
                    }
                    let filter = contract.filters.Transfer(null);
                    contract.on(filter, (from, to, amount, event) => {
                        console.log(`to: ${to}`)
                    });
                    // let block = await lastBlock();
                    // var w = await contract.queryFilter(filter, block - 1000, block);
                    // debugger;
                    setContractLoaded(true);
                } catch (error) {
                    setContractLoaded(false);
                    logError(error);
                }
            }

            readContractData();
        }, [user]
    );

    async function initContract() {
        return await createContract(MINT_CONTRACT, TokenMinter.abi);
    }

    async function doPause(state: boolean) {
        const contract = await initContract();
        await doTransaction(
            async () => await contract.setPause(state),
            () => {
                notification.success({
                    message: `Pause tx completed.`,
                });
            }, (e: any) => {
                logError(e)
            });
    };

    async function doMint() {
        const contract = await initContract();

        contract.filters.Transfer(myAddress);

        contract.on("Minted", async (source, tokenIds, value) => {
            setMyTokenIds([...tokenIds, value]);
            setMintedPieced((await contract.totalSupply()).toString());
            notification.success({
                message: `Minted ${tokenIds.length} tokens`,
            });
        });

        await doTransaction(
            async () => await contract.mint(mintCount, { value: ethers.utils.parseEther('' + mintCount * mintRate) }),
            () => {
                notification.success({
                    message: `Transaction executed`,
                });
            }, (e: any) => {
                logError(e)
            });
    };

    function logError(e: any) {
        notification.error({
            message: `Transaction failed ${e.data?.message ?? e}`,
        });
        console.log(e);
    }

    //setBaseURI("ipfs://QmXgMDuRGVEwPTWq7NDC2fuyVCQkY9E2gCB3qUKuJ8Hdhw/");
    async function reveal() {
        const contract = await initContract();
        await contract.reveal();
        await contract.tokenURI('');
    }

    async function withdraw() {
        const contract = await initContract();
        await contract.withdraw();
    }

    const generateItems = async (contract: ethers.Contract, tokenIds: any[]) => {
        const tokensInfo: any = [];
        await Promise.all(tokenIds.map(async (element: BigNumber, i: number) => {
            const tokenId = element.toString();
            var uri = await contract.tokenURI(element);
            var tokeninfoParagraph = <p className='text-white' key={i}>ID: {tokenId} / URL : {uri}</p>
            tokensInfo.push(tokeninfoParagraph);
        }));

        return tokensInfo;
    };

    const headText = (text: string) => <h3 className='text-white p-1'>{text}</h3>;
    const TokenInfo = () => {
        if (contractLoaded)
            return (
                <>
                    <p className='text-white p-1'>Mint you random NFT. One from the {maxSupply} token could be you.</p>
                    <h3 className='text-white p-1'>Contract: {MINT_CONTRACT}  <PlusCircleOutlined className='text-l' onClick={() => addToMetamaskToken(MINT_CONTRACT, "ALT", 0)} /></h3>
                    <h3 className='text-white p-1'>Price per mint: {mintRate}</h3>
                    <h3 className='text-white p-1'>Started At: {saleStartedAt}</h3>
                    <h3 className='text-white p-1'>Minting live: {!paused ? "live" : "paused"}</h3>
                    <h3 className='text-white p-1'>Supply: {mintedPieces}/{maxSupply}</h3>
                    <h3 className='text-white p-1'>Minted by you account: {myCount}</h3>
                </>
            )
        else return <div className='mt-4'><Spin></Spin></div>
    };

    return (
        <>
            <div className="grid p-4 grid-cols-2 h-full pt-36">
                <div className='text-center border-4 p-10 h-full'>
                    <div className='mt-4'>
                        <div>
                            <Image preview={false} height={"50px"} width={"80px"} src={privew} className='block'></Image>
                        </div>
                        <div className='mt-4'   >
                            <Image preview={false} height={"50px"} width={"50px"} src='question-mark.png' className='block'></Image>
                        </div>

                        {TokenInfo()}
                        <InputNumber min={1} max={5} defaultValue={mintCount} onChange={setMintCount} />
                        <Button className="font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={doMint} disabled={!contractLoaded}>Mint you unique NFT</Button>

                    </div>
                </div>
                <div className='text-center border-4'>
                    <div className=''>
                        <h3 className='text-white p-10 mt-4 text-lg'>My token ids:</h3>
                        {
                            myNftItems
                        }

                    </div>

                </div>
                <div className='text-center border-4  p-10'>
                    <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" disabled={paused} onClick={() => doPause(true)}> Pause off</Button>
                    <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" disabled={!paused} onClick={() => doPause(false)}> Pause on</Button>

                    <div>
                        <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={reveal}> Reveal NFT URI</Button>
                    </div>

                    <div className='grid grid-cols-2'>
                        <div>
                            <p>Add to whitelist</p>
                            <Input size="large" placeholder="Add address to whitelist" />
                        </div>
                        <div>
                            <p>Whitelisted addresses:</p>
                        </div>
                        <div>
                            <Button className="m-4 font-bold p-4 mt-4 bg-pink-500 text-white rounded  shadow-lg" onClick={withdraw}> Withdraw</Button>
                        </div>

                    </div>
                </div>
                <div className='text-center border-4   p-10'>
                    <Vault></Vault>
                </div>
            </div>

        </>
    )
}