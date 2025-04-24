import request from './request'

/**
 * 获取购物车列表
 * @returns {Promise} 购物车列表数据
 */
export function getCartList() {
  return request({
    url: '/user/cart/findCartList',
    method: 'get'
  })
}

/**
 * 添加商品到购物车
 * @param {Object} cartItem 购物车商品数据
 * @returns {Promise} 添加结果
 */
export function addToCart(cartItem) {
  return request({
    url: '/user/cart/addCart',
    method: 'post',
    data: cartItem
  })
}

/**
 * 更新购物车商品数量
 * @param {Number|String} goodId 商品ID
 * @param {Number} num 商品数量
 * @returns {Promise} 更新结果
 */
export function updateCartItemQuantity(goodId, num) {
  return request({
    url: '/user/cart/handleCart',
    method: 'get',
    params: {
      goodId,
      num
    }
  })
}

/**
 * 从购物车中移除商品
 * @param {Number|String} goodId 商品ID
 * @returns {Promise} 删除结果
 */
export function removeFromCart(goodId) {
  return request({
    url: '/user/cart/deleteCart',
    method: 'delete',
    params: {
      goodId
    }
  })
}

/**
 * 清空购物车
 * @returns {Promise} 清空结果
 */
export function clearCart() {
  return request({
    url: '/user/cart/clear',
    method: 'delete'
  })
}

/**
 * 设置购物车商品选中状态
 * @param {Number|String} goodId 商品ID
 * @param {Boolean} checked 是否选中
 * @returns {Promise} 设置结果
 */
export function setCartItemChecked(goodId, checked) {
  return request({
    url: '/user/cart/checked',
    method: 'put',
    data: {
      goodId,
      checked
    }
  })
}

/**
 * 设置全部商品选中状态
 * @param {Boolean} checked 是否全选
 * @returns {Promise} 设置结果
 */
export function setAllCartItemsChecked(checked) {
  return request({
    url: '/user/cart/checkedAll',
    method: 'put',
    data: {
      checked
    }
  })
} 