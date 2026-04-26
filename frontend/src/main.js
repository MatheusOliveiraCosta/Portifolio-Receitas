import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importamos o arquivo que acabamos de criar

const app = createApp(App)

app.use(router) // Conectamos o roteador ao Vue

app.mount('#app')
