const express = require('express');
const app = express();
const gameRouter = require('./routes/game');

app.use(express.static('public'));

app.use('/contract', gameRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...")
});