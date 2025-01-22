<template>
  <div class="app-wrapper" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="sidebar-container">
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo">
        <span v-show="!appStore.sidebarCollapsed">浅笑管理部</span>
      </div>
      <el-scrollbar>
        <sidebar-menu />
      </el-scrollbar>
    </div>

    <div class="main-container">
      <navbar />
      <tags-view />
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import SidebarMenu from './components/SidebarMenu.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView.vue'
import AppMain from './components/AppMain.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;

  .sidebar-container {
    width: 210px;
    height: 100%;
    background-color: var(--el-menu-bg-color);
    transition: width 0.3s;
    overflow: hidden;

    .logo {
      height: 50px;
      padding: 10px;
      display: flex;
      align-items: center;
      background: var(--el-menu-bg-color);
      overflow: hidden;

      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }

      span {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-menu-text-color);
        white-space: nowrap;
      }
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &.collapsed {
    .sidebar-container {
      width: 64px;
    }
  }
}
</style>
