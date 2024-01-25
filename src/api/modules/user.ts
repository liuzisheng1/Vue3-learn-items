import http from "@/utils/http"
import { Login, BasicResponse, UserInfo } from "@/types"

// 登录
export const login = async (data: Login) => http.post<BasicResponse>("/api/login", data)
// 登出
export const loginOut = async () => http.get<BasicResponse>("/api/logout")

// 获取用户信息
export const getUserInfo = async (params: { _id: string }) =>
  http.get<UserInfo>("/api/user/list", { params })
