import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = value.includes(userStore.role)
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('需要指定角色权限，例如 v-permission="[\'ADMIN\']"')
    }
  }
}
