import type { RouteRecordRaw } from 'vue-router'
import { UserRole } from '@/types/permission'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          requiresAuth: true
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          roles: [UserRole.OWNER]
        }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/department/index.vue'),
        meta: {
          title: '部门管理',
          requiresAuth: true,
          roles: [UserRole.OWNER, UserRole.ADMIN]
        }
      },
      {
        path: 'position',
        name: 'Position',
        component: () => import('@/views/position/index.vue'),
        meta: {
          title: '职位管理',
          requiresAuth: true,
          roles: [UserRole.OWNER, UserRole.ADMIN]
        }
      },
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/member/index.vue'),
        meta: {
          title: '成员管理',
          requiresAuth: true,
          roles: [UserRole.OWNER, UserRole.ADMIN]
        }
      },
      {
        path: 'punishment',
        name: 'Punishment',
        component: () => import('@/views/punishment/index.vue'),
        meta: {
          title: '处罚管理',
          requiresAuth: true,
          roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.VOLUNTEER]
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      requiresAuth: false
    }
  }
]
