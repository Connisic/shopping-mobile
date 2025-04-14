import request from './request'

// 获取秒杀商品列表
export function getSeckillProducts(page = 1, size = 10) {
  return request({
    url: '/user/seckillGoods/findPage',
    method: 'get',
    params: { page, size }
  })
}

// 获取秒杀商品详情
export function getSeckillProductDetail(id) {
  return request({
    url: '/user/seckillGoods/findById',
    method: 'get',
    params: { id }
  })
}

// 创建秒杀订单
export function createSeckillOrder(orderData) {
  return request({
    url: '/user/seckillGoods/add',
    method: 'post',
    data: orderData
  })
}

// 查询秒杀订单
export function getSeckillOrder(id) {
  return request({
    url: '/user/seckillGoods/findOrder',
    method: 'get',
    params: { id }
  })
}

// 支付秒杀订单
export function paySeckillOrder(id) {
  return request({
    url: '/user/seckillGoods/pay',
    method: 'get',
    params: { id }
  })
} 