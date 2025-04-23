import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// 导出Pinia实例，用于在main.js中注册
export default pinia

// 统一导出所有store，方便引用
export * from './userStore'
export * from './cartStore'
export * from './productStore'
export * from './orderStore'
export * from './seckillStore'
export * from './searchStore'
export * from './addressStore' 