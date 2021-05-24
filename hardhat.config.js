require("dotenv").config();

require("@nomiclabs/hardhat-truffle5");
require("./tasks/deploy");
require("hardhat-deploy");
require("hardhat-etherscan-abi");
require("hardhat-dependency-compiler");
require("@nomiclabs/hardhat-ethers");

const dotenv = require('dotenv');
dotenv.config();
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
            url:"https://rinkeby.infura.io/v3/8d858a3067c74441bea2bf95dd4305b4",
            accounts: [process.env.PRIVATE_KEY],
            network_id: '4',
            gasPrice: 1000000000,
            timeout: 100000,
        },
        moonalpha: {
            url:"https://rpc.testnet.moonbeam.network",
            accounts: [process.env.PRIVATE_KEY],
            network_id: '1287',
            gasPrice: 1000000000,
            timeout: 100000,
        },
        oasis: {
            url:"https://rpc.oasiseth.org:8545",
            accounts: [process.env.PRIVATE_KEY],
            network_id: 69,
            gasPrice: 1000000000,
            timeout: 100000
        },
        matic_tesnet: {
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
};
