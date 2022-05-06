import React from "react";
import {
    STAKE_CONTRACT
} from '../../../config.js'

import Staker from '../../../artifacts/contracts/Staker.sol/Staker.json'
import { Button, Input } from "antd";
import { useMoralis } from "react-moralis";

export const Vault = () => {
    const { user, Moralis } = useMoralis();
    React.useEffect(
        () => {
            async function readContractData() {
            }

            readContractData();
        }, [user]
    );

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
export default Vault;