import { reactive } from "vue";
import { io } from "socket.io-client";

export const socketState = reactive({
  connected: false,
});

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";

export const socket = io(URL);

socket.on("connect", () => {
  socketState.connected = true;
});

socket.on("disconnect", () => {
  socketState.connected = false;
});