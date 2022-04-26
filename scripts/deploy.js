const hre = require("hardhat");
const fs = require('fs');

async function main() {
  
  const TokenMinter = await hre.ethers.getContractFactory("TokenMinter");
  const tokenMinter = await TokenMinter.deploy();
  await tokenMinter.deployed();
  console.log("TokenMinter deployed to:", tokenMinter.address);

  const RewardToken = await hre.ethers.getContractFactory("ERC20Rewards");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  console.log("RewardToken deployed to:", rewardToken.address);

  const StakeContract = await hre.ethers.getContractFactory("ERC20Rewards");
  const staker = await StakeContract.deploy();
  await staker.deployed();
  console.log("Staker deployed to:", staker.address);

  let config = `
  export const STAKE_CONTRACT = "${staker.address}"
  export const REWARDS_CONTRACT = "${rewardToken.address}"
  export const MINT_CONTRACT = "${tokenMinter.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

  console.log(" Deployment succeeded!")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
