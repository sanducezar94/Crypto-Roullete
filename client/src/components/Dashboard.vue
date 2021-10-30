<template lang="">
    <div class='container'>
        <div>
            <BalanceBox></BalanceBox>
        </div>
    </div>
            
</template>
<script>
import BalanceBox from "./BalanceBox.vue";

export default {
  name: "Dashboard",
  components: {
      BalanceBox,
  },
  props: {},
  data() {
    return {
    };
  },
}

</script>

<style scoped>
    .container{
        background-color: #1e2240;
        width: 100%;
        height: 100%;
    }
</style>