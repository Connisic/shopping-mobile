import { createStore } from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import product from './modules/product'
import order from './modules/order'
import seckill from './modules/seckill'
import search from './modules/search'

export default createStore({
  state: {
    user: {
      id: 1,
      name: 'User',
      token: 'mock-token'
    },
    cart: {
      items: []
    },
    address: {
      list: [
        {
          id: '1',
          name: '张三',
          tel: '13000000000',
          province: '浙江省',
          city: '杭州市',
          county: '西湖区',
          addressDetail: '文三路 138 号东方通信大厦 7 楼 501 室',
          areaCode: '330106',
          isDefault: true,
        },
        {
          id: '2',
          name: '李四',
          tel: '1310000000',
          province: '浙江省',
          city: '杭州市',
          county: '拱墅区',
          addressDetail: '莫干山路 50 号',
          areaCode: '330105',
          isDefault: false,
        },
      ]
    }
  },
  getters: {
    // 获取购物车所有商品总数
    cartItemCount(state) {
      return state.cart.items.reduce((count, item) => count + item.quantity, 0)
    },
    // 获取购物车商品总金额
    cartTotalPrice(state) {
      return state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    // 获取地址列表
    addressList(state) {
      return state.address.list
    },
    // 获取默认地址
    defaultAddress(state) {
      return state.address.list.find(address => address.isDefault) || state.address.list[0]
    }
  },
  mutations: {
    // 添加商品到购物车
    addToCart(state, product) {
      const item = state.cart.items.find(item => item.id === product.id)
      if (item) {
        item.quantity++
      } else {
        state.cart.items.push({
          ...product,
          quantity: 1
        })
      }
    },
    // 从购物车中移除商品
    removeFromCart(state, productId) {
      const index = state.cart.items.findIndex(item => item.id === productId)
      if (index > -1) {
        state.cart.items.splice(index, 1)
      }
    },
    // 更新购物车商品数量
    updateCartItemQuantity(state, { productId, quantity }) {
      const item = state.cart.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    // 添加地址
    addAddress(state, address) {
      // 如果是默认地址，先将其他地址设为非默认
      if (address.isDefault) {
        state.address.list.forEach(item => {
          item.isDefault = false
        })
      }
      state.address.list.push(address)
    },
    // 更新地址
    updateAddress(state, address) {
      const index = state.address.list.findIndex(item => item.id === address.id)
      if (index > -1) {
        // 如果是默认地址，先将其他地址设为非默认
        if (address.isDefault) {
          state.address.list.forEach(item => {
            item.isDefault = false
          })
        }
        state.address.list[index] = address
      }
    },
    // 删除地址
    deleteAddress(state, addressId) {
      const index = state.address.list.findIndex(item => item.id === addressId)
      if (index > -1) {
        state.address.list.splice(index, 1)
      }
    },
    // 设置默认地址
    setDefaultAddress(state, addressId) {
      state.address.list.forEach(item => {
        item.isDefault = item.id === addressId
      })
    }
  },
  actions: {
    // 添加地址
    addAddress({ commit }, address) {
      // 生成唯一ID
      const newAddress = {
        ...address,
        id: new Date().getTime().toString()
      }
      commit('addAddress', newAddress)
      return newAddress
    },
    // 更新地址
    updateAddress({ commit }, address) {
      commit('updateAddress', address)
      return address
    },
    // 删除地址
    deleteAddress({ commit }, addressId) {
      commit('deleteAddress', addressId)
    }
  },
  modules: {
    user,
    cart,
    product,
    order,
    seckill,
    search
  }
}) 