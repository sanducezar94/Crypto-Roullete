import { createStore } from "vuex";
import { actions } from "./actions.js";
import { mutations } from "./mutations.js";

export const store = createStore({
  state() {
    return {
      user: { balance: 0 },
      wallet: { account: "", isAuthorised: false },
      host: "http://localhost:3001/",
      roundPhase: 0,
    };
  },
  getters: {
    getUser: (state) => state.user,
    getWallet: (state) => state.wallet,
    getHost: (state) => state.host,
    getRoundPhase: (state) => state.roundPhase
  },
  mutations: mutations,
  actions: actions,
});
