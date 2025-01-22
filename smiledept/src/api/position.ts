import request from '@/utils/request'
import type { PositionDTO } from '@/types'

export function getPositions() {
  return request<PositionDTO[]>({
    url: '/positions',
    method: 'get'
  })
}

export function createPosition(data: PositionDTO) {
  return request<PositionDTO>({
    url: '/positions',
    method: 'post',
    data
  })
}

export function updatePosition(data: PositionDTO) {
  return request<PositionDTO>({
    url: `/positions/${data.id}`,
    method: 'put',
    data
  })
}

export function deletePosition(id: number) {
  return request({
    url: `/positions/${id}`,
    method: 'delete'
  })
}

export function getPositionsByDepartment(departmentId: number) {
  return request<PositionDTO[]>({
    url: `/positions/department/${departmentId}`,
    method: 'get'
  })
}
