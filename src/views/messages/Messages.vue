<template>
  <div class="messages">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="title">
        消息 <span class="badge">(21)</span>
      </div>
      <div class="right-icons">
        <van-icon name="shopping-cart-o" size="40" />
        <van-icon name="add-o" size="40" />
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-field
        v-model="keyword"
        placeholder="搜索聊天记录"
        class="search-input"
        clearable
      >
        <template #left-icon>
          <van-icon name="search" size="18" color="#999" />
        </template>
      </van-field>
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

<style lang="less" scoped>
@import '@/styles/variables.less';

.messages {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 50px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: @primary-color;
    
    .title {
      font-size: 18px;
      font-weight: bold;
      color: white;
      
      .badge {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: normal;
      }
    }
    
    .right-icons {
      display: flex;
      gap: 15px;
      
      .van-icon {
        color: white;
      }
    }
  }
  
  .search-bar {
    padding: 0 15px 15px;
    background-color: @primary-color;
    
    .search-input {
      background-color: #f6f6f6;
      border-radius: 20px;
      
      :deep(.van-field__control) {
        color: #333;
      }
      
      :deep(.van-field__left-icon) {
        margin-right: 6px;
      }
    }
  }
  
  .section-title {
    padding: 10px 15px;
    font-size: 14px;
    color: #666;
    background-color: #f8f8f8;
  }
  
  .message-list {
    background-color: white;
    
    .message-item {
      display: flex;
      padding: 12px 15px;
      border-bottom: 1px solid #f5f5f5;
      
      &:active {
        background-color: #f9f9f9;
      }
      
      .avatar {
        position: relative;
        margin-right: 12px;
        
        .unread-badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: @primary-color;
          color: white;
          font-size: 11px;
          min-width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 8px;
          padding: 0 4px;
          transform: translate(30%, -30%);
        }
      }
      
      .message-content {
        flex: 1;
        min-width: 0;
        
        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          
          .shop-name {
            font-size: 15px;
            color: #333;
            font-weight: 500;
          }
          
          .message-time {
            color: #999;
            font-size: 12px;
          }
        }
        
        .message-text {
          font-size: 13px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          
          &.message-text-unread {
            color: #333;
            font-weight: 500;
          }
        }
      }
      
      .message-actions {
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
    }
  }
  
  :deep(.van-tabbar) {
    background-color: white;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
    
    .van-tabbar-item {
      &--active {
        color: @primary-color;
      }
      
      .tabbar-text {
        font-size: 12px;
        transform: scale(0.9);
        display: block;
        margin-top: 2px;
      }
    }
  }
}
</style> 