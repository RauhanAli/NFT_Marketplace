const { expect } = require("chai");
const { ethers } = require("hardhat");

const DEFAULT_URI = "https://www.mytokenlocation.com";
describe("NFT", function() {

  let NFT, nft,nftContractAddress, ownerSigner, secondNFTSigner;

  before(async function() {
    /* deploy the NFT contract */
    NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(0x6c13D85eb24D3697F5965bD723041F24125Dd14e);
    await nft.deployed()
    nftContractAddress = nft.address;
    /* Get users */
    //[ownerSigner, secondNFTSigner, ...otherSigners] = await ethers.getSigners();
    
  })

  describe("createToken", function() {
    it("Emit NFTMinted event", async function() {
        await expect(nft.connect(ownerSigner).createToken(DEFAULT_URI)).to.emit(nft, 'NFTMinted').withArgs(1, DEFAULT_URI);

    })
    it("Should update the balances", async function() {

        await expect(() => nft.connect(ownerSigner).createToken(DEFAULT_URI))
          .to.changeTokenBalance(nft, ownerSigner, 1);

        await expect(() => nft.connect(secondNFTSigner).createToken(DEFAULT_URI))
          .to.changeTokenBalance(nft, secondNFTSigner, 1);

    })
  })
})