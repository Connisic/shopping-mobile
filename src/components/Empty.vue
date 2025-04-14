<template>
  <div class="empty-container">
    <van-empty
      :image="image"
      :description="description"
    >
      <template #bottom v-if="buttonText">
        <van-button round type="danger" size="small" @click="$emit('click')">
          {{ buttonText }}
        </van-button>
      </template>
    </van-empty>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    image: {
      type: String,
      default: 'default'
    },
    description: {
      type: String,
      default: '暂无数据'
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style lang="less" scoped>
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
}
</style> 