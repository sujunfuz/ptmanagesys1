// export type UserLoginType = {
//   username: string
//   password: string
// }

export type UserType = {
  username: string
  password: string
  role: string
  tokenValue: string
  roleId: string
  permissions: string | string[]
}

export type UserLoginType = {
  mobile: string
  smsCode: string
}
