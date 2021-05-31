const { task } = require('hardhat/config');

task('deploy', 'Deploys the whole contracts suite and optionally verifies source code on Etherscan')
    .addOptionalParam(
        'ownerAddress',
        'An address that will become the owner of the contracts after deployment. If not specified, the account generated from the passed in private key (i.e. the deployer) will be the owner'
    )

    .addParam('protocolFeeNativeAssetReceiver', "The address that will receive the protocol fee, after it's been converted to the chain's native asset (ETH, xDAI, etc)")

    .addParam('protocolFeeFallbackReceiver', "The address that will receive the protocol fee when it cannot be converted to the chain's native asset")

    .addParam('tokenRegistryAddress', 'The address of the token registry used on Swapr')

    .addParam('tokenRegistryListId', 'The unique identifier of token registry list id used to validate tokens on Swapr')

    .addParam('nativeAssetWrapperAddress', 'The address of the contract that wraps the native asset in the target chain')

    .addFlag('deployFarming', 'Whether or not to deploy farming-related contracts')

    .setAction(async (taskArguments, hre) => {

        const {
            protocolFeeNativeAssetReceiver,
            protocolFeeFallbackReceiver,
            nativeAssetWrapperAddress,
            tokenRegistryAddress,
            tokenRegistryListId,
            ownerAddress,
            deployFarming
        } = taskArguments;

        const [accountAddress] = await hre.web3.eth.getAccounts();

        console.log(`----------------------------------------------------------------------------------`);
        console.log('use:: Protocol FeeReceiver:', protocolFeeNativeAssetReceiver);
        console.log(`----------------------------------------------------------------------------------`);

        console.log('use:: Protocol fallback FeeReceiver:', protocolFeeFallbackReceiver);
        console.log(`----------------------------------------------------------------------------------`);

        console.log('use:: Asset Wrapper:', nativeAssetWrapperAddress);
        console.log(`----------------------------------------------------------------------------------`);

        console.log('use:: Token Registry:', tokenRegistryAddress);
        console.log(`----------------------------------------------------------------------------------`);

        console.log('use:: Token Registry list Id:', tokenRegistryListId);
        console.log(`----------------------------------------------------------------------------------`);

        console.log('use:: Account Dev:', accountAddress);
        console.log(`----------------------------------------------------------------------------------`);

        console.log(`----------------------------------------------------------------------------------`);
        console.log(`----------------------------------------------------------------------------------`);
        console.log('Start Deploying core deployer...');

        const CoreDeployer = hre.artifacts.require('DEXswapDeployer');

        const coreDeployer = await CoreDeployer.new(protocolFeeNativeAssetReceiver, accountAddress, nativeAssetWrapperAddress, [], [], []);

        // core
        console.log('Funding DexSwap Deployer...');
        console.log(`--------------------------------------------------------------------------`);

        await hre.web3.eth.sendTransaction({
            from: accountAddress,
            to: coreDeployer.address,
            value: 1, // 1 wei
        });

        console.log('Calling DexSwap Deployer...');
        console.log(`--------------------------------------------------------------------------`);

        const { receipt } = await coreDeployer.deploy();

        const { logs } = receipt;

        console.log('Deploying DEXswap Wrapped ETHER');
        console.log(`--------------------------------------------------------------------------`);

        const factoryAddress = logs.find((event) => event.event === 'PairFactoryDeployed').args.factory;

        const feeReceiverAddress = logs.find((event) => event.event === 'FeeReceiverDeployed').args.feeReceiver;

        const feeSetterAddress = logs.find((event) => event.event === 'FeeSetterDeployed').args.feeSetter;

        // periphery
        const Router = hre.artifacts.require('DEXswapRouter');

        console.log('Deploying DEXswap Router');


        const router = await Router.new(factoryAddress, nativeAssetWrapperAddress);

        const WETH9 = hre.artifacts.require('WETH9');
        console.log('Deploying DEXswap WETH');
        const weth9Instance = await WETH9.new();

        const DEXswapPair = hre.artifacts.require('DEXswapPair');
        console.log('Deploying DEXswap PAIR');
        const DEXswapPairInstance = await DEXswapPair.new();

        // staking rewards distribution (liquidity mining)
        let defaultRewardTokensValidator = null;
        let defaultStakableTokenValidator = null;
        let stakingRewardsFactory = null;


        if (deployFarming) {

            const DefaultRewardTokensValidator = hre.artifacts.require('DefaultRewardTokensValidator');

            console.log('Deploying reward tokens validator');

            defaultRewardTokensValidator = await DefaultRewardTokensValidator.new(tokenRegistryAddress, tokenRegistryListId);

            console.log('Deploying stakable token validator');

            const DefaultStakableTokenValidator = hre.artifacts.require('DefaultStakableTokenValidator');

            console.log('Deploying staking reward distributions factory');

            defaultStakableTokenValidator = await DefaultStakableTokenValidator.new(tokenRegistryAddress, tokenRegistryListId, factoryAddress);

            const StakingRewardsFactory = hre.artifacts.require('DexswapERC20StakingRewardsDistributionFactory');

            stakingRewardsFactory = await StakingRewardsFactory.new(defaultRewardTokensValidator.address, defaultRewardTokensValidator.address);



        } else {

            console.log('skipping famirng contracts deployment');

        }

        if (ownerAddress) {
            console.log('Transferring ownership of the contracts');

            // transferring ownership
            const FeeReceiver = hre.artifacts.require('DEXswapFeeReceiver');

            const feeReceiverInstance = await FeeReceiver.at(feeReceiverAddress);

            console.log('Updating protocol fee receivers');

            await feeReceiverInstance.changeReceivers(protocolFeeNativeAssetReceiver, protocolFeeFallbackReceiver);

            console.log('Transferring fee receiver ownership');

            await feeReceiverInstance.transferOwnership(ownerAddress);

            const FeeSetter = hre.artifacts.require('DEXswapFeeSetter');

            const feeSetterInstance = await FeeSetter.at(feeSetterAddress);

            console.log('Transferring fee setter ownership');

            await feeSetterInstance.transferOwnership(ownerAddress);

            if (deployFarming) {
                console.log('Transferring default reward tokens validator ownership');

                await defaultRewardTokensValidator.transferOwnership(ownerAddress);

                console.log('Transferring default stakable token validator ownership');

                await defaultStakableTokenValidator.transferOwnership(ownerAddress);

                console.log('Transferring ERC20 staking rewards distribution factory validator ownership');

                await stakingRewardsFactory.transferOwnership(ownerAddress);
            }

            console.log('Full ownership correctly transferred to the specified owner address');
        }

            console.log(`============================= Core =======================================`);

            console.log(`--------------------------------------------------------------------------`);
            console.log(`DexSwap Deployer :    ${coreDeployer.address}`);
            console.log(`--------------------------------------------------------------------------`);

            console.log(`DexSwap Factory :     ${factoryAddress}`);
            console.log(`--------------------------------------------------------------------------`);

            console.log(`DexSwap Wrapped :     ${weth9Instance.address}`);
            console.log(`--------------------------------------------------------------------------`);
            
            console.log(`DexSwap Pair :        ${DEXswapPairInstance.address}`);
            console.log(`--------------------------------------------------------------------------`);
            
            console.log(`--------------------------------------------------------------------------`);
            console.log(`DexSwap FeeSetter :   ${feeSetterAddress}`);
            console.log(`--------------------------------------------------------------------------`);

            console.log(`--------------------------------------------------------------------------`);
            console.log(`DexSwap FeeReceiver : ${feeReceiverAddress}`);
            console.log(`--------------------------------------------------------------------------`);

            console.log(`=========================== Periphery ====================================`);

            console.log(`--------------------------------------------------------------------------`);
            console.log(`DexSwap Router:       ${router.address}`);
            console.log(`--------------------------------------------------------------------------`);

        if (deployFarming) {
            console.log(`--------------- Staking rewards distribution factory ---------------------`);

            console.log(`--------------------------------------------------------------------------`);
            console.log(`Reward tokens validator         ${defaultRewardTokensValidator.address}`);
            console.log(`--------------------------------------------------------------------------`);

            console.log(`--------------------------------------------------------------------------`);
            console.log(`Stakable token validator         ${defaultStakableTokenValidator.address}`);
            console.log(`--------------------------------------------------------------------------`);

            console.log(`--------------------------------------------------------------------------`);
            console.log(`DexSwap Staking Rewards Factory  ${stakingRewardsFactory.address}`);
            console.log(`--------------------------------------------------------------------------`);
        }
    });