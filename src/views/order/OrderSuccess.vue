<template>
  <div class="order-success">
    <div class="success-icon">
      <van-icon name="checked" />
    </div>
    <div class="success-text">下单成功</div>
    <div class="order-info">
      <div class="info-item">
        <span class="label">订单号：</span>
        <span class="value">{{ order.orderNo || '---' }}</span>
      </div>
      <div class="info-item">
        <span class="label">订单金额：</span>
        <span class="value price">¥{{ formatPrice(order.totalAmount) }}</span>
      </div>
    </div>
    <div class="buttons">
      <van-button type="default" block @click="viewOrder">查看订单</van-button>
      <van-button type="danger" block @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores'
import { Toast } from 'vant'
import { formatPrice } from '@/utils'

export default {
  name: 'OrderSuccess',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const orderStore = useOrderStore()
    
    // 从路由参数获取订单ID
    const orderId = computed(() => Number(route.query.orderId))
    
    // 获取当前订单
    const order = computed(() => orderStore.currentOrder || {})
    
    // 查看订单详情
    const viewOrder = () => {
      // 根据当前订单状态决定跳转到哪个标签
      let type = '';
      if (order.value && order.value.status) {
        switch(order.value.status) {
          case 'pending':
            type = 'pending_payment';
            break;
          case 'paid':
            type = 'pending_delivery';
            break;
          case 'delivered':
            type = 'pending_receipt';
            break;
          case 'completed':
            type = 'pending_comment';
            break;
          default:
            type = '';
        }
      } else {
        // 默认跳转到待付款
        type = 'pending_payment';
      }
      
      router.push({
        path: '/orders',
        query: { type }
      })
    }
    
    // 返回首页
    const goHome = () => {
      router.push('/')
    }
    
    // 加载订单详情
    const fetchOrderDetail = async () => {
      if (!orderId.value) {
        Toast.fail('订单ID不存在')
        setTimeout(() => {
          router.replace('/')
        }, 1500)
        return
      }
      
      try {
        await orderStore.fetchOrderDetail(orderId.value)
      } catch (error) {
        console.error('获取订单详情失败', error)
        Toast.fail('获取订单详情失败')
      }
    }
    
    onMounted(() => {
      fetchOrderDetail()
    })
    
    return {
      order,
      viewOrder,
      goHome,
      formatPrice
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.order-success {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  
  .success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: @red;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    
    .van-icon {
      font-size: 40px;
    }
  }
  
  .success-text {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .order-info {
    width: 100%;
    background-color: #f7f8fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        color: @text-color-secondary;
      }
      
      .value {
        color: @text-color;
        font-weight: 500;
        
        &.price {
          color: @red;
        }
      }
    }
  }
  
  .buttons {
    width: 100%;
    
    .van-button {
      margin-bottom: 15px;
    }
  }
}
</style> 