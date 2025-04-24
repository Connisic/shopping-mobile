<template>
  <div class="profile">
    <!-- 用户信息区域 -->
    <div class="user-info">
      <div class="user-top-actions">
        <div class="setting-btn" @click="goToAddress">
          <van-icon name="location-o" />
        </div>
        <div class="setting-btn" @click="goToSettings">
          <van-icon name="setting-o" />
        </div>
      </div>
      
      <div class="user-profile">
        <div class="avatar-wrap">
          <img class="avatar" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="avatar">
        </div>
        <div class="user-info-container">
          <div class="user-detail">
            <div class="username">用户6829</div>
            <div class="user-level">
              <van-icon name="medal-o" />
              <span>普通会员</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加用户成就区域 -->
      <div class="user-achievements">
        <div class="achievement-item">
          <van-icon name="star-o" class="achievement-icon" />
          <span class="count">8</span>
          <span class="label">收藏</span>
        </div>
        <div class="achievement-item">
          <van-icon name="footprint-o" class="achievement-icon" />
          <span class="count">12</span>
          <span class="label">足迹</span>
        </div>
        <div class="achievement-item">
          <van-icon name="coupon-o" class="achievement-icon" />
          <span class="count">3</span>
          <span class="label">优惠券</span>
        </div>
      </div>
    </div>

    <!-- 我的订单 -->
    <van-cell-group inset class="order-section card-effect">
      <van-cell title="我的订单" is-link value="查看全部" @click="viewAllOrders" />
      <div class="order-types">
        <div class="type-item" @click="goToOrderList('pending_payment')">
          <div class="icon-wrapper">
            <van-icon name="balance-pay" class="icon" />
            <div class="count-tag" v-if="pendingPaymentCount > 0">{{ pendingPaymentCount }}</div>
          </div>
          <span>待付款</span>
        </div>
        <div class="type-item" @click="goToOrderList('pending_delivery')">
          <div class="icon-wrapper">
            <van-icon name="cart-circle-o" class="icon" />
            <div class="count-tag" v-if="pendingDeliveryCount > 0">{{ pendingDeliveryCount }}</div>
          </div>
          <span>待发货</span>
        </div>
        <div class="type-item" @click="goToOrderList('pending_receipt')">
          <div class="icon-wrapper">
            <van-icon name="logistics" class="icon" />
          </div>
          <span>待收货</span>
        </div>
        <div class="type-item" @click="goToOrderList('pending_comment')">
          <div class="icon-wrapper">
            <van-icon name="comment-o" class="icon" />
          </div>
          <span>待评价</span>
        </div>
      </div>
    </van-cell-group>
    
    <!-- 为您推荐 -->
    <div class="recommend-section">
      
      <div class="recommend-list">
        <div 
          class="recommend-item card-effect" 
          v-for="(item, index) in recommendList" 
          :key="index" 
          @click="viewProduct(item)"
        >
          <van-image :src="item.image" fit="cover" class="recommend-item-image" radius="8" lazy-load />
          <div class="recommend-item-content">
            <div class="recommend-item-title">{{ item.title }}</div>
            <div class="recommend-item-price">¥{{ formatPrice(item.price) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTabbar" route class="custom-tabbar">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/message">消息</van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const activeTabbar = ref(3)
    
    // 徽标数量
    const pendingPaymentCount = ref(2)
    const pendingDeliveryCount = ref(1)

    const viewAllOrders = () => {
      router.push('/orders')
    }

    const goToOrderList = (type) => {
      router.push({
        path: '/orders',
        query: { 
          type: type 
        }
      })
    }
    
    // 推荐商品列表
    const recommendList = ref([
      {
        id: 101,
        title: '时尚休闲连衣裙夏季新款女装气质修身显瘦裙子',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 128.00
      },
      {
        id: 102,
        title: '简约百搭男士T恤纯棉短袖打底衫',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 69.90
      },
      {
        id: 103,
        title: '简约铝合金手机支架折叠式桌面支架',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 19.80
      },
      {
        id: 104,
        title: '多功能便携蓝牙音箱户外防水小音响',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 89.00
      },
      {
        id: 105,
        title: '轻薄便携式笔记本电脑散热器游戏本降温底座',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 59.00
      },
      {
        id: 106,
        title: '舒适透气运动鞋休闲跑步鞋男女情侣款',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 199.00
      }
    ])
    
    // 格式化价格
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '0.00'
      return parseFloat(price).toFixed(2)
    }
    
    // 查看商品详情
    const viewProduct = (product) => {
      router.push(`/product/${product.id}`)
    }
    
    // 管理收货地址
    const goToAddress = () => {
      router.push('/address')
    }

    // 跳转到设置页面
    const goToSettings = () => {
      router.push('/settings')
    }

    return {
      activeTabbar,
      viewAllOrders,
      goToOrderList,
      recommendList,
      formatPrice,
      viewProduct,
      goToAddress,
      goToSettings,
      pendingPaymentCount,
      pendingDeliveryCount
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme/_mixins.scss'; // 引入主题混入

// 卡片浮动效果
.card-effect {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
}

.profile {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;

  .user-info {
    background: linear-gradient(135deg, #ff4d4f, #ffb1b3);
    padding: 16px 16px 12px;
    color: white;
    position: relative;
    border-radius: 0 0 20px 20px;
    margin-bottom: 12px;
    box-shadow: 0 4px 16px rgba(245, 34, 45, 0.2);
    backdrop-filter: blur(10px);
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -30px;
      right: -20px;
      width: 120px;
      height: 120px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      z-index: 0;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: -40px;
      left: -30px;
      width: 150px;
      height: 150px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
      z-index: 0;
    }

    .user-top-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
      
      .setting-btn {
        margin-left: 12px;
        width: 36px;
        height: 36px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
        transition: transform 0.2s ease, background-color 0.2s ease;
        
        .van-icon {
          font-size: 18px;
        }
        
        &:active {
          transform: translateY(2px);
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .user-profile {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;

      .avatar-wrap {
        width: 60px;
        height: 60px;
        margin-right: 12px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.8);
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        
        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-info-container {
        flex: 1;
        
        .user-detail {
          .username {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          
          .user-level {
            font-size: 11px;
            display: flex;
            align-items: center;
            background-color: rgba(255, 204, 0, 0.2);
            border-radius: 10px;
            padding: 2px 8px;
            display: inline-flex;
            box-shadow: 0 1px 4px rgba(255, 204, 0, 0.2);
            
            .van-icon {
              margin-right: 4px;
              color: #ffcc00;
              font-size: 12px;
            }
          }
        }
      }
    }
    
    .user-achievements {
      display: flex;
      justify-content: space-around;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 10px 0;
      position: relative;
      z-index: 1;
      
      .achievement-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .achievement-icon {
          font-size: 16px;
          margin-bottom: 2px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .count {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
        }
        
        .label {
          font-size: 11px;
          opacity: 0.9;
          margin-top: 2px;
        }
      }
    }
  }

  .order-section {
    margin: 0 12px 16px;
    border-radius: 12px;
    overflow: hidden;
    
    :deep(.van-cell) {
      align-items: center;
      padding: 16px;
      
      &::after {
        border-bottom: 1px solid #f5f5f5;
      }
      
      .van-cell__title {
        font-size: 16px;
        font-weight: 600;
      }
      
      .van-cell__value {
        color: #969799;
      }
    }
  }

  .order-types {
    display: flex;
    justify-content: space-around;
    padding: 20px 8px 24px;
    
    .type-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 13px;
      position: relative;
      width: 60px;
      
      .icon-wrapper {
        position: relative;
        margin-bottom: 8px;
      }
      
      .icon {
        font-size: 24px;
        color: #ee0a24;
        transition: transform 0.2s ease;
      }
      
      &:active .icon {
        transform: scale(1.1);
      }
      
      .count-tag {
        position: absolute;
        top: -8px;
        right: -10px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        background-color: #ee0a24;
        color: white;
        border-radius: 8px;
        font-size: 10px;
        padding: 0 4px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(238, 10, 36, 0.2);
      }
    }
  }

  .recommend-section {
    margin-top: 16px;
    padding: 0 12px;
    
    .recommend-header {
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;
      
      :deep(.van-cell) {
        padding: 16px;
        
        .van-cell__title {
          font-size: 16px;
          font-weight: 600;
        }
        
        .personalized-tag {
          font-size: 12px;
          background-color: #ffece8;
          color: #ee0a24;
          padding: 2px 8px;
          border-radius: 10px;
        }
      }
    }
  }

  .recommend-list {
    column-count: 2;
    column-gap: 12px;
    
    .recommend-item {
      break-inside: avoid;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
      cursor: pointer;
      
      .recommend-item-image {
        width: 100%;
        height: 120px;
      }
      
      .recommend-item-content {
        padding: 10px 12px;
      }
      
      .recommend-item-title {
        font-size: 13px;
        color: #323233;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
        height: 36px;
      }
      
      .recommend-item-price {
        font-size: 16px;
        color: #ee0a24;
        font-weight: 600;
      }
    }
  }
  
  .custom-tabbar {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    
    :deep(.van-tabbar-item--active) {
      color: #ee0a24;
      font-weight: 500;
      
      .van-tabbar-item__icon {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
      }
    }
  }
}
</style> 