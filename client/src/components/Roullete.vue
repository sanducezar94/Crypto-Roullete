<template>
  <div
    class="position-relative d-flex justify-content-center align-items-center"
  >
    <div
      style="z-index: 20"
      class="text-golden position-absolute top-50 text-center"
      v-if="isRoundFinished()"
    >
      New round in <br />
      {{ (20 - roundTimer).toFixed(1) }} s
    </div>

    <div
      style="z-index: 20"
      class="text-golden position-absolute top-50 text-center"
      v-if="isRoundPaused()"
    >
      Result is {{ result }} <br />
      {{ (10 - roundTimer).toFixed(1) }} s
    </div>

    <div class="roullete-pin-top"></div>
    <div
      class="roullete-container"
      style="border-radius: 16px"
      v-bind:style="getContainerStyle()"
    >
      <div
        class="roullete"
        v-bind:style="{ transform: 'rotate(' + angle + 'deg)' }"
      >
        <div class="position-absolute roullete-outline"></div>
        <div class="position-relative">
          <div
            v-bind:data-index="index"
            class="block"
            v-bind:class="{
              blue: block === 2,
              green: block === 20,
              purple: block === 3,
              red: block === 5,
              joker: block === 666
            }"
            v-bind:style="roulleteBlockStyle(index)"
            v-for="(block, index) in blockArray"
            :key="index"
          >
            <div
              style="transform: rotate(90deg); color: #ffd309; z-index: 25"
              class="w-100 h-100 fw-bold"
            >
              {{ getBlockText(block) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BLOCK_SIZE = 64;
const BLOCK_GROUP = 15;
const ZERO_BLOCK_OCCURENCE = 7;
import { ROULLETE_PHASE } from "../constants/constants.js";

const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

export default {
  name: "Roullete",
  props: {
    blocks: {
      type: Number,
      default: 36,
    },
    radius: {
      type: Number,
      default: 275,
    },
    blockSize: {
      type: Number,
      default: 48,
    },
  },
  data() {
    return {
      angle: 0,
      drawKey: 0,
      moving: false,
      blockArray: [20, 3, 2, 3, 2, 3, 2, 5, 2, 3, 2, 3, 2, 3, 2, 5, 2, 3, 2, 3, 2, 3, 2, 3,2, 5, 2, 3, 2, 3, 2, 3, 2, 2, 5, 2],
      packets: [],
      roundTimer: 0,
      roundPhase: ROULLETE_PHASE.FINISHED,
      previousRoundPhase: ROULLETE_PHASE.FINISHED
    };
  },
  mounted: function () {
    this.$socket.on("update_wheel", (args) => {
      this.insertPacket(args);
    });

    this.$socket.on("init_wheel", (args) => {
      this.angle = args.angle;
    });

    const interval = setInterval(() => {
      this.updateRoullete();
    }, 1000 / 60);
  },
  methods: {
    getBlockText(block){
      if(block === 666) return '🤡';
      return block;
    },
    isRoundFinished() {
      return this.roundPhase === ROULLETE_PHASE.FINISHED;
    },
    isRoundPaused() {
      return this.roundPhase === ROULLETE_PHASE.PAUSED;
    },
    currentNumber() {
      const index = Math.floor((this.distance % 360) / 10);
      return this.blockArray[index];
    },
    roulleteBlockStyle(index) {
      const degree = index * 10 - 90;
      const radian = (degree * Math.PI) / 180;
      const left = Math.floor(Math.cos(radian) * this.radius) - 18;
      const top = Math.floor(Math.sin(radian) * this.radius) - 16; //because block height is 2 pixel smaller than the width
      return {
        transform: "rotate(" + degree + "deg)",
        left: left + "px",
        top: top + "px",
      };
    },
    getContainerStyle(index) {
      return {
        width: this.radius * 2.5 + "px",
        height: this.radius * 2.5 + "px",
      };
    },
    insertPacket(packet) {
      this.packets.unshift(packet);
      if (this.packets.length > 10) this.packets.pop();
    },
    updateRoullete() {
      if (this.packets.length === 0 || !this.packets) return;
      if (this.angle === 0) this.angle = this.packets[0].angle;
      this.angle = lerp(this.angle, this.packets[0].angle, 0.05);
      this.roundTimer = (
        lerp(this.roundTimer, this.packets[0].roundTimer, 1) / 1000
      ).toFixed(1);
      this.previousRoundPhase = this.roundPhase;
      this.roundPhase = this.packets[0].roundPhase;

      if(this.roundPhase !== this.previousRoundPhase){
        this.$store.commit('setRoundPhase', this.roundPhase);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.roullete-container {
  display: inline-flex;
  overflow-x: hidden;
  justify-content: center;
  position: relative;
  user-select: none;
  justify-content: center;
  align-items: center;
  align-content: center;
  overflow: hidden;
}

.ddroullete-container::before {
  content: "";
  display: block;
  position: absolute;
  z-index: 5;
  left: 0;
  height: 96px;
  width: 25%;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0.1)
  );
}

.ddroullete-container::after {
  content: "";
  display: block;
  position: absolute;
  right: 0;
  height: 96px;
  width: 25%;
  background-image: linear-gradient(
    to left,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0.1)
  );
}

.roullete-outline {
  border-radius: 50%;
  border: 60px solid #1e2240;
  width: 93%;
  height: 93%;
  box-shadow: 0 0px 32px 0 rgba(116, 86, 131, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
}

.roullete {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  position: relative;
  overflow: hidden;
}

.roullete-pin-top {
  position: absolute;
  height: 27px;
  width: 6px;
  box-shadow: 1px 5px rgba(0, 0, 0, 0.1);
  z-index: 5;
  left: calc(50% - 4px);
  top: 0;
  background-color: #e7e4e7;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
}

.roullete-pin-top::after {
  content: "";
  display: block;
  position: absolute;
  height: 48px;
  width: 48px;
  top: 27px;
  left: -20px;
  background-color: none;
  border: 4px solid #e7e4e7;
  border-radius: 20%;
}

.roullete-pin-bottom {
  position: absolute;
  height: 20px;
  width: 5px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 1px -5px rgba(0, 0, 0, 0.1);
  background-color: red;
  top: 15px;
  z-index: 5;
}

.block {
  height: 34px;
  width: 36px;
  line-height: 36px;
  color: white;
  position: absolute;
  border-radius: 20%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
}

.block::after {
  content: "";
  display: block;
  position: absolute;
  width: 1px;
  height: 1px;
  top: 18px;
  left: 18px;
  border-radius: 50%;
  box-shadow: 0px 0px 12px 12px rgb(253, 253, 253, 0.35);
  z-index: 15;
}

.block + .selected {
  box-shadow: 0px 0px 24px 24px #ffd309;
}
</style>
