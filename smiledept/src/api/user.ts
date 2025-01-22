import request from '@/utils/request'
import type { UserDTO } from '@/types'

export function getUsers() {
  return request<UserDTO[]>({
    url: '/users',
    method: 'get'
  })
}

export function createUser(data: UserDTO) {
  return request<UserDTO>({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(data: UserDTO) {
  return request<UserDTO>({
    url: `/users/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id: number) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export function searchUserList(query: string) {
  return request<UserDTO[]>({
    url: '/users/search',
    method: 'get',
    params: { query }
  })
}
