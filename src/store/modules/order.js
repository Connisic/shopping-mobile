import { orderAPI } from '@/services'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state: {
    orders: [],
    currentOrder: null
  },
  getters: {
    orderCount: state => state.orders.length,
    // 订单状态 1-未付款 2-已付款 3-未发货 4-已发货 5-交易成功 6-交易关闭 7-待评价
    pendingPaymentCount: state => state.orders.filter(order => order.status === 1).length,
    pendingDeliveryCount: state => state.orders.filter(order => order.status === 2 || order.status === 3).length,
    pendingReceiveCount: state => state.orders.filter(order => order.status === 4).length
  },
  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    ADD_ORDER(state, order) {
      state.orders.unshift(order)
    },
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = order
    },
    UPDATE_ORDER_STATUS(state, { id, status }) {
      const order = state.orders.find(order => order.id === id)
      if (order) {
        order.status = status
      }
    }
  },
  actions: {
    // 获取订单列表
    async fetchOrders({ commit }, { status = null } = {}) {
      try {
        const response = await orderAPI.getUserOrders(status)
        const orders = response.data
        commit('SET_ORDERS', orders)
        return orders
      } catch (error) {
        console.error('获取订单列表失败：', error)
        Toast('获取订单列表失败')
        return []
      }
    },
    
    // 获取订单详情
    async fetchOrderDetail({ commit }, id) {
      try {
        const response = await orderAPI.getOrderDetail(id)
        const order = response.data
        commit('SET_CURRENT_ORDER', order)
        return order
      } catch (error) {
        console.error('获取订单详情失败：', error)
        Toast('获取订单详情失败')
        return null
      }
    },
    
    // 创建订单
    async createOrder({ commit, rootGetters, dispatch }, { addressId, items, remarks }) {
      try {
        // 获取选中的商品，如果没有传入items则使用购物车中选中的商品
        const cartItems = items || rootGetters['cart/checkedItems']
        
        // 构造订单数据
        const orderData = {
          cartGoods: cartItems.map(item => ({
            goodId: item.goodId,
            goodsName: item.goodsName,
            price: item.price,
            num: item.num,
            headerPic: item.headerPic
          })),
          receiverAreaName: rootGetters['user/defaultAddress']?.addressDetail || '',
          receiverMobile: rootGetters['user/defaultAddress']?.tel || '',
          receiver: rootGetters['user/defaultAddress']?.name || '',
          buyerMessage: remarks || ''
        }
        
        // 调用API创建订单
        const response = await orderAPI.createOrder(orderData)
        const order = response.data
        
        commit('ADD_ORDER', order)
        commit('SET_CURRENT_ORDER', order)
        
        // 清空购物车中已结算的商品
        if (!items) {
          commit('cart/CLEAR_CART', null, { root: true })
        }
        
        return order
      } catch (error) {
        console.error('创建订单失败：', error)
        Toast('创建订单失败')
        throw error
      }
    },
    
    // 生成支付二维码
    async generatePayQRCode({ state }, orderId) {
      try {
        const response = await orderAPI.generatePayQRCode(orderId)
        return response.data // 返回二维码URL
      } catch (error) {
        console.error('生成支付二维码失败：', error)
        Toast('生成支付二维码失败')
        throw error
      }
    }
  }
} 