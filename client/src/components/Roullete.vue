<template>
  <div class='position-relative'>
    <div class='text-golden'> {{ Math.floor(distance) }} , {{ currentNumber()}}, {{ blockArray[36 - result] }}
          <button v-on:click='newRound()' class='ms-4 btn btn-primary'>Spin</button>
    </div>

        <div class="roullete-pin-top"></div>
    <div
      class="roullete-container"
      style="border-radius: 16px"
      v-bind:style="getContainerStyle()"
    >
      <div
        class="roullete"
        v-bind:style="{ transform: 'rotate(' + x + 'deg)' }"
      >
        <div class="position-absolute roullete-outline"></div>
        <div class="position-relative">
          <div v-bind:data-index='index'
            class="block"
            v-bind:class="{
              blue: block === 2,
              green: block === 20,
              purple: block === 3,
              red: block === 5,
            }"
            v-bind:style="roulleteBlockStyle(index)"
            v-for="(block, index) in blockArray"
            :key="index"
          >
            <div
              style="transform: rotate(90deg); color: #ffd309; z-index: 25"
              class="w-100 h-100 fw-bold"
            >
              {{ block }}
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
      startBlock: 0,
      endBlock: 45,
      x: 0, //-((this.blocks / 2) * BLOCK_SIZE - BLOCK_SIZE * 4),
      fps: 120,
      ticker: null,
      drawKey: 0,
      velocity:0,
      acceleration: 0,
      moving: false,
      blockArray: [],
      distance: 0,
      totalDistance: 0,
      result: 0,
    };
  },
  mounted: function () {
    let index = 1;
    this.ticker = setInterval(() => {
      this.update();
    }, 1000 / this.fps);
    this.updateBlocks();
    this.moving = true;
  },
  methods: {
    newRound() {
      const moveDistance = Math.floor(90 + Math.random() * 15) * 10;
      this.totalDistance = this.x + moveDistance;
      const speed = 2 + Math.random() * 4;
      const acceleration = -(speed * speed) / (2 * moveDistance);
      const result = (Math.floor((moveDistance % 360) / 10) + this.result) % 36;
      console.log('Result index:', result);
      this.result = result;
      this.velocity = speed;
      this.acceleration = acceleration;
      this.moving = true;
      console.log('Wheel started moving at: ' + speed + ' with acceleration: ' + acceleration + ' for a total of ' + moveDistance/10 + ' blocks.');
    },
    currentNumber() {
      const index = Math.floor((this.distance % 360) / 10);
      return this.blockArray[index];
    },
    roulleteBlockStyle(index) {
      const degree = index * 10 + 270;
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
    update() {
      if (!this.moving) return;

      this.x += this.velocity;
      this.distance += this.velocity;
      this.velocity += this.acceleration;

      if(this.distance + this.velocity >= this.totalDistance){
        this.x = this.totalDistance;
        this.velocity = 0;
        this.distance = this.totalDistance;
        this.moving = false;
        console.log('FINAL DISTANCE:', this.distance);
      }
      if (this.velocity <= 0) {
        this.moving = false;

        const blocks = document.getElementsByClassName("block");
        /* setTimeout(() => {
          this.x -= 15 * BLOCK_SIZE;
        }, 1000);*/
      }
    },
    updateBlocks() {
      let index = 0;
      for (let i = 0; i < this.blocks; i++) {
        if (i === 0) {
          this.blockArray.push(20);
          continue;
        }
        if (i % 2 === 1) {
          this.blockArray.push(2);
        }
        if (i % 2 === 0) {
          if (i % 5 === 0) {
            this.blockArray.push(5);
          } else {
            this.blockArray.push(3);
          }
        }
      }
      /*let zeroBlock = 0;
      while (index <= this.blocks) {
        if (
          index == ZERO_BLOCK_OCCURENCE ||
          zeroBlock == ZERO_BLOCK_OCCURENCE * 2
        ) {
          this.blockArray.push(0);
          zeroBlock = 0;
        }
        if (index % 2 == 0) {
          this.blockArray.push(1 + (Math.floor(index / 2) % 7));
        } else {
          this.blockArray.push(14 - (Math.floor(index / 2) % 7));
        }
        zeroBlock += 1;
        index += 1;
      }*/
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
