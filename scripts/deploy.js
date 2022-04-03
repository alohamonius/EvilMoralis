const hre = require("hardhat");
const fs = require('fs');

async function main() {
  
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  const TokenMinter = await hre.ethers.getContractFactory("TokenMinter");
  const tokenMinter = await TokenMinter.deploy();
  await tokenMinter.deployed();
  console.log("tokenMinter deployed to:", tokenMinter.address);

  let config = `
  export const MARKET_CONTRACT = "${nftMarket.address}"
  export const TOKEN_CONTRACT = "${nft.address}"
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
