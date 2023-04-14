import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import request from '../request'

export const useLoginStore = defineStore('login', () => {
  const loggedIn = ref(false);
  const key = ref(null);
  const loginMessage = ref('');
  function login(username, password) {
    loginMessage.value = '';
    
    request.post('login', {
      username,
      password,
    }).then((response) => {
      console.log(response.data);
      if (response.data.code === 200) {
        loggedIn.value = true;
        key.value = response.data.key;
      } else if (response.data.status === 'error') {
        loginMessage.value = response.data.message;
      }
    });
  }

  return { loggedIn, key, loginMessage, login }
})
