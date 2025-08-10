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
      // A correção garante que este caminho esteja 100% correto
      path: '/manga/:id',
      name: 'manga-detail',
      component: MangaDetailView,
      props: true
    }
  ]
})

export default router
