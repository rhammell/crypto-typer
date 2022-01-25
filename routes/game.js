const express = require('express');
const { endGame, getDifficulty, contractDetails } = require('./contract.js');

const router = express.Router();

router.get('/getDifficulty', async (req, res) => {
    try {
      var difficulty = await getDifficulty();
      res.json({'difficulty': difficulty});
    } catch(error) {
      res.status(500); 
      res.json({'msg': 'Error getting difficulty from contract.'});
    }
})

router.get('/details', (req, res) => {
   res.json(contractDetails);
})

router.get('/endgame/:id/:result', async (req, res) => {
  try {
    var tx = await endGame(req.params.id, req.params.result);
    console.log('tx');
    console.log(tx);
    res.json({'tx': tx}); 
  } catch(error) {
    console.log(error);
    res.status(500);
    res.json({'msg': 'Error interacting with smart contract.'});
  }
});

module.exports = router;