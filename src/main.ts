// src/main.ts

import './assets/main.css' // Garante que nosso tema escuro seja carregado

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importações da biblioteca de notificação
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(Toast) // Dizendo ao Vue para usar a biblioteca de notificação

app.mount('#app')
