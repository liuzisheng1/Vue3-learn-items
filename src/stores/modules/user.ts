import { defineStore } from "pinia"
import { store } from "@/stores/store.ts"
import { Token, UserInfo, Login } from "@/types"
import { login, getUserInfo } from "@/api"
import { ACCESS_TOKEN } from "@/constants"
import { ResultEnum } from "@/enum"
import { storage } from "@/utils/storage.ts"

export interface IUserState {
  token: Token
  userId: string
  refreshToken: string
  userInfo: UserInfo
}

export const useUserStore = defineStore({
  id: "user",
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, {}),
    userId: "",
    refreshToken: "",
    userInfo: {} as UserInfo
  }),
  getters: {
    getToken(): Token {
      return this.token
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getUserId(): string {
      return this.userId
    },
    getUserInfo(): UserInfo {
      return this.userInfo
    }
  },
  actions: {
    setToken(token: Token) {
      this.token = token
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setUserId(userId: string) {
      this.userId = userId
    },
    async login(params: Login) {
      try {
        const response = await login(params)
        const { result, code } = response as unknown as { result: any; code: string | number }
        if (code === ResultEnum.SUCCESS) {
          const token = {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn
          }
          storage.set(ACCESS_TOKEN, token)
          this.setRefreshToken(result.refreshToken)
          this.setToken(token)
          this.setUserId(result.userId)
        } else {
          console.error("登录失败：code = " + code)
          // 可以考虑在这里添加一个错误处理的逻辑，比如提示用户
        }
      } catch (error) {
        console.error("登录失败：", error)
        // 对于 API 调用失败，可以考虑提示用户或者重试逻辑
      }
    },
    async getUserInfoTo() {
      try {
        const response = await getUserInfo()
        const { result, code } = response as unknown as { result: any; code: string | number }
        if (code === ResultEnum.SUCCESS) {
          this.setUserInfo(result)
        } else {
          throw new Error("getInfo: permissionsList must be a non-null array !")
        }
        return result
      } catch (error) {
        console.error("获取用户信息失败：", error)
        // 对于 API 调用失败，可以考虑提示用户或者重试逻辑
        throw error
      }
    },
    async loginOutTo() {
      // 重新登录应该由组件的用户交互逻辑来触发
      // 这里应该仅负责执行登出的逻辑，而不是进行导航
      await ElMessageBox.alert("登录已失效,请重新登录", "提示", {
        confirmButtonText: "重新登录",
        callback: () => {
          storage.clear()
        }
      })
    }
  }
})

// export const userStore = useUserStore(store)
export const useUser = () => {
  return useUserStore(store)
}
