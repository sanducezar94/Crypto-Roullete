<template>
  <div>
    <Web3Handler></Web3Handler>
    <div class="row">
      <div class="col-2">
        <Dashboard> </Dashboard>
      </div>
      <div class="col-10">
        <Roullete :blocks="36" :radius="200" :blockSize="24" />

        <div class="row m-5">
          <div class="col-3">
            <BetBox :color="'blue'" :title="'2×'" />
          </div>
          <div class="col-3">
            <BetBox :color="'purple'" :title="'3×'" />
          </div>
          <div class="col-3">
            <BetBox :color="'red'" :title="'5×'" />
          </div>
          <div class="col-3">
            <BetBox :color="'green'" :title="'20×'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Roullete from "./components/Roullete.vue";
import BetBox from "./components/BetBox.vue";
import Web3Handler from "./components/Web3Handler.vue";
import Dashboard from "./components/Dashboard.vue";

export default {
  name: "App",
  components: {
    Roullete,
    BetBox,
    Web3Handler,
    Dashboard,
  },
  props: {},
  data() {
    return {
      loaded: false,
      loggedIn: false,
    };
  },
  async mounted() {
    const unsubscribe = this.$store.subscribeAction(async (action, state) => {
      if (action.type === "retrieveUserData") {
        const bets = await fetch(this.$store.getters.getHost + "bets", {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });
        const result = await bets.json();
        this.$store.dispatch("populateBets", result);
      }
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #14152b;
}

.blue {
  background-color: #38427e;
}

.green {
  background-color: #428675;
}

.purple {
  background-color: #81359a;
}

.red {
  background-color: #9a3546;
}

.text-blue {
  color: #38427e;
}

.text-green {
  color: #428675 !important;
}

.text-purple {
  color: #81359a;
}

.text-red {
  color: #9a3546;
}

.text-golden {
  color: #ffd309;
}
</style>
