import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import request from '../request'
import { useLoginStore } from './login';

export const useDashboardStore = defineStore('dashboard', () => {
  const boards = ref([]);
  const fetchingBoards = ref(false);
  async function fetchBoards() {
    let resolveFn, rejectFn;
    const promise = new Promise((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    const loginStore = useLoginStore();
    fetchingBoards.value = true;
    request.get(`api/boards?key=${loginStore.key}`).then((response) => {
      if (response.data.constructor === Array) {
        boards.value = response.data;
        fetchingBoards.value = false;
      }

      resolveFn();
    }).catch((err) => {
      rejectFn(err);
    });

    return promise;
  }

  return { boards, fetchBoards, fetchingBoards }
})
