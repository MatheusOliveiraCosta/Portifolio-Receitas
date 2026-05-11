import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PainelView from '../views/PainelView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // A raiz do site agora é a vitrine!
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView // O login foi para /login
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
    }

  ]
})

export default router