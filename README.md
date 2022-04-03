Added packages:
- Hardhat
- ipfs-http-client
- chai
- mocha
- axios

npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai

npx hardhat node - run local blockchain API

npm run start - run UI

npx hardhat run scripts/deploy.js --network {avaxtest/polygon/localhost}



For UI:
- https://tailwindcss.com/docs/utility-first
- https://mui.com/


npx hardhat compile - create artifacts (abi) for every smart contract. Artifacts folder better to remove before new build.

npx hardhat test  - smart contract unit tests, folder (test)




#Solidity console.log - way to debug contracts.

https://faucet.polygon.technology/
Polygon faucet, put you wallet.

1. Download metamask
2. Add to metamask localhost RPC NODE (hardhat node)
    a. Hardhat http://localhost:8545  1337 ETH
    b. Choose hardhat as active network

npx hardhat console --network localhost

For locally developing, we need proxy moralis-> hardhat.



Download https://github.com/fatedier/frp/releases
./frpc -c frpc.ini
or 
frpc.exe -c frpc.ini

>frpc.ini
[common]
  server_addr = v2a0cvictoga.usemoralis.com
  server_port = 7000
  token = 7rSCAZHqAO
[hardhat]
  type = http
  local_port = 8545
  custom_domains = v2a0cvictoga.usemoralis.com
