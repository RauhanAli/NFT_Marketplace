//require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-waffle');
const dotenv = require("dotenv");
dotenv.config({path: __dirname + '/.env'});
const { CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY, INFURA_API_KEY} = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1337
    },
    localhost:{
      url: "http://127.0.0.1:8545"  
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY}`],
      gas: 2100000,
			gasPrice: 8000000000,
			saveDeployments: true,
      chainId: 4
    },
    bsctestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [`0x${CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY}`],
      chainId: 97
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [`0x${CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY}`],
      gas: 2100000,
			gasPrice: 8000000000,
			saveDeployments: true,
      chainId: 56
    },
  },
  gas: 2100000,
			gasPrice: 8000000000,
			saveDeployments: true,
  solidity: {
    version: "0.8.4",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
