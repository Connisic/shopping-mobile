import { defineStore } from 'pinia'
import { cartAPI } from '@/services'
import { Toast } from 'vant'

// 购物车假数据
const mockCartItems = [
  {
    id: 1,
    goodId: 1,
    goodsName: '时尚休闲连衣裙夏季新款',
    price: 128.00,
    headerPic: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    num: 1,
    checked: true
  },
  {
    id: 2,
    goodId: 2,
    goodsName: '简约百搭男士T恤纯棉短袖',
    price: 69.90,
    headerPic: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    num: 2,
    checked: true
  }
]

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
        if (response && response.data && response.data.length > 0) {
          // 使用后端返回的数据
          this.setCartItems(response.data)
          console.log('使用后端购物车数据')
          return response.data
        } else {
          // 后端没有返回有效数据，使用假数据
          this.setCartItems(mockCartItems)
          console.log('使用假购物车数据')
          return mockCartItems
        }
      } catch (error) {
        console.error('获取购物车失败：', error)
        Toast('获取购物车失败，显示模拟数据')
        // 请求失败，使用假数据
        this.setCartItems(mockCartItems)
        console.log('API错误，使用假购物车数据')
        return mockCartItems
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
        
        const response = await cartAPI.addToCart(cartItem)
        if (response && response.code === 200) {
          // API成功
          this.addItemToCart(cartItem)
          Toast.success('已加入购物车')
        } else {
          // API返回错误，仍添加到本地
          this.addItemToCart(cartItem)
          Toast.success('已加入本地购物车')
          console.log('API返回错误，添加到本地购物车')
        }
      } catch (error) {
        console.error('添加到购物车失败：', error)
        // 依然添加到本地购物车
        const cartItem = {
          goodId: item.id,
          goodsName: item.title,
          price: item.price,
          num: item.count || 1,
          headerPic: item.image,
          specificationValues: item.specificationValues || ''
        }
        this.addItemToCart(cartItem)
        Toast.success('已加入本地购物车')
        console.log('API错误，添加到本地购物车')
      }
    },
    
    // 更新购物车商品数量
    async updateCartItem({ goodId, num }) {
      try {
        const response = await cartAPI.updateCartItemQuantity(goodId, num)
        if (response && response.code === 200) {
          // API成功
          this.updateCartItemQuantity({ goodId, num })
        } else {
          // API返回错误，仍更新本地
          this.updateCartItemQuantity({ goodId, num })
          console.log('API返回错误，更新本地购物车')
        }
      } catch (error) {
        console.error('更新购物车失败：', error)
        // 依然更新本地购物车
        this.updateCartItemQuantity({ goodId, num })
        console.log('API错误，更新本地购物车')
      }
    },
    
    // 从购物车中移除商品
    async removeCartItem(goodId) {
      try {
        const response = await cartAPI.removeFromCart(goodId)
        if (response && response.code === 200) {
          // API成功
          this.removeCartItemLocally(goodId)
          Toast.success('已从购物车移除')
        } else {
          // API返回错误，仍从本地移除
          this.removeCartItemLocally(goodId)
          Toast.success('已从本地购物车移除')
          console.log('API返回错误，从本地购物车移除')
        }
      } catch (error) {
        console.error('移除购物车商品失败：', error)
        // 依然从本地购物车移除
        this.removeCartItemLocally(goodId)
        Toast.success('已从本地购物车移除')
        console.log('API错误，从本地购物车移除')
      }
    }
  }
}) 