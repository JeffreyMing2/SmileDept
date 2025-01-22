<template>
  <div class="error-page">
    <div class="error-code">404</div>
    <div class="error-desc">抱歉，您访问的页面不存在</div>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: var(--el-color-primary);
  }

  .error-desc {
    font-size: 24px;
    color: var(--el-text-color-primary);
    margin: 24px 0;
  }
}
</style>
