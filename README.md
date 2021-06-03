# DexSwap - Contracts Staging Deployer

A helper repo that can be used to deploy DexSwap - Swapper || related contracts
(core/periphery/) to any given EVM-compatible network.

All Contract Files :
- [DexSwap Core](https://github.com/Agin-DropDisco/dexswap-core)
- [DexSwap Periphery](https://github.com/Agin-DropDisco/dexswap-periphery)
- [DexSwap Registry](https://github.com/Agin-DropDisco/dexswap-registry)
- [DexSwap Staking](https://github.com/Agin-DropDisco/dexswap-staking)
- [DexSwap Staking Distribution](https://github.com/Agin-DropDisco/dexswap-staking-ditribution)
- [DexSwap Staging Deployer](https://github.com/Agin-DropDisco/dexswap-swapper-staging)

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

- Example Parameter : 
```
yarn deploy --network rinkeby --token-registry-address <myAddress from dexswap registry>
```

- For the Token Registry Parameters Chek > [This Link](https://github.com/Agin-DropDisco/dexswap-registry) 

 - Deployed Rinkeby
::: Core
::: Factory deployed at address 0x459A066775B41dAEad2522Cb29B41A7C9adc1AB1
---------------------------------------------------------------------------
::: CoreDeployer 0x47F6B94f3840129233d753FA7Bf537C00f2B7109
---------------------------------------------------------------------------
::: Fee setter deployed at address 0xf6a16c839D1B7E21B32FfD9C9d91698aA7dDC317
---------------------------------------------------------------------------
::: Fee receiver deployed at address 0x1a99597e141Dc3163dB90d0BCF3934E59eD84e13
---------------------------------------------------------------------------

::: Periphery
Router deployed at address 0x27da36D819C97cc9377607408b2b07ef89CFa8b4
---------------------------------------------------------------------------

::: Owners
Fee setter owned by address 0x932fD1ab0a7f02D55055872221D9812d8B431421
---------------------------------------------------------------------------
::: Fee receiver owned by address 0x932fD1ab0a7f02D55055872221D9812d8B431421
---------------------------------------------------------------------------

::: Checks
Fee setter is set to 0xf6a16c839D1B7E21B32FfD9C9d91698aA7dDC317 in factory
---------------------------------------------------------------------------
Fee receiver is set to 0x1a99597e141Dc3163dB90d0BCF3934E59eD84e13 in factory
---------------------------------------------------------------------------
Done in 137.07s.
