const Migrations = artifacts.require("Migrations");
const DEXTokenRegistry = artifacts.require("DEXTokenRegistry");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(DEXTokenRegistry);
};
