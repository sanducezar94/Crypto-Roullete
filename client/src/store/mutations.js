export const mutations = {
  setUser(state, payload) {
    state.user = payload.user;
  },
  setRoundPhase(state, payload) {
    state.roundPhase = payload;
  },
};
