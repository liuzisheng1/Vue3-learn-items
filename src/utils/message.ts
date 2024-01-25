// plugins/global-methods.ts
import { App } from "vue"
import { InjectionKey } from "vue"
import { ElMessage } from "element-plus"

// 创建一个 injection key
export const MessageSymbol: InjectionKey<typeof ElMessage> = Symbol()

export default {
  install: (app: App, options) => {
    // 注入全局方法
    app.provide(MessageSymbol, ElMessage)
  }
}
