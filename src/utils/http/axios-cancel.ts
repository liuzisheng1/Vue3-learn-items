import axios, { AxiosRequestConfig, Canceler } from "axios"
import { isFunction } from "lodash-es"
import { isJsonString } from "@/utils/is-method.ts"
import { stringify } from "qs"

export const getPendingUrl = (config: AxiosRequestConfig) => {
  if (config && config.data && isJsonString(config.data)) {
    config.data = JSON.parse(config.data)
  }
  const { method, url, params, data } = config // 请求方式，参数，请求地址，
  return [method, url, stringify(params), stringify(data)].join("&") // 拼接
}
const pendingMap = new Map<string, Canceler>()
export class AxiosCancel {
  // public pendingMap = new Map<string, Canceler>()
  /**
   * 添加挂起的请求配置
   * @param config Axios的请求配置
   */
  addPending(config: AxiosRequestConfig) {
    // this.removePending(config)
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
      config.cancelToken = new axios.CancelToken((cancel) => {
        // cancel 函数的参数会作为 promise 的 error 被捕获
        cancel(`${config.url} 请求已取消`)
      })
    } else {
      config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
          pendingMap.set(url, cancel)
        })
    }
  }

  /**
   * 移除所有挂起的请求配置
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    pendingMap.clear()
  }

  /**
   * 移除指定的挂起的请求配置
   * @param config Axios的请求配置
   */
  removePending(config: AxiosRequestConfig) {
    if (!config) return
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
      // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
      const cancel = pendingMap.get(url)
      cancel && cancel(url)
      pendingMap.delete(url)
    }
  }
}
