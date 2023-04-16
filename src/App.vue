<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { state, socket } from "@/socket";

socket.on('foo', (data) => {
  console.log(data);
});
</script>

<template>
  <header>
    <div class="logo">
      Vueboards
    </div>
  </header>

  <main>
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
    padding: 20px;

    .logo {
      color: $primary-color;
      font-weight: bold;
      font-size: 22px;
    }
  }

  main {
    flex: 1;
  }
}
</style>
