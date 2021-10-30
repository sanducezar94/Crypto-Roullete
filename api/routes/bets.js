const express = require("express");
const router = express.Router();
const { Bet, Round } = require("../models");

const getCurrentBets = async () => {
  const round = await Round.findAll({
    order: [["createdAt", "DESC"]],
  });
  const bets = await Bet.findAll({
    where: {
      roundId: round[0].id,
    },
  });

  return bets;
};

router.get("/", async function (req, res) {
  const bets = await getCurrentBets();
  res.send(bets);
});

router.post("/", async function (req, res) {
  const bets = await getCurrentBets();
  res.send(bets);
});

module.exports = router;
