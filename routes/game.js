const express = require('express');
const { endGame, getDifficulty, contractDetails } = require('./contract.js');

const router = express.Router();

router.get('/getDifficulty', (req, res) => {
  getDifficulty()
    .then(difficulty => {
      res.json({'difficulty': difficulty})
    })
    .catch(error => {
      console.log(error);
      res.status(500); 
      res.json({'msg': 'Error interacting with smart contract.'});
    })
})

router.get('/details', (req, res) => {
  res.json(contractDetails);
})

router.get('/endgame/:id/:result', async (req, res) => {
  console.log(req.params.id)
  console.log(req.params.result)
  endGame(req.params.id, req.params.result)
    .then(transaction => {
      res.json({'transaction': transaction})
    })
    .catch(error => {
      res.status(500); 
      res.json({'msg': 'Error interacting with smart contract.'});
    })
});

module.exports = router;