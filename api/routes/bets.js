const express = require("express");
const router = express.Router();
const { Bet, Round } = require("../models");
const _betRepo = require('../repository/bets.js');

router.get("/", async function (req, res) {
  const bets = await _betRepo.getCurrentBets();
  res.send(bets);
});

module.exports = router;
