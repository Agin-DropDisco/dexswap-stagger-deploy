require("dotenv").config();
require("@nomiclabs/hardhat-truffle5");
// require("hardhat-dependency-compiler");
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("./tasks/deploy");

const infuraId = process.env.INFURA_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    
    networks: {
        xdai: {
            url: "https://rpc.xdaichain.com/",
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: 1000000000,
            timeout: 100000,
        },
        rinkeby: {
            url:`https://rinkeby.infura.io/v3/${infuraId}`,
            accounts: [process.env.PRIVATE_KEY],
            network_id: 4,
            gasPrice: 1000000000,
            timeout: 100000,
        },
        moonbeam: {
            url:"https://rpc.testnet.moonbeam.network",
            accounts: [process.env.PRIVATE_KEY],
            network_id: 1287,
            gasPrice: 0,
            chainId: 1287,
        },
        oasis: {
            url:"https://rpc.oasiseth.org:8545",
            accounts: [process.env.PRIVATE_KEY],
            network_id: 69,
            gasPrice: 1000000000,
            timeout: 100000
        },
        matic: {
            url:"https://rpc-mumbai.matic.today",
            accounts: [process.env.PRIVATE_KEY],
            network_id: 80001,
            gasPrice: 1000000000,
            timeout: 100000
        }
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },

    paths: {
        sources: "./contracts",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    solidity: {
        compilers: [
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
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
};
