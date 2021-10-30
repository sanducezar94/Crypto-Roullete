import io from "socket.io-client";

export default {
    install: (app, options) => {
        const socket = io.connect("http://localhost:3001");

        app.config.globalProperties.$socket = socket;
        
        app.mixin({
            created() {
            }
        });
    }
  }