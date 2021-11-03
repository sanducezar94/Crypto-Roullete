const { User, Bet, Round } = require("../models");
const validate = require("../services/validator.js");
const ERROR_MESSAGES = require("../constants/messages.js");
const EXCHANGE_RATE = 1000;

const betsIO = (socket) => {
  socket.on("sign_up", async (user) => {
    try {
      validate(user, ERROR_MESSAGES.INVALID_REQUEST);

      const wallet = user;
      validate(wallet, ERROR_MESSAGES.INVALID_REQUEST);

      const dbUser = await User.findAll({
        where: {
          wallet: wallet,
        },
      });

      if (dbUser.length > 0) {
        socket.emit("log_in", dbUser[0]);
        return;
      }

      const newUser = await User.create({
        username: socket.id,
        wallet: wallet,
        balance: 0,
      }).catch((err) => console.error("Error creating new user."));
      socket.emit("log_in", newUser);
    } catch (err) {
      //console.log(err);
    }
  });

  socket.on("disconnect", (socket) => {
    //console.log("User disconnected", socket.id);
  });

  socket.on("buy_credit", async (order) => {
    try {
      validate(order, ERROR_MESSAGES.INVALID_REQUEST);

      const user = await User.findAll({ where: { id: order.userId } });

      validate(user, ERROR_MESSAGES.INVALID_REQUEST);

      const newBalance = user[0].balance + order.amount * EXCHANGE_RATE;
      await User.update(
        { balance: newBalance },
        { where: { id: order.userId } }
      );
      socket.emit("update_credit", newBalance);
    } catch (err) {}
  });

  socket.on("add_credit", async (order) => {
    try {
      validate(order, ERROR_MESSAGES.INVALID_REQUEST);

      console.log(order);

      const user = await User.findAll({ where: { id: order.userId } });

      validate(user, ERROR_MESSAGES.INVALID_REQUEST);

      const newBalance = user[0].balance + order.amount;
      await User.update(
        { balance: newBalance },
        { where: { id: order.userId } }
      );
      socket.emit("update_credit", newBalance);
    } catch (err) {}
  });
};

module.exports = betsIO;
