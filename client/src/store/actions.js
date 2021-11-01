export const actions = {
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
}