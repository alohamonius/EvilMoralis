require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim();
const infuraId = '774f8aa47d1c46e297d5e99c9a720076';

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    avaxtest:{
      chainId: 43113,
      url:`https://api.avax-test.network/ext/bc/C/rpc`,
      accounts:[privateKey]
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
    //   accounts: [privateKey]
    // },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
