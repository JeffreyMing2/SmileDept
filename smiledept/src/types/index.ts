import type { UserRole } from './permission'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  nickname: string
  avatar: string
  role: UserRole
}

export interface UserDTO {
  id?: number
  username: string
  password?: string
  nickname: string
  avatar?: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export interface DepartmentDTO {
  id?: number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface PositionDTO {
  id?: number
  name: string
  departmentId: number
  departmentName?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface MemberDTO {
  id?: number
  userId: number
  username?: string
  nickname?: string
  departmentId: number
  departmentName?: string
  positionId: number
  positionName?: string
  joinDate: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface PunishmentDTO {
  id?: number
  userId: number
  username?: string
  nickname?: string
  type: string
  reason: string
  punishment: string
  startDate: string
  endDate?: string
  status: string
  registeredById: number
  registeredByName?: string
  approvedById?: number
  approvedByName?: string
  approvedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
