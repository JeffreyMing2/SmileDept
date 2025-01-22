<template>
  <div class="punishment-container">
    <el-card>
      <template #header>
        <div class="header">
          <div class="left">
            <span>处罚管理</span>
            <el-radio-group v-model="currentType" class="ml-4">
              <el-radio-button v-for="type in availableTypes" :key="type.value" :label="type.value">
                {{ type.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <el-button type="primary" @click="handleAdd" v-if="canRegister">
            登记处罚
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="punishmentList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="被处罚人" width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="row.avatar" />
              <div class="user-detail">
                <div>{{ row.nickname || row.username }}</div>
                <div class="text-gray">{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="处罚原因" show-overflow-tooltip />
        <el-table-column prop="punishment" label="处罚内容" show-overflow-tooltip />
        <el-table-column label="处罚期限" width="200">
          <template #default="{ row }">
            <div>{{ formatDate(row.startDate) }}</div>
            <div v-if="row.endDate" class="text-gray">
              至 {{ formatDate(row.endDate) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPunishmentStatusType(row.status)">
              {{ getPunishmentStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="登记人" width="120">
          <template #default="{ row }">
            {{ row.registeredByName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              v-if="canApprove && row.status === 'PENDING'"
              type="success"
              link
              @click="handleApprove(row)"
            >
              审批
            </el-button>
            <el-button
              v-if="canCancel && row.status === 'ACTIVE'"
              type="warning"
              link
              @click="handleCancel(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="canDelete && row.status !== 'ACTIVE'"
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 处罚表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="被处罚人" prop="userId">
          <el-select
            v-model="form.userId"
            class="w-full"
            filterable
            remote
            :remote-method="searchUsers"
            :loading="userSearching"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.nickname || user.username"
              :value="user.id"
            >
              <div class="user-option">
                <el-avatar :size="24" :src="user.avatar" />
                <span>{{ user.nickname || user.username }}</span>
                <span class="text-gray">({{ user.username }})</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处罚原因" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="处罚内容" prop="punishment">
          <el-input
            v-model="form.punishment"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            class="w-full"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            class="w-full"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog
      title="处罚审批"
      v-model="approveDialogVisible"
      width="500px"
    >
      <el-form
        ref="approveFormRef"
        :model="approveForm"
        :rules="approveRules"
        label-width="80px"
      >
        <el-form-item label="审批意见" prop="comment">
          <el-input
            v-model="approveForm.comment"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="success" @click="submitApprove" :loading="approving">
          通过
        </el-button>
        <el-button type="danger" @click="submitReject" :loading="approving">
          拒绝
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { PunishmentDTO, UserDTO } from '@/types'
import { UserRole } from '@/types/permission'
import {
  getPunishments,
  createPunishment,
  approvePunishment,
  rejectPunishment,
  cancelPunishment,
  deletePunishment
} from '@/api/punishment'
import { searchUserList } from '@/api/user'
import { formatDate } from '@/utils/format'

const userStore = useUserStore()
const loading = ref(false)
const punishmentList = ref<PunishmentDTO[]>([])
const userOptions = ref<UserDTO[]>([])
const dialogVisible = ref(false)
const approveDialogVisible = ref(false)
const submitting = ref(false)
const approving = ref(false)
const userSearching = ref(false)
const formRef = ref<FormInstance>()
const approveFormRef = ref<FormInstance>()
const currentType = ref('MEMBER')

const form = ref<Partial<PunishmentDTO>>({
  userId: undefined,
  type: currentType.value,
  reason: '',
  punishment: '',
  startDate: '',
  endDate: ''
})

const approveForm = ref({
  id: undefined as number | undefined,
  comment: ''
})

const rules = {
  userId: [
    { required: true, message: '请选择被处罚人', trigger: 'change' }
  ],
  reason: [
    { required: true, message: '请输入处罚原因', trigger: 'blur' }
  ],
  punishment: [
    { required: true, message: '请输入处罚内容', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ]
}

const approveRules = {
  comment: [
    { required: true, message: '请输入审批意见', trigger: 'blur' }
  ]
}

// 根据用户角色显示可用的处罚类型
const availableTypes = computed(() => {
  const types = []
  if (userStore.isOwner) {
    types.push(
      { label: '管理处罚', value: 'ADMIN' },
      { label: '成员处罚', value: 'MEMBER' },
      { label: '志愿者处罚', value: 'VOLUNTEER' }
    )
  } else if (userStore.isAdmin) {
    types.push(
      { label: '成员处罚', value: 'MEMBER' },
      { label: '志愿者处罚', value: 'VOLUNTEER' }
    )
  } else if (userStore.isVolunteer) {
    types.push({ label: '成员处罚', value: 'MEMBER' })
  }
  return types
})

// 权限控制
const canRegister = computed(() => {
  if (currentType.value === 'ADMIN') return userStore.isOwner
  if (currentType.value === 'VOLUNTEER') return userStore.isOwner || userStore.isAdmin
  return userStore.isOwner || userStore.isAdmin || userStore.isVolunteer
})

const canApprove = computed(() => {
  if (currentType.value === 'ADMIN') return userStore.isOwner
  if (currentType.value === 'VOLUNTEER') return userStore.isOwner
  return userStore.isOwner || userStore.isAdmin
})

const canCancel = computed(() => {
  if (currentType.value === 'ADMIN') return userStore.isOwner
  if (currentType.value === 'VOLUNTEER') return userStore.isOwner
  return userStore.isOwner || userStore.isAdmin
})

const canDelete = computed(() => {
  if (currentType.value === 'ADMIN') return userStore.isOwner
  if (currentType.value === 'VOLUNTEER') return userStore.isOwner
  return userStore.isOwner || userStore.isAdmin
})

const dialogTitle = computed(() => '登记处罚')

// 处罚状态处理
function getPunishmentStatusType(status: string) {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'ACTIVE':
      return 'danger'
    case 'COMPLETED':
      return 'success'
    case 'CANCELLED':
      return 'info'
    case 'REJECTED':
      return 'info'
    default:
      return 'info'
  }
}

function getPunishmentStatusText(status: string) {
  switch (status) {
    case 'PENDING':
      return '待审批'
    case 'ACTIVE':
      return '生效中'
    case 'COMPLETED':
      return '已完成'
    case 'CANCELLED':
      return '已取消'
    case 'REJECTED':
      return '已拒绝'
    default:
      return '未知'
  }
}

// 表单处理
function resetForm() {
  form.value = {
    userId: undefined,
    type: currentType.value,
    reason: '',
    punishment: '',
    startDate: '',
    endDate: ''
  }
  formRef.value?.resetFields()
}

function handleAdd() {
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    await createPunishment({
      ...form.value,
      type: currentType.value
    } as PunishmentDTO)

    ElMessage.success('登记成功')
    dialogVisible.value = false
    fetchPunishments()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 审批处理
function handleApprove(row: PunishmentDTO) {
  approveForm.value.id = row.id
  approveForm.value.comment = ''
  approveDialogVisible.value = true
}

async function submitApprove() {
  if (!approveFormRef.value) return

  try {
    await approveFormRef.value.validate()
    approving.value = true

    await approvePunishment(approveForm.value.id!, approveForm.value.comment)
    ElMessage.success('审批通过')
    approveDialogVisible.value = false
    fetchPunishments()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    approving.value = false
  }
}

async function submitReject() {
  if (!approveFormRef.value) return

  try {
    await approveFormRef.value.validate()
    approving.value = true

    await rejectPunishment(approveForm.value.id!, approveForm.value.comment)
    ElMessage.success('已拒绝')
    approveDialogVisible.value = false
    fetchPunishments()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    approving.value = false
  }
}

async function handleCancel(row: PunishmentDTO) {
  try {
    await ElMessageBox.confirm('确定要取消该处罚吗？', '提示', {
      type: 'warning'
    })
    await cancelPunishment(row.id!)
    ElMessage.success('取消成功')
    fetchPunishments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

async function handleDelete(row: PunishmentDTO) {
  try {
    await ElMessageBox.confirm('确定要删除该处罚记录吗？', '提示', {
      type: 'warning'
    })
    await deletePunishment(row.id!)
    ElMessage.success('删除成功')
    fetchPunishments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// API调用
async function searchUsers(query: string) {
  if (query.length < 2) return

  try {
    userSearching.value = true
    userOptions.value = await searchUserList(query)
  } catch (error: any) {
    ElMessage.error(error.message || '搜索用户失败')
  } finally {
    userSearching.value = false
  }
}

async function fetchPunishments() {
  try {
    loading.value = true
    punishmentList.value = await getPunishments(currentType.value)
  } catch (error: any) {
    ElMessage.error(error.message || '获取处罚列表失败')
  } finally {
    loading.value = false
  }
}

// 监听处罚类型变化
watch(currentType, () => {
  fetchPunishments()
})

onMounted(() => {
  fetchPunishments()
})
</script>

<style lang="scss" scoped>
.punishment-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .user-detail {
      .text-gray {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .user-option {
    display: flex;
    align-items: center;
    gap: 8px;

    .text-gray {
      font-size: 12px;
      color: #909399;
    }
  }

  .w-full {
    width: 100%;
  }

  .text-gray {
    color: #909399;
  }

  .ml-4 {
    margin-left: 16px;
  }
}
</style>
