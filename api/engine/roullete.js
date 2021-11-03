const _roundsRepo = require("../repository/rounds");
const ROULLETE_PHASE = require("../constants/game.js");

class Roullete {
  constructor() {
    this.moving = false;
    this.acceleration = 0;
    this.angleVelocity = 0;
    this.distance = 0;
    this.totalDistance = 0;
    this.result = 0;
    this.angle = 0;
    this.updateTimer = 0;
    this.updateInterval = 0.1 * 1000;
    this.round = null;

    this.totalBlocks = 36;
    this.blockArray = [20, 3, 2, 3, 2, 3, 2, 5, 2, 3, 2, 3, 2, 3, 2, 5, 2, 3, 2, 3, 2, 3, 2, 3,2, 5, 2, 3, 2, 3, 2, 3, 2, 2, 5, 2],
    this.roundPhase = ROULLETE_PHASE.FINISHED;
    this.roundTimer = 0;
    this.prepareNewRound();
  }

  update(dt, server) {
    this.updateTimer += dt;

    switch (this.roundPhase) {
      case ROULLETE_PHASE.PAUSED: {
        this.roundTimer += dt;
        if (this.roundTimer >= 5 * 1000) {
          server.emit("clear_bets");
          this.prepareNewRound(server);
          this.roundPhase = ROULLETE_PHASE.FINISHED;
          this.roundTimer = 0;
        }
      }
      case ROULLETE_PHASE.FINISHED: {
        this.roundTimer += dt;
        if (this.roundTimer >= 20 * 1000) {
          this.startNewRound(server);
          this.roundTimer = 0;
          this.roundPhase = ROULLETE_PHASE.SPINNING;
          return;
        }
      }
      default: {
      }
    }

    if (this.updateTimer >= this.updateInterval) {
      server.emit("update_wheel", this.getPacket());
      this.updateTimer = 0;
    }

    this.spinWheel(server);
  }

  spinWheel(server) {
    if (!this.moving || this.roundPhase !== ROULLETE_PHASE.SPINNING) return;

    this.angle -= this.angleVelocity;
    this.distance += this.angleVelocity;
    this.angleVelocity += this.acceleration;

    if (this.distance + this.angleVelocity >= this.totalDistance) {
      this.angle = -this.totalDistance;
      this.angleVelocity = 0;
      this.distance = this.totalDistance;
      this.moving = false;
      this.roundPhase = ROULLETE_PHASE.PAUSED;

      server.emit('win_bet', this.getResultColor());
    }
  }

  getResultColor(){
      switch(this.blockArray[this.result]){
        case 2:
            return 'blue';
        case 3:
            return 'purple';
        case 5:
            return 'red';
        case 20:
            return 'green';
        case 666:
            return 'joker';
      }
  }

  async prepareNewRound() {
    const blockNumber = Math.floor(90 + Math.random() * 90);

    const moveDistance = blockNumber * 10;
    const angleVelocity = 2 + Math.random() * 3;
    const acceleration = -(angleVelocity * angleVelocity) / (2 * moveDistance);

    this.result = (blockNumber + this.result) % 36;
    this.totalDistance = Math.floor(this.distance + moveDistance);
    console.log('Result: ',this.blockArray[this.result]);

    this.angleVelocity = angleVelocity;
    this.acceleration = acceleration;
    const round = await _roundsRepo.createNewRound();
    this.round = round;
  }

  async startNewRound(server) {
    this.moving = true;
    this.roundFinished = false;
    this.roundPhase = ROULLETE_PHASE.SPINNING;
    server.emit('start_wheel');
  }

  getPacket() {
    const packet = {
      angle: this.angle,
      roundTimer: this.roundTimer,
      roundPhase: this.roundPhase,
      result: this.roundPhase === this.roundPhase.PAUSED ? this.result : 0
    };
    return packet;
  }
}

module.exports = Roullete;
