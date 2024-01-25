export interface Login {
  username?: string
  password?: string
  phone?: number
  code?: string
}

export interface Token {
  expiresIn?: string
  accessToken?: string
  refreshToken?: string
  refreshExpiresIn?: string
  userId?: string
}

export interface BasicResponse<T = any> {
  code: number
  message: string
  status: string
  result?: T
}
