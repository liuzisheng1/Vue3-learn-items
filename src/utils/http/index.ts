import type {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosHeaders
} from "axios"
import axios from "axios"
import TokenManager from "@/utils/http/token-manager"
import { checkStatus } from "@/utils/http/check-status"

import { authErrMap } from "@/enum"

export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>

export class Request {
  private readonly axiosInstance: AxiosInstance
  private TokenManager: TokenManager

  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options)
    this.axiosInstance.interceptors.request.use(
      (axiosConfig: AxiosRequestConfig | AxiosHeaders) => this.requestInterceptor(axiosConfig),
      (error) => this.requestErrorInterceptor(error)
    )
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => this.responseSuccessInterceptor(response),
      (error) => this.responseErrorInterceptor(error)
    )
    this.TokenManager = new TokenManager()
  }

  async requestInterceptor(config: AxiosRequestConfig | AxiosHeaders): Promise<any> {
    // 这里可以添加逻辑，如果需要的话
    // await this.TokenManager.ensureValidRefreshTokens(config)
    return config
  }

  requestErrorInterceptor(error: AxiosError): Promise<AxiosError> {
    console.error("Request Error:", error.message)
    return Promise.reject(error)
  }

  responseSuccessInterceptor(response: AxiosResponse): any {
    const { status, data } = response
    if (status !== 200) return Promise.reject(data)
    ElMessage.success("请联系管理员1")
    console.log("Response Success:", response)
    return data
  }

  private async responseErrorInterceptor(error: any): Promise<any> {
    const { status } = error?.response || {}
    try {
      checkStatus(status)

      // if (status === 401) {
      //   await this.TokenManager.refreshTokens()
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
