import { login, logout, getInfo } from "@/api/login"
import { getToken, setToken, removeToken } from "@/utils/auth"
import defAva from "@/assets/images/profile.jpg"
import { defineStore } from "pinia"

export interface LoginForm {
  username: string
  password: string
  code: string
  uuid: string
}

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken() || "", // 确保初始化时可能为 null
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
  }),
  actions: {
    // 登录
    login(userInfo: LoginForm) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res: any) => {
            setToken(res.data.token)
            this.token = res.data.token
            resolve(null)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    async getInfo() {
      try {
        const res = await getInfo()
        const data = res.data
        const user = data.loginUser
        const avatar =
          user.avatar == "" || user.avatar == null ? defAva : user.avatar

        if (data.roles && data.roles.length > 0) {
          this.roles = data.roles
          this.permissions = data.permissions
        } else {
          this.roles = ["ROLE_DEFAULT"]
        }
        this.name = user.username
        this.avatar = avatar
        return data // resolve 返回data
      } catch (error) {
        this.resetState() // 清除用户信息
        throw error // 重新抛出错误，让`router.beforeEach`能捕获
      }
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.resetState() // 调用重置方法
  
            location.reload()
            resolve(null)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 清除用户信息
    resetState() {
      this.token = ""
      this.name = ""
      this.avatar = ""
      this.roles = []
      this.permissions = []
      removeToken()
    },
  },
})

export default useUserStore
