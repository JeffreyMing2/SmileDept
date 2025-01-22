import { UserRole } from '@/types/permission'
import type { MenuItem } from '@/types/permission'

export const menuConfig: MenuItem[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    title: '首页',
    icon: 'HomeFilled',
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.MEMBER]
  },
  {
    path: '/user',
    name: 'User',
    title: '用户管理',
    icon: 'User',
    roles: [UserRole.OWNER]
  },
  {
    path: '/department',
    name: 'Department',
    title: '部门管理',
    icon: 'Office',
    roles: [UserRole.OWNER]
  },
  {
    path: '/position',
    name: 'Position',
    title: '职位管理',
    icon: 'Position',
    roles: [UserRole.OWNER]
  },
  {
    path: '/member',
    name: 'Member',
    title: '成员管理',
    icon: 'UserFilled',
    roles: [UserRole.OWNER, UserRole.ADMIN]
  },
  {
    path: '/recruitment',
    name: 'Recruitment',
    title: '招募管理',
    icon: 'Promotion',
    roles: [UserRole.OWNER]
  },
  {
    path: '/admin',
    name: 'Admin',
    title: '管理员管理',
    icon: 'Setting',
    roles: [UserRole.OWNER]
  },
  {
    path: '/volunteer',
    name: 'Volunteer',
    title: '志愿者管理',
    icon: 'Star',
    roles: [UserRole.OWNER, UserRole.ADMIN]
  },
  {
    path: '/download',
    name: 'Download',
    title: '下载中心',
    icon: 'Download',
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.VOLUNTEER, UserRole.MEMBER]
  },
  {
    path: '/punishment',
    name: 'Punishment',
    title: '处罚管理',
    icon: 'Warning',
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.VOLUNTEER],
    children: [
      {
        path: '/punishment/admin/register',
        name: 'AdminPunishmentRegister',
        title: '管理处罚登记',
        roles: [UserRole.OWNER]
      },
      {
        path: '/punishment/member/register',
        name: 'MemberPunishmentRegister',
        title: '成员处罚登记',
        roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.VOLUNTEER]
      },
      {
        path: '/punishment/volunteer/register',
        name: 'VolunteerPunishmentRegister',
        title: '志愿者处罚登记',
        roles: [UserRole.OWNER, UserRole.ADMIN]
      },
      {
        path: '/punishment/admin/manage',
        name: 'AdminPunishmentManage',
        title: '管理处罚管理',
        roles: [UserRole.OWNER]
      },
      {
        path: '/punishment/member/manage',
        name: 'MemberPunishmentManage',
        title: '成员处罚管理',
        roles: [UserRole.OWNER, UserRole.ADMIN]
      },
      {
        path: '/punishment/volunteer/manage',
        name: 'VolunteerPunishmentManage',
        title: '志愿者处罚管理',
        roles: [UserRole.OWNER, UserRole.ADMIN]
      }
    ]
  },
  {
    path: '/recruitment/register',
    name: 'RecruitmentRegister',
    title: '管理招募登记',
    icon: 'Edit',
    roles: [UserRole.MEMBER]
  },
  {
    path: '/punishment/query',
    name: 'PunishmentQuery',
    title: '处罚查询',
    icon: 'Search',
    roles: [UserRole.MEMBER]
  }
]
