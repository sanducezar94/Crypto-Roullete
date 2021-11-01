const { User, Bet, Round } = require("../models");
const _roundRepo = require("../repository/rounds.js");
const ERROR_MESSAGES = require("../constants/messages.js");
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
      console.log(err);
    }
  });

  socket.on("refund_bet", async (...args) => {
    try {
      validate(args, ERROR_MESSAGES.INVALID_REQUEST);

      const user = await User.findAll({ where: { id: args[0].userId } });
      validate(user, ERROR_MESSAGES.NO_USER);

      const newBalance = user[0].balance + args[0].amount;
      const result = await Bet.destroy({ where: { id: args[0].id } });
      validate(result === 0, ERROR_MESSAGES.INVALID_REQUEST);

      const updatedUser = await User.update(
        { balance: newBalance },
        { where: { id: args[0].userId } }
      );
      validate(updatedUser.length === 0, ERROR_MESSAGES.INVALID_REQUEST);

      socket.emit("update_credit", updatedUser[0].newBalance);
    } catch (err) {
      //Logger.log('');
    }
  });
};

module.exports = betsIO;
