// 秒杀模块
import { seckillAPI } from '@/services'
import { Toast } from 'vant'

const state = {
  // 秒杀结束时间，默认2小时后
  endTime: Date.now() + 2 * 60 * 60 * 1000,
  // 倒计时数据
  countdown: {
    hours: 1,
    minutes: 59,
    seconds: 59
  },
  // 秒杀商品列表
  seckillProducts: [],
  // 当前查看的秒杀商品详情
  currentSeckillProduct: null
}

const getters = {
  // 获取秒杀结束时间
  endTime: state => state.endTime,
  // 获取倒计时
  countdown: state => state.countdown,
  // 获取秒杀商品列表
  seckillProducts: state => state.seckillProducts,
  // 获取首页显示的秒杀商品（前3个）
  homeSeckillProducts: state => state.seckillProducts.slice(0, 3),
  // 获取当前查看的秒杀商品详情
  currentSeckillProduct: state => state.currentSeckillProduct
}

const mutations = {
  // 更新倒计时
  updateCountdown(state, countdown) {
    state.countdown = countdown
  },
  // 设置秒杀结束时间
  setEndTime(state, endTime) {
    state.endTime = endTime
  },
  // 设置秒杀商品列表
  setSeckillProducts(state, products) {
    state.seckillProducts = products
  },
  // 设置当前秒杀商品详情
  setCurrentSeckillProduct(state, product) {
    state.currentSeckillProduct = product
  }
}

const actions = {
  // 更新倒计时
  updateCountdown({ commit, state }) {
    const now = Date.now()
    const diff = state.endTime - now
    
    if (diff <= 0) {
      // 倒计时结束
      commit('updateCountdown', {
        hours: 0,
        minutes: 0,
        seconds: 0
      })
      return
    }
    
    // 计算时分秒
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    commit('updateCountdown', { hours, minutes, seconds })
  },
  
  // 获取秒杀商品列表
  async fetchSeckillProducts({ commit }) {
    try {
      const response = await seckillAPI.getSeckillProducts()
      const products = response.data.records.map(item => ({
        id: item.id,
        title: item.title,
        price: item.costPrice, // 秒杀价
        originPrice: item.price, // 原价
        image: item.headerPic,
        goodsId: item.goodsId,
        soldPercentage: item.num > 0 ? Math.floor(((item.num - item.stockCount) / item.num) * 100) : 0,
        startTime: item.startTime,
        endTime: item.endTime,
        introduction: item.introduction
      }))
      
      commit('setSeckillProducts', products)
      
      // 如果有秒杀商品，设置第一个商品的结束时间为倒计时结束时间
      if (products.length > 0 && products[0].endTime) {
        const endTimeDate = new Date(products[0].endTime).getTime()
        commit('setEndTime', endTimeDate)
      }
      
      return products
    } catch (error) {
      console.error('获取秒杀商品列表失败：', error)
      Toast('获取秒杀商品列表失败')
      return []
    }
  },
  
  // 获取秒杀商品详情
  async fetchSeckillProductDetail({ commit }, id) {
    try {
      const response = await seckillAPI.getSeckillProductDetail(id)
      const product = response.data
      
      // 转换格式
      const formattedProduct = {
        id: product.id,
        goodsId: product.goodsId,
        title: product.title,
        price: product.costPrice, // 秒杀价
        originPrice: product.price, // 原价
        image: product.headerPic,
        introduction: product.introduction,
        soldPercentage: product.num > 0 ? Math.floor(((product.num - product.stockCount) / product.num) * 100) : 0,
        startTime: product.startTime,
        endTime: product.endTime,
        stockCount: product.stockCount
      }
      
      commit('setCurrentSeckillProduct', formattedProduct)
      
      // 设置该商品的结束时间为倒计时结束时间
      if (formattedProduct.endTime) {
        const endTimeDate = new Date(formattedProduct.endTime).getTime()
        commit('setEndTime', endTimeDate)
      }
      
      return formattedProduct
    } catch (error) {
      console.error('获取秒杀商品详情失败：', error)
      Toast('获取秒杀商品详情失败')
      return null
    }
  },
  
  // 创建秒杀订单
  async createSeckillOrder({ commit }, orderData) {
    try {
      const response = await seckillAPI.createSeckillOrder(orderData)
      return response.data
    } catch (error) {
      console.error('创建秒杀订单失败：', error)
      Toast('创建秒杀订单失败')
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 