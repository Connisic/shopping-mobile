<template>
  <div class="order-list">
    <div v-if="loading" class="loading">
      <van-loading color="#e53e3e" />
    </div>
    
    <van-empty v-else-if="!orders.length" description="暂无订单" />
    
    <div v-else class="orders">
      <div v-for="order in orders" :key="order.id" class="order-card" @click="handleViewOrder(order)">
        <!-- 订单头部 -->
        <div class="order-header">
          <span class="order-no">订单号：{{ order.orderNo }}</span>
          <span class="order-status" :class="order.status">{{ getStatusText(order.status) }}</span>
        </div>

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

        <!-- 订单底部 -->
        <div class="order-footer">
          <div class="order-total">
            共{{ getTotalCount(order.items) }}件商品，总计：
            <span class="total-price">¥{{ formatPrice(order.totalAmount) }}</span>
          </div>
          
          <div class="order-actions">
            <van-button 
              v-if="order.status === 'pending'" 
              type="danger" 
              size="small"
              @click.stop="handlePayOrder(order)"
            >
              去支付
            </van-button>
            
            <van-button 
              v-if="order.status === 'delivered'" 
              type="danger" 
              plain 
              size="small"
              @click.stop="handleConfirmReceive(order)"
            >
              确认收货
            </van-button>

            <van-button 
              v-if="order.status === 'completed'" 
              type="danger" 
              size="small"
              @click.stop="handleComment(order)"
            >
              去评价
            </van-button>
            
            <van-button 
              size="small"
              plain
              @click.stop="handleViewOrder(order)"
            >
              查看详情
            </van-button>
            
            <van-button 
              v-if="order.status === 'pending'" 
              size="small"
              plain
              @click.stop="handleCancelOrder(order)"
            >
              取消订单
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog } from 'vant'

export default {
  name: 'OrderList',
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // 获取订单状态文本
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
    
    // 获取订单总数量
    const getTotalCount = (items) => {
      return items.reduce((total, item) => total + item.count, 0)
    }
    
    // 格式化价格
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '0.00'
      return Number(price).toFixed(2)
    }
    
    // 支付订单
    const handlePayOrder = (order) => {
      // 跳转到结算页面
      router.push({
        path: '/checkout',
        query: {
          orderId: order.id,
          orderNo: order.orderNo,
          amount: order.totalAmount,
          from: 'order'
        }
      })
    }
    
    // 确认收货
    const handleConfirmReceive = (order) => {
      Dialog.confirm({
        title: '确认收货',
        message: '确认已收到商品吗？',
      }).then(() => {
        store.dispatch('order/updateOrderStatus', { id: order.id, status: 'completed' })
      }).catch(() => {
        // 取消操作
      })
    }
    
    // 查看订单详情
    const handleViewOrder = (order) => {
      router.push(`/order/${order.id}`)
    }
    
    // 取消订单
    const handleCancelOrder = (order) => {
      Dialog.confirm({
        title: '取消订单',
        message: '确认取消该订单吗？',
      }).then(() => {
        store.dispatch('order/updateOrderStatus', { id: order.id, status: 'cancelled' })
      }).catch(() => {
        // 取消操作
      })
    }
    
    // 去评价
    const handleComment = (order) => {
      router.push({
        path: `/comment/${order.id}`,
        query: { orderNo: order.orderNo }
      })
    }
    
    return {
      getStatusText,
      getTotalCount,
      handlePayOrder,
      handleConfirmReceive,
      handleViewOrder,
      handleCancelOrder,
      handleComment,
      formatPrice
    }
  }
}
</script>

<style lang="less" scoped>
.order-list {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding: 12px;
  
  .loading {
    display: flex;
    justify-content: center;
    padding: 30px 0;
  }
  
  .orders {
    .order-card {
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #f5f5f5;
        
        .order-no {
          font-size: 14px;
          color: #666;
        }
        
        .order-status {
          font-size: 14px;
          
          &.pending {
            color: #ff976a;
          }
          
          &.paid {
            color: #1989fa;
          }
          
          &.delivered {
            color: #07c160;
          }
          
          &.completed {
            color: #969799;
          }
          
          &.cancelled {
            color: #969799;
          }
        }
      }
      
      .goods-card {
        margin: 0;
        background-color: #fff;
        
        &:not(:last-child) {
          border-bottom: 1px solid #f5f5f5;
        }
        
        .goods-count {
          color: #666;
        }
      }
      
      .order-footer {
        padding: 12px;
        border-top: 1px solid #f5f5f5;
        
        .order-total {
          margin-bottom: 12px;
          text-align: right;
          font-size: 14px;
          color: #666;
          
          .total-price {
            color: var(--primary-color);
            font-weight: 500;
            font-size: 16px;
          }
        }
        
        .order-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          
          .van-button {
            height: 32px;
            padding: 0 16px;
          }
        }
      }
    }
  }
}
</style> 