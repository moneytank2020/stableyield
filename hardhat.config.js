require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers'); 
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ganache");
const keys = require('./keys.json')
// require("@nomiclabs/hardhat-etherscan");

// const { devAccount, strategistAccount, ftmScanApiKey } = require("./secrets.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// eslint-disable-next-line no-undef
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat:{
      forking:{
        url:"https://speedy-nodes-nyc.moralis.io/eba52a71b5f0e25d93a7b668/bsc/mainnet/archive",
        enabled:true
      }
    },
    localhost: {
      chainId:31337,
      from:"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      url: "http://127.0.0.1:8545"
    },
    mainnet: {
      chainId:56,
      url: "https://bsc-dataseed.binance.org/",
      accounts:[keys.key]
    },
    testnet: {
      chainId: 4002,
      url: 'https://rpc.testnet.fantom.network'
    }
    // ganache: {
    //   url: "http://127.0.0.1:7454",
    //   chainId:1337
    // },
    // testnet:{
    //   url: "https://rpc.testnet.fantom.network/",
    //   chainId:0xfa2,
    //   from:"0xEDF83624422861842983A93049CCBE4d9387168A"

    // }
    // hardhat: {
    //   forking: {
    //     url: "https://rpc.ftm.tools/",
    //     accounts: [strategistAccount],
    //   },
    //   mining: {
    //     auto: true,
    //     interval: 1000,
    //   },
    // },
    // opera: {
    //   url: "https://rpc.ftm.tools/",
    //   accounts: [strategistAccount],
    // },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9"
      },
      {
        version: "0.5.0",
      },
      {
        version: "0.4.22"
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 2000000,
  },

  external: {
    deployments: {
      hardhat: ['deployments/mainnet'],
    },
  },
  // etherscan: {
  //   apiKey: ftmScanApiKey,
  // }
};
