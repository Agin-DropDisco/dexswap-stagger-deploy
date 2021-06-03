require("dotenv").config();
require("@nomiclabs/hardhat-truffle5");
require("./tasks/deploy");
require("./tasks/check-surel");

const INFURA_IDS = process.env.INFURA_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const PK_1 = process.env.PRIVATE_KEY1;
const PK_2 = process.env.PRIVATE_KEY2;
const PK_3 = process.env.PRIVATE_KEY3;
const PK_4 = process.env.PRIVATE_KEY4;
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
            url:`https://rinkeby.infura.io/v3/${INFURA_IDS}`,
            accounts: [process.env.PRIVATE_KEY],
            network_id: 4,
            gasPrice: 1000000000,
            timeout: 100000,
        },
        moonbase: {
            url:"https://rpc.testnet.moonbeam.network",
            accounts: [PK_1, PK_2, PK_3, PK_4],
            network_id: 1287,
            gasPrice: 10000000,
            timeout: 100000
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

    mocha: {
        timeout: 20000,
     },
};
