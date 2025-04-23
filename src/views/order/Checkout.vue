<template>
  <div class="checkout">
    <van-nav-bar
      title="订单结算"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    
    <div class="checkout-content">
      <!-- 收货地址 -->
      <div class="address-card" @click="handleAddressClick">
        <div v-if="defaultAddress" class="address-info">
          <div class="address-header">
            <span class="name">{{ defaultAddress.name }}</span>
            <span class="tel">{{ defaultAddress.tel }}</span>
          </div>
          <div class="address-detail">
            {{ getFullAddress(defaultAddress) }}
          </div>
        </div>
        <div v-else class="address-empty">
          <van-icon name="add" class="add-icon" />
          <span>添加收货地址</span>
        </div>
        <van-icon name="arrow" class="right-icon" />
      </div>
      
      <!-- 商品列表 -->
      <div class="goods-card">
        <div class="card-title">商品信息</div>
        <div v-if="isFromOrder" class="order-info">
          <div class="order-no">订单号：{{ orderNo }}</div>
          <div class="order-amount">订单金额：<span class="price-value">¥{{ formatPrice(orderAmount) }}</span></div>
        </div>
        <div v-else class="goods-list">
          <div v-for="item in cartItems" :key="item.id" class="goods-item">
            <div class="goods-image">
              <van-image :src="item.image" width="80" height="80" fit="cover" />
            </div>
            <div class="goods-info">
              <div class="goods-title">{{ item.title }}</div>
              <div class="goods-sku" v-if="item.sku">{{ item.sku }}</div>
              <div class="goods-price">
                <span class="price">¥{{ formatPrice(item.price) }}</span>
                <span class="count">x{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="payment-card">
        <div class="card-title">支付方式</div>
        <div class="payment-options">
          <div class="payment-item" :class="{ 'payment-selected': paymentMethod === 'wechat' }" @click="paymentMethod = 'wechat'">
            <div class="payment-icon wechat">
              <van-icon name="wechat-pay" color="var(--wechat-color)" size="28" />
            </div>
            <span class="payment-name">微信支付</span>
            <div class="payment-select">
              <div class="select-circle" :style="paymentMethod === 'wechat' ? 'background-color: var(--wechat-color); border-color: var(--wechat-color);' : ''"></div>
            </div>
          </div>
          <div class="payment-item" :class="{ 'payment-selected': paymentMethod === 'alipay' }" @click="paymentMethod = 'alipay'">
            <div class="payment-icon alipay">
              <van-icon name="alipay" color="var(--alipay-color)" size="28" />
            </div>
            <span class="payment-name">支付宝</span>
            <div class="payment-select">
              <div class="select-circle" :style="paymentMethod === 'alipay' ? 'background-color: var(--alipay-color); border-color: var(--alipay-color);' : ''"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 结算栏 -->
    <van-submit-bar
      :price="(totalAmount || 0) * 100"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <template #tip>
        <div class="total-info">
          共{{ totalCount }}件商品，合计：<span class="total-price">¥{{ formatPrice(totalAmount) }}</span>
        </div>
      </template>
    </van-submit-bar>
    
    <!-- 地址选择弹窗 -->
    <van-popup
      v-model:show="showAddressPopup"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="address-popup">
        <div class="popup-header">
          <div class="popup-title">选择收货地址</div>
          <van-icon name="cross" class="close-icon" @click="showAddressPopup = false" />
        </div>
        <div class="address-list">
          <div 
            v-for="address in addresses" 
            :key="address.id" 
            class="address-item"
            @click="selectAddress(address)"
          >
            <div class="item-header">
              <span class="name">{{ address.name }}</span>
              <span class="tel">{{ address.tel }}</span>
              <span v-if="address.isDefault" class="tag">默认</span>
            </div>
            <div class="item-address">
              {{ getFullAddress(address) }}
            </div>
          </div>
          <div class="add-address" @click="goToAddAddress">
            <van-icon name="add-o" />
            <span>新增地址</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore, useOrderStore, useUserStore } from '@/stores'
import { Toast } from 'vant'
import { formatPrice } from '@/utils'

export default {
  name: 'Checkout',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const cartStore = useCartStore()
    const orderStore = useOrderStore()
    const userStore = useUserStore()
    
    const paymentMethod = ref('wechat')
    const showAddressPopup = ref(false)
    
    // 判断是否来自订单页面的支付
    const isFromOrder = computed(() => route.query.from === 'order')
    const orderId = ref(route.query.orderId)
    const orderNo = ref(route.query.orderNo)
    const orderAmount = ref(route.query.amount ? Number(route.query.amount) : 0)
    
    // 获取购物车选中商品
    const cartItems = computed(() => {
      if (isFromOrder.value) {
        // 如果是订单支付，返回空数组或者从store获取订单商品
        return []
      } else {
        return cartStore.checkedItems
      }
    })
    
    // 计算商品总价
    const totalAmount = computed(() => {
      if (isFromOrder.value) {
        return orderAmount.value
      }
      return cartStore.checkedAmount
    })
    
    // 计算商品总数
    const totalCount = computed(() => {
      if (isFromOrder.value) {
        return 1
      }
      return cartItems.value.reduce((total, item) => total + item.count, 0)
    })
    
    // 获取地址列表
    const addresses = computed(() => userStore.addresses)
    
    // 获取默认地址
    const defaultAddress = computed(() => userStore.defaultAddress)
    
    // 返回上一页
    const onClickLeft = () => {
      if (isFromOrder.value) {
        router.push('/orders')
      } else {
        router.push('/cart')
      }
    }
    
    // 获取完整地址
    const getFullAddress = (address) => {
      if (!address) return ''
      return `${address.province} ${address.city} ${address.county} ${address.addressDetail}`
    }
    
    // 选择地址
    const selectAddress = (address) => {
      // 在实际项目中，这里应该调用API设置默认地址
      userStore.setDefaultAddress(address.id)
      showAddressPopup.value = false
    }
    
    // 添加新地址
    const goToAddAddress = () => {
      showAddressPopup.value = false
      // 跳转到添加地址页面，使用replace替代push
      router.replace({
        path: '/address/edit',
        query: { 
          type: 'add',
          from: 'checkout'
        }
      })
    }
    
    // 处理地址点击
    const handleAddressClick = () => {
      if (addresses.value.length > 0) {
        // 有地址时，跳转到地址列表页面
        goToAddressList()
      } else {
        // 没有地址时，直接跳转到添加地址页面，使用replace替代push
        router.replace({
          path: '/address/edit',
          query: { 
            type: 'add',
            from: 'checkout'
          }
        })
      }
    }
    
    // 跳转到地址列表页面
    const goToAddressList = () => {
      router.push({
        path: '/address',
        query: { 
          from: 'checkout'
        }
      })
    }
    
    // 提交订单
    const onSubmit = async () => {
      if (!defaultAddress.value) {
        Toast('请先添加收货地址')
        return
      }
      
      // 处理订单支付的情况
      if (isFromOrder.value) {
        try {
          // 支付订单
          await orderStore.updateOrderStatus({ 
            id: orderId.value, 
            status: 'paid' 
          })
          
          // 跳转到支付成功页面
          router.push({
            path: '/order-success',
            query: {
              orderId: orderId.value,
              orderNo: orderNo.value,
              from: 'payment'
            }
          })
          
          Toast.success('支付成功')
        } catch (error) {
          console.error('支付订单失败', error)
          Toast.fail('支付失败，请重试')
        }
        return
      }
      
      // 处理正常购物车结算
      if (!cartItems.value.length) {
        Toast('购物车中没有商品')
        return
      }
      
      try {
        // 创建订单
        const order = await orderStore.createOrder({
          addressId: defaultAddress.value.id,
          items: cartItems.value,
          amount: totalAmount.value,
          paymentMethod: paymentMethod.value
        })
        
        // 跳转到订单成功页面
        router.push({
          path: '/order-success',
          query: {
            orderId: order.id,
            orderNo: order.orderNo
          }
        })
        
        // 清空购物车已选商品
        cartStore.clearCheckedItems()
      } catch (error) {
        console.error('创建订单失败', error)
        Toast.fail('创建订单失败，请重试')
      }
    }
    
    return {
      paymentMethod,
      showAddressPopup,
      cartItems,
      totalAmount,
      totalCount,
      addresses,
      defaultAddress,
      isFromOrder,
      orderId,
      orderNo,
      orderAmount,
      onClickLeft,
      getFullAddress,
      selectAddress,
      goToAddAddress,
      onSubmit,
      formatPrice,
      handleAddressClick,
      goToAddressList
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.checkout {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
  
  .checkout-content {
    padding: 10px;
    
    .address-card,
    .goods-card,
    .delivery-card,
    .payment-card,
    .remark-card {
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 10px;
      padding: 16px;
      position: relative;
    }
    
    .card-title {
      font-size: @font-size-md;
      font-weight: 500;
      margin-bottom: 12px;
    }
    
    .address-card {
      .address-info {
        .address-header {
          margin-bottom: 8px;
          
          .name {
            font-size: @font-size-md;
            font-weight: bold;
            margin-right: 10px;
          }
          
          .tel {
            font-size: @font-size-sm;
            color: @text-color-secondary;
          }
        }
        
        .address-detail {
          font-size: @font-size-sm;
          color: @text-color-secondary;
          padding-right: 20px;
        }
      }
      
      .address-empty {
        display: flex;
        align-items: center;
        color: @text-color-secondary;
        
        .add-icon {
          margin-right: 5px;
        }
      }
      
      .right-icon {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: @gray;
      }
    }
    
    .goods-card {
      .order-info {
        margin-bottom: 10px;
        padding: 15px;
        background-color: #f8f8f8;
        border-radius: 8px;
        
        .order-no {
          font-size: @font-size-sm;
          color: @text-color-secondary;
          margin-bottom: 10px;
        }
        
        .order-amount {
          font-size: @font-size-md;
          .price-value {
            color: @red;
            font-weight: bold;
            font-size: 20px;
          }
        }
      }
      
      .goods-list {
        .goods-item {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid @border-color;
          
          &:last-child {
            border-bottom: none;
          }
          
          .goods-image {
            margin-right: 10px;
          }
          
          .goods-info {
            flex: 1;
            
            .goods-title {
              font-size: @font-size-md;
              margin-bottom: 4px;
            }
            
            .goods-sku {
              font-size: @font-size-sm;
              color: @gray;
              margin-bottom: 4px;
            }
            
            .goods-price {
              display: flex;
              justify-content: space-between;
              
              .price {
                font-size: @font-size-md;
                color: @red;
              }
              
              .count {
                color: @gray;
              }
            }
          }
        }
      }
    }
    
    .payment-card {
      .payment-options {
        margin-top: 5px;
        
        .payment-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #ebedf0;
          cursor: pointer;
          position: relative;
          
          &:last-child {
            border-bottom: none;
          }
          
          &.payment-selected {
            background-color: #f7f8f9;
          }
          
          .payment-icon {
            width: 40px;
            height: 40px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
          }
          
          .wechat {
            background-color: rgba(7, 193, 96, 0.1);
          }
          
          .alipay {
            background-color: rgba(22, 119, 255, 0.1);
          }
          
          .payment-name {
            font-size: 15px;
            margin-right: auto;
          }
          
          .payment-select {
            margin-right: 10px;
            
            .select-circle {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              border: 1px solid #dcdee0;
            }
          }
        }
      }
    }
  }
  
  .total-info {
    text-align: right;
    font-size: @font-size-sm;
    color: @text-color-secondary;
    
    .total-price {
      color: @red;
      font-weight: bold;
    }
  }
  
  .address-popup {
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid @border-color;
      
      .popup-title {
        font-size: @font-size-lg;
        font-weight: 500;
      }
      
      .close-icon {
        font-size: 20px;
        color: @gray;
      }
    }
    
    .address-list {
      padding: 0 16px;
      max-height: calc(60vh - 50px);
      overflow-y: auto;
      
      .address-item {
        padding: 16px 0;
        border-bottom: 1px solid @border-color;
        
        .item-header {
          margin-bottom: 8px;
          
          .name {
            font-size: @font-size-md;
            font-weight: bold;
            margin-right: 10px;
          }
          
          .tel {
            font-size: @font-size-sm;
            color: @text-color-secondary;
            margin-right: 10px;
          }
          
          .tag {
            display: inline-block;
            font-size: @font-size-xs;
            color: @red;
            border: 1px solid @red;
            padding: 1px 4px;
            border-radius: 2px;
          }
        }
        
        .item-address {
          font-size: @font-size-sm;
          color: @text-color-secondary;
          line-height: 1.4;
        }
      }
      
      .add-address {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 0;
        color: @blue;
        
        .van-icon {
          margin-right: 5px;
        }
      }
    }
  }
}
</style> 