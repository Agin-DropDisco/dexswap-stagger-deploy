const eth = require('ethereumjs-util');
const Web3 = require('web3');
const web3 = new Web3();

const DEXswapPair = require('../artifacts/DEXswapPair.json');

// Hash of the bytecode is fixed. Calculated with eth.keccak256():
var bytecodeHash = eth.keccak256(DEXswapPair.bytecode).toString('hex');

console.log(`INIT CODE HASH:`, bytecodeHash);