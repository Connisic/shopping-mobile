<template>
  <div class="profile">
    <!-- 用户信息区域 -->
    <div class="user-info">
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
          <div class="settings">
            <div class="setting-btn" @click="goToAddress">
              <van-icon name="location-o" />
              <span>地址</span>
            </div>
            <div class="setting-btn" @click="goToSettings">
              <van-icon name="setting-o" />
              <span>设置</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的订单 -->
    <div class="order-section">
      <div class="section-header">
        <span>我的订单</span>
        <div class="view-all" @click="viewAllOrders">
          <span>查看全部</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="order-types">
        <div class="type-item" @click="goToOrderList('pending_payment')">
          <van-icon name="paid" class="icon" badge="2" />
          <span>待付款</span>
        </div>
        <div class="type-item" @click="goToOrderList('pending_delivery')">
          <van-icon name="shopping-cart-o" class="icon" badge="1" />
          <span>待发货</span>
        </div>
        <div class="type-item" @click="goToOrderList('pending_receipt')">
          <van-icon name="logistics" class="icon" />
          <span>待收货</span>
        </div>
        <div class="type-item" @click="goToOrderList('pending_comment')">
          <van-icon name="comment-o" class="icon" />
          <span>待评价</span>
        </div>
      </div>
    </div>
    
    <!-- 为您推荐 -->
    <div class="recommend-section">
      <div class="section-header">
        <span>为您推荐</span>
      </div>
      <div class="recommend-list">
        <div class="recommend-item" v-for="(item, index) in recommendList" :key="index" @click="viewProduct(item)">
          <van-image :src="item.image" fit="cover" class="recommend-item-image" radius="4" />
          <div class="recommend-item-title">{{ item.title }}</div>
          <div class="recommend-item-price">¥{{ formatPrice(item.price) }}</div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTabbar" route>
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
        title: '时尚休闲连衣裙夏季新款',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 128.00
      },
      {
        id: 102,
        title: '简约百搭男士T恤纯棉短袖',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 69.90
      },
      {
        id: 103,
        title: '简约铝合金手机支架折叠式',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 19.80
      },
      {
        id: 104,
        title: '多功能便携蓝牙音箱户外防水',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 89.00
      },
      {
        id: 105,
        title: '轻薄便携式笔记本电脑散热器',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 59.00
      },
      {
        id: 106,
        title: '舒适透气运动鞋休闲跑步鞋',
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
      goToSettings
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.profile {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;

  .user-info {
    background-color: @primary-color;
    padding: 16px;
    color: white;
    position: relative;

    .user-profile {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .avatar-wrap {
        margin-right: 16px;
        flex-shrink: 0;

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
      }

      .user-info-container {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .user-detail {
          .username {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .user-level {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            opacity: 0.8;
          }
        }

        .settings {
          display: flex;
          gap: 18px;

          .setting-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;

            &:active {
              transform: scale(0.95);
            }

            .van-icon {
              font-size: 20px;
              margin-bottom: 4px;
              color: white;
            }

            span {
              font-size: 12px;
              font-weight: 500;
              color: white;
            }
          }
        }
      }
    }
  }

  .order-section {
    margin-top: 12px;
    background-color: white;
    padding: 16px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: bold;

      .view-all {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: normal;
        color: #999;
      }
    }
  }

  .order-types {
    display: flex;
    justify-content: space-between;

    .type-item {
      text-align: center;

      .icon {
        font-size: 24px;
        margin-bottom: 8px;
      }

      span {
        font-size: 12px;
        color: #333;
      }
    }
  }

  .functions-section {
    margin-top: 12px;
    background-color: white;
    padding: 16px;

    .section-header {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    
    .functions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      
      .function-item {
        text-align: center;
        cursor: pointer;
        
        .icon {
          font-size: 24px;
          margin-bottom: 8px;
          color: @primary-color;
        }
        
        span {
          font-size: 12px;
          color: #333;
        }
      }
    }
  }

  .recommend-section {
    margin-top: 12px;
    background-color: white;
    padding: 16px;

    .section-header {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    
    .recommend-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .recommend-item {
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        
        .recommend-item-image {
          width: 100%;
          height: 160px;
          display: block;
        }
        
        .recommend-item-title {
          padding: 8px 10px 4px;
          font-size: 14px;
          line-height: 1.4;
          color: #333;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .recommend-item-price {
          padding: 0 10px 10px;
          font-size: 16px;
          color: #ee0a24;
          font-weight: bold;
        }
      }
    }
  }
}
</style> 