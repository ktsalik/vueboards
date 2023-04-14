<script setup>
import { ref } from 'vue';
import { useLoginStore } from '../stores/login';
import router from '../router';

const loginStore = useLoginStore();

loginStore.$subscribe((mutation, state) => {
  if (state.loggedIn) {
    router.push('/dashboard');
  }
});

const username = ref('');
const password = ref('');

const login = () => {
  loginStore.login(username.value, password.value);
};
</script>

<template>
  <div class="Login">
    <div class="form">
      <div class="input">
        <span>USERNAME</span>
        <input type="text" v-model="username" placeholder="Enter your username or email" />
      </div>

      <div class="input">
        <span>PASSWORD</span>
        <input type="password" v-model="password" placeholder="********" />
      </div>

      <span class="message">
        {{ loginStore.loginMessage }}
      </span>

      <button class="btn-login" @click="login">Login</button>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.Login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    border-radius: 10px;
    background-color: #FFFFFF;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    .input {
      display: flex;
      flex-direction: column;
      margin: 10px 0;

      span {
        margin-left: 10px;
        font-size: 10px;
        font-weight: bold;
      }

      input {
        outline: none;
        border: none;
        width: 275px;
        margin-top: 5px;
        padding: 10px 15px;
        background-color: #F0F0F0;
        border-radius: 27px;
        color: #333333;
        font-size: 14px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
      }
    }

    .btn-login {
      outline: none;
      border: none;
      width: 295px;
      margin-top: 20px;
      padding: 10px;
      border-radius: 5px;
      background-color: $primary-color;
      color: $primary-text-color;
      font-size: 16px;
      box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
      cursor: pointer;
    }

    .message {
      height: 15px;
      margin-top: 10px;
      color: $muted-text-color;
    }
  }
}
</style>
