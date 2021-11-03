const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/./config/config.json")[env];
const Roullete = require('./engine/roullete');
const { Server } = require("socket.io");
const { sequelize, User, Bet, Round } = require("./models");

async function initialize() {
  await sequelize.sync();
}

initialize();

const corsOptions = {
  origin: config['hostURI'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", config['hostURI']); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const bets = require("./routes/bets");
const rounds = require("./routes/rounds");

app.use("/bets", bets);
app.use("/rounds", rounds);

const server = http.createServer(app).listen("8080", "localhost");
const io = new Server(server, {
  cors: {
    origin: config['hostURI'],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let sockets = [];
  fs.readdirSync(__dirname + "/sockets")
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const socketFile = require(path.join(__dirname + "/sockets/", file))(
        socket
      );
      sockets[file.slice(-3)] = socketFile;
    });
});

function startGameLoop(server) {
  var lastUpdate = Date.now();
  const roullete = new Roullete();
  const interval = setInterval(() => {
      let now = Date.now();
      var dt = (now - lastUpdate);
      lastUpdate = now;
      roullete.update(dt, server);
  }, 0);
}

startGameLoop(io);

server.listen(3001, () => {
  console.log("Server started on port 3001");
});
