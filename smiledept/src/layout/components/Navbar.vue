<template>
  <div class="navbar">
    <div class="left">
      <el-icon class="hamburger" @click="appStore.toggleSidebar">
        <Fold v-if="appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <breadcrumb />
    </div>

    <div class="right">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-container">
          <el-avatar :size="32" :src="userStore.avatar" />
          <span class="name">{{ userStore.nickname || userStore.username }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="theme">
              <el-icon><Moon /></el-icon>
              <span>{{ appStore.theme === 'dark' ? '浅色模式' : '深色模式' }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Fold, Expand, CaretBottom, Moon, SwitchButton } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

async function handleCommand(command: string) {
  if (command === 'theme') {
    appStore.setTheme(appStore.theme === 'dark' ? 'light' : 'dark')
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      userStore.logout()
      router.push('/login')
    } catch {
      // 用户取消操作
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);

  .left {
    display: flex;
    align-items: center;

    .hamburger {
      padding: 0 12px;
      cursor: pointer;
      font-size: 20px;
      color: var(--el-text-color-regular);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .right {
    .avatar-container {
      display: flex;
      align-items: center;
      padding: 0 8px;
      cursor: pointer;

      .name {
        margin: 0 8px;
        color: var(--el-text-color-regular);
      }

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }
  }
}
</style>
