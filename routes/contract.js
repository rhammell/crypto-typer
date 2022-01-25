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
  const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
  const tx = await contract.methods.endGame(gameId, false).send({from: account})
	return tx;
}

async function getDifficulty() {
  const difficulty = await contract.methods.difficulty().call();
	return difficulty;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	'getDifficulty': getDifficulty,
	'endGame': endGame,
	'contractDetails': contractDetails
}
