const express = require("express");
const router = express.Router();
const { User, Bet, Round } = require("../models");

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

router.get("/", async function (req, res) {
  res.send("bets");
});

router.post("/createNewRound", async function (req, res, next) {
  if(!req.body || req.body.currentDistance) {
    res.status(500).send('Invalid request.');
  }
  const { currentDistance } = req.params;
  const result = await createNewRound(currentDistance);
  return result;
});

module.exports = router;
