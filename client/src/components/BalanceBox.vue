<template>
  <div v-if="isLoggedIn" class="pt-4">
    <h2 class="text-golden">username</h2>
    <div class="row p-3" style="height: 60px">
      <div class="col-6">
        <h3 class="text-golden" style="line-height: 1.3" v-if="isLoggedIn">
          {{ userBalance }}$
        </h3>
      </div>
      <div class="col-6">
        <button v-on:click="buyTokens()" class="btn btn-outline-warning">
          Buy More
        </button>
      </div>
    </div>

    <Modal v-if="showBuyModal">
      <template v-slot:header>
        <div class="row"><h3>Make a new deposit</h3></div>
      </template>
      <template v-slot:body>
        <div class="row">
          <div class="col-3 mt-1">Amount</div>
          <div class="col-8 offset-1">
            <input
              v-model="buyAmount"
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
            <button v-if='!isLoading'
              v-on:click="closeDepositModal"
              class="btn btn-outline-danger"
            >
              Cancel
            </button>
          </div>
          <div class="col-4 ms-1 me-1">
            <button
              v-if="!isLoading"
              v-on:click="confirmDeposit()"
              class="btn btn-success"
            >
              Accept
            </button>
            <div v-else class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
  <div v-else class="w-100 p-4 ms-0 me-0 row">
    <button class="btn btn-outline-warning" v-on:click="logIn()">
      Connect Wallet
    </button>
  </div>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "BalanceBox",
  components: {
    Modal,
  },
  props: {
    displayBuy: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loaded: 0,
      isLoading: false,
      buyAmount: 0,
      showBuyModal: false,
    };
  },
  mounted: function () {
    this.$socket.on("update_credit", (amount) => {
      this.$store.dispatch("updateCredit", amount);
      this.closeDepositModal();
    });
  },
  methods: {
    closeDepositModal(){
      this.showBuyModal = false;
      this.isLoading = false;
    },
    buyTokens() {
      this.showBuyModal = !this.showBuyModal;
    },
    logIn() {
      this.$store.dispatch("signInWallet");
    },
    confirmDeposit() {
      const buyAmount = parseInt(this.buyAmount);
      this.$store.dispatch("buyCredit", buyAmount);
      this.isLoading = true;
    },
  },
  computed: {
    userBalance() {
      return this.$store.getters.getUser.balance;
    },
    isLoggedIn() {
      return this.$store.getters.getWallet.isAuthorised;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
