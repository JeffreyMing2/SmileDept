import request from '@/utils/request'
import type { MemberDTO } from '@/types'

export function getMembers() {
  return request<MemberDTO[]>({
    url: '/members',
    method: 'get'
  })
}

export function createMember(data: MemberDTO) {
  return request<MemberDTO>({
    url: '/members',
    method: 'post',
    data
  })
}

export function updateMember(data: MemberDTO) {
  return request<MemberDTO>({
    url: `/members/${data.id}`,
    method: 'put',
    data
  })
}

export function leaveMember(id: number) {
  return request({
    url: `/members/${id}/leave`,
    method: 'put'
  })
}

export function getMembersByDepartment(departmentId: number) {
  return request<MemberDTO[]>({
    url: `/members/department/${departmentId}`,
    method: 'get'
  })
}
