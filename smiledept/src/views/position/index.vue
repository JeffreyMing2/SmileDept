<template>
  <div class="position-container">
    <el-card>
      <template #header>
        <div class="header">
          <span>职位管理</span>
          <el-button type="primary" @click="handleAdd">
            新增职位
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="positionList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="职位名称" />
        <el-table-column prop="departmentName" label="所属部门" />
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

    <!-- 职位表单对话框 -->
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
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="form.departmentId" class="w-full">
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
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
import type { PositionDTO, DepartmentDTO } from '@/types'
import { getPositions, createPosition, updatePosition, deletePosition } from '@/api/position'
import { getDepartments } from '@/api/department'
import { formatDateTime } from '@/utils/format'

const loading = ref(false)
const positionList = ref<PositionDTO[]>([])
const departmentList = ref<DepartmentDTO[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = ref<Partial<PositionDTO>>({
  name: '',
  departmentId: undefined,
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入职位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ]
}

const dialogTitle = computed(() => form.value.id ? '编辑职位' : '新增职位')

function resetForm() {
  form.value = {
    name: '',
    departmentId: undefined,
    description: ''
  }
  formRef.value?.resetFields()
}

function handleAdd() {
  dialogVisible.value = true
}

function handleEdit(row: PositionDTO) {
  form.value = { ...row }
  dialogVisible.value = true
}

async function handleDelete(row: PositionDTO) {
  try {
    await ElMessageBox.confirm('确定要删除该职位吗？', '提示', {
      type: 'warning'
    })
    await deletePosition(row.id!)
    ElMessage.success('删除成功')
    fetchPositions()
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
      await updatePosition(form.value as PositionDTO)
      ElMessage.success('更新成功')
    } else {
      await createPosition(form.value as PositionDTO)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchPositions()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

async function fetchPositions() {
  try {
    loading.value = true
    positionList.value = await getPositions()
  } catch (error: any) {
    ElMessage.error(error.message || '获取职位列表失败')
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
  fetchPositions()
  fetchDepartments()
})
</script>

<style lang="scss" scoped>
.position-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .w-full {
    width: 100%;
  }
}
</style>
