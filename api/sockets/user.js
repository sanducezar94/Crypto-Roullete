const { User, Bet, Round } = require("../models");
const EXCHANGE_RATE = 1000;

const betsIO = (socket) => {
  socket.on("sign_up", async (...args) => {
    if (!args || args.length === 0) return;

    const wallet = args[0];
    if (wallet === "" || !wallet) return;

    const user = await User.findAll({
      where: {
        wallet: wallet,
      },
    });

    if (user.length > 0) {
      socket.emit("log_in", user[0]);
      return;
    }

    const newUser = await User.create({
      username: socket.id,
      wallet: wallet,
      balance: 0,
    }).catch((err) => console.error("Error creating new user."));
    socket.emit("log_in", newUser);
  });

  socket.on("disconnect", (socket) => {
    console.log("User disconnected", socket.id);
  });

  socket.on("buy_credit", async (args) => {
    if (!args || args.length === 0) return;

    const userId = args.userId;
    const user = await User.findAll({ where: { id: userId } });

    if (!user || user.length === 0) return;

    const newBalance = user[0].balance + args.amount * EXCHANGE_RATE;
    await User.update({ balance: newBalance }, { where: { id: userId } });
    socket.emit("update_credit", newBalance);
  });
};

module.exports = betsIO;
