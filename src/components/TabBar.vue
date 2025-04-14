<template>
  <van-tabbar v-model="active" active-color="#e53e3e" fixed>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="chat-o" to="/messages">消息</van-tabbar-item>
    <van-tabbar-item icon="cart-o" to="/cart" :badge="cartCount ? cartCount : ''">购物车</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'TabBar',
  setup() {
    const route = useRoute()
    const store = useStore()
    
    // 导航栏激活的选项
    const active = ref(0)
    
    // 购物车商品数量
    const cartCount = computed(() => store.getters['cart/totalCount'])
    
    // 监听路由变化，设置对应的tabbar激活项
    watch(() => route.path, (path) => {
      if (path === '/') {
        active.value = 0
      } else if (path === '/messages') {
        active.value = 1
      } else if (path === '/cart') {
        active.value = 2
      } else if (path === '/profile') {
        active.value = 3
      }
    }, { immediate: true })
    
    return {
      active,
      cartCount
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabbar {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style> 