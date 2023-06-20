<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { socketState, socket } from "@/socket";
import request from './request';
import { useLoginStore } from './stores/login';
import router from './router';
import { reactive } from 'vue';

const loginStore = useLoginStore();

let previousStateOfLoggedIn = false;
loginStore.$subscribe((mutation, state) => {
  if (state.loggedIn && previousStateOfLoggedIn !== state.loggedIn) {
    if (!socket.connected) {
      socket.once('connect', () => {
        socket.emit('key', state.key);
      });
    } else {
      socket.emit('key', state.key);
    }
  }
  previousStateOfLoggedIn = state.loggedIn;
});

const state = reactive({
  initialized: false,
});

socket.on('foo', (data) => {
  console.log(data);
});

const key = localStorage.getItem('key');
if (key) {
  request.get(`/api?key=${key}`).then((response) => {
    if (response.data.code === 401) {
      router.push('/login');
    } else {
      loginStore.$patch({
        loggedIn: true,
        key,
      });

      router.push('/'); 
    }

    state.initialized = true;
  });
} else {
  router.push('/login');
  state.initialized = true;
}
</script>

<template>
  <header>
    <RouterLink to="/" class="logo">
      Vueboards
    </RouterLink>

    <span style="font-size: 11px">This app exists for demonstration reasons. All data stored will rollback after 15 minutes of inactivity.</span>
  </header>

  <main v-if="state.initialized">
    <RouterView />
  </main>
</template>

<style lang="scss">
@import './assets/variables.scss';

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $app-background-color;
  color: $app-text-color;

  header {
    display: flex;
    justify-content: space-between;
    padding: 20px;

    .logo {
      color: $primary-color;
      font-weight: bold;
      font-size: 22px;
    }
  }

  main {
    width: 100%;
    height: calc(100% - 75px);
  }
}

@media screen and (max-width: 425px) {
  #app {

    header {
      flex-direction: column;
    }
  }
}

a, button {
  color: $app-text-color;
}
</style>
