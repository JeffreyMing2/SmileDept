<template>
  <el-scrollbar
    ref="scrollbarRef"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ElScrollbar } from 'element-plus'

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

function handleScroll(e: WheelEvent) {
  const eventDelta = e.deltaY
  const wrap = scrollbarRef.value?.wrapRef
  if (wrap) {
    wrap.scrollLeft += eventDelta / 4
  }
}

defineExpose({
  scrollbarRef
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }

  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
