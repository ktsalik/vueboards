<script setup>
import { ref, onMounted } from 'vue';
import { useLoginStore } from '../stores/login';
import router from '../router';

const loginStore = useLoginStore();

loginStore.$subscribe((mutation, state) => {
  if (state.loggedIn) {
    router.push('/');
  }
});

const usernameInputElRef = ref(null);

onMounted(() => {
  usernameInputElRef.value.focus();
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
        <input type="text" ref="usernameInputElRef" v-model="username" @keyup.enter="login" placeholder="Enter your username or email" />
      </div>

      <div class="input">
        <span>PASSWORD</span>
        <input type="password" v-model="password" @keyup.enter="login" placeholder="********" />
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
    @include component();
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .input {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 10px 0;

      span {
        margin-left: 10px;
        font-size: 10px;
        font-weight: bold;
      }

      input {
        width: 275px;
        max-width: calc(100% - 15px - 15px);
        margin-top: 5px;
        padding: 10px 15px;
        background-color: #F0F0F0;
        border-radius: 27px;
        color: #333333;
        font-size: 14px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
      }
    }

    .btn-login {
      width: 295px;
      max-width: 100%;
      margin-top: 20px;
      @include button();
    }

    .message {
      height: 15px;
      margin-top: 10px;
      color: $muted-text-color;
    }
  }
}

@media screen and (max-width: 425px) {
  .Login {

    .form {

      .message {
        font-size: 10px;
      }
    }
  }
}
</style>
