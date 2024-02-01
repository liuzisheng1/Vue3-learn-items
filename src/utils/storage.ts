const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 // 默认缓存期限为7天
type StorageType = typeof localStorage | typeof sessionStorage
export default class Storage {
  private storage: StorageType // StorageType 应该是具体的存储类型，如 localStorage 或 sessionStorage
  private prefixKey?: string

  constructor(prefixKey = "", storage: StorageType = localStorage) {
    this.storage = storage
    this.prefixKey = prefixKey
  }

  private getKey(key: string): string {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {*} value 缓存值
   * @param expire 缓存过期时间，默认为7天
   */
  set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME): void {
    const data = {
      value,
      expire: expire !== null ? Date.now() + expire * 1000 : null
    }
    const stringData = JSON.stringify(data)
    this.storage.setItem(this.getKey(key), stringData)
  }

  /**
   * 读取缓存
   * @param {string} key 缓存键
   * @param {*=} def 默认值
   */
  get(key: string, def: any = null): any {
    const item = this.storage.getItem(this.getKey(key))
    if (item) {
      try {
        const data = JSON.parse(item)
        const { value, expire } = data
        if (expire === null || expire >= Date.now()) {
          return value
        }
        this.remove(key)
      } catch (e) {
        return def
      }
    }
    return def
  }

  /**
   * 从缓存删除某项
   * @param {string} key
   */
  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * 设置cookie
   * @param {string} name cookie 名称
   * @param {*} value cookie 值
   * @param {number=} expire 过期时间
   * 如果过期时间未设置，默认关闭浏览器自动删除
   */
  setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME): void {
    const maxAge = expire !== null ? `; Max-Age=${expire}` : ""
    document.cookie = `${this.getKey(name)}=${value}${maxAge}`
  }

  /**
   * 根据名字获取cookie值
   * @param name
   */
  getCookie(name: string): string {
    const cookies = document.cookie.split("; ")
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=")
      if (this.getKey(key) === name) {
        return value
      }
    }
    return ""
  }

  /**
   * 根据名字删除指定的cookie
   * @param {string} key
   */
  removeCookie(key: string): void {
    this.setCookie(key, "", -1)
  }

  /**
   * 清空cookie，使所有cookie失效
   */
  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (let i = keys.length; i--; ) {
        const key = keys[i]
        this.setCookie(key, "", -1)
      }
    }
  }
}

export const storage = new Storage("")
