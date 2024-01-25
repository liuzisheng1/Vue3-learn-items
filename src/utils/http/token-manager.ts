import { LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN_URL } from "@/constants"
import type { Login } from "@/types"
import type { AxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios"
import axios from "axios"

// 配置额外的请求头接口

// Token管理类
class TokenManager {
  // 状态属性，用于存储获取的token信息
  private accessToken?: string
  private refreshToken?: string
  private expiresIn?: number

  // 构造函数，初始化token信息
  constructor() {
    this.accessToken = undefined
    this.refreshToken = undefined
    this.expiresIn = undefined
  }

  // 登录方法，获取token相关数据
  async login(params: Login): Promise<void> {
    try {
      const response = await axios.post(LOGIN_URL, params)
      const { accessToken, refreshToken, expiresIn } = response.data.result
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.expiresIn = parseInt(expiresIn)
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Login failed")
    }
  }

  // 登出方法，清除token信息
  async logout(): Promise<void> {
    // 可以考虑清除本地存储中的token，并发送登出请求
    this.accessToken = undefined
    this.refreshToken = undefined
    this.expiresIn = undefined

    try {
      await axios.post(LOGOUT_URL)
    } catch (error) {
      console.error("Logout failed:", error)
      throw new Error("Logout failed")
    }
  }

  // 刷新token方法，通过refreshToken获取新的accessToken
  async refreshTokens(): Promise<void> {
    try {
      const response: AxiosResponse = await axios.post(REFRESH_TOKEN_URL, {
        refreshToken: this.refreshToken
      })
      this.accessToken = response.data.result.accessToken
      this.expiresIn = response.data.result.expiresIn ?? 0
    } catch (error) {
      console.error("Refresh tokens failed:", error)
      throw new Error("Refresh tokens failed")
    }
  }

  // 判断accessToken是否过期的方法
  private isAccessTokenExpired(): boolean {
    const expirationTime = Math.floor((this.expiresIn as number) * 1000)
    return Date.now() >= expirationTime
  }

  // 确保请求配置中包含有效的refreshToken
  async ensureValidRefreshTokens(config: AxiosRequestConfig | AxiosHeaders): Promise<void> {
    if (!this.accessToken || !this.refreshToken || !this.expiresIn) {
      throw new Error("Tokens not set")
    }
    if (this.isAccessTokenExpired()) {
      try {
        await this.refreshTokens()
      } catch (error) {
        console.error("Failed to refresh tokens:", error)
        throw new Error("Failed to refresh tokens")
      }
    }
    config.headers = { ...config.headers, Authorization: `Bearer ${this.accessToken}` }
  }
}

// 导出TokenManager类
export default TokenManager
