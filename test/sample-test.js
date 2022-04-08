const assert = require("assert");

describe('TokenMinter', () => {
  it("NumberMinted", async () => {
    const Minter = await ethers.getContractFactory("TokenMinter")
    const minter = await Minter.deploy()
    await minter.deployed()

    await minter.mint();
    await minter.mint();

    const numberMinted = (await minter.myMintedNumber()).toString();
    console.log(numberMinted);

    assert(numberMinted == 2)
  });

  it("TokenMinterByAddress", async () => {
    const Minter = await ethers.getContractFactory("TokenMinter")
    const minter = await Minter.deploy()
    await minter.deployed()

    const signers = await ethers.getSigners()
    await minter.mint();
    await minter.mint();

    const numberMinted = (await minter.numberMintedByAddress(signers[0].address)).toString();
    console.log(numberMinted);

    assert(numberMinted == 2, "Only 2 should be")
  });

  it("TwoUsersTryToMintAndCheckBalance", async () => {
    const Minter = await ethers.getContractFactory("TokenMinter")
    const minter = await Minter.deploy()
    await minter.deployed()

    const [owner, addr1, addr2] = await ethers.getSigners();
    console.log("addresses");
    console.log(addr1.address, addr2.address);
    await minter.connect(addr1).mint();
    await minter.connect(addr2).mint();
    await minter.connect(addr2).mint();

    const numberMinted1 = (await minter.numberMintedByAddress(addr1.address)).toString();
    const numberMinted2 = (await minter.numberMintedByAddress(addr2.address)).toString();
    assert(numberMinted1 == 1, `${numberMinted1}`);
    assert(numberMinted2 == 2);
  });

});

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
});
