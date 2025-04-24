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

/**
 * 解析JWT Token
 * @param {String} token JWT Token字符串
 * @returns {Object|null} 解析后的数据对象，解析失败则返回null
 */
export function parseJwt(token) {
  try {
    if (!token) {
      console.warn('No token provided to parseJwt');
      return null;
    }
    
    console.log('Parsing JWT token:', token.substring(0, 20) + '...');
    
    // 拆分token，获取payload部分
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT token format (expected 3 parts):', parts.length);
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    try {
      // 解码base64
      const rawPayload = atob(base64);
      
      // 将二进制字符串转换为UTF-8字符串
      const jsonPayload = decodeURIComponent(
        Array.from(rawPayload)
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      console.log('JWT payload parsed successfully:', payload);
      return payload;
    } catch (decodeError) {
      console.error('Error decoding JWT payload:', decodeError);
      return null;
    }
  } catch (error) {
    console.error('解析JWT失败:', error);
    return null;
  }
}

/**
 * 检查Token是否过期
 * @returns {Boolean} 是否过期
 */
export function isTokenExpired() {
  const token = getToken()
  if (!token) return true
  
  try {
    const decodedToken = parseJwt(token)
    if (!decodedToken) return true
    
    // 检查exp字段（过期时间戳）
    const currentTime = Date.now() / 1000 // 转换为秒
    return decodedToken.exp < currentTime
  } catch (error) {
    console.error('检查Token过期失败:', error)
    return true
  }
} 