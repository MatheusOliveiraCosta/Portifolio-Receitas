import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PainelView from '../views/PainelView.vue'
import AdminView from '../views/AdminView.vue'
import FeedView from '../views/FeedView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView 
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView 
    },
    {
      path: '/painel',
      name: 'painel',
      component: PainelView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView 
    },

    {
    path: '/feed',
    name: 'feed',
    component: FeedView,
    // Se quiser que só alunos logados vejam, deixe o meta auth:
    meta: { requiresAuth: true } 
    }

  ]
})

export default router