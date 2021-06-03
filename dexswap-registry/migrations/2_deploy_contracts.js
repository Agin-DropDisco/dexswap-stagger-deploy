var DEXTokenRegistry = artifacts.require("DEXTokenRegistry");

module.exports = function(deployer){
  deployer.deploy(DEXTokenRegistry);
};