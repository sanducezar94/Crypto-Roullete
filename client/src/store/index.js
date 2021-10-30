import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      user: { balance: 0 },
      wallet: { account: "", isAuthorised: false },
      host: 'http://localhost:3001/'
    };
  },
  getters: {
    getUser: (state) => state.user,
    getWallet: (state) => state.wallet,
    getHost: (state) => state.host
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.user;
    },
  },
  actions: {
    initializeUser({ state }, args) {
      state.user = args;
    },
    updateCredit({ state }, args) {
      if (!args) return;
      const balance = parseInt(args);
      state.user.balance = balance;
    },
    retrieveUserData({state}, args){

    },
    populateBets({state}, args){

    },    
    buyCredit({state}, args){

    },
    signInWallet({state}, args){

    },
    updateWallet({state}, args) {
      if(!args) return;
      state.wallet = args;
      
      if(state.wallet.isAuthorised){
        this.dispatch('signInWallet', args.wallet);
      }
    }
  },
});
