import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRole } from '@/types/permission'
import type { LoginRequest, LoginResponse } from '@/types'
import { login as loginApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const username = ref('')
  const nickname = ref('')
  const avatar = ref('')
  const role = ref<UserRole | ''>('')

  const isLoggedIn = computed(() => !!token.value)
  const isOwner = computed(() => role.value === 'OWNER')
  const isAdmin = computed(() => role.value === 'ADMIN')
  const isVolunteer = computed(() => role.value === 'VOLUNTEER')
  const isMember = computed(() => role.value === 'MEMBER')

  async function login(loginForm: LoginRequest) {
    const response = await loginApi(loginForm)
    setUserInfo(response)
    return response
  }

  function setUserInfo(data: LoginResponse) {
    token.value = data.token
    username.value = data.username
    nickname.value = data.nickname
    avatar.value = data.avatar
    role.value = data.role
    localStorage.setItem('token', data.token)
  }

  function logout() {
    token.value = ''
    username.value = ''
    nickname.value = ''
    avatar.value = ''
    role.value = ''
    localStorage.removeItem('token')
  }

  return {
    token,
    username,
    nickname,
    avatar,
    role,
    isLoggedIn,
    isOwner,
    isAdmin,
    isVolunteer,
    isMember,
    login,
    setUserInfo,
    logout
  }
})
