import request from '@/utils/request'
import { API_BASE_URL } from '@/constants'

const userAPI = {
  /**
   * 用户注册
   * @param {Object} data 注册信息
   * @param {string} data.username 用户名
   * @param {string} data.password 密码
   * @param {string} data.phone 手机号
   * @param {string} data.checkCode 验证码
   * @returns {Promise}
   */
  register(data) {
    return request({
      url: `${API_BASE_URL}/user/register`,
      method: 'post',
      data
    })
  },

  /**
   * 用户登录
   * @param {Object} data 登录信息
   * @param {string} [data.username] 用户名
   * @param {string} [data.password] 密码
   * @param {string} [data.phone] 手机号（验证码登录）
   * @param {string} [data.checkCode] 验证码（验证码登录）
   * @param {string} [data.loginType] 登录类型，默认password，可选sms
   * @returns {Promise}
   */
  login(data) {
    // 根据登录类型选择不同的接口
    const url = data.loginType === 'sms' 
      ? `${API_BASE_URL}/user/loginByCode` 
      : `${API_BASE_URL}/user/login`
    
    return request({
      url,
      method: 'post',
      data
    })
  },

  /**
   * 获取验证码
   * @param {string} phone 手机号
   * @returns {Promise}
   */
  getVerifyCode(phone) {
    return request({
      url: `${API_BASE_URL}/user/verify-code`,
      method: 'post',
      data: { phone }
    })
  },

  /**
   * 获取用户信息
   * @returns {Promise}
   */
  getUserInfo() {
    return request({
      url: `${API_BASE_URL}/user/info`,
      method: 'get'
    })
  },

  /**
   * 修改用户信息
   * @param {Object} data 用户信息
   * @returns {Promise}
   */
  updateUserInfo(data) {
    return request({
      url: `${API_BASE_URL}/user/info`,
      method: 'put',
      data
    })
  },

  /**
   * 修改密码
   * @param {Object} data 密码信息
   * @param {string} data.oldPassword 旧密码
   * @param {string} data.newPassword 新密码
   * @returns {Promise}
   */
  changePassword(data) {
    return request({
      url: `${API_BASE_URL}/user/password`,
      method: 'put',
      data
    })
  },

  /**
   * 退出登录
   * @returns {Promise}
   */
  logout() {
    return request({
      url: `${API_BASE_URL}/user/logout`,
      method: 'post'
    })
  }
}

export default userAPI 