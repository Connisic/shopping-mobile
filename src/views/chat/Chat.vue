<template>
  <div class="chat-page">
    <!-- 顶部导航栏 -->
    <div class="chat-header">
      <van-icon name="arrow-left" class="back-icon" @click="onBack" />
      <div class="shop-info">
        <div class="shop-name">{{ shopInfo.name }}</div>
        <div class="shop-status">{{ shopInfo.status }}</div>
      </div>
      <van-icon name="more-o" class="more-icon" />
    </div>

    <!-- 聊天内容区 -->
    <div class="chat-content" ref="chatContent">
      <div class="chat-date">2024年3月12日 14:30</div>
      
      <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
        <!-- 系统消息 -->
        <div v-if="message.type === 'system'" class="system-message">
          {{ message.content }}
        </div>
        
        <!-- 普通消息 -->
        <div v-else :class="['message', message.isSelf ? 'message-self' : 'message-other']">
          <img 
            v-if="!message.isSelf" 
            :src="shopInfo.avatar" 
            class="avatar"
            alt="shop avatar"
          >
          <div class="message-content">
            <div class="message-bubble">
              <!-- 商品卡片消息 -->
              <div v-if="message.type === 'product'" class="product-card">
                <img :src="message.product.image" class="product-image" />
                <div class="product-info">
                  <div class="product-name">{{ message.product.name }}</div>
                  <div class="product-price">¥{{ message.product.price }}</div>
                </div>
              </div>
              <!-- 文本消息 -->
              <div v-else class="text-content">{{ message.content }}</div>
            </div>
            <!-- 消息状态 -->
            <div v-if="message.isSelf" class="message-status">
              <van-icon name="checked" v-if="message.status === 'sent'" />
              <span v-else-if="message.status === 'sending'">发送中...</span>
              <span v-else-if="message.status === 'failed'" class="failed">
                发送失败 <span class="retry">重试</span>
              </span>
            </div>
          </div>
          <img 
            v-if="message.isSelf" 
            src="@/assets/avatar.jpg" 
            class="avatar"
            alt="self avatar"
          >
        </div>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="chat-footer">
      <div class="input-wrapper">
        <van-icon name="smile-o" class="emoji-icon" />
        <input 
          type="text" 
          v-model="inputMessage"
          class="message-input"
          placeholder="请输入消息..."
          @keyup.enter="sendMessage"
        >
        <van-icon name="photograph" class="image-icon" />
      </div>
      <div 
        class="send-btn"
        :class="{ active: inputMessage.trim() }"
        @click="sendMessage"
      >
        发送
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Chat',
  setup() {
    const router = useRouter()
    const chatContent = ref(null)
    const inputMessage = ref('')
    
    // 店铺信息
    const shopInfo = ref({
      name: '欧贝婷旗舰店',
      status: '在线',
      avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
    })
    
    // 聊天消息
    const messages = ref([
      {
        type: 'system',
        content: '商家已开启客服消息保护，请勿轻信商家客服在聊天中索要银行卡号、验证码等敏感信息'
      },
      {
        type: 'text',
        content: '您好，请问有什么可以帮您？',
        isSelf: false,
        time: '14:30'
      },
      {
        type: 'product',
        isSelf: false,
        product: {
          name: 'iPhone 15 Pro Max 256GB 原色钛金属',
          price: '9999',
          image: 'https://img01.yzcdn.cn/vant/cat.jpeg'
        }
      },
      {
        type: 'text',
        content: '这个手机现在有货吗？',
        isSelf: true,
        status: 'sent',
        time: '14:31'
      },
      {
        type: 'text',
        content: '有的呢，请问您需要什么颜色的呢？',
        isSelf: false,
        time: '14:31'
      }
    ])
    
    // 返回上一页
    const onBack = () => {
      router.back()
    }
    
    // 发送消息
    const sendMessage = async () => {
      if (!inputMessage.value.trim()) return
      
      // 添加新消息
      messages.value.push({
        type: 'text',
        content: inputMessage.value,
        isSelf: true,
        status: 'sent',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      })
      
      // 清空输入框
      inputMessage.value = ''
      
      // 滚动到底部
      await nextTick()
      scrollToBottom()
    }
    
    // 滚动到底部
    const scrollToBottom = () => {
      const content = chatContent.value
      if (content) {
        content.scrollTop = content.scrollHeight
      }
    }
    
    onMounted(() => {
      scrollToBottom()
    })
    
    return {
      chatContent,
      inputMessage,
      shopInfo,
      messages,
      onBack,
      sendMessage
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.chat-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;

  .chat-header {
    background: linear-gradient(135deg, @primary-color, darken(@primary-color, 15%));
    padding: 12px 16px;
    display: flex;
    align-items: center;
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .back-icon {
      font-size: 20px;
      padding: 4px;
    }
    
    .shop-info {
      flex: 1;
      margin: 0 12px;
      
      .shop-name {
        font-size: 16px;
        font-weight: 500;
      }
      
      .shop-status {
        font-size: 12px;
        opacity: 0.8;
      }
    }
    
    .more-icon {
      font-size: 20px;
      padding: 4px;
    }
  }

  .chat-content {
    flex: 1;
    padding: 12px 16px;
    overflow-y: auto;
    
    .chat-date {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin: 16px 0;
    }
    
    .system-message {
      text-align: center;
      font-size: 12px;
      color: #999;
      background: rgba(0, 0, 0, 0.05);
      padding: 6px 12px;
      border-radius: 12px;
      margin: 16px auto;
      max-width: 80%;
    }
    
    .message-wrapper {
      margin-bottom: 16px;
      
      .message {
        display: flex;
        align-items: flex-start;
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .message-content {
          margin: 0 12px;
          max-width: 70%;
          
          .message-bubble {
            padding: 10px 12px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            position: relative;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
            
            &::before {
              content: '';
              position: absolute;
              top: 14px;
              width: 6px;
              height: 12px;
            }
          }
          
          .message-status {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
            display: flex;
            align-items: center;
            
            .failed {
              color: #ff4d4f;
              
              .retry {
                color: @primary-color;
                margin-left: 4px;
                cursor: pointer;
              }
            }
          }
        }
        
        &.message-self {
          flex-direction: row-reverse;
          
          .message-bubble {
            background: linear-gradient(135deg, #ff3b30, #ff4f44);
            color: white;
            
            &::before {
              right: -6px;
              background: radial-gradient(circle at 0 0, transparent 6px, #ff4f44 0);
              transform: scaleX(-1);
            }
          }
          
          .message-status {
            justify-content: flex-end;
          }
        }
        
        &.message-other {
          .message-bubble {
            background: linear-gradient(135deg, #ffffff, #f8f8f8);
            color: #333;
            border: 1px solid rgba(0, 0, 0, 0.05);
            
            &::before {
              left: -6px;
              background: radial-gradient(circle at 0 0, transparent 6px, #ffffff 0);
            }
          }
        }
        
        .product-card {
          display: flex;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          width: 240px;
          
          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
          }
          
          .product-info {
            flex: 1;
            padding: 8px;
            
            .product-name {
              font-size: 13px;
              color: #333;
              line-height: 1.4;
              margin-bottom: 4px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            .product-price {
              color: @primary-color;
              font-size: 15px;
              font-weight: bold;
              
              &::before {
                content: '¥';
                font-size: 12px;
                margin-right: 1px;
              }
            }
          }
        }
      }
    }
  }

  .chat-footer {
    background: white;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: sticky;
    bottom: 0;
    box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
    
    .input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-radius: 20px;
      padding: 0 12px;
      
      .emoji-icon,
      .image-icon {
        font-size: 20px;
        color: #999;
        padding: 8px;
      }
      
      .message-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        height: 36px;
        font-size: 14px;
        margin: 0 8px;
        
        &::placeholder {
          color: #999;
        }
      }
    }
    
    .send-btn {
      padding: 8px 16px;
      border-radius: 18px;
      font-size: 14px;
      background: #f5f5f5;
      color: #999;
      transition: all 0.3s ease;
      
      &.active {
        background: linear-gradient(135deg, @primary-color, darken(@primary-color, 10%));
        color: white;
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}
</style> 