import request from '@/utils/request'
import type { DepartmentDTO } from '@/types'

export function getDepartments() {
  return request<DepartmentDTO[]>({
    url: '/departments',
    method: 'get'
  })
}

export function createDepartment(data: DepartmentDTO) {
  return request<DepartmentDTO>({
    url: '/departments',
    method: 'post',
    data
  })
}

export function updateDepartment(data: DepartmentDTO) {
  return request<DepartmentDTO>({
    url: `/departments/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteDepartment(id: number) {
  return request({
    url: `/departments/${id}`,
    method: 'delete'
  })
}
