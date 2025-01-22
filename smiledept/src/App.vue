<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const appStore = useAppStore()

onMounted(() => {
  // 应用主题
  document.documentElement.setAttribute('data-theme', appStore.theme)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>
