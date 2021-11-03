<template lang="">
    <div class='container p-0'>
                <div class='h-75'>
                    <ChatBox></ChatBox>
                </div>
        <div class='h-25'>
            <BalanceBox></BalanceBox>
        </div>
    </div>
            
</template>
<script>
import BalanceBox from "./BalanceBox.vue";
import ChatBox from "./ChatBox.vue";

export default {
  name: "Dashboard",
  components: {
    BalanceBox,
    ChatBox,
  },
  props: {},
  data() {
    return {};
  },
};
</script>

<style scoped>
.container {
  background-color: #1e2240;
  width: 100%;
  height: 100%;
}
</style>