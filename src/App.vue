<template>
  <div id="app" class="app" :class="{ 'dark': isDarkMode }">
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" class="page-component" />
        </keep-alive>
      </transition>
    </router-view>
    <van-tabbar v-model="active" active-color="#e53e3e" v-if="showTabbar">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/messages">消息</van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/cart" :badge="cartCount ? cartCount : ''">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { bus, isDarkMode as globalDarkMode } from '@/utils/eventBus'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    // 深色模式，使用全局状态
    const isDarkMode = globalDarkMode
    
    // 监听主题变化事件
    const onThemeChange = (theme) => {
      isDarkMode.value = theme === 'dark'
    }
    
    onMounted(() => {
      bus.on('theme-change', onThemeChange)
    })
    
    onBeforeUnmount(() => {
      bus.off('theme-change', onThemeChange)
    })
    
    // 导航栏激活的选项
    const active = ref(0)
    
    // 过渡效果
    const transitionName = ref('slide-left')
    
    // 记录导航历史，用于判断过渡方向
    const navHistory = ref([])
    
    // 购物车商品数量
    const cartCount = computed(() => store.getters['cart/totalCount'])
    
    // 监听路由变化，记录导航历史并设置过渡方向
    watch(() => route.fullPath, (to, from) => {
      if (!from) {
        navHistory.value.push(to)
        return
      }
      
      // 获取当前路由和前一个路由的路径
      const toPath = route.path
      const fromPath = router.currentRoute.value.path
      
      // 从首页到搜索页使用淡入淡出效果
      if ((fromPath === '/' && toPath === '/search') || 
          (fromPath === '/search' && toPath === '/')) {
        transitionName.value = 'fade'
      } else {
        const toIndex = navHistory.value.indexOf(to)
        if (toIndex !== -1) {
          // 如果是返回操作
          transitionName.value = 'slide-right'
          // 清除当前路由之后的历史记录
          navHistory.value = navHistory.value.slice(0, toIndex + 1)
        } else {
          // 如果是前进操作
          transitionName.value = 'slide-left'
          navHistory.value.push(to)
        }
      }
      
      // 设置对应的tabbar激活项
      if (route.path === '/') {
        active.value = 0
      } else if (route.path === '/messages') {
        active.value = 1
      } else if (route.path === '/cart') {
        active.value = 2
      } else if (route.path === '/profile') {
        active.value = 3
      }
    }, { immediate: true })
    
    // 判断是否显示tabbar
    const showTabbar = computed(() => {
      const hideTabbarRoutes = [
        '/search', 
        '/search-results', 
        '/message-detail', 
        '/checkout', 
        '/order-success',
        '/login',      // 登录页面
        '/register',   // 注册页面
        '/forget-password' // 忘记密码页面
      ]
      
      // 商品详情页
      if (route.path.startsWith('/product/')) {
        return false
      }
      
      // 订单详情页
      if (route.path.startsWith('/order/')) {
        return false
      }
      
      // 秒杀详情页
      if (route.path.startsWith('/seckill/')) {
        return false
      }
      
      return !hideTabbarRoutes.includes(route.path)
    })
    
    return {
      active,
      cartCount,
      showTabbar,
      transitionName,
      isDarkMode
    }
  }
}
</script>

<style lang="less">
#app {
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
}

.app {
  position: relative;
  min-height: 100vh;
  max-width: 750px;
  margin: 0 auto;
  overflow-x: hidden;
  
  .page-component {
    min-height: 100vh;
    width: 100%;
  }
  
  .van-tabbar {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 页面转场动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
}

// 滑动效果
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

// 淡入淡出效果
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
