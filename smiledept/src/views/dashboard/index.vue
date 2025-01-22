<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>欢迎回来</span>
            </div>
          </template>
          <div class="welcome-info">
            <el-avatar
              :size="64"
              :src="userStore.avatar"
            />
            <h3>{{ userStore.nickname || userStore.username }}</h3>
            <p>{{ roleText }}</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6" v-if="userStore.isOwner || userStore.isAdmin">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>成员统计</span>
            </div>
          </template>
          <div class="stat-info">
            <h2>{{ memberCount }}</h2>
            <p>当前成员数</p>
          </div>
        </el-card>
      </el-col>

      <!-- 其他统计卡片 -->
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { UserRole } from '@/types/permission'

const userStore = useUserStore()
const memberCount = ref(0)

const roleText = computed(() => {
  switch (userStore.role) {
    case UserRole.OWNER:
      return '群主'
    case UserRole.ADMIN:
      return '管理员'
    case UserRole.VOLUNTEER:
      return '志愿者'
    case UserRole.MEMBER:
      return '成员'
    default:
      return '未知'
  }
})

// TODO: 获取统计数据
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .welcome-info {
    text-align: center;

    h3 {
      margin: 10px 0;
      color: #303133;
    }

    p {
      margin: 0;
      color: #909399;
    }
  }

  .stat-info {
    text-align: center;

    h2 {
      margin: 0;
      font-size: 36px;
      color: #409EFF;
    }

    p {
      margin: 10px 0 0;
      color: #909399;
    }
  }
}
</style>
