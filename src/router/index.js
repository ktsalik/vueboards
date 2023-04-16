import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import BoardView from '../views/BoardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/boards/:boardId',
      name: 'board',
      component: BoardView,
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'default',
    //   component: DashboardView,
    // },
  ],
});

export default router
