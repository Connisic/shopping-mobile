<template>
  <div class="message-list">
    <div class="loading" v-if="loading">
      <van-loading color="#e53e3e" />
    </div>
    
    <empty v-else-if="!messages.length" description="暂无消息" />
    
    <template v-else>
      <div 
        class="message-item"
        v-for="message in messages"
        :key="message.id"
        @click="$emit('click', message)"
      >
        <div class="avatar">
          <van-image
            round
            width="40"
            height="40"
            :src="message.avatar || 'https://img01.yzcdn.cn/vant/cat.jpeg'"
          />
          <div class="unread-dot" v-if="!message.isRead"></div>
        </div>
        
        <div class="message-content">
          <div class="message-header">
            <span class="title">{{ message.title }}</span>
            <span class="time">{{ message.time || formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-preview">{{ message.content }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Empty from '@/components/Empty.vue'
import { formatDate } from '@/utils'

export default defineComponent({
  name: 'MessageList',
  components: {
    Empty
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup() {
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      
      const now = new Date()
      const messageDate = new Date(timestamp)
      
      // 同一天，显示时分
      if (now.toDateString() === messageDate.toDateString()) {
        return formatDate(timestamp, 'HH:mm')
      }
      
      // 昨天
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      if (yesterday.toDateString() === messageDate.toDateString()) {
        return '昨天'
      }
      
      // 一周内，显示星期
      const weekDays = ['日', '一', '二', '三', '四', '五', '六']
      const diffDays = Math.floor((now - messageDate) / (24 * 3600 * 1000))
      if (diffDays < 7) {
        return `周${weekDays[messageDate.getDay()]}`
      }
      
      // 更早，显示月日
      return formatDate(timestamp, 'MM-DD')
    }
    
    return {
      formatTime
    }
  }
})
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.message-list {
  background-color: #fff;
  
  .loading {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  
  .message-item {
    display: flex;
    padding: 12px 15px;
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    
    &:active {
      background-color: #f9f9f9;
    }
    
    .avatar {
      position: relative;
      margin-right: 12px;
      flex-shrink: 0;
      
      .unread-dot {
        position: absolute;
        top: 0;
        right: 0;
        width: 8px;
        height: 8px;
        background-color: #e53e3e;
        border-radius: 50%;
      }
    }
    
    .message-content {
      flex: 1;
      min-width: 0;
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        
        .title {
          font-size: 15px;
          color: #000;
          font-weight: normal;
        }
        
        .time {
          font-size: 12px;
          color: #999;
          flex-shrink: 0;
          margin-left: 10px;
        }
      }
      
      .message-preview {
        font-size: 13px;
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style> 