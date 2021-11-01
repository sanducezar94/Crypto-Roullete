const { User, Bet, Round } = require("../models");

const repo = {
  createNewRound: async () => {
    try {
      const newRound = await Round.create({
        result: 0,
      });

      return newRound;
    } catch (err) {}
  },
  getLastRound: async () => {
    try {
      const round = await Round.findOne({
        order: [["createdAt", "DESC"]],
      });
      return round;
    } catch (err) {}
  },
};

module.exports = repo;
