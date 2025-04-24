// API基础URL
export const API_BASE_URL = 'http://localhost:8082/api'

// 本地存储的Key
export const STORAGE_KEYS = {
  TOKEN: 'YY_TOKEN',
  USER_INFO: 'YY_USER_INFO'
}

// 订单状态
export const ORDER_STATUS = {
  PENDING_PAYMENT: 1, // 待付款
  PENDING_SHIPMENT: 2, // 待发货
  PENDING_RECEIPT: 3, // 待收货
  COMPLETED: 4, // 已完成
  CANCELLED: 5 // 已取消
}

// 支付方式
export const PAYMENT_METHODS = {
  ALIPAY: 1, // 支付宝
  WECHAT: 2, // 微信
  CREDIT_CARD: 3 // 信用卡
}

// 默认分页大小
export const DEFAULT_PAGE_SIZE = 10

// 商品排序方式
export const PRODUCT_SORT = {
  PRICE_ASC: { field: 'price', order: 'asc' }, // 价格从低到高
  PRICE_DESC: { field: 'price', order: 'desc' }, // 价格从高到低
  SALES_DESC: { field: 'sales', order: 'desc' }, // 销量从高到低
  RATING_DESC: { field: 'rating', order: 'desc' } // 评分从高到低
} 