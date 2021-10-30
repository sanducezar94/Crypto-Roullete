const { User, Bet, Round } = require("../models");

const betsIO = (socket) => {
  socket.on("make_bet", async (...args) => {
    if (!args || args.length === 0) return;
    const userId = args[0].userId;
    const user = await User.findAll({ where: { id: userId } });

    if (!user || user.length === 0) return;

    const newBalance = user[0].balance - args[0].amount;
    await User.update({ balance: newBalance }, { where: { id: userId } });
    await Bet.create({
      amount: args[0].amount,
      userId: args[0].userId,
      roundId: 1,
      color: args[0].color,
    });

    socket.emit("update_credit", newBalance);
    socket.broadcast.emit("make_bet", args[0]);
    console.log("New bet made!");
  });
};

module.exports = betsIO;
