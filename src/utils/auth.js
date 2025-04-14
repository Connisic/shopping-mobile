import { STORAGE_KEYS } from '@/constants'

/**
 * 获取Token
 * @returns {String} token值
 */
export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * 设置Token
 * @param {String} token token值
 */
export function setToken(token) {
  return localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

/**
 * 移除Token
 */
export function removeToken() {
  return localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

/**
 * 获取用户信息
 * @returns {Object} 用户信息对象
 */
export function getUserInfo() {
  const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO)
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

/**
 * 设置用户信息
 * @param {Object} userInfo 用户信息对象
 */
export function setUserInfo(userInfo) {
  return localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  return localStorage.removeItem(STORAGE_KEYS.USER_INFO)
} 