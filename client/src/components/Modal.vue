<template lang="">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="m-container">

          <div class="m-header">
            <slot name="header">
            </slot>
          </div>

          <div class="m-body">
            <slot name="body">
            </slot>
          </div>

          <div class="m-footer">
            <slot name="footer">
            </slot>
          </div>
        </div>
      </div>
    </div>   
</template>

<script>
export default {
  name: "Modal",
  props: {},
  data() {
    return {
    };
  },
}

</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.m-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
    background: rgba(197, 180, 230, 0.15);
  box-shadow: 0 0px 24px 0 rgba(88, 52, 122, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 10px;
  color: white;
  transition: 0.5s all;
}

.m-header h3 {
  margin-top: 0;
  color: #42b983;
}

.m-body {
  margin: 20px 0;
}

.modal-default-button {
  display: block;
  margin-top: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

