<script setup>
import router from '../router';
import { useLoginStore } from '../stores/login';


const loginStore = useLoginStore();
if (!loginStore.loggedIn) {
  router.push('/login');
}
</script>

<template>
  Dashboard
</template>
