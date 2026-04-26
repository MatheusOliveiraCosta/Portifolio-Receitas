import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PainelView from '../views/PainelView.vue' // <-- Adicionado

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/painel',
      name: 'painel',
      component: PainelView // <-- Adicionado
    }
  ]
})

export default router