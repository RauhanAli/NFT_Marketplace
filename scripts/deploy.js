const hre = require("hardhat");

const fs = require('fs');

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();

  console.log("nftMarketplace deployed to:", nftMarketplace.address);
 
  const NFT = await hre.ethers.getContractFactory("NFT");
  //const nft = await NFT.deploy(nftMarketplace.address)
  const nft = await NFT.deploy("0x6c13D85eb24D3697F5965bD723041F24125Dd14e", nftMarketplace.address)
  await nft.deployed();
  console.log("nft deployed to:", nft.address);
  // fs.writeFileSync('./config.js', `
  // export const marketplaceAddress = "${nftMarketplace.address}"
  // `)
  // const Resell = await hre.ethers.getContractFactory("NFTMarketResell");
  // const resell = await Resell.deploy(nft.address);
  // await resell.deploy();
  // console.log("resellNFT deployed to:", resell.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
