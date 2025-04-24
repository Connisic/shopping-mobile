<template>
  <div class="messages">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="title">
        消息 <span class="badge">(21)</span>
      </div>
      <div class="right-icons">
        <van-icon name="shopping-cart-o" class="header-icon" />
        <van-icon name="add-o" class="header-icon" />
      </div>
    </div>

    <!-- 最近消息标题 -->
    <div class="section-title">两周前的消息</div>

    <!-- 消息列表 -->
    <div class="message-list">
      <div 
        v-for="message in messageList" 
        :key="message.id"
        class="message-item"
        @click="goToMessageDetail(message)"
      >
        <div class="avatar">
          <van-image
            :src="message.avatar"
            width="50"
            height="50"
            radius="4"
            fit="cover"
          />
          <div class="unread-badge" v-if="message.unreadCount">{{ message.unreadCount }}</div>
        </div>
        <div class="message-content">
          <div class="message-header">
            <div class="shop-name">{{ message.title }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
          <div class="message-text" :class="{'message-text-unread': message.unreadCount > 0}">
            {{ message.content }}
          </div>
        </div>
        <div class="message-actions" v-if="message.hasMenu">
          <van-icon name="ellipsis" size="18" color="#999" />
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar fixed route>
      <van-tabbar-item to="/" icon="wap-home-o">
        <span class="tabbar-text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/messages" icon="chat-o" badge="21">
        <span class="tabbar-text">消息</span>
      </van-tabbar-item>
      <van-tabbar-item to="/cart" icon="cart-o">
        <span class="tabbar-text">购物车</span>
      </van-tabbar-item>
      <van-tabbar-item to="/profile" icon="contact">
        <span class="tabbar-text">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Messages',
  setup() {
    const router = useRouter()
    const keyword = ref('')
    
    // 消息列表数据
    const messageList = ref([
      {
        id: 1,
        title: '欧贝婷旗舰店',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '请确认收货地址',
        time: '25/03/10',
        unreadCount: 0
      },
      {
        id: 2,
        title: '仰泽旗舰店',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '请确认收货地址',
        time: '25/03/10',
        unreadCount: 0
      },
      {
        id: 3,
        title: 'risym旗舰店',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '亲，看您您的宝贝已经开始派送了，请记得签收...',
        time: '25/01/23',
        unreadCount: 4
      },
      {
        id: 4,
        title: '联想特价群',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: 'qq6162074455撤回了一条消息',
        time: '25/01/10',
        unreadCount: 0,
        hasMenu: true
      },
      {
        id: 5,
        title: '港仔文艺男',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '尊敬的tb05394227，上次买的宝贝还满意吗，...',
        time: '25/01/02',
        unreadCount: 0
      },
      {
        id: 6,
        title: 'XINROU新柔壁炉',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '欢迎您光临本店',
        time: '25/01/02',
        unreadCount: 0
      },
      {
        id: 7,
        title: '浮造积木研究所',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '亲，对造造的服务满意吗？',
        time: '24/12/31',
        unreadCount: 0
      },
      {
        id: 8,
        title: '闪客旗舰店',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '订单页面重新申请退货上传单号',
        time: '24/12/31',
        unreadCount: 0
      },
      {
        id: 9,
        title: '官方客服',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '您的账权限已到，点击查看>>',
        time: '24/12/31',
        unreadCount: 2
      },
      {
        id: 10,
        title: '蜀蒂旗舰店',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        content: '请确认收货地址',
        time: '24/12/18',
        unreadCount: 0
      }
    ])
    
    // 前往消息详情
    const goToMessageDetail = (message) => {
      router.push({
        path: '/message-detail',
        query: { id: message.id }
      })
    }
    
    onMounted(() => {
      // 可以在这里获取消息列表
    })
    
    return {
      keyword,
      messageList,
      goToMessageDetail
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.messages {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 50px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: $primary-gradient;
    box-shadow: $shadow-md;
    
    .title {
      font-size: $font-lg;
      font-weight: 600;
      color: white;
      
      .badge {
        font-size: $font-xs;
        color: rgba(255, 255, 255, 0.8);
        font-weight: normal;
        margin-left: 4px;
      }
    }
    
    .right-icons {
      display: flex;
      gap: 12px;
      
      .header-icon {
        font-size: 22px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border-radius: 50%;
        transition: all 0.3s ease;
        
        &:active {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(0.95);
        }
      }
    }
  }
  
  .search-bar {
    background-color: var(--primary-color);
    flex: 1;
    padding: 0 10px;
    
    .search-input {
      background-color: #f6f6f6;
      border-radius: 25px;
      height: 36px;
      
      :deep(.van-field__control) {
        color: #333;
        text-align: center;
      }
      
      :deep(.van-field__left-icon) {
        margin-right: 6px;
      }

      :deep(.van-field__placeholder) {
        text-align: center;
      }
    }
  }
  
  .section-title {
    padding: 12px 16px;
    font-size: $font-sm;
    color: $text-secondary;
    background-color: transparent;
    position: relative;
    margin-top: 6px;
    
    &::after {
      content: '';
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 1px;
      background: linear-gradient(to right, rgba($primary-color, 0.2), transparent);
    }
  }
  
  .message-list {
    background-color: $card-color;
    margin: 0 12px;
    border-radius: $radius-xl;
    box-shadow: $shadow-lg;
    overflow: hidden;
    
    .message-item {
      display: flex;
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:active {
        background-color: rgba($primary-color, 0.03);
        transform: translateX(4px);
      }
      
      .avatar {
        position: relative;
        margin-right: 14px;
        
        .van-image {
          ::v-deep(img) {
            border-radius: $radius-md;
            transition: transform 0.3s ease;
            box-shadow: $shadow-md;
          }
        }
        
        .unread-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: $primary-color;
          color: white;
          font-size: 11px;
          min-width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 9px;
          padding: 0 4px;
          box-shadow: 0 2px 4px rgba($primary-color, 0.3);
          z-index: 2;
        }
      }
      
      .message-content {
        flex: 1;
        min-width: 0;
        
        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          
          .shop-name {
            font-size: $font-md;
            color: $text-primary;
            font-weight: 500;
          }
          
          .message-time {
            color: $text-secondary;
            font-size: $font-xxs;
          }
        }
        
        .message-text {
          font-size: $font-sm;
          color: $text-secondary;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.5;
          
          &.message-text-unread {
            color: $text-primary;
            font-weight: 600;
            position: relative;
            
            &::before {
              content: '';
              position: absolute;
              left: -8px;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 16px;
              background-color: $primary-color;
              border-radius: $radius-sm;
              opacity: 0.7;
            }
          }
        }
      }
      
      .message-actions {
        display: flex;
        align-items: center;
        padding-left: 10px;
        
        .van-icon {
          padding: 6px;
          border-radius: 50%;
          transition: all 0.2s ease;
          
          &:active {
            background-color: rgba(0, 0, 0, 0.05);
            transform: scale(1.1);
          }
        }
      }
    }
  }
  
  :deep(.van-tabbar) {
    background-color: white;
    box-shadow: $shadow-up;
    
    .van-tabbar-item {
      &--active {
        color: $primary-color;
        font-weight: 500;
        
        .van-icon {
          transform: translateY(-2px);
        }
      }
      
      .tabbar-text {
        font-size: $font-xs;
        display: block;
        margin-top: 2px;
        transition: all 0.3s;
      }
    }
  }
}
</style> 