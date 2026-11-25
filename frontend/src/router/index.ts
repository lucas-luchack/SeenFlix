import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import SearchView from '../views/SearchView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import ProfileView from '../views/ProfileView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** Page réservée aux utilisateurs connectés (redirection vers /login) */
    requiresAuth?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/login',
    name: 'login',
    component: AuthView,
    props: { mode: 'login' },
  },
  {
    path: '/register',
    name: 'register',
    component: AuthView,
    props: { mode: 'register' },
  },
  { path: '/search', name: 'search', component: SearchView },
  {
    path: '/:type(movie|tv)/:id(\\d+)',
    name: 'detail',
    component: MovieDetailView,
    props: (route) => ({ type: route.params.type, id: Number(route.params.id) }),
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
