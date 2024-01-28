import { REFRESH_TOKEN_URL } from "@/constants"
import { Token } from "@/types"
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import axios from "axios"
import { useUser } from "@/stores/index.ts"
// 配置额外的请求头接口

// Token管理类
class TokenManager {
  async refreshTokens(refreshToken: string): Promise<void> {
    const response: AxiosResponse = await axios.post(REFRESH_TOKEN_URL, {
      refreshToken: refreshToken
    })
    return response.data.result
  }
  // 判断accessToken是否过期的方法 true 代表过期，false代表未过期
  private isAccessTokenExpired(expiresIn: number): boolean {
    if (!expiresIn) return true
    return Math.floor(Date.now() / 1000) < expiresIn
  }

  async validateTokens(tokens: Token) {
    if (!tokens.refreshToken || !tokens.accessToken || !tokens.expiresIn) {
      await useUser().loginOutTo()
    }
  }
  setTokens(newTokens: any) {
    useUser().setToken(newTokens)
  }

  // 将访问令牌添加到请求头中
  addAuthorizationHeader(config: AxiosRequestConfig, tokens: Token) {
    ;(config.headers as Recordable).Authorization = `Bearer ${tokens.accessToken}`
  }

  // 确保请求配置中包含有效的refreshToken
  async ensureValidRefreshTokens(config: AxiosRequestConfig): Promise<void> {
    const { accessToken, expiresIn, refreshToken } = useUser().getToken
    await this.validateTokens({ accessToken, expiresIn, refreshToken })
    if (!this.isAccessTokenExpired(expiresIn as number)) {
      const refreshedTokens = await this.refreshTokens(refreshToken as string)
      const token = Object.assign({}, refreshedTokens, { refreshToken })
      this.setTokens(token)
      this.addAuthorizationHeader(config, token)
    } else {
      this.addAuthorizationHeader(config, { accessToken, expiresIn, refreshToken })
    }
  }
}

// 导出TokenManager类
export default TokenManager
