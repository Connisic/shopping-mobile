import { defineStore } from 'pinia'
import { orderAPI } from '@/services'
import { Toast } from 'vant'
import { useCartStore } from './cartStore'
import { useUserStore } from './userStore'
import { mapOrders, mapOrder } from '@/utils/adapters'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null
  }),
  
  getters: {
    orderCount: (state) => state.orders.length,
    // 订单状态 'pending'-未付款 'paid'-已付款/待发货 'delivered'-待收货 'completed'-交易成功/待评价 'cancelled'-交易关闭
    pendingPaymentCount: (state) => state.orders.filter(order => order.status === 'pending').length,
    pendingDeliveryCount: (state) => state.orders.filter(order => order.status === 'paid').length,
    pendingReceiveCount: (state) => state.orders.filter(order => order.status === 'delivered').length
  },
  
  actions: {
    // 设置订单列表
    setOrders(orders) {
      this.orders = orders
    },
    
    // 添加新订单
    addOrder(order) {
      this.orders.unshift(order)
    },
    
    // 设置当前订单
    setCurrentOrder(order) {
      this.currentOrder = order
    },
    
    // 更新订单状态
    updateOrderStatus({ id, status }) {
      const order = this.orders.find(order => order.id === id)
      if (order) {
        order.status = status
      }
    },
    
    // 获取订单列表
    async fetchOrders({ status = null } = {}) {
      try {
        const response = await orderAPI.getUserOrders(status)
        if (response && response.data) {
          // 使用适配器转换订单数据格式
          const mappedOrders = mapOrders(response.data)
          this.setOrders(mappedOrders)
          return mappedOrders
        } else {
          return []
        }
      } catch (error) {
        console.error('获取订单列表失败：', error)
        Toast('获取订单列表失败')
        return []
      }
    },
    
    // 获取订单详情
    async fetchOrderDetail(id) {
      try {
        const response = await orderAPI.getOrderDetail(id)
        if (response && response.data) {
          // 使用适配器转换订单数据格式
          const mappedOrder = mapOrder(response.data)
          this.setCurrentOrder(mappedOrder)
          return mappedOrder
        } else {
          return null
        }
      } catch (error) {
        console.error('获取订单详情失败：', error)
        Toast('获取订单详情失败')
        return null
      }
    },
    
    // 创建订单
    async createOrder({ addressId, items, remarks }) {
      try {
        const cartStore = useCartStore()
        const userStore = useUserStore()
        
        // 获取选中的商品，如果没有传入items则使用购物车中选中的商品
        const cartItems = items || cartStore.checkedItems
        
        // 构造订单数据
        const orderData = {
          cartGoods: cartItems.map(item => ({
            goodId: item.goodId,
            goodsName: item.goodsName,
            price: item.price,
            num: item.num,
            headerPic: item.headerPic
          })),
          receiverAreaName: userStore.defaultAddress?.addressDetail || '',
          receiverMobile: userStore.defaultAddress?.tel || '',
          receiver: userStore.defaultAddress?.name || '',
          buyerMessage: remarks || ''
        }
        
        // 调用API创建订单
        const response = await orderAPI.createOrder(orderData)
        const order = response.data
        
        this.addOrder(order)
        this.setCurrentOrder(order)
        
        // 清空购物车中已结算的商品
        if (!items) {
          cartStore.clearCart()
        }
        
        return order
      } catch (error) {
        console.error('创建订单失败：', error)
        Toast('创建订单失败')
        throw error
      }
    },
    
    // 生成支付二维码
    async generatePayQRCode(orderId) {
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
}) 