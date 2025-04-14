import { cartAPI } from '@/services'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state: {
    cartItems: []
  },
  getters: {
    totalCount: state => {
      return state.cartItems.reduce((total, item) => total + item.num, 0)
    },
    totalPrice: state => {
      return state.cartItems.reduce((total, item) => {
        const price = parseFloat(item.price)
        return total + price * item.num
      }, 0)
    },
    checkedItems: state => {
      return state.cartItems.filter(item => item.checked)
    },
    checkedTotalPrice: (state, getters) => {
      return getters.checkedItems.reduce((total, item) => {
        const price = parseFloat(item.price)
        return total + price * item.num
      }, 0)
    }
  },
  mutations: {
    SET_CART_ITEMS(state, items) {
      // 确保所有项目都有checked属性，后端可能没有该属性
      state.cartItems = items.map(item => ({
        ...item,
        checked: item.checked === undefined ? true : item.checked
      }))
    },
    ADD_TO_CART(state, item) {
      const existItem = state.cartItems.find(cartItem => cartItem.goodId === item.goodId)
      if (existItem) {
        existItem.num += item.num || 1
      } else {
        state.cartItems.push({
          ...item,
          num: item.num || 1,
          checked: true
        })
      }
    },
    UPDATE_CART_ITEM(state, { goodId, num }) {
      const item = state.cartItems.find(item => item.goodId === goodId)
      if (item) {
        item.num = num
      }
    },
    REMOVE_CART_ITEM(state, goodId) {
      const index = state.cartItems.findIndex(item => item.goodId === goodId)
      if (index !== -1) {
        state.cartItems.splice(index, 1)
      }
    },
    TOGGLE_CHECKED(state, { goodId, checked }) {
      const item = state.cartItems.find(item => item.goodId === goodId)
      if (item) {
        item.checked = checked
      }
    },
    TOGGLE_ALL_CHECKED(state, checked) {
      state.cartItems.forEach(item => {
        item.checked = checked
      })
    },
    CLEAR_CART(state) {
      state.cartItems = []
    }
  },
  actions: {
    // 获取购物车列表
    async fetchCartList({ commit }) {
      try {
        const response = await cartAPI.getCartList()
        commit('SET_CART_ITEMS', response.data)
        return response.data
      } catch (error) {
        console.error('获取购物车失败：', error)
        Toast('获取购物车失败')
        return []
      }
    },
    
    // 添加商品到购物车
    async addToCart({ commit, dispatch }, item) {
      try {
        // 构造购物车商品数据
        const cartItem = {
          goodId: item.id,
          goodsName: item.title,
          price: item.price,
          num: item.count || 1,
          headerPic: item.image,
          specificationValues: item.specificationValues || ''
        }
        
        await cartAPI.addToCart(cartItem)
        commit('ADD_TO_CART', cartItem)
        Toast.success('已加入购物车')
      } catch (error) {
        console.error('添加到购物车失败：', error)
        Toast.fail('添加失败，请重试')
      }
    },
    
    // 更新购物车商品数量
    async updateCartItem({ commit }, { goodId, num }) {
      try {
        await cartAPI.updateCartItemQuantity(goodId, num)
        commit('UPDATE_CART_ITEM', { goodId, num })
      } catch (error) {
        console.error('更新购物车失败：', error)
        Toast.fail('更新失败，请重试')
      }
    },
    
    // 从购物车中移除商品
    async removeCartItem({ commit }, goodId) {
      try {
        await cartAPI.removeFromCart(goodId)
        commit('REMOVE_CART_ITEM', goodId)
        Toast.success('已从购物车移除')
      } catch (error) {
        console.error('移除购物车商品失败：', error)
        Toast.fail('移除失败，请重试')
      }
    },
    
    // 切换商品选中状态
    toggleChecked({ commit }, payload) {
      commit('TOGGLE_CHECKED', payload)
    },
    
    // 切换全选状态
    toggleAllChecked({ commit }, checked) {
      commit('TOGGLE_ALL_CHECKED', checked)
    },
    
    // 清空购物车
    clearCart({ commit }) {
      commit('CLEAR_CART')
    }
  }
} 