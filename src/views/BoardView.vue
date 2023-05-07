<script setup>
import { reactive, ref, nextTick, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import request from '../request';
import { useLoginStore } from '../stores/login';
import ContextMenu from '../components/ContextMenu.vue';
import StoryCard from '../components/StoryCard.vue';
import initializeStoryCardDrag from '../StoryCardDrag';

const loginStore = useLoginStore();
const route = useRoute();

const state = reactive({
  boardId: route.params.boardId,
  board: null,
  addingNewColumn: false,
});

const element = ref(null);

const getBoard = () => {
  request.get(`api/boards/${state.boardId}?key=${loginStore.key}`).then((response) => {
    state.board = response.data.data;
  });
};

const addColumn = () => {
  if (!state.addingNewColumn) {
    state.addingNewColumn = true;

    state.board.columns.push({
      name: '',
      editingName: true,
    });
  }

  nextTick(() => {
    element.value.querySelector('.new-column-name-input').focus();
  });
};

const saveColumn = () => {
  const columnToSave = state.board.columns.find((c) => c.editingName);

  if (columnToSave.id) {
    request.post(`api/boards/${state.board.id}/columns/${columnToSave.id}/update`, {
      name: columnToSave.name,
      key: loginStore.key,
    }).then((response) => {
      columnToSave.editingName = false;
    });
  } else {
    request.post(`api/boards/${state.board.id}/columns/add`, {
      name: columnToSave.name,
      key: loginStore.key,
    }).then((response) => {
      columnToSave.id = response.data.data.newColumnId;
      columnToSave.stories = [];
      columnToSave.editingName = false;
      state.addingNewColumn = false;
    });
  }
};

const onColumnSettingsClick = (e, column) => {
  if (e.target.classList.contains('btn-settings') || (e.target.tagName === 'svg' && e.target.parentNode.classList.contains('btn-settings')) || (e.target.tagName === 'path' && e.target.parentNode.tagName === 'svg' && e.target.parentNode.parentNode.classList.contains('btn-settings'))) {
    column.showSettingsMenu = !column.showSettingsMenu;
  }
};

const onEditColumnName = (column) => {
  column.editingName = true;
  column.showSettingsMenu = false;
  
  nextTick(() => {
    element.value.querySelector('[id="column-' + column.id + '"] .input-name').select();
  });
};

const removeColumn = (columnId) => {
  request.post(`api/boards/${state.board.id}/columns/${columnId}/delete`, {
    key: loginStore.key,
  }).then((response) => {
    if (response.data.status === 'ok') {
      state.board.columns.splice(state.board.columns.findIndex((c) => c.id === columnId), 1);
    }
  });
};

const addNewStory = (column) => {
  column.stories.push({
    name: '',
    isNewStory: true,
  });
};

const onStoryCancel = (column, index) => {
  column.stories.splice(index, 1);
};

const onStorySave = (column, index) => {
  const story = column.stories[index];

  if (story.id) {
    request.post(`api/boards/${state.board.id}/columns/${column.id}/stories/${story.id}/update`, {
      name: story.name,
      type: story.type,
      points: story.points,
      state: story.state,
      description: story.description,
      key: loginStore.key,
    }).then((response) => {

    });
  } else {
    request.post(`api/boards/${state.board.id}/columns/${column.id}/stories/add`, {
      name: story.name,
      type: story.type,
      points: story.points,
      state: story.state,
      description: story.description,
      key: loginStore.key,
    }).then((response) => {
      if (response.data.status === 'ok') {
        column.stories[index] = {
          ...response.data.data.story,
        };
      }
    });
  }
};

const onStorySaveDescription = (column, index) => {
  const story = column.stories[index];

  request.post(`api/boards/${state.board.id}/columns/${column.id}/stories/${story.id}/update`, {
    description: story.description,
    key: loginStore.key,
  }).then((response) => {
    
  });
};

const { onStoryCardMouseDown, onWindowMouseMove, onWindowMouseUp } = initializeStoryCardDrag(element, (change) => {
  request.post(`api/boards/${state.board.id}/columns/${change.fromColumnId}/stories/${change.storyId}/move/${change.toColumnId}`, {
    position: change.position,
    key: loginStore.key,
  }).then((response) => {
    getBoard();
  });
});

onMounted(() => {
  window.addEventListener('mousemove', onWindowMouseMove);
  window.addEventListener('mouseup', onWindowMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onWindowMouseMove);
  window.removeEventListener('mouseup', onWindowMouseUp);
});

getBoard();
</script>

<template>
  <div class="Board"
    v-if="state.board"
    ref="element"
  >
    <div
      class="left"
      :class="{ 'no-columns': state.board.columns.length === 0 }"
    >
      <div class="board-name">{{ state.board.name }}</div>

      <div class="menu">
        
        <button
          class="btn-add-column"
          @click="addColumn"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          <span>Add Column</span>
        </button>
      </div>
    </div>

    <div v-for="(column, index) in state.board.columns" class="column" :id="'column-' + column.id">
      <div class="header">
        <input
          v-if="column.editingName"
          type="text"
          class="input-name"
          :class="{ 'new-column-name-input': !column.id }"
          v-model="column.name"
          @keyup.enter="saveColumn"
          placeholder="Column Name"
        />

        <span v-if="!column.editingName" class="name">{{ column.name }}</span>

        <div>
          <button
            v-if="column.id && !column.editingName"
            class="btn-add-story"
            @click="addNewStory(column)"
          >
            <font-awesome-icon icon="fa-plus" />
            <span>Add Story</span>
          </button>

          <button
            v-if="column.id && !column.editingName"
            class="btn-settings"
            @click="onColumnSettingsClick($event, column)"
          >
            <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" size="lg" />

            <ContextMenu
              :open="column.showSettingsMenu"
              @close="column.showSettingsMenu = false"
            >
              <div class="column-settings-options">
                <button
                  @click="onEditColumnName(column)"
                >
                  Change Name
                </button>
                <button
                  @click="removeColumn(column.id)"  
                >
                  Delete
                </button>
              </div>
            </ContextMenu>
          </button>
        </div>
      </div>

      <div class="stories-list">
        <StoryCard v-for="(story, index) in column.stories"
          :key="story.id"
          :id="'story-' + story.id"
          :data="story"
          @save="onStorySave(column, index)"
          @saveDescription="onStorySaveDescription(column, index)"
          @cancel="onStoryCancel(column, index)"
          @mousedown="$event => onStoryCardMouseDown($event, column, index)"
        ></StoryCard>
      </div>
    </div>
  </div>
  <!-- {{ state.board }} -->
</template>

<style lang="scss">
@import '../assets/variables.scss';

.Board {
  @include styled_scrollbar();
  max-width: calc(100% - $component-padding - $component-padding);
  height: calc(100% - $component-padding);
  display: flex;
  overflow-x: auto;
  padding: $component-padding;
  padding-top: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  .left {
    max-width: 300px;
    display: flex;
    flex-direction: column;

    .board-name {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: calc($component-padding / 2);
      border-radius: $component-border-radius;
      background-color: $component-background-color;
      box-shadow: $component-box-shadow;
      font-size: 18px;
      font-weight: bold;
    }

    .menu {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      padding: calc($component-padding / 2);
      border-radius: $component-border-radius;
      background-color: $component-background-color;
      box-shadow: $component-box-shadow;

      .btn-add-column {
        display: flex;
        align-items: center;
        cursor: pointer;

        span {
          margin-left: 5px;
          white-space: nowrap;
        }
      }
    }
  }

  .column {
    @include component();
    @include styled_scrollbar();
    min-width: 300px;
    max-width: 300px;
    height: calc(100% - $component-padding);
    overflow-y: auto;
    margin-left: 20px;
    padding-top: 0;

    .header {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: calc($component-padding / 2);
      padding-bottom: calc($component-padding / 2);
      background-color: $component-background-color;
      z-index: 10;

      .input-name {
        width: calc(100% - 10px - 10px);
        padding: 10px;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
      }

      .name {
        max-width: 80px;
        overflow-x: hidden;
        font-weight: bold;
      }

      .btn-add-story {
        @include button();
        @include button_outline();
        @include button_xs();

        span {
          margin-left: 5px;
        }
      }

      .btn-settings {
        margin-left: 10px;
        padding: 0 7px;

        .ContextMenu {
          cursor: default;

          .column-settings-options {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            button {
              margin: 5px 0;
              white-space: nowrap;
            }
          }
        }
      }
    }

    .stories-list {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      padding-left: 5px;
      padding-right: 5px;
      z-index: 5;

      .Story {
        margin: 8px 0;
      }
    }
  }
}

@media screen and (max-width: 425px) {
  .Board {

    .left {
      display: none;

      &.no-columns {
        display: flex;
      }
    }

    .column {
      min-width: max(calc(100% - $component-padding - $component-padding), 200px);
      margin: unset;

      &:not(:nth-child(2)) {
      margin-left: $component-padding;
    }
    }
  }
}
</style>
