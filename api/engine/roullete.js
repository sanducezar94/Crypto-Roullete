const _roundsRepo = require("../repository/rounds");

const ROULLETE_PHASE = {
  PAUSED: 0,
  FINISHED: 1,
  SPINNING: 2,
};

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

    this.roundPhase = ROULLETE_PHASE.FINISHED;
    this.roundTimer = 0;
    this.prepareNewRound();
  }

  update(dt, server) {
    this.updateTimer += dt;

    switch (this.roundPhase) {
      case ROULLETE_PHASE.PAUSED: {
        this.roundTimer += dt;
        if (this.roundTimer >= 10 * 1000) {
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

    this.spinWheel();
  }

  spinWheel() {
    if (!this.moving || this.roundPhase !== ROULLETE_PHASE.SPINNING) return;

    this.angle += this.angleVelocity;
    this.distance += this.angleVelocity;
    this.angleVelocity += this.acceleration;

    if (this.distance + this.angleVelocity >= this.totalDistance) {
      this.angle = this.totalDistance;
      this.angleVelocity = 0;
      this.distance = this.totalDistance;
      this.moving = false;
      this.roundPhase = ROULLETE_PHASE.PAUSED;
    }

    if (this.angleVelocity <= 0) {
      this.moving = false;
      this.roundPhase = ROULLETE_PHASE.PAUSED;
    }
  }

  async prepareNewRound() {
    const moveDistance = Math.floor(120 + Math.random() * 15) * 10;
    const angleVelocity = 2 + Math.random() * 3;
    const acceleration = -(angleVelocity * angleVelocity) / (2 * moveDistance);
    const result = (Math.floor((moveDistance % 360) / 10) + this.result) % 36;

    this.totalDistance = this.angle + moveDistance;
    this.result = result;
    this.angleVelocity = angleVelocity;
    this.acceleration = acceleration;
    const round = await _roundsRepo.createNewRound();
    this.round = round;
  }

  async startNewRound() {
    console.log(
      "Wheel started moving at: " +
        this.angleVelocity +
        " with acceleration: " +
        this.acceleration +
        " for a total of " +
        this.moveDistance / 10 +
        " blocks."
    );
    this.moving = true;
    this.roundFinished = false;
    this.roundPhase = ROULLETE_PHASE.SPINNING;
  }

  getPacket() {
    const packet = {
      angle: this.angle,
      roundTimer: this.roundTimer,
      roundPhase: this.roundPhase,
    };
    return packet;
  }
}

module.exports = Roullete;
