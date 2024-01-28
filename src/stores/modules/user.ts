import { defineStore } from "pinia"
import { store } from "@/stores/store.ts"
import { Token, UserInfo, Login } from "@/types"
import { login, loginOut, getUserInfo } from "@/api"
import { ACCESS_TOKEN, USER_ID } from "@/constants"
import { ResultEnum } from "@/enum"
import { storage } from "@/utils/storage.ts"

export interface IUserState {
  token: Token
  userId: string
  userInfo: UserInfo
}
export const useUserStore = defineStore({
  id: "user",
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, {}),
    userId: "",
    userInfo: {} as UserInfo
  }),
  getters: {
    getToken(): Token {
      return this.token
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
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setUserId(userId: string) {
      this.userId = userId
    },
    async login(params: Login) {
      const response = await login(params)
      const { result, code } = response as unknown as { result: any; code: string | number }
      if (code === ResultEnum.SUCCESS) {
        const token = {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        }
        storage.set(ACCESS_TOKEN, token)
        this.setToken(token)
        this.setUserId(result.userId)
      }
    },
    async getUserInfoTo() {
      const response = await getUserInfo()
      const { result, code } = response as unknown as { result: any; code: string | number }
      if (code === ResultEnum.SUCCESS) {
        this.setUserInfo(result)
      } else {
        throw new Error("getInfo: permissionsList must be a non-null array !")
      }
      return result
    },
    async loginOutTo() {
      await loginOut()
      storage.remove(ACCESS_TOKEN)
      storage.remove(USER_ID)
      this.setUserInfo({})
    }
  }
})

// export const userStore = useUserStore(store)
export const useUser = () => {
  return useUserStore(store)
}
