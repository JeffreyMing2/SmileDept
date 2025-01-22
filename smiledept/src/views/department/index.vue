<template>
  <div class="department-container">
    <el-card>
      <template #header>
        <div class="header">
          <span>部门管理</span>
          <el-button type="primary" @click="handleAdd">
            新增部门
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="departmentList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 部门表单对话框 -->
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
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
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
import type { DepartmentDTO } from '@/types'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/api/department'
import { formatDateTime } from '@/utils/format'

const loading = ref(false)
const departmentList = ref<DepartmentDTO[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = ref<Partial<DepartmentDTO>>({
  name: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => form.value.id ? '编辑部门' : '新增部门')

function resetForm() {
  form.value = {
    name: '',
    description: ''
  }
  formRef.value?.resetFields()
}

function handleAdd() {
  dialogVisible.value = true
}

function handleEdit(row: DepartmentDTO) {
  form.value = { ...row }
  dialogVisible.value = true
}

async function handleDelete(row: DepartmentDTO) {
  try {
    await ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
      type: 'warning'
    })
    await deleteDepartment(row.id!)
    ElMessage.success('删除成功')
    fetchDepartments()
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
      await updateDepartment(form.value as DepartmentDTO)
      ElMessage.success('更新成功')
    } else {
      await createDepartment(form.value as DepartmentDTO)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchDepartments()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

async function fetchDepartments() {
  try {
    loading.value = true
    departmentList.value = await getDepartments()
  } catch (error: any) {
    ElMessage.error(error.message || '获取部门列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDepartments()
})
</script>

<style lang="scss" scoped>
.department-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
