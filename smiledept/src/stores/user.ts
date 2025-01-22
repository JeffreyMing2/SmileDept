import { defineStore } from 'pinia'
import type { LoginResponse } from '@/types'
import { UserRole } from '@/types/permission'

interface UserState {
  token: string | null
  username: string
  nickname: string
  avatar: string
  role: UserRole
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    username: '',
    nickname: '',
    avatar: '',
    role: UserRole.MEMBER
  }),

  getters: {
    isOwner: (state) => state.role === UserRole.OWNER,
    isAdmin: (state) => state.role === UserRole.ADMIN,
    isVolunteer: (state) => state.role === UserRole.VOLUNTEER,
    isMember: (state) => state.role === UserRole.MEMBER
  },

  actions: {
    setUserInfo(userInfo: LoginResponse & { role: UserRole }) {
      this.token = userInfo.token
      this.username = userInfo.username
      this.nickname = userInfo.nickname
      this.avatar = userInfo.avatar
      this.role = userInfo.role

      localStorage.setItem('token', userInfo.token)
    },

    logout() {
      this.token = null
      this.username = ''
      this.nickname = ''
      this.avatar = ''
      this.role = UserRole.MEMBER

      localStorage.removeItem('token')
    }
  }
})
