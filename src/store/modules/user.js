import userAPI from '@/services/user'
import router from '@/router'
import { setToken, removeToken, getToken } from '@/utils/auth'

const state = {
  token: getToken() || '',
  userInfo: {},
  isLogin: !!getToken()
}

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
  isLogin: state => state.isLogin,
  username: state => state.userInfo.username || '',
  avatar: state => state.userInfo.avatar || ''
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    state.isLogin = !!token
    if (token) {
      setToken(token)
    } else {
      removeToken()
    }
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = {}
    state.isLogin = false
    removeToken()
  }
}

const actions = {
  // 用户注册
  async register({ commit }, userInfo) {
    try {
      const response = await userAPI.register(userInfo)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 用户登录
  async login({ commit, dispatch }, userInfo) {
    try {
      const response = await userAPI.login(userInfo)
      const { token } = response.data
      commit('SET_TOKEN', token)
      // 登录后获取用户信息
      await dispatch('getUserInfo')
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 获取用户信息
  async getUserInfo({ commit }) {
    try {
      const response = await userAPI.getUserInfo()
      const { data } = response
      commit('SET_USER_INFO', data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 获取验证码
  async getVerifyCode(_, phone) {
    try {
      const response = await userAPI.getVerifyCode(phone)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 退出登录
  async logout({ commit }) {
    try {
      await userAPI.logout()
      commit('CLEAR_USER')
      router.push('/login')
      return Promise.resolve()
    } catch (error) {
      commit('CLEAR_USER')
      return Promise.reject(error)
    }
  },
  
  // 更新用户信息
  async updateUserInfo({ commit }, userInfo) {
    try {
      const response = await userAPI.updateUserInfo(userInfo)
      commit('SET_USER_INFO', { ...state.userInfo, ...userInfo })
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 修改密码
  async changePassword(_, passwordInfo) {
    try {
      const response = await userAPI.changePassword(passwordInfo)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 