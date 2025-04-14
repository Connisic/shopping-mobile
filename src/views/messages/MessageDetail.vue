<template>
  <div class="message-detail">
    <van-nav-bar
      title="消息详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    
    <div class="chat-container" ref="chatContainer">
      <div class="chat-header">
        <div class="shop-info">
          <div class="shop-avatar">
            <van-image
              round
              width="40"
              height="40"
              src="https://img01.yzcdn.cn/vant/cat.jpeg"
            />
          </div>
          <div class="shop-name">{{ shopName }}</div>
        </div>
      </div>
      
      <div class="chat-content">
        <div v-if="loading" class="loading-container">
          <van-loading color="#ee0a24" />
        </div>
        
        <template v-else>
          <div class="chat-time">{{ formatTime(chatMessages[0]?.timestamp) }}</div>
          
          <message-bubble
            v-for="(message, index) in chatMessages"
            :key="index"
            :content="message.content"
            :is-self="message.isSelf"
            :avatar="message.avatar"
            :timestamp="message.timestamp"
          />
        </template>
      </div>
    </div>
    
    <div class="chat-footer">
      <van-field
        v-model="message"
        placeholder="请输入消息"
        class="message-input"
        clearable
      >
        <template #button>
          <van-button 
            size="small" 
            type="danger" 
            class="send-btn"
            :disabled="!message.trim()"
            @click="sendMessage"
          >
            发送
          </van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils'
import MessageBubble from '@/components/MessageBubble.vue'

export default {
  name: 'MessageDetail',
  components: {
    MessageBubble
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 获取消息ID，可用于实际开发中从服务器获取消息详情
    // eslint-disable-next-line no-unused-vars
    const messageId = computed(() => route.query.id)
    const shopName = ref('YY官方旗舰店')
    const loading = ref(true)
    const message = ref('')
    const chatContainer = ref(null)
    
    // 聊天消息
    const chatMessages = ref([])
    
    // 导航栏返回按钮
    const onClickLeft = () => {
      router.back()
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      return formatDate(timestamp)
    }
    
    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      })
    }
    
    // 发送消息
    const sendMessage = () => {
      if (!message.value.trim()) return
      
      const newMessage = {
        content: message.value,
        timestamp: new Date(),
        isSelf: true,
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
      }
      
      chatMessages.value.push(newMessage)
      message.value = ''
      
      scrollToBottom()
      
      // 模拟商家回复
      setTimeout(() => {
        const reply = {
          content: '您好，有什么可以帮助您的吗？',
          timestamp: new Date(),
          isSelf: false,
          avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
        }
        
        chatMessages.value.push(reply)
        scrollToBottom()
      }, 1000)
    }
    
    // 获取聊天记录
    const fetchChatMessages = () => {
      loading.value = true
      
      // 模拟请求
      setTimeout(() => {
        // 模拟数据
        chatMessages.value = [
          {
            content: '您好，欢迎来到YY官方旗舰店，有什么可以帮助您的吗？',
            timestamp: new Date(Date.now() - 3600000 * 24),
            isSelf: false,
            avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
          },
          {
            content: '我想咨询一下我购买的商品什么时候发货？',
            timestamp: new Date(Date.now() - 3600000 * 23),
            isSelf: true,
            avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
          },
          {
            content: '您好，请问您的订单号是多少呢？',
            timestamp: new Date(Date.now() - 3600000 * 22),
            isSelf: false,
            avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
          },
          {
            content: 'YY20230401001',
            timestamp: new Date(Date.now() - 3600000 * 21),
            isSelf: true,
            avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
          },
          {
            content: '您的订单已于昨天发出，预计3-5天内送达，请您耐心等待哦~',
            timestamp: new Date(Date.now() - 3600000 * 20),
            isSelf: false,
            avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
          }
        ]
        
        loading.value = false
        scrollToBottom()
      }, 1000)
    }
    
    onMounted(() => {
      fetchChatMessages()
    })
    
    return {
      shopName,
      loading,
      message,
      chatMessages,
      chatContainer,
      onClickLeft,
      formatTime,
      sendMessage
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.message-detail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: @gray-light;
  
  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 60px;
    
    .chat-header {
      padding: 16px;
      background-color: #fff;
      margin-bottom: 10px;
      
      .shop-info {
        display: flex;
        align-items: center;
        
        .shop-avatar {
          margin-right: 10px;
        }
        
        .shop-name {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    
    .chat-content {
      padding: 0 16px;
      
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
      }
      
      .chat-time {
        text-align: center;
        font-size: 12px;
        color: @gray;
        margin: 16px 0;
      }
    }
  }
  
  .chat-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 10px 16px;
    box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    
    .message-input {
      width: 100%;
      
      :deep(.van-field__control) {
        background-color: @gray-light;
        border-radius: 20px;
        padding: 8px 12px;
      }
      
      .send-btn {
        margin-left: 8px;
        border-radius: 4px;
      }
    }
  }
}
</style> 