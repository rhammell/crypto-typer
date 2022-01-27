require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const { MNEMONIC, SNOWTRACE_API_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://speedy-nodes-nyc.moralis.io/fc01bff553547d0b0922100b/polygon/mumbai"),
      network_id: 80001,
    },
    fuji: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://api.avax-test.network/ext/bc/C/rpc`),
      network_id: 43113,
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.9",
    }
  },

  // Required for etherscan verification using truffle-plugin-verify package
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
  //  etherscan: ETHERSCAN_API_KEY,
    snowtrace: SNOWTRACE_API_KEY
  }
};