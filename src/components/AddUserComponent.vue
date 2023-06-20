<script setup>
import { onMounted, ref, reactive, watch, nextTick } from 'vue'
import request from '../request';
import { useLoginStore } from '../stores/login';

const props = defineProps({
  boardId: Number,
});

const loginStore = useLoginStore();

const inputEl = ref(null);
const placeholderEl = ref(null);

const state = reactive({
  username: '',
  searchInputDirty: false,
  autocompleted: false,
  suggestions: [],
  selectedSuggestionIndex: -1,
  addingUser: false,
});

watch(() => {
  return {
    ...state,
  };
}, (previousState, currentState) => {
  if (previousState.username !== currentState.username) {
    if (!currentState.autocompleted) {
      if (state.username.length >= 2) {
        request.get(`api/search-user/${state.username}?key=${loginStore.key}`).then((response) => {
          state.suggestions = response.data.data;
        });
      } else {
        state.suggestions = [];
      }
    } else {
      state.autocompleted = false;
    }
  }
});

onMounted(() => {
  placeholderEl.value.addEventListener('click', () => {
    placeholderEl.value.classList.add('d-none');
    inputEl.value.focus();
  });

  inputEl.value.addEventListener('focus', () => {
    placeholderEl.value.classList.add('d-none');
  });

  inputEl.value.addEventListener('blur', () => {
    if (state.username.length === 0) {
      placeholderEl.value.classList.remove('d-none');
    }
  });
});

const onInputKeydown = (e) => {
  if (e.code === 'ArrowDown') {
    state.selectedSuggestionIndex++;
    if (state.selectedSuggestionIndex >= state.suggestions.length) {
      state.selectedSuggestionIndex = 0;
    }
    e.preventDefault();
  } else if (e.code === 'ArrowUp') {
    state.selectedSuggestionIndex--;
    if (state.selectedSuggestionIndex < 0) {
      state.selectedSuggestionIndex = state.suggestions.length - 1;
    }
    e.preventDefault();
  } else if (e.code === 'Enter') {
    if (state.selectedSuggestionIndex > -1) {
      const selectedUser = state.suggestions[state.selectedSuggestionIndex];
      state.autocompleted = true;
      nextTick(() => {
        state.username = selectedUser.username || selectedUser.email;
        state.selectedSuggestionIndex = -1;
        state.suggestions = [];
      });
    } else {
      addUser();
    }
  }
};

const onSuggestionClick = (suggestionIndex) => {
  const selectedUser = state.suggestions[suggestionIndex];
  state.autocompleted = true;
  nextTick(() => {
    state.username = selectedUser.username || selectedUser.email;
    state.selectedSuggestionIndex = -1;
    state.suggestions = [];
  });
};

const onSearchInputChange = () => {
  state.autocompleted = false
  state.searchInputDirty = true;
};

const addUser = () => {
  state.addingUser = true;
  request.post(`api/boards/${props.boardId}/add-user`, {
    username: state.username,
    key: loginStore.key,
  }).then((response) => {
    if (response.data.status === 'ok') {
      state.username = '';
      state.suggestions = [];
      state.selectedSuggestionIndex = -1;
      state.searchInputDirty = false;
    } else if (response.data.code === 500 && response.data.error === 'UNIQUE constraint failed: board_users.board_id, board_users.user_id') {
      alert('User is already added');
    }

    state.addingUser = false;
  });
};
</script>

<template>
  <div class="add-user-component">
    <span>ADD USER</span>

    <div class="input">
      <span
        class="placeholder"
        ref="placeholderEl"
      >
        Username or E-mail
      </span>

      <input
        type="text"
        ref="inputEl"
        v-model="state.username"
        @change="onSearchInputChange"
        @keydown="onInputKeydown"
      />

      <div
        class="suggestions"
        :class="{ 'open': state.suggestions.length > 0 }"
      >
        <div
          v-for="(user, index) in state.suggestions"
          class="suggestions__item"
          :class="{ 'active' : state.selectedSuggestionIndex === index }"
          @mouseover="state.selectedSuggestionIndex = index"
          @click="e => onSuggestionClick(index)"
        >
          <span>{{ user.username }}</span>
          <span>{{ user.email }}</span>
        </div>
      </div>
    </div>

    <button
      v-if="state.searchInputDirty && state.username.length >= 2"
      class="btn-add-user"
      @click="addUser"
    >
      <template v-if="!state.addingUser">
        <font-awesome-icon icon="fa-solid fa-plus" />
        <span>Add User</span>
      </template>

      <template v-if="state.addingUser">
        <font-awesome-icon icon="fa-solid fa-circle-notch" spin />
        <span>Adding User</span>
      </template>
    </button>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.add-user-component {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  
  span {
    font-size: 10px;
    font-weight: bold;
  }

  .input {
    position: relative;
    margin-top: 5px;

    .placeholder {
      position: absolute;
      top: 55%;
      left: 10px;
      transform: translate(0%, -50%);
    }

    input {
      width: 200px;
      max-width: calc(100% - 10px - 10px);
      padding: 10px;
      border-radius: 5px;
      background-color: #F0F0F0;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
    }

    .suggestions {
      position: absolute;
      top: calc(100% - 3px);
      left: 0;
      width: 220px;
      max-height: 220px;
      overflow-y: auto;
      display: none;
      flex-direction: column;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      background-color: #F0F0F0;
      color: $dropdown-text-color;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;

      .suggestions__item {
        padding: 10px;
        cursor: pointer;

        &.active {
          background-color: $dropdown-active-item-background-color;
        }
      }
    }

    .suggestions.open {
      display: flex;
    }
  }

  .btn-add-user {
    @include button();
    @include button_sm();
    width: 100%;
    max-width: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    padding: 10px 0;

    span {
      margin-left: 5px;
    }
  }
}
</style>
