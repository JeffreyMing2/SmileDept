import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)

  // 全局加载状态
  const loading = ref(false)

  // 系统主题
  const theme = ref(localStorage.getItem('theme') || 'light')

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setTheme(value: 'light' | 'dark') {
    theme.value = value
    localStorage.setItem('theme', value)
    // 应用主题样式
    document.documentElement.setAttribute('data-theme', value)
  }

  return {
    sidebarCollapsed,
    loading,
    theme,
    toggleSidebar,
    setLoading,
    setTheme
  }
})
