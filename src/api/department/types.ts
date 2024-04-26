export interface DepartmentItem {
  id: string
  departmentName: string
  children?: DepartmentItem[]
}

export interface DepartmentListResponse {
  list: DepartmentItem[]
}

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  id: string
  username?: string
  account?: string
}

export interface DepartmentUserItem {
  id: string
  loginName: string
  realName: string
  mobileNo: string
  createTimeStr: string
  status: any
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  total: number
}
