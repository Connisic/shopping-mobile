<template>
  <div class="order-detail">
    <van-nav-bar
      title="订单详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="detail-content" v-if="order">
      <!-- 订单状态 -->
      <div class="status-card">
        <div class="status-icon">
          <van-icon :name="getStatusIcon(order.status)" size="24" />
        </div>
        <div class="status-info">
          <div class="status-text">{{ getStatusText(order.status) }}</div>
          <div class="status-desc">{{ getStatusDescription(order.status) }}</div>
        </div>
      </div>

      <!-- 收货地址 -->
      <van-cell-group inset class="card-wrapper">
        <van-cell icon="location-o" class="address-cell">
          <template #title>
            <div class="contact-info">
              <span class="name">{{ order.address?.name }}</span>
              <span class="phone">{{ order.address?.phone }}</span>
            </div>
            <div class="address-detail">{{ formatAddress(order.address) }}</div>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 商品信息 -->
      <van-card
        v-for="item in order.items"
        :key="item.id"
        :price="formatPrice(item.price)"
        :title="item.title"
        :thumb="item.image"
        class="goods-card"
      >
        <template #num>
          <span class="goods-count">x{{ item.count }}</span>
        </template>
      </van-card>

      <!-- 订单信息 -->
      <van-cell-group inset class="card-wrapper">
        <van-cell title="订单编号：" :value="order.orderNo" />
        <van-cell title="创建时间：" :value="formatDate(order.createTime)" />
        <van-cell title="支付方式：" :value="order.paymentMethod || '未支付'" />
        <van-cell title="支付时间：" :value="order.payTime ? formatDate(order.payTime) : '未支付'" />
        <van-cell title="商品总额：" :value="'¥' + formatPrice(order.totalAmount)" />
        <van-cell title="运费：" :value="'¥' + formatPrice(order.freight || 0)" />
        <van-cell title="实付金额：" :value="'¥' + formatPrice(order.totalAmount + (order.freight || 0))" class="total-amount" />
      </van-cell-group>

      <!-- 底部按钮 -->
      <div class="bottom-bar">
        <template v-if="order.status === 'pending'">
          <van-button type="default" size="small" plain @click="handleCancelOrder">取消订单</van-button>
          <van-button type="danger" size="small" @click="handlePayOrder">立即支付</van-button>
        </template>
        <template v-if="order.status === 'delivered'">
          <van-button type="danger" size="small" @click="handleConfirmReceive">确认收货</van-button>
        </template>
        <template v-if="order.status === 'completed'">
          <van-button type="danger" plain size="small" @click="handleDeleteOrder">删除订单</van-button>
          <van-button type="danger" size="small" @click="handleBuyAgain">再次购买</van-button>
        </template>
      </div>
    </div>
    
    <van-empty v-else description="订单不存在" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { formatDate } from '@/utils/date'

export default {
  name: 'OrderDetail',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    const order = ref(null)
    const countdown = ref(0)
    let timer = null

    // 计算剩余支付时间
    const calculateCountdown = () => {
      if (!order.value || order.value.status !== 'pending') return

      const createTime = new Date(order.value.createTime).getTime()
      const now = Date.now()
      const timeLimit = 30 * 60 * 1000 // 30分钟支付时限
      const remainingTime = createTime + timeLimit - now

      if (remainingTime <= 0) {
        clearInterval(timer)
        countdown.value = 0
        // 订单超时，自动取消
        handleCancelOrder()
        return
      }

      countdown.value = remainingTime
    }

    // 格式化倒计时显示
    const formatCountdown = computed(() => {
      if (countdown.value <= 0) return '已超时'
      
      const minutes = Math.floor(countdown.value / 1000 / 60)
      const seconds = Math.floor((countdown.value / 1000) % 60)
      return `${minutes}分${seconds}秒`
    })

    // 开始倒计时
    const startCountdown = () => {
      calculateCountdown()
      timer = setInterval(() => {
        calculateCountdown()
      }, 1000)
    }

    // 获取订单详情
    const fetchOrderDetail = async () => {
      const orderId = route.params.id
      // 这里应该调用实际的API
      // 暂时使用模拟数据
      const mockOrders = {
        '1': {
          id: '1',
          orderNo: '20230401001',
          status: 'pending',
          totalAmount: 128.00,
          freight: 10.00,
          createTime: new Date().toISOString(),
          items: [
            {
              id: 1,
              title: '时尚休闲连衣裙夏季新款',
              image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
              price: 128.00,
              count: 1
            }
          ]
        },
        '2': {
          id: '2',
          orderNo: '20230401002',
          status: 'paid',
          totalAmount: 139.80,
          freight: 10.00,
          createTime: '2025-04-08 22:27:00',
          payTime: '2025-04-08 22:28:00',
          paymentMethod: '微信支付',
          items: [
            {
              id: 2,
              title: '简约百搭男士T恤纯棉短袖',
              image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
              price: 69.90,
              count: 2
            }
          ]
        },
        '3': {
          id: '3',
          orderNo: '20230401003',
          status: 'delivered',
          totalAmount: 89.00,
          freight: 10.00,
          createTime: '2025-04-08 22:27:00',
          payTime: '2025-04-08 22:28:00',
          paymentMethod: '支付宝',
          items: [
            {
              id: 3,
              title: '多功能便携蓝牙音箱户外防水',
              image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
              price: 89.00,
              count: 1
            }
          ]
        },
        '4': {
          id: '4',
          orderNo: '20230401004',
          status: 'completed',
          totalAmount: 19.80,
          freight: 10.00,
          createTime: '2025-04-08 22:27:00',
          payTime: '2025-04-08 22:28:00',
          paymentMethod: '微信支付',
          items: [
            {
              id: 4,
              title: '简约铝合金手机支架折叠式',
              image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
              price: 19.80,
              count: 1
            }
          ]
        }
      }

      // 所有订单都使用相同的地址
      const address = {
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南路XX号'
      }

      // 根据订单ID获取对应的订单数据
      const orderData = mockOrders[orderId]
      if (orderData) {
        order.value = {
          ...orderData,
          address
        }
      }
    }
    
    // 返回上一页
    const onClickLeft = () => {
      // 根据当前订单状态决定返回到哪个标签
      let type = '';
      switch(order.value?.status) {
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
      
      router.push({
        path: '/orders',
        query: { type }
      });
    }
    
    // 获取状态图标
    const getStatusIcon = (status) => {
      switch (status) {
        case 'pending':
          return 'clock-o'
        case 'paid':
          return 'logistics'
        case 'delivered':
          return 'send-gift-o'
        case 'completed':
          return 'comment-o'
        case 'cancelled':
          return 'close'
        default:
          return 'question-o'
      }
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      switch (status) {
        case 'pending':
          return '待付款'
        case 'paid':
          return '待发货'
        case 'delivered':
          return '待收货'
        case 'completed':
          return '待评价'
        case 'cancelled':
          return '已取消'
        default:
          return '未知状态'
      }
    }
    
    // 获取状态描述
    const getStatusDescription = (status) => {
      switch (status) {
        case 'pending':
          return '请尽快完成支付'
        case 'paid':
          return '商家正在处理您的订单'
        case 'delivered':
          return '商品正在配送中'
        case 'completed':
          return '期待您的评价'
        case 'cancelled':
          return '订单已取消'
        default:
          return ''
      }
    }
    
    // 格式化地址
    const formatAddress = (address) => {
      if (!address) return ''
      return `${address.province}${address.city}${address.district}${address.detail}`
    }
    
    // 格式化价格
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '0.00'
      return Number(price).toFixed(2)
    }
    
    // 支付订单
    const handlePayOrder = () => {
      router.push({
        path: '/checkout',
        query: {
          orderId: order.value.id,
          orderNo: order.value.orderNo,
          amount: order.value.totalAmount,
          from: 'detail'
        }
      })
    }
    
    // 取消订单
    const handleCancelOrder = async () => {
      try {
        await store.dispatch('order/updateOrderStatus', { 
          id: order.value.id, 
          status: 'cancelled' 
        })
        Toast('订单已取消')
        router.push({
          path: '/orders',
          query: { type: '' }
        });
      } catch (error) {
        console.error('取消订单失败', error)
      }
    }
    
    // 确认收货
    const handleConfirmReceive = () => {
      Dialog.confirm({
        title: '确认收货',
        message: '确认已收到商品吗？',
      }).then(() => {
        // 调用确认收货API
        Toast.success('已确认收货')
        router.push({
          path: '/orders',
          query: { type: 'pending_comment' }
        });
      })
    }
    
    // 删除订单
    const handleDeleteOrder = () => {
      Dialog.confirm({
        title: '删除订单',
        message: '确认删除该订单吗？',
      }).then(() => {
        // 调用删除订单API
        Toast.success('订单已删除')
        router.push({
          path: '/orders',
          query: { type: '' }
        });
      })
    }
    
    // 再次购买
    const handleBuyAgain = () => {
      // 将商品加入购物车
      Toast.success('已加入购物车')
      router.push('/cart')
    }
    
    onMounted(() => {
      fetchOrderDetail()
      startCountdown()
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })
    
    return {
      order,
      formatCountdown,
      onClickLeft,
      getStatusIcon,
      getStatusText,
      getStatusDescription,
      formatAddress,
      formatPrice,
      formatDate,
      handlePayOrder,
      handleCancelOrder,
      handleConfirmReceive,
      handleDeleteOrder,
      handleBuyAgain
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 80px;
  
  :deep(.van-nav-bar) {
    .van-icon,
    .van-nav-bar__text {
      color: var(--primary-color);
    }
  }
  
  .detail-content {
    padding-top: 46px;
    
    .status-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background-color: #ee0a24;
      color: #fff;
      
      .status-icon {
        margin-right: 15px;
        
        .van-icon {
          color: #fff;
        }
      }
      
      .status-info {
        .status-text {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .status-desc {
          font-size: 14px;
          opacity: 0.9;
        }
      }
    }
    
    .card-wrapper {
      margin: 12px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fff;
    }
    
    .address-cell {
      .contact-info {
        margin-bottom: 4px;
        
        .name {
          margin-right: 12px;
          font-weight: 500;
        }
        
        .phone {
          color: #666;
        }
      }
      
      .address-detail {
        color: #333;
        font-size: 14px;
      }
    }
    
    .goods-card {
      margin: 12px;
      background-color: #fff;
      border-radius: 8px;
      
      .goods-count {
        color: #666;
      }
    }
    
    .total-amount {
      :deep(.van-cell__value) {
        color: var(--primary-color);
        font-weight: 500;
      }
    }
    
    .bottom-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 16px;
      background-color: #fff;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      
      .van-button {
        margin-left: 10px;
        height: 32px;
        padding: 0 16px;
      }
    }
  }
}
</style> 