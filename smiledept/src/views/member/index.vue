<template>
  <div class="member-container">
    <el-card>
      <template #header>
        <div class="header">
          <span>成员管理</span>
          <el-button type="primary" @click="handleAdd">
            新增成员
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="memberList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" width="200">
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
        <el-table-column prop="departmentName" label="所属部门" />
        <el-table-column prop="positionName" label="职位" />
        <el-table-column prop="joinDate" label="加入日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.joinDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'info'">
              {{ row.status === 'ACTIVE' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              type="warning"
              link
              v-if="row.status === 'ACTIVE'"
              @click="handleLeave(row)"
            >
              离职
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 成员表单对话框 -->
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
        <el-form-item label="用户" prop="userId">
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
        <el-form-item label="部门" prop="departmentId">
          <el-select
            v-model="form.departmentId"
            class="w-full"
            @change="handleDepartmentChange"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="positionId">
          <el-select
            v-model="form.positionId"
            class="w-full"
            :disabled="!form.departmentId"
          >
            <el-option
              v-for="pos in positionList"
              :key="pos.id"
              :label="pos.name"
              :value="pos.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="加入日期" prop="joinDate">
          <el-date-picker
            v-model="form.joinDate"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { MemberDTO, UserDTO, DepartmentDTO, PositionDTO } from '@/types'
import { getMembers, createMember, updateMember, leaveMember } from '@/api/member'
import { searchUserList } from '@/api/user'
import { getDepartments } from '@/api/department'
import { getPositionsByDepartment } from '@/api/position'
import { formatDate } from '@/utils/format'

const loading = ref(false)
const memberList = ref<MemberDTO[]>([])
const departmentList = ref<DepartmentDTO[]>([])
const positionList = ref<PositionDTO[]>([])
const userOptions = ref<UserDTO[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)
const userSearching = ref(false)
const formRef = ref<FormInstance>()

const form = ref<Partial<MemberDTO>>({
  userId: undefined,
  departmentId: undefined,
  positionId: undefined,
  joinDate: ''
})

const rules = {
  userId: [
    { required: true, message: '请选择用户', trigger: 'change' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  positionId: [
    { required: true, message: '请选择职位', trigger: 'change' }
  ],
  joinDate: [
    { required: true, message: '请选择加入日期', trigger: 'change' }
  ]
}

const dialogTitle = computed(() => form.value.id ? '编辑成员' : '新增成员')

function resetForm() {
  form.value = {
    userId: undefined,
    departmentId: undefined,
    positionId: undefined,
    joinDate: ''
  }
  positionList.value = []
  formRef.value?.resetFields()
}

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

async function handleDepartmentChange(departmentId: number) {
  form.value.positionId = undefined
  if (!departmentId) return

  try {
    positionList.value = await getPositionsByDepartment(departmentId)
  } catch (error: any) {
    ElMessage.error(error.message || '获取职位列表失败')
  }
}

function handleAdd() {
  dialogVisible.value = true
}

function handleEdit(row: MemberDTO) {
  form.value = { ...row }
  handleDepartmentChange(row.departmentId)
  dialogVisible.value = true
}

async function handleLeave(row: MemberDTO) {
  try {
    await ElMessageBox.confirm('确定要将该成员设置为离职吗？', '提示', {
      type: 'warning'
    })
    await leaveMember(row.id!)
    ElMessage.success('操作成功')
    fetchMembers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (form.value.id) {
      await updateMember(form.value as MemberDTO)
      ElMessage.success('更新成功')
    } else {
      await createMember(form.value as MemberDTO)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchMembers()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

async function fetchMembers() {
  try {
    loading.value = true
    memberList.value = await getMembers()
  } catch (error: any) {
    ElMessage.error(error.message || '获取成员列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchDepartments() {
  try {
    departmentList.value = await getDepartments()
  } catch (error: any) {
    ElMessage.error(error.message || '获取部门列表失败')
  }
}

onMounted(() => {
  fetchMembers()
  fetchDepartments()
})
</script>

<style lang="scss" scoped>
.member-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
}
</style>
