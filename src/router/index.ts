// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MangaDetailView from '../views/MangaDetailView.vue'
import LoginView from '../views/LoginView.vue'
import { getUsuarioAtual } from '@/firebase/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/manga/:id',
      name: 'manga-detail',
      component: MangaDetailView,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const usuario = await getUsuarioAtual();

  if (requiresAuth && !usuario) {
    next('/login');
  } else if (to.path === '/login' && usuario) {
    next('/');
  } else {
    next();
  }
});

export default router
