export interface UserInfo {
  _id?: string
  email?: string
  username?: string
  password?: string
  phone?: string
  role?: string
  sex?: string
  welcome?: string
  avatar?: string
  userType?: string
  status?: string
  create_time?: string
  update_time?: string
  permission?: Menu[]
}

export interface Menu {
  _id?: string
  parentId?: string
  name?: string
  path?: string
  icon?: string
  level?: number
  status?: boolean
  subtitle?: string
  type?: number
  component?: string
  actions?: number[]
  roles?: string[]
  parentPaths?: string[]
  children?: Menu[]
}
