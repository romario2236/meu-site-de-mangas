// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MangaDetailView from '../views/MangaDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // AQUI ESTÁ A CORREÇÃO: Garantindo que o caminho seja exatamente este.
      path: '/manga/:id',
      name: 'manga-detail',
      component: MangaDetailView,
      props: true
    }
  ]
})

export default router
