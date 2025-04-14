<template>
  <div class="message-bubble" :class="{ 'message-self': isSelf }">
    <div class="avatar-container">
      <van-image
        round
        width="40"
        height="40"
        :src="avatar"
      />
    </div>
    
    <div class="message-content">
      <div class="message-text">{{ content }}</div>
      <div class="message-time">{{ formatTime(timestamp) }}</div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils'

export default {
  name: 'MessageBubble',
  props: {
    content: {
      type: String,
      required: true
    },
    isSelf: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: () => new Date()
    }
  },
  setup() {
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      return formatDate(timestamp, 'HH:mm')
    }
    
    return {
      formatTime
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.message-bubble {
  display: flex;
  margin-bottom: 16px;
  
  .avatar-container {
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .message-content {
    max-width: 70%;
    
    .message-text {
      padding: 10px 12px;
      background-color: #fff;
      border-radius: 8px;
      line-height: 1.4;
      word-break: break-all;
    }
    
    .message-time {
      font-size: 12px;
      color: @gray;
      margin-top: 4px;
    }
  }
  
  &.message-self {
    flex-direction: row-reverse;
    
    .avatar-container {
      margin-right: 0;
      margin-left: 12px;
    }
    
    .message-content {
      align-items: flex-end;
      
      .message-text {
        background-color: @red;
        color: #fff;
      }
      
      .message-time {
        text-align: right;
      }
    }
  }
}
</style> 