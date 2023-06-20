<script setup>
import { useLoginStore } from '../stores/login';
import { useDashboardStore } from '../stores/dashboard';
import { ref } from 'vue';
import Window from '../components/Window.vue';
import AddUserComponent from '../components/AddUserComponent.vue';
import request from '../request';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const dashboardStore = useDashboardStore();
const router = useRouter();

if (!loginStore.loggedIn) {
  router.push('/login');  
}

dashboardStore.fetchBoards();

const newBoardNameInputRef = ref(null);
const showNewBoardDialog = ref(false);
const newBoardName = ref('');
const creatingBoard = ref(false);
const showSettingsWindow = ref(false);
const boardSelectedId = ref(null);
const boardSelected = ref(null);
const updatingBoardName = ref(false);

const onNewBoardClick = () => {
  showNewBoardDialog.value = true;
  setTimeout(() => {
    newBoardNameInputRef.value.focus();
  });
};

const closeNewBoardDialog = () => {
  showNewBoardDialog.value = false;
  clearNewBoardDialog();
};

const onCloseNewBoardDialog = () => {
  closeNewBoardDialog();
};

const clearNewBoardDialog = () => {
  newBoardName.value = '';
};

const createBoard = () => {
  if (!creatingBoard.value && newBoardName.value.length > 0) {
    creatingBoard.value = true;

    request.post('api/boards/new', {
      name: newBoardName.value,
      key: loginStore.key,
    }).then((response) => {
      console.log(response.data);
      dashboardStore.fetchBoards().then(() => {
        closeNewBoardDialog();
        creatingBoard.value = false;
        clearNewBoardDialog();
      });
    });
  }
};

const openSettingsWindow = () => {
  showSettingsWindow.value = true;
};

const onSettingsClick = (boardId) => {
  boardSelectedId.value = boardId;
  boardSelected.value = dashboardStore.boards.find((b) => b.id === boardSelectedId.value);
  newBoardName.value = boardSelected.value.name;
  openSettingsWindow(boardId);
};

const onSettingsClose = () => {
  showSettingsWindow.value = false;
  newBoardName.value = '';
  boardSelected.value = null;
};

const updateBoardName = () => {
  if (updatingBoardName.value === false) {
    updatingBoardName.value = true;

    request.post(`api/boards/${boardSelected.value.id}/update`, {
      name: newBoardName.value,
      key: loginStore.key,
    }).then((response) => {
      dashboardStore.fetchBoards().then(() => {
        updatingBoardName.value = false;
      });
    });
  }
};

dashboardStore.$subscribe((mutation, state) => {
  if (boardSelectedId.value) {
    boardSelected.value = state.boards.find((b) => b.id === boardSelectedId.value);
  }
});

const logout = () => {
  localStorage.removeItem('key');
  
  loginStore.$patch({
    key: null,
    loggedIn: false,
  });

  router.push('/login');
};
</script>

<template>
  <div class="Dashboard">
    <button class="btn-new-board" @click="onNewBoardClick">
      <font-awesome-icon icon="fa-solid fa-plus" />
      <span>New Board</span>
    </button>

    <div class="boards-list">
      <div
        v-if="dashboardStore.boards.length > 0"
        class="boards-list__header"
      >
        <span>BOARD NAME</span>
        <span>SETTINGS</span>
      </div>

      <div v-for="board in dashboardStore.boards" class="board-list__item">
        <router-link :to="`/boards/${board.id}`" class="name">{{ board.name }}</router-link>
        
        <button
          class="btn-settings"
          @click="onSettingsClick(board.id)"
        >
          <font-awesome-icon icon="fa-solid fa-cog" size="lg" />
        </button>
      </div>

      <div
        v-if="!dashboardStore.fetchingBoards && dashboardStore.boards.length === 0"
        class="no-boards-yet-message"
      >
        <font-awesome-icon icon="fa-solid fa-table-columns" size="4x" />
        <span>Create a New Board to get started</span>
      </div>

      <div
        v-if="dashboardStore.fetchingBoards && dashboardStore.boards.length === 0"
        class="fetching-boards-message"
      >
        <font-awesome-icon icon="fa-solid fa-circle-notch" size="2x" spin />
        <span>Unpacking boards</span>
      </div>
    </div>

    <Window
      class="create-board-dialog"
      :open="showNewBoardDialog"
      :onClose="onCloseNewBoardDialog"
    >
      <span class="title">Create New Board</span>

      <div class="input">
        <span>NAME</span>
        <input
          type="text"
          placeholder="Enter name for your new board"
          v-model="newBoardName"
          @keyup.enter="createBoard"
          ref="newBoardNameInputRef"
        />
      </div>

      <button
        class="btn-create-board"
        @click="createBoard"
      >
        <span v-if="!creatingBoard">Create</span>
        <template v-if="creatingBoard">
          <font-awesome-icon icon="fa-solid fa-circle-notch" spin />
          <span>Creating</span>
        </template>
      </button>
    </Window>

    <Window
      class="board-settings-window"
      :fullHeight="true"
      :open="showSettingsWindow"
      :onClose="onSettingsClose"
    >
      <span class="title">Board Settings</span>

      <div class="controls">
        <div class="change-name-input">
          <span>CHANGE NAME</span>
          <input
            type="text"
            v-model="newBoardName"
            placeholder="New name for the board"
            @keyup.enter="updateBoardName"
          />
        </div>

        <button
          v-if="boardSelected"
          class="btn-update-name"
          :class="{ 'hide': newBoardName.length === 0 || newBoardName === boardSelected.name }"
          @click="updateBoardName"
        >
          <template v-if="!updatingBoardName">
            <font-awesome-icon icon="fa-solid fa-save" />
            <span>Save</span>
          </template>

          <template v-if="updatingBoardName">
            <font-awesome-icon icon="fa-solid fa-circle-notch" spin />
            <span>Saving Changes</span>
          </template>
        </button>

        <AddUserComponent
          v-if="boardSelected"
          :boardId="boardSelectedId"
        ></AddUserComponent>
      </div>

      <button
        class="btn-close"
        @click="onSettingsClose"
      >
        Close
      </button>
    </Window>

    <button
      class="btn-logout"
      @click="logout"
    >Logout</button>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.Dashboard {
  position: relative;
  width: 1280px;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .btn-new-board {
    @include button();

    span {
      margin-left: 5px;
    }
  }

  .boards-list {
    @include component();
    @include styled_scrollbar();
    width: 425px;
    height: calc(100% - 20px - $component-padding * 2 - $component-padding * 2);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-top: 20px;
    padding-top: 0;

    .boards-list__header {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      background-color: $component-background-color;

      span {
        font-size: 10px;
        font-weight: bold;
      }
    }

    .board-list__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
      
      a {
        text-decoration: underline;
      }

      &:last-of-type {
        margin-bottom: 0;
      }

      .btn-settings {
        background-color: transparent;
        color: $app-text-color;
        cursor: pointer;
      }
    }

    .no-boards-yet-message, .fetching-boards-message {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: $muted-text-color;

      span {
        margin-top: 10px;
        text-align: center;
      }
    }
  }

  .create-board-dialog {

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .input {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 50px;

      span {
        font-size: 10px;
        font-weight: bold;
      }

      input {
        width: 200px;
        max-width: calc(100% - 10px - 10px);
        margin-top: 5px;
        padding: 10px;
        border-radius: 5px;
        background-color: #F0F0F0;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
      }
    }

    .btn-create-board {
      @include button();
      width: 100%;
      margin-top: 30px;

      svg {
        margin-right: 5px;
      }
    }
  }

  .board-settings-window {

    .content {
      width: 425px;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .controls {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;

      .change-name-input {
        display: flex;
        flex-direction: column;
        margin-top: 50px;

        span {
          font-size: 10px;
          font-weight: bold;
        }

        input {
          width: 200px;
          max-width: calc(100% - 10px - 10px);
          margin-top: 5px;
          padding: 10px;
          border-radius: 5px;
          background-color: #F0F0F0;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
        }
      }

      .btn-update-name {
        @include button();
        @include button_sm();
        width: 100%;
        max-width: 220px;
        margin-top: 10px;

        span {
          margin-left: 5px;
        }
      }
    }

    .btn-close {
      @include button();
      @include button_neutral();
      align-self: center;
      padding-left: 30px;
      padding-right: 30px;
    }
  }

  .btn-logout {
    @include button();
    @include button_outline(neutral);
    @include button_xs();
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>