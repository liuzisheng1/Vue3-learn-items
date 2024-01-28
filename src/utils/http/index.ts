import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from "axios"
import axios from "axios"
import axiosRetry from "axios-retry"
import TokenManager from "@/utils/http/token-manager"
import { checkStatus } from "@/utils/http/check-status"
import { AxiosCancel } from "@/utils/http/axios-cancel"
import { useUser } from "@/stores/index.ts"

export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>

export const TokenOrManager = new TokenManager()
export const axiosCancel = new AxiosCancel()

export class Request {
  private readonly axiosInstance: AxiosInstance

  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options)
    // 配置axios-retry
    axiosRetry(this.axiosInstance, {
      retries: 2, // 设置最大重试次数
      retryDelay: (retryCount) => retryCount * 1000, // 设置每次重试间隔时间
      retryCondition: (error: AxiosError): boolean => {
        // 自定义重试条件
        return Boolean(error?.response && error?.response?.status >= 500)
      }
    })
    this.axiosInstance.interceptors.request.use(
      (axiosConfig: AxiosRequestConfig) => this.requestInterceptor(axiosConfig),
      (error) => this.requestErrorInterceptor(error)
    )
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => this.responseSuccessInterceptor(response),
      (error) => this.responseErrorInterceptor(error)
    )
  }

  async requestInterceptor(config: AxiosRequestConfig): Promise<any> {
    const userStore = useUser()
    axiosCancel.addPending(config)

    if (userStore.getToken.accessToken) {
      ;(config.headers as Recordable).Authorization = `Bearer ${userStore.getToken.accessToken}`
    }
    // if (!userStore.getToken.accessToken) return Promise.reject("请登录")
    // 这里可以添加逻辑，如果需要的话
    // await TokenOrManager.ensureValidRefreshTokens(config)
    return config
  }

  requestErrorInterceptor(error: AxiosError): Promise<AxiosError> {
    console.error("Request Error:", error.message)
    return Promise.reject(error)
  }

  responseSuccessInterceptor(response: AxiosResponse): any {
    response && axiosCancel.removePending(response.config)
    const { status, data } = response
    if (status !== 200) return Promise.reject(data)
    ElMessage.success("请联系管理员1")
    console.log("Response Success:", response)
    return data
  }

  private async responseErrorInterceptor(error: any): Promise<any> {
    axiosCancel.removePending(error?.config)
    const { status } = error?.response || {}
    try {
      checkStatus(status)
      // await this.axiosInstance(error?.config)
      // if (status === 401) {
      //   await TokenManager.refreshTokens()
      //   return this.axiosInstance(error?.config)
      // }
    } catch (error) {
      // await this.TokenManager.logout()
      console.error("Response Error:", error)
    }
    return Promise.reject(error)
  }

  /**
   * 发起一个请求并返回响应
   * @param config 请求配置
   * @returns 响应对象
   */
  request<T, D = any>(config: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance(config)
  }

  /**
   * 发起一个GET请求并返回响应
   * @param url 请求的URL
   * @param config 请求配置
   * @returns 响应对象
   */
  get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.get(url, config)
  }

  /**
   * 发起一个POST请求并返回响应
   * @param url 请求的URL
   * @param data 请求的数据
   * @param config 请求配置
   * @returns 响应对象
   */
  post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.post(url, data, config)
  }

  /**
   * 发起一个PUT请求并返回响应
   * @param url 请求的URL
   * @param data 请求的数据
   * @param config 请求配置
   * @returns 响应对象
   */
  put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.put(url, data, config)
  }

  /**
   * 发起一个DELETE请求并返回响应
   * @param url 请求的URL
   * @param config 请求配置
   * @returns 响应对象
   */
  delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.delete(url, config)
  }
}

const http = new Request({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60 * 1000 * 5
})

export default http
