/**
 * 格式化价格
 * @param {number|string} price 价格数值
 * @param {number} decimals 小数位数
 * @returns {string} 格式化后的价格字符串
 */
export function formatPrice(price, decimals = 2) {
  if (price === undefined || price === null) return '0.00'
  return Number(price).toFixed(decimals)
}

/**
 * 格式化日期
 * @param {Date|number|string} date 日期对象/时间戳/日期字符串
 * @param {string} fmt 格式化模板，如：yyyy-MM-dd HH:mm:ss
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  
  return fmt
    .replace(/yyyy/g, year)
    .replace(/yy/g, String(year).slice(2))
    .replace(/MM/g, String(month).padStart(2, '0'))
    .replace(/M/g, month)
    .replace(/DD/g, String(day).padStart(2, '0'))
    .replace(/D/g, day)
    .replace(/HH/g, String(hour).padStart(2, '0'))
    .replace(/H/g, hour)
    .replace(/mm/g, String(minute).padStart(2, '0'))
    .replace(/m/g, minute)
    .replace(/ss/g, String(second).padStart(2, '0'))
    .replace(/s/g, second)
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} interval - 间隔时间，单位毫秒
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, interval) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 将对象转为查询字符串
 * @param {Object} obj - 参数对象
 * @returns {string} 查询字符串
 */
export function objectToQuery(obj) {
  if (!obj) return ''
  
  return Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 获取查询参数
 * @param {string} name - 参数名
 * @returns {string} 参数值
 */
export function getQueryParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}

/**
 * 本地存储相关操作
 */
export const storage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },
  get(key) {
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

/**
 * 解析URL查询参数
 * @param {string} url URL字符串
 * @returns {Object} 查询参数对象
 */
export function parseQuery(url) {
  const query = {}
  const urlObj = new URL(url, window.location.origin)
  
  for (const [key, value] of urlObj.searchParams.entries()) {
    query[key] = value
  }
  
  return query
}

/**
 * 将对象转换为URL查询参数字符串
 * @param {Object} obj 参数对象
 * @returns {string} 查询参数字符串
 */
export function stringifyQuery(obj) {
  if (!obj) return ''
  
  const params = new URLSearchParams()
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      params.append(key, obj[key])
    }
  })
  
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
} 