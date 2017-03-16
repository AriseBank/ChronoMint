var ChronoMint = artifacts.require("./ChronoMint.sol");
var ContractsManager = artifacts.require("./ContractsManager.sol");
var Shareable = artifacts.require("./PendingManager.sol");
var UserManager = artifacts.require("./UserManager.sol");
module.exports = function(deployer, network) {
  return deployer.deploy(UserManager).then(function () {
     return deployer.deploy(Shareable).then(function () {
        return deployer.deploy(ChronoMint).then(function () {
                                        return deployer.deploy(ContractsManager).then(function () {
                                           return UserManager.deployed().then(function (instance) {
                                              instance.addOwner(ChronoMint.address);
                                              instance.addOwner(ContractsManager.address);
                                              return ChronoMint.deployed().then(function (instance) {
                                                 instance.init(UserManager.address, Shareable.address);
                                                 return ContractsManager.deployed().then(function (instance) {
                                                 instance.init(UserManager.address, Shareable.address);
                                                 return Shareable.deployed().then(function (instance) {
                                                 instance.init(UserManager.address);
                                              });
                                              });
                                              });
                                            });
                                         });
                                        });
 				      });
                                    });
}
