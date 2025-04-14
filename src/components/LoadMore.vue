<template>
  <div class="load-more">
    <template v-if="loading">
      <van-loading size="24px" color="#e53e3e">加载中...</van-loading>
    </template>
    <template v-else-if="finished">
      <div class="load-more-text">{{ finishedText }}</div>
    </template>
    <template v-else>
      <div class="load-more-text" @click="$emit('load')">{{ loadingText }}</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'LoadMore',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '点击加载更多'
    },
    finishedText: {
      type: String,
      default: '没有更多了'
    }
  },
  emits: ['load']
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 10px 0;
  
  .load-more-text {
    color: @gray;
    font-size: @font-size-sm;
  }
}
</style> 