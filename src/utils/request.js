import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:8082/api', // API基础URL
  timeout: 15000, // 请求超时时间
  withCredentials: true // 允许跨域携带cookie
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从Pinia获取token
    const userStore = useUserStore()
    const token = userStore.token
    
    // 如果有token则添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果返回的不是成功状态码，则进行错误处理
    if (res.code && res.code !== 200) {
      // 显示错误消息
      Toast(res.message || '请求失败')
      
      // 如果是未登录状态，则跳转到登录页
      if (res.code === 401) {
        // 获取userStore实例
        const userStore = useUserStore()
        
        // 清除用户信息
        userStore.logout()
        
        // 跳转到登录页面
        router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  error => {
    console.error('响应错误：', error)
    
    // 错误提示
    Toast(error.message || '请求失败')
    
    // 如果是未授权，则跳转到登录页
    if (error.response && error.response.status === 401) {
      // 获取userStore实例
      const userStore = useUserStore()
      
      // 清除用户信息
      userStore.logout()
      
      router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
    }
    
    return Promise.reject(error)
  }
)

export default request 