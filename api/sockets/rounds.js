const { User, Bet, Round } = require("../models");
const ERROR_MESSAGES = require("../constants/messages.js");
const _roundRepo = require("../repository/rounds.js");
const validate = require("../services/validator.js");

const roundsIO = (socket) => {
  socket.on('reward_players', async (args) => {
    const lastRound = await _roundRepo.getLastRound();
    const bets = await Bet.findAll({
      where: { roundId: lastRound.id }
    });

    //this will be handled on the smart contract once deployed
    for(let i = 0; i < bets.length; i++){
      if(bets[i].color === lastRound.result){
        const user = User.findOne({
          where: { id: bet[i].userId }
        });
        require(user, ERROR_MESSAGES.INVALID_REQUEST);
        const newBalance = user.balance + (bets[i].amount * lastRound.resultMultiplier);
        await User.update({ balance: newBalance }, {where: {id: user.id}});
      }
    }
  });
};

module.exports = roundsIO;
