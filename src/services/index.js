// 导入所有具名导出的模块
import * as userServices from './user'
import * as orderServices from './order'
import * as productServices from './product'
import * as cartServices from './cart'
import * as searchServices from './search'
import * as seckillServices from './seckill'

// 作为命名空间对象导出
export const userAPI = userServices
export const orderAPI = orderServices
export const productAPI = productServices
export const cartAPI = cartServices
export const searchAPI = searchServices
export const seckillAPI = seckillServices

// 也可以导出所有服务函数
export * from './user'
export * from './order'
export * from './product'
export * from './cart'
export * from './search'
export * from './seckill' 