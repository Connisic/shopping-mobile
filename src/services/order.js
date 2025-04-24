import request from './request'

/**
 * 创建订单
 * @param {Object} orderData 订单数据
 * @returns {Promise} 创建结果
 */
export function createOrder(orderData) {
  return request({
    url: '/user/order/orders/add',
    method: 'post',
    data: orderData
  })
}

/**
 * 获取订单列表
 * @param {Number} [status] 订单状态（不传则获取所有状态订单）
 * @param {Number} [page=1] 页码
 * @param {Number} [size=10] 每页数量
 * @returns {Promise} 订单列表数据
 */
export function getUserOrders(status, page = 1, size = 10) {
  return request({
    url: '/user/order/orders/findUserOrders',
    method: 'get',
    params: {
      status
    }
  })
}

/**
 * 获取订单详情
 * @param {String} id 订单ID
 * @returns {Promise} 订单详情数据
 */
export function getOrderDetail(id) {
  return request({
    url: '/user/order/orders/findById',
    method: 'get',
    params: { id }
  })
}

/**
 * 取消订单
 * @param {String} id 订单ID
 * @param {String} [reason] 取消原因
 * @returns {Promise} 取消结果
 */
export function cancelOrder(id, reason) {
  return request({
    url: `/user/order/cancel/${id}`,
    method: 'put',
    data: { reason }
  })
}

/**
 * 删除订单
 * @param {String} id 订单ID
 * @returns {Promise} 删除结果
 */
export function deleteOrder(id) {
  return request({
    url: `/user/order/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 支付订单
 * @param {String} id 订单ID
 * @param {Number} paymentType 支付方式（1-支付宝，2-微信，3-余额）
 * @returns {Promise} 支付结果
 */
export function payOrder(id, paymentType) {
  return request({
    url: `/user/order/payment/pcPay`,
    method: 'post',
    params: { orderId: id }
  })
}

/**
 * 生成支付二维码
 * @param {String} id 订单ID
 * @returns {Promise} 二维码URL
 */
export function generatePayQRCode(id) {
  return request({
    url: `/user/order/payment/pcPay`,
    method: 'post',
    params: { orderId: id }
  })
}

/**
 * 确认收货
 * @param {String} id 订单ID
 * @returns {Promise} 确认结果
 */
export function confirmReceive(id) {
  return request({
    url: `/user/order/receive/${id}`,
    method: 'put'
  })
}

/**
 * 添加收货地址
 * @param {Object} address 地址信息
 * @returns {Promise} 添加结果
 */
export function addAddress(address) {
  return request({
    url: '/user/order/address/add',
    method: 'post',
    data: address
  })
}

/**
 * 更新收货地址
 * @param {Object} address 地址信息
 * @returns {Promise} 更新结果
 */
export function updateAddress(address) {
  return request({
    url: '/user/order/address/update',
    method: 'put',
    data: address
  })
}

/**
 * 删除收货地址
 * @param {String} id 地址ID
 * @returns {Promise} 删除结果
 */
export function deleteAddress(id) {
  return request({
    url: '/user/order/address/delete',
    method: 'delete',
    params: { id }
  })
}

/**
 * 获取收货地址列表
 * @returns {Promise} 地址列表数据
 */
export function getAddressList() {
  return request({
    url: '/user/order/address/findByUser',
    method: 'get'
  })
}

/**
 * 设置默认收货地址
 * @param {String} id 地址ID
 * @returns {Promise} 设置结果
 */
export function setDefaultAddress(id) {
  return request({
    url: `/user/address/setDefault/${id}`,
    method: 'put'
  })
}

/**
 * 获取所有省份
 * @returns {Promise} 省份列表
 */
export function getProvinces() {
  return request({
    url: '/user/order/address/findAllProvince',
    method: 'get'
  })
}

/**
 * 获取某省下所有城市
 * @param {String} provinceId 省份ID
 * @returns {Promise} 城市列表
 */
export function getCities(provinceId) {
  return request({
    url: '/user/order/address/findCityByProvince',
    method: 'get',
    params: { provinceId }
  })
}

/**
 * 获取某市下所有区县
 * @param {String} cityId 城市ID
 * @returns {Promise} 区县列表
 */
export function getDistricts(cityId) {
  return request({
    url: '/user/order/address/findAreaByCity',
    method: 'get',
    params: { cityId }
  })
} 