import { defineStore } from 'pinia'
import userAPI from '@/services/user'
import router from '@/router'
import { setToken, removeToken, getToken, parseJwt, isTokenExpired, setUserInfo as setLocalUserInfo, removeUserInfo } from '@/utils/auth'

// 定义用户Store
export const useUserStore = defineStore('user', {
  // 状态（相当于Vuex的state）
  state: () => {
    // 从token中初始化状态
    const token = getToken()
    const decoded = token ? parseJwt(token) : null
    const isValidToken = token && decoded && !isTokenExpired()

    return {
      token: isValidToken ? token : '',
      userInfo: decoded || {},
      isLogin: isValidToken
    }
  },

  // 计算属性（相当于Vuex的getters）
  getters: {
    username: (state) => state.userInfo.username || '',
    userId: (state) => state.userInfo.userId || state.userInfo.sub || '',
    avatar: (state) => state.userInfo.avatar || '',
    // 检查token是否过期
    isTokenValid: (state) => {
      if (!state.token) return false
      return !isTokenExpired()
    }
  },

  // 方法（相当于Vuex的mutations和actions的结合）
  actions: {
    // 设置Token并从中提取用户信息
    setToken(token) {
      this.token = token
      
      if (token) {
        setToken(token)
        // 从JWT中解析用户信息
        const decoded = parseJwt(token)
        if (decoded) {
          this.userInfo = decoded
          this.isLogin = true
          // 将用户信息也存储到本地
          setLocalUserInfo(decoded)
        }
      } else {
        this.clearUser()
      }
    },

    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      setLocalUserInfo(userInfo)
    },

    // 清除用户信息
    clearUser() {
      this.token = ''
      this.userInfo = {}
      this.isLogin = false
      removeToken()
      removeUserInfo()
    },

    // 检查认证状态，如果token过期则退出登录
    checkAuth() {
      if (this.token && isTokenExpired()) {
        this.clearUser()
        router.push('/login')
        return false
      }
      return !!this.token
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
        
        // 检查响应结构并提取token
        // 后端直接返回token字符串作为data字段
        if (response && response.data) {
          let token = null;
          
          // 情况1: data直接就是token字符串
          if (typeof response.data === 'string') {
            token = response.data;
          } 
          // 情况2: data是对象且包含token字段
          else if (response.data.token) {
            token = response.data.token;
          }
          
          if (token) {
            // 设置token，并自动提取用户信息
            this.setToken(token);
            return Promise.resolve(response);
          }
        }
        
        // 如果没有获取到有效token
        return Promise.reject(new Error('登录失败，未获取到有效token'));
      } catch (error) {
        console.error('登录错误:', error);
        return Promise.reject(error);
      }
    },
    
    // 获取用户信息（如果token中没有足够信息则调用接口获取完整信息）
    async getUserInfo() {
      // 如果token中已包含足够的用户信息，则无需再次请求
      if (this.userInfo && this.userInfo.username) {
        return Promise.resolve(this.userInfo)
      }
      
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
    async getVerifyCode(phone, isLogin = true) {
      try {
        const response = await userAPI.getVerifyCode(phone, isLogin)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 退出登录
    async logout() {
      try {
        // 如果有token，则调用后端登出接口
        if (this.token) {
          await userAPI.logout()
        }
        this.clearUser()
        router.push('/login')
        return Promise.resolve()
      } catch (error) {
        // 即使后端登出失败，也要清除本地状态
        this.clearUser()
        return Promise.reject(error)
      }
    },
    
    // 更新用户信息
    async updateUserInfo(userInfo) {
      try {
        const response = await userAPI.updateUserInfo(userInfo)
        this.userInfo = { ...this.userInfo, ...userInfo }
        setLocalUserInfo(this.userInfo)
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