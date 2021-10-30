const { User, Bet, Round } = require("../models");

const RADIUS = 2 * 200 * Math.PI;

const t = (a, d) => { return a / d; };

const createNewRound = async (currentDistance) => {
  const spins = Math.random() * 11 + (2 + Math.random() * 2);
  const speed = 2 + Math.random() * 4;
  const acceleration = -(speed * speed) / 2 * (spins * 360);
  const result = (currentDistance + spins * 360) % 360;

  const newRound = await Round.create({
    result: result
  });

  return newRound;
}

const roundsIO = (socket) => {
  socket.on('start_round', async (args) => {

  });
};

module.exports = roundsIO;
