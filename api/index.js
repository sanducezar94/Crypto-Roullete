const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { sequelize, User, Bet, Round } = require("./models");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

async function initialize() {
  await sequelize.sync();
}

initialize();

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
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
    origin: "http://localhost:8080",
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

server.listen(3001, () => {
  console.log("Server started on port 3001");
});
