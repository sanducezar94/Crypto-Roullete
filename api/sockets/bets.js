const { User, Bet, Round } = require("../models");
const ERROR_MESSAGES = require("../constants/messages.js");
const _roundRepo = require("../repository/rounds.js");
const validate = require("../services/validator.js");

const betsIO = (socket) => {
  socket.on("make_bet", async (newBet) => {
    try {
      validate(newBet, ERROR_MESSAGES.INVALID_REQUEST);

      const dbUser = await User.findAll({ where: { id: newBet.userId } });
      validate(dbUser, ERROR_MESSAGES.NO_USER);
      validate(dbUser[0].balance < newBet.amount, ERROR_MESSAGES.NO_BALANCE);

      const round = await _roundRepo.getLastRound();
      validate(round, ERROR_MESSAGES.NO_BALANCE);

      const newBalance = dbUser[0].balance - newBet.amount;
      await User.update(
        { balance: newBalance },
        { where: { id: newBet.userId } }
      );
      const bet = await Bet.create({
        amount: newBet.amount,
        userId: newBet.userId,
        roundId: round.id,
        color: newBet.color,
      });

      socket.emit("update_credit", newBalance);
      socket.broadcast.emit("make_bet", bet);
      socket.emit("make_bet", bet);
    } catch (err) {
      //console.log(err);
    }
  });

  socket.on("refund_bet", async (bet) => {
    try {
      validate(bet, ERROR_MESSAGES.INVALID_REQUEST);

      const dbUser = await User.findAll({ where: { id: bet.userId } });
      validate(dbUser, ERROR_MESSAGES.NO_USER);

      const dbBet = await Bet.findOne({ where: { id: bet.id }});
      validate(dbBet, ERROR_MESSAGES.INVALID_REQUEST);

      const newBalance = dbUser[0].balance + bet.amount;
      const result = await Bet.destroy({ where: { id: bet.id } });
      validate(result === 0, ERROR_MESSAGES.INVALID_REQUEST);

      const updatedUser = await User.update(
        { balance: newBalance },
        { where: { id: bet.userId } }
      );
      validate(updatedUser.length === 0, ERROR_MESSAGES.INVALID_REQUEST);

      console.log('Bet Removed', bet);
      socket.emit("update_credit", updatedUser[0].newBalance);
      socket.broadcast.emit("remove_bet", bet);
      socket.emit("remove_bet", bet);
    } catch (err) {
      //console.log(err);
    }
  });
};

module.exports = betsIO;
