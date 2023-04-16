<script setup>
import { defineProps, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import request from '../request';
import { useLoginStore } from '../stores/login';

const loginStore = useLoginStore();

const route = useRoute();

const props = defineProps({

});

const { } = toRefs(props);

const state = reactive({
  boardId: route.params.boardId,
  board: null,
});

request.get(`api/boards/${state.boardId}?key=${loginStore.key}`).then((response) => {
  state.board = response.data;
});

</script>

<template>
  Board {{ state.boardId }}
  <br />
  {{ state.board }}
</template>