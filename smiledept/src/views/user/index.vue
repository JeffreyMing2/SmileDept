<template>
  <div class="user-container">
    <el-card>
      <template #header>
        <div class="header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">
            新增用户
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.role !== UserRole.OWNER"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.role !== UserRole.OWNER"
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

    <!-- 用户表单对话框 -->
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" class="w-full">
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
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
import { UserRole } from '@/types/permission'
import type { UserDTO } from '@/types'
import { useUserStore } from '@/stores/user'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/user'

const loading = ref(false)
const userList = ref<UserDTO[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = ref<Partial<UserDTO>>({
  username: '',
  password: '',
  nickname: '',
  role: UserRole.MEMBER
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const roleOptions = [
  { label: '管理员', value: UserRole.ADMIN },
  { label: '志愿者', value: UserRole.VOLUNTEER },
  { label: '成员', value: UserRole.MEMBER }
]

const dialogTitle = computed(() => form.value.id ? '编辑用户' : '新增用户')

function getRoleType(role: UserRole) {
  switch (role) {
    case UserRole.OWNER:
      return 'danger'
    case UserRole.ADMIN:
      return 'warning'
    case UserRole.VOLUNTEER:
      return 'success'
    default:
      return 'info'
  }
}

function getRoleText(role: UserRole) {
  switch (role) {
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
}

function resetForm() {
  form.value = {
    username: '',
    password: '',
    nickname: '',
    role: UserRole.MEMBER
  }
  formRef.value?.resetFields()
}

function handleAdd() {
  dialogVisible.value = true
}

function handleEdit(row: UserDTO) {
  form.value = { ...row }
  dialogVisible.value = true
}

async function handleDelete(row: UserDTO) {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    })
    await deleteUser(row.id!)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (form.value.id) {
      await updateUser(form.value as UserDTO)
      ElMessage.success('更新成功')
    } else {
      await createUser(form.value as UserDTO)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchUsers()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

async function fetchUsers() {
  try {
    loading.value = true
    userList.value = await getUsers()
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped>
.user-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-tag) {
    text-transform: capitalize;
  }

  .w-full {
    width: 100%;
  }
}
</style>
