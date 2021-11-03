const { User, Bet, Round } = require("../models");
const validate = require("../services/validator.js");
const ERROR_MESSAGES = require("../constants/messages.js");

const chatIO = (socket) => {
  socket.on('receive_message', async (args) => {
    const message = args;
    socket.broadcast.emit("send_message", bet);
  });
};

module.exports = chatIO;
