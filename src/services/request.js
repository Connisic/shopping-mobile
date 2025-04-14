import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // API的base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true // 允许携带cookie
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    
    // 如果token存在，则添加到请求头
    if (token) {
      config.headers['Authorization'] = token
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 判断状态码
    if (res.code !== 200) {
      // 显示错误消息
      Toast.fail(res.message || '操作失败')
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || '操作失败'))
    }
    
    return res
  },
  error => {
    console.error('响应错误：', error)
    
    // 处理网络错误
    if (!error.response) {
      Toast.fail('网络异常，请检查网络连接')
    } else {
      // 处理HTTP状态码错误
      switch (error.response.status) {
        case 401:
          // 清除token
          localStorage.removeItem('token')
          // 跳转到登录页
          router.push('/login')
          Toast.fail('登录已过期，请重新登录')
          break
        case 403:
          Toast.fail('没有权限访问')
          break
        case 404:
          Toast.fail('请求的资源不存在')
          break
        case 500:
          Toast.fail('服务器异常')
          break
        default:
          Toast.fail('操作失败，请稍后重试')
      }
    }
    
    return Promise.reject(error)
  }
)

export default service 