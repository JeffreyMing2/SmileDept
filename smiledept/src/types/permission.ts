export enum UserRole {
  OWNER = 'OWNER',      // 群主
  ADMIN = 'ADMIN',      // 管理员
  VOLUNTEER = 'VOLUNTEER', // 志愿者
  MEMBER = 'MEMBER'     // 成员
}

export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  roles: UserRole[]
  children?: MenuItem[]
}
