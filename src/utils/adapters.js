/**
 * 订单状态适配器 - 将后端状态码转换为前端状态字符串
 * @param {number} status 后端状态码
 * @returns {string} 前端状态字符串
 */
export function mapOrderStatus(status) {
  // 后端状态码: 1、未付款，2、已付款，3、未发货，4、已发货，5、交易成功，6、交易关闭，7、待评价
  // 前端状态字符串: 'pending', 'paid', 'delivered', 'completed', 'cancelled'
  switch (Number(status)) {
    case 1:
      return 'pending' // 未付款
    case 2:
    case 3:
      return 'paid' // 已付款/未发货
    case 4:
      return 'delivered' // 已发货
    case 5:
    case 7:
      return 'completed' // 交易成功/待评价
    case 6:
      return 'cancelled' // 交易关闭
    default:
      return 'unknown'
  }
}

/**
 * 订单项适配器 - 将后端订单项转换为前端所需格式
 * @param {Array} cartGoods 后端订单项数组
 * @returns {Array} 前端订单项数组
 */
export function mapOrderItems(cartGoods) {
  if (!cartGoods || !Array.isArray(cartGoods)) return []
  
  return cartGoods.map(item => ({
    id: item.id,
    title: item.goodsName,
    price: item.price,
    count: item.num,
    image: item.headerPic || 'https://img01.yzcdn.cn/vant/cat.jpeg' // 使用默认图片如果没有提供
  }))
}

/**
 * 订单适配器 - 将后端订单数据转换为前端所需格式
 * @param {Object} backendOrder 后端订单数据
 * @returns {Object} 前端订单对象
 */
export function mapOrder(backendOrder) {
  return {
    id: backendOrder.id,
    orderNo: backendOrder.id, // 使用ID作为订单号
    status: mapOrderStatus(backendOrder.status),
    totalAmount: backendOrder.payment,
    items: mapOrderItems(backendOrder.cartGoods),
    createTime: backendOrder.createTime,
    paymentTime: backendOrder.paymentTime,
    receiverName: backendOrder.receiver,
    receiverPhone: backendOrder.receiverMobile,
    receiverAddress: backendOrder.receiverAreaName,
    // 保留原始数据以备不时之需
    rawData: backendOrder
  }
}

/**
 * 订单列表适配器 - 将后端订单列表转换为前端所需格式
 * @param {Array} backendOrders 后端订单列表
 * @returns {Array} 前端订单列表
 */
export function mapOrders(backendOrders) {
  if (!backendOrders || !Array.isArray(backendOrders)) return []
  
  return backendOrders.map(order => mapOrder(order))
} 