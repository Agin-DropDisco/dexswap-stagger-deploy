# Swapper Contracts Staging Deployer

A helper repo that can be used to deploy Swapr-related contracts
(core/periphery/) to any given EVM-compatible network.

## Getting started

```
yarn
```

in the project's root, and create a `.env` file with the following structure:

```
PRIVATE_KEY="a private key"
```

This private key will be used to derive the account that will perform the
deployment, and that will ultimately be the owner of the platform's contracts.

## How to use

To actually trigger a deployiment, simply run:

```
yarn deploy
```
- See All the Task Parameters to deploying to the Chain

- Example Parameter : hardhat run --network rinkeby --token-registry-address <myAddress from dexswap registry>

- For the Token Registry Parameters Chek > [This Link](https://github.com/Agin-DropDisco/dexswap-registry) 


