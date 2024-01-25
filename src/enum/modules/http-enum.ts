export enum AuthErrMap {
  "登录失效，需要重新登录" = 10031,
  "您太久没登录，请重新登录~",
  "账户未绑定角色，请联系管理员绑定角色",
  "该用户未注册，请联系管理员注册用户",
  "无法获取对应第三方平台用户",
  "该账户未关联员工，请联系管理员做关联",
  "账号已无效",
  "账号未找到"
}

export enum PageEnum {
  // 登录
  BASE_LOGIN = "/login",
  BASE_LOGIN_NAME = "Login",
  //重定向
  REDIRECT = "/redirect",
  REDIRECT_NAME = "Redirect",
  // 首页
  BASE_HOME = "/dashboard",
  //首页跳转默认路由
  BASE_HOME_REDIRECT = "/dashboard/console",
  // 错误
  ERROR_PAGE_NAME = "ErrorPage"
}

export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = "success"
}
