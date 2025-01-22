import request from '@/utils/request'
import type { PunishmentDTO } from '@/types'

export function getPunishments(type: string) {
  return request<PunishmentDTO[]>({
    url: '/punishments',
    method: 'get',
    params: { type }
  })
}

export function createPunishment(data: PunishmentDTO) {
  return request<PunishmentDTO>({
    url: '/punishments',
    method: 'post',
    data
  })
}

export function approvePunishment(id: number, comment: string) {
  return request({
    url: `/punishments/${id}/approve`,
    method: 'put',
    data: { comment }
  })
}

export function rejectPunishment(id: number, comment: string) {
  return request({
    url: `/punishments/${id}/reject`,
    method: 'put',
    data: { comment }
  })
}

export function cancelPunishment(id: number) {
  return request({
    url: `/punishments/${id}/cancel`,
    method: 'put'
  })
}

export function deletePunishment(id: number) {
  return request({
    url: `/punishments/${id}`,
    method: 'delete'
  })
}
