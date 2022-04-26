import React from "react";
import {
    STAKE_CONTRACT
} from '../../../config.js'

import Staker from '../../../artifacts/contracts/Staker.sol/Staker.json'
import { Button, Input } from "antd";

class Vault extends React.Component {

    // React.useEffect(
    //     () => {
    //         async function readContractData() {
    //             if (!user) {
    //                 return;
    //             }
    //             try {
    //                 const address = user?.get('ethAddress');
    //                 setMyAddress(address);
    //                 debugger;
    //                 const contract = await createContract();
    //                 const maxSupply = await contract.MAX_SUPPLY();
    //                 const config = await contract.getSalesData();

    //                 const tokenIds = await contract.walletOfOwner(address);
    //                 setMyTokenIds(tokenIds);

    //                 setMintRate(+Moralis.Units.FromWei(config[0]));
    //                 setSaleStartedAt(config[1]);
    //                 setPaused(config[2]);

    //                 setMaxSupply(maxSupply.toString());

    //                 setMyCount(Number(await contract.myMintedNumber()));
    //                 setMintedPieced(Number(await contract.getMintedCount()));

    //                 if (tokenIds.length > 0) {
    //                     var myItems = await generateItems(contract, tokenIds);
    //                     setMyNftItems(myItems);
    //                 }

    //                 setContractLoaded(true);
    //             } catch (error) {
    //                 setContractLoaded(false);
    //                 notification.error({
    //                     message: `${error}`,
    //                 });
    //             }
    //         }

    //         readContractData();
    //     }, [user]
    // );

    render() {
        return (
            <div>
                <Input size="large" placeholder="Add tokenId seprated by comma" />
                <Button>Stake</Button>
                <Button>Unstake</Button>
                <h2>{STAKE_CONTRACT}</h2>
                <p>Total nfts locked:</p>
                <p>My staked count:</p>
                <p>My staked nfts:</p>
            </div>
        );
    }
}
export default Vault;