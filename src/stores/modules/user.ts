import { defineStore } from "pinia"
import { store } from "@/stores/store.ts"
import { Token, UserInfo, Login } from "@/types"
import { login, loginOut, getUserInfo } from "@/api"
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
    token: storage.get("token", {}),
    userId: storage.get("userId", ""),
    userInfo: {} as UserInfo
  }),
  getters: {
    getToken(): Token {
      return this.token
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
    async login(params: Login) {
      const response = await login(params)
      const { result, code } = response
      if (code === ResultEnum.SUCCESS) {
        const token = {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        }
        storage.set("token", token)
        storage.set("userId", result._id)
        this.setToken(token)
      }
    },
    async getUserInfoTo() {
      const response = await getUserInfo({ _id: this.userId })
      const { result, code } = response
      if (code === ResultEnum.SUCCESS) {
        this.setUserInfo(result)
      } else {
        throw new Error("getInfo: permissionsList must be a non-null array !")
      }
      return result
    },
    async loginOutTo() {
      await loginOut()
      storage.remove("token")
      storage.remove("userId")
      this.setUserInfo({})
    }
  }
})

export const userStore = useUserStore(store)
