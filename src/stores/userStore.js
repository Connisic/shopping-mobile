import { defineStore } from 'pinia'
import userAPI from '@/services/user'
import router from '@/router'
import { setToken, removeToken, getToken } from '@/utils/auth'

// 定义用户Store
export const useUserStore = defineStore('user', {
  // 状态（相当于Vuex的state）
  state: () => ({
    token: getToken() || '',
    userInfo: {},
    isLogin: !!getToken()
  }),

  // 计算属性（相当于Vuex的getters）
  getters: {
    username: (state) => state.userInfo.username || '',
    avatar: (state) => state.userInfo.avatar || ''
  },

  // 方法（相当于Vuex的mutations和actions的结合）
  actions: {
    // 设置Token
    setToken(token) {
      this.token = token
      this.isLogin = !!token
      if (token) {
        setToken(token)
      } else {
        removeToken()
      }
    },

    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },

    // 清除用户信息
    clearUser() {
      this.token = ''
      this.userInfo = {}
      this.isLogin = false
      removeToken()
    },

    // 用户注册
    async register(userInfo) {
      try {
        const response = await userAPI.register(userInfo)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 用户登录
    async login(userInfo) {
      try {
        const response = await userAPI.login(userInfo)
        const { token } = response.data
        this.setToken(token)
        // 登录后获取用户信息
        await this.getUserInfo()
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      try {
        const response = await userAPI.getUserInfo()
        const { data } = response
        this.setUserInfo(data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 获取验证码
    async getVerifyCode(phone) {
      try {
        const response = await userAPI.getVerifyCode(phone)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 退出登录
    async logout() {
      try {
        await userAPI.logout()
        this.clearUser()
        router.push('/login')
        return Promise.resolve()
      } catch (error) {
        this.clearUser()
        return Promise.reject(error)
      }
    },
    
    // 更新用户信息
    async updateUserInfo(userInfo) {
      try {
        const response = await userAPI.updateUserInfo(userInfo)
        this.userInfo = { ...this.userInfo, ...userInfo }
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 修改密码
    async changePassword(passwordInfo) {
      try {
        const response = await userAPI.changePassword(passwordInfo)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}) 