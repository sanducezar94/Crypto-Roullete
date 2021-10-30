<template>
  <div>
    <div
      class="container interactable mb-3"
      v-on:click="showBetModal = true"
      v-bind:class="color"
    >
      <div class="back-light" v-bind:class="color"></div>
      <h2 class="text-golden">{{ title }}</h2>
    </div>
    <div class="container pt-3 bet-box">
      <div v-for="(bet, index) in bets" :key="index">
        <span class="text-golden"> bet</span> - {{ bet.amount }} $ONE
        <span
          v-on:click="removeBet(bet.userId)"
          v-if="isCurrentUser(bet.userId)"
          class="text-danger"
          style="cursor: pointer"
          >X</span
        >
      </div>
    </div>

    <Modal v-if="showBetModal">
      <template v-slot:header>
        <div class="row position-relative"><h3>Make a new bet</h3></div>
        <div class="row text-white-50">
          <h4>{{ title }}</h4>
          <div class="back-light" style="top: 25%" v-bind:class="color"></div>
        </div>
      </template>
      <template v-slot:body>
        <div class="row">
          <div class="col-3 mt-1">Amount</div>
          <div class="col-8 offset-1">
            <input
              v-model="betAmount"
              type="text"
              class="form-control"
              style="height: 32px"
              placeholder="0"
            />
          </div>
        </div>
        <div class="mt-3">
          <p class="text-start text-white-50">
            Make sure you are connected to
            <strong class="text-golden">Harmony Testnet</strong>
          </p>
        </div>
      </template>
      <template v-slot:footer>
        <div class="row">
          <div class="col"></div>
          <div class="col-4 ms-1 me-1">
            <button v-on:click="closeBetModal()" class="btn btn-outline-danger">
              Cancel
            </button>
          </div>
          <div class="col-4 ms-1 me-1">
            <button v-on:click="makeBet()" class="btn btn-success">
              Accept
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "BetBox",
  components: {
    Modal,
  },
  props: {
    title: String,
    mult: {
      type: Number,
      default: 2,
    },
    color: String,
  },
  data() {
    return {
      bets: [],
      betAmount: 0,
      betId: 0,
      isLoading: false,
      showBetModal: false,
    };
  },
  mounted() {
    this.$socket.on("make_bet", (bet) => {
      if (bet.color !== this.color) return;
      console.log(bet);
      this.addBet(bet);
      this.closeBetModal();
    });

    const unsubscribe = this.$store.subscribeAction(async (action, state) => {
      if (action.type === "populateBets") {
        const bets = action.payload;
  console.log(bets);
        for (let i = 0; i < bets.length; i++) {
          if (bets[i].color === this.color) {
            this.addBet(bets[i]);
          }
        }
      }
    });
  },
  methods: {
    closeBetModal() {
      this.showBetModal = false;
      this.isLoading = false;
    },
    getTitleColor() {
      return "text-" + this.color;
    },
    isCurrentUser(userId) {
      return userId === this.$store.getters.getUser.id;
    },
    addBet(bet) {
      for (let i = 0; i < this.bets.length; i++) {
        if (this.bets[i].userId === bet.userId) {
          this.bets[i].amount += bet.amount;
          this.betAmount = 0;
          return;
        }
      }
      this.bets.push(bet);
      this.betAmount = 0;
    },
    makeBet() {
      if (!this.$store.getters.getWallet.isAuthorised) {
        this.$store.dispatch("signInWallet");
        return;
      }

      this.isLoading = true;
      const betAmount = parseInt(this.betAmount);

      this.isLoading = false;
      const bet = {
        wallet: this.$store.getters.getWallet.wallet,
        amount: betAmount,
        userId: this.$store.getters.getUser.id,
        color: this.color,
      };
      this.$socket.emit("make_bet", bet);
      this.addBet(bet);
      this.closeBetModal();
    },
    removeBet(userId) {
      this.bets = this.bets.filter((c) => c.userId !== userId);
    },
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  min-height: 72px !important;
  width: 95%;
  position: relative;
  background: rgba(197, 180, 230, 0.15);
  box-shadow: 0 0px 24px 0 rgba(100, 52, 122, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 10px;
  color: white;
  transition: 0.5s all;
}

.container.interactable {
  cursor: pointer;
}

.container.interactable.red:hover {
  color: white !important;
  background-color: #9a3546;
  box-shadow: 0 0px 36px 0 #9a3546;
}

.container.interactable.purple:hover {
  color: white !important;
  background-color: #81359a;
  box-shadow: 0 0px 36px 0 #81359a;
}

.container.interactable.green:hover {
  color: white !important;
  background-color: #428675;
  box-shadow: 0 0px 36px 0 #428675;
}

.container.interactable.blue:hover {
  color: white !important;
  background-color: #38427e;
  box-shadow: 0 0px 36px 0 #38427e;
}

.container.interactable:hover h2 {
  color: white !important;
}

.back-light {
  border-radius: 30%;
  height: 0px;
  width: 0px;
  left: 50%;
  top: 96px;
  position: absolute;
  z-index: -5;
}

.back-light.red {
  box-shadow: 0px 0px 96px 64px #9a3546;
}
.back-light.green {
  box-shadow: 0px 0px 96px 64px #428675;
}
.back-light.blue {
  box-shadow: 0px 0px 96px 64px #38427e;
}
.back-light.purple {
  box-shadow: 0px 0px 96px 64px #81359a;
}

.container h2 {
  transition: 0.5s all;
  line-height: 72px;
}

.bet-box {
  min-height: 300px !important;
}
</style>
