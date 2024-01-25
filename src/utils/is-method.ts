// 判断一个字符串是否为JSON字符串
export function isJsonString(str: any) {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str)
      return typeof obj === "object" && obj !== null
    } catch (e) {
      console.error(`Invalid JSON string: "${str}", error: ${e}`)
      return false
    }
  }
  console.error("Expected a string as input")
  return false
}
