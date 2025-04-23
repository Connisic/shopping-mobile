import { defineStore } from 'pinia'

export const useAddressStore = defineStore('address', {
  state: () => ({
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
  }),
  
  getters: {
    addressList: (state) => state.list,
    defaultAddress: (state) => state.list.find(address => address.isDefault) || state.list[0]
  },
  
  actions: {
    // 添加地址
    addAddress(address) {
      // 生成唯一ID
      const newAddress = {
        ...address,
        id: new Date().getTime().toString()
      }
      
      // 如果是默认地址，先将其他地址设为非默认
      if (newAddress.isDefault) {
        this.list.forEach(item => {
          item.isDefault = false
        })
      }
      
      this.list.push(newAddress)
      return newAddress
    },
    
    // 更新地址
    updateAddress(address) {
      const index = this.list.findIndex(item => item.id === address.id)
      if (index > -1) {
        // 如果是默认地址，先将其他地址设为非默认
        if (address.isDefault) {
          this.list.forEach(item => {
            item.isDefault = false
          })
        }
        this.list[index] = address
      }
      return address
    },
    
    // 删除地址
    deleteAddress(addressId) {
      const index = this.list.findIndex(item => item.id === addressId)
      if (index > -1) {
        this.list.splice(index, 1)
      }
    },
    
    // 设置默认地址
    setDefaultAddress(addressId) {
      this.list.forEach(item => {
        item.isDefault = item.id === addressId
      })
    }
  }
}) 