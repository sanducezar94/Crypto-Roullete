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
            <BetBox :color="'blue'" :mult='2' :title="'2×'" />
          </div>
          <div class="col-3">
            <BetBox :color="'purple'" :mult='3' :title="'3×'" />
          </div>
          <div class="col-3">
            <BetBox :color="'red'" :mult='5' :title="'5×'" />
          </div>
          <div class="col-3">
            <BetBox :color="'green'" :mult='20' :title="'20×'" />
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
    const bets = await fetch(this.$store.getters.getHost + "bets", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    const result = await bets.json();
    this.$store.dispatch("populateBets", result);
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
  --var-blue-chip: #38427e;
  --var-green-chip: #428675;
  --var-red-chip: #9a3546;
  --var-purple-chip: #81359a;

}

.blue {
  background-color: var(--var-blue-chip);
}

.green {
  background-color: var(--var-green-chip);
}

.purple {
  background-color: var(--var-purple-chip);
}

.red {
  background-color: var(--var-red-chip);
}

.text-blue {
  color: var(--var-blue-chip);
}

.text-green {
  color: var(--var-green-chip);
}

.text-purple {
  color: var(--var-purple-chip);
}

.text-red {
  color: var(--var-red-chip);
}

.text-golden {
  color: #ffd309;
}
</style>
