Welcome to educational project😜😜😜
========

This project currently about NFT minting. And modern responsive design. 


In this project, I demonstrate how to work with solidity, react && hardhat.
Also I have examples of automatic testing for smart contracts.
AntDesign as UI kit, and Tailwind for the best experience in writing CSS.



INSTALLATION
============
1. Clone & Install dependencies

        git clone 
        npm install
        npm run start - run UI
        
2. Run local blockchain[hardhat] & [compile, deploy, test]

        npx hardhat node - run local blockchain API
        npx hardhat run scripts/deploy.js --network {avaxtest/polygon/localhost}
        npx hardhat compile - create artifacts (abi) for every smart contract. Artifacts folder better to remove before new build.
        npx hardhat test  - smart contract unit tests, folder (test)
3. Metamask. 

    Add any testnets with tokenmagic to you metamask.
    
        https://tokenmagic.app/#/ (add avax fuji to networks)
4. Top up you account in you tesnet
    
        https://faucet.polygon.technology/
        https://faucet.avax-test.network/
5. Create account on Moralis & create server
        
        https://moralis.io/
    
    
For UI:
- https://tailwindcss.com/docs/utility-first
- https://ant.design/
