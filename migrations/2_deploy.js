const CryptoTyper = artifacts.require("CryptoTyper");
const fs = require('fs');

module.exports = function (deployer) {
  deployer.deploy(CryptoTyper)
    .then(() => {

      var json = JSON.stringify({
        "address": CryptoTyper.address,
        "abi": CryptoTyper.abi
      });

      fs.writeFile('deployed-contract.json', json, 'utf8', function(){});
    })

};
