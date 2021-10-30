import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store/index.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import vueSocket from './plugins/vueSocket.js';

const app = createApp(App);

app.use(store);
app.use(vueSocket);
app.mount('#app');