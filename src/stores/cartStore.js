import { defineStore } from 'pinia'
import { cartAPI } from '@/services'
import { Toast } from 'vant'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: []
  }),
  
  getters: {
    totalCount: (state) => {
      return state.cartItems.reduce((total, item) => total + item.num, 0)
    },
    totalPrice: (state) => {
      return state.cartItems.reduce((total, item) => {
        const price = parseFloat(item.price)
        return total + price * item.num
      }, 0)
    },
    checkedItems: (state) => {
      return state.cartItems.filter(item => item.checked)
    },
    checkedTotalPrice: (state) => {
      return state.checkedItems.reduce((total, item) => {
        const price = parseFloat(item.price)
        return total + price * item.num
      }, 0)
    }
  },
  
  actions: {
    // 设置购物车项目
    setCartItems(items) {
      // 确保所有项目都有checked属性，后端可能没有该属性
      this.cartItems = items.map(item => ({
        ...item,
        checked: item.checked === undefined ? true : item.checked
      }))
    },
    
    // 添加商品到购物车状态
    addItemToCart(item) {
      const existItem = this.cartItems.find(cartItem => cartItem.goodId === item.goodId)
      if (existItem) {
        existItem.num += item.num || 1
      } else {
        this.cartItems.push({
          ...item,
          num: item.num || 1,
          checked: true
        })
      }
    },
    
    // 更新购物车商品数量（本地状态）
    updateCartItemQuantity({ goodId, num }) {
      const item = this.cartItems.find(item => item.goodId === goodId)
      if (item) {
        item.num = num
      }
    },
    
    // 移除购物车中的商品（本地状态）
    removeCartItemLocally(goodId) {
      const index = this.cartItems.findIndex(item => item.goodId === goodId)
      if (index !== -1) {
        this.cartItems.splice(index, 1)
      }
    },
    
    // 切换选中状态
    toggleChecked({ goodId, checked }) {
      const item = this.cartItems.find(item => item.goodId === goodId)
      if (item) {
        item.checked = checked
      }
    },
    
    // 全选/全不选
    toggleAllChecked(checked) {
      this.cartItems.forEach(item => {
        item.checked = checked
      })
    },
    
    // 清空购物车
    clearCart() {
      this.cartItems = []
    },
    
    // === API操作 ===
    
    // 获取购物车列表
    async fetchCartList() {
      try {
        const response = await cartAPI.getCartList()
        this.setCartItems(response.data)
        return response.data
      } catch (error) {
        console.error('获取购物车失败：', error)
        Toast('获取购物车失败')
        return []
      }
    },
    
    // 添加商品到购物车
    async addToCart(item) {
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
        this.addItemToCart(cartItem)
        Toast.success('已加入购物车')
      } catch (error) {
        console.error('添加到购物车失败：', error)
        Toast.fail('添加失败，请重试')
      }
    },
    
    // 更新购物车商品数量
    async updateCartItem({ goodId, num }) {
      try {
        await cartAPI.updateCartItemQuantity(goodId, num)
        this.updateCartItemQuantity({ goodId, num })
      } catch (error) {
        console.error('更新购物车失败：', error)
        Toast.fail('更新失败，请重试')
      }
    },
    
    // 从购物车中移除商品
    async removeCartItem(goodId) {
      try {
        await cartAPI.removeFromCart(goodId)
        this.removeCartItemLocally(goodId)
        Toast.success('已从购物车移除')
      } catch (error) {
        console.error('移除购物车商品失败：', error)
        Toast.fail('移除失败，请重试')
      }
    }
  }
}) 