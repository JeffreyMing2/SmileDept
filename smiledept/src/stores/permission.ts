import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from './user'
import { routes } from '@/router/routes'

export const usePermissionStore = defineStore('permission', () => {
  const userStore = useUserStore()
  const routes = ref<RouteRecordRaw[]>([])

  // 根据用户角色过滤路由
  const filterRoutes = computed(() => {
    const accessedRoutes = routes.value.filter(route => {
      if (route.meta?.roles) {
        return route.meta.roles.includes(userStore.role)
      }
      return true
    })
    return accessedRoutes
  })

  // 生成菜单
  const menus = computed(() => {
    return filterRoutes.value.filter(route => {
      return route.path !== '/login' && route.path !== '/404'
    })
  })

  function generateRoutes() {
    routes.value = routes
    return filterRoutes.value
  }

  return {
    routes,
    filterRoutes,
    menus,
    generateRoutes
  }
})
