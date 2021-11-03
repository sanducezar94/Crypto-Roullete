<template lang="">
    <div>
        
    </div>
</template>
<script>
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

const HARMONY_TESTNET = 1666700000;

export default {
  name: "Web3Handler",
  props: {},
  data() {
    return {
      account: "",
      isAuthorised: false,
      networkId: HARMONY_TESTNET,
    };
  },
  async mounted() {
    const unsubscribe = this.$store.subscribeAction(async (action, state) => {
      const buyAmount = parseInt(action.payload);
      if (action.type == "buyCredit") {
        if (buyAmount === 0 || !buyAmount) return;

        const transaction = await this.signTransaction(buyAmount);
        if (transaction != null) {
          this.$socket.emit("buy_credit", {
            userId: this.$store.getters.getUser.id,
            amount: buyAmount,
          });
        }
      }

      if (action.type == "signInWallet") {
        await this.signIn();
        await this.$socket.emit("sign_up", this.account);
      }
    });

    await this.initialize();
    await this.signIn();
    await this.$socket.emit("sign_up", this.account);

    this.$socket.on("log_in", (user) => {
      this.$store.dispatch("initializeUser", user);
      this.loggedIn = true;
    });
  },
  methods: {
    async initialize() {
      const provider = await detectEthereumProvider();

      provider.on("accountsChanged", this.handleAccountsChanged);

      provider.on("networkChanged", (networkId) => {
        this.handleNetworkChange(networkId);
      });

      provider.on("connect", () => {});

      provider.on("disconnect", () => {
        this.logOut();
      });
    },
    //-- SIGN IN --
    async signIn() {
      const provider = await detectEthereumProvider();

      const networkId = await provider.request({
        method: "net_version",
      });

      if (networkId == HARMONY_TESTNET) {
        if (provider !== window.ethereum) {
          console.error("Do you have multiple wallets installed?");
        }

        if (!provider) {
          console.error("Metamask not found");
          return;
        }

        const signIn = await window.ethereum
          .request({
            method: "eth_requestAccounts",
            params: [
              {
                eth_accounts: {},
              },
            ],
          })
          .then((accounts) => {
            this.handleAccountsChanged(accounts);
          })
          .catch((err) => {
            if (err.code === 4001) {
              console.log("Connection refused.");
            } else {
              console.error(err);
            }
          });
      } else {
        console.error("Change network to Harmony Testnet");
        const chainId = await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x6357d2e0" }],
        });
        const networkId = await provider.request({
          method: "net_version",
        });

        if (networkId === HARMONY_TESTNET) {
          await this.signIn();
        }
      }
    },
    async signTransaction(amount) {
      const web3 = new Web3(window.ethereum);
      const receiverAddress = "0xc7ee5fde9aa710659d3ea2d9766527b7eaf85e9b";
      const gas = 6721900;
      const gasPrice = await web3.eth.getGasPrice();
      const account = this.account;

      const result = await web3.eth
        .sendTransaction({
          from: account,
          to: receiverAddress,
          value: amount * 1e18,
          gasPrice,
          gas,
        })
        .on("error", console.error)
        .on("transactionHash", (transactionHash) => {
          console.log("Transaction is sending:", transactionHash);
        });

      return result;
    },
    handleNetworkChange(networkId) {
      if (networkId != HARMONY_TESTNET) {
        console.error("You are not connected to Harmony Testnet.");
        this.logOut();
      } else {
        this.signIn();
      }
    },
    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.error("Not found accounts");
        this.logOut();
      } else {
        this.account = accounts[0];
        this.isAuthorised = true;
        this.updateWallet();
      }
    },
    logOut() {
      this.isAuthorised = false;
      this.account = "";
      this.updateWallet();
    },
    updateWallet() {
      this.$store.dispatch("updateWallet", {
        wallet: this.account,
        isAuthorised: this.isAuthorised,
      });
    },
  },
  watch: {
    account: function (newVal) {
      console.log("account updated", newVal);
    },
  },
};
</script>
<style lang="">
</style>