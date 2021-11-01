const { User, Bet, Round } = require("../models");

const roundsIO = (socket) => {
  socket.on('start_round', async (args) => {

  });
};

module.exports = roundsIO;
