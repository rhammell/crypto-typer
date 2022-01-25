require('dotenv').config()

const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { MNEMONIC, NODE_URL} = process.env;

const provider = new HDWalletProvider(MNEMONIC, NODE_URL);
const web3 = new Web3(provider);

var contractDetails = require('../deployed-contract.json');
const { json } = require('express/lib/response');

const contract = new web3.eth.Contract(contractDetails.abi, contractDetails.address);

async function endGame(gameId, outcome) {
	console.log('endGame');
	console.log(NODE_URL);
  const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
	const nonce = await web3.eth.getTransactionCount(account);
	console.log(nonce);
  const tx = await contract.methods.endGame(gameId, false).send({
		from: account,
		nonce: web3.utils.toHex(nonce)
	})
	return tx;
}

async function getDifficulty() {
	console.log('getDifficulty');
  const difficulty = await contract.methods.difficulty().call();
  return parseInt(difficulty);
}

module.exports = {
	'getDifficulty': getDifficulty,
	'endGame': endGame,
	'contractDetails': contractDetails
}
