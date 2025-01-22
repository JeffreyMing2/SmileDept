import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
  const userStore = useUserStore()
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`
  }

  // 访问根路径时重定向到 /dashboard
  if (to.path === '/') {
    next('/dashboard')
    return
  }

  // 不需要登录的页面
  if (!to.meta.requiresAuth) {
    if (to.path === '/login' && userStore.isLoggedIn) {
      next('/')
    } else {
      next()
    }
    return
  }

  // 需要登录但未登录
  if (!userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 需要特定角色
  const roles = to.meta.roles as string[] | undefined
  if (roles && !roles.includes(userStore.role)) {
    next('/404')
    return
  }

  next()
})

export default router
