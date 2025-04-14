<template>
  <div class="orders-page">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="orders-content">
      <van-tabs v-model:active="activeTab" sticky animated class="order-tabs">
        <van-tab title="全部">
          <transition name="order-tab-content">
            <order-list :orders="allOrders" :loading="loading" />
          </transition>
        </van-tab>
        <van-tab title="待付款">
          <transition name="order-tab-content">
            <order-list :orders="pendingOrders" :loading="loading" />
          </transition>
        </van-tab>
        <van-tab title="待发货">
          <transition name="order-tab-content">
            <order-list :orders="paidOrders" :loading="loading" />
          </transition>
        </van-tab>
        <van-tab title="待收货">
          <transition name="order-tab-content">
            <order-list :orders="deliveredOrders" :loading="loading" />
          </transition>
        </van-tab>
        <van-tab title="待评价">
          <transition name="order-tab-content">
            <order-list :orders="completedOrders" :loading="loading" />
          </transition>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import OrderList from './components/OrderList.vue'

// 模拟订单数据
const mockOrders = [
  {
    id: '1',
    orderNo: '20230401001',
    status: 'pending',  // 待付款
    totalAmount: 128.00,
    items: [
      {
        id: 1,
        title: '时尚休闲连衣裙夏季新款',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 128.00,
        count: 1
      }
    ]
  },
  {
    id: '2',
    orderNo: '20230401002',
    status: 'paid',  // 待发货
    totalAmount: 139.80,
    items: [
      {
        id: 2,
        title: '简约百搭男士T恤纯棉短袖',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 69.90,
        count: 2
      }
    ]
  },
  {
    id: '3',
    orderNo: '20230401003',
    status: 'delivered',  // 待收货
    totalAmount: 89.00,
    items: [
      {
        id: 3,
        title: '多功能便携蓝牙音箱户外防水',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 89.00,
        count: 1
      }
    ]
  },
  {
    id: '4',
    orderNo: '20230401004',
    status: 'completed',  // 已完成/待评价
    totalAmount: 19.80,
    items: [
      {
        id: 4,
        title: '简约铝合金手机支架折叠式',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 19.80,
        count: 1
      }
    ]
  }
]

export default {
  name: 'OrdersPage',
  components: {
    OrderList
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // 获取查询参数中的类型
    const typeParam = route.query.type || ''
    
    // 活动标签
    const activeTab = ref(0)
    
    // 根据路由参数设置初始活动标签
    const setActiveTabByType = (type) => {
      switch(type) {
        case 'pending_payment':
          activeTab.value = 1
          break
        case 'pending_delivery':
          activeTab.value = 2
          break
        case 'pending_receipt':
          activeTab.value = 3
          break
        case 'pending_comment':
          activeTab.value = 4
          break
        default:
          activeTab.value = 0
      }
    }
    
    // 初始化时根据路由参数设置活动标签
    setActiveTabByType(typeParam)
    
    // 监听路由参数变化
    watch(() => route.query.type, (newType) => {
      if (newType) {
        setActiveTabByType(newType)
      }
    })
    
    // 监听标签变化并更新URL，保留用户浏览历史
    watch(() => activeTab.value, (newTab) => {
      let type = '';
      switch(newTab) {
        case 1:
          type = 'pending_payment';
          break;
        case 2:
          type = 'pending_delivery';
          break;
        case 3:
          type = 'pending_receipt';
          break;
        case 4:
          type = 'pending_comment';
          break;
        default:
          type = '';
      }
      
      // 使用replace更新URL，不增加历史记录
      if (type && type !== route.query.type) {
        router.replace({
          path: '/orders',
          query: { ...route.query, type }
        });
      }
    })
    
    // 加载状态
    const loading = ref(false)
    
    // 所有订单
    const orders = ref([])
    
    // 获取订单数据
    const fetchOrders = () => {
      loading.value = true
      
      // 模拟API请求延迟
      setTimeout(() => {
        orders.value = mockOrders
        loading.value = false
      }, 500)
    }
    
    // 根据状态过滤订单
    const allOrders = computed(() => orders.value)
    
    const pendingOrders = computed(() => 
      orders.value.filter(order => order.status === 'pending')
    )
    
    const paidOrders = computed(() => 
      orders.value.filter(order => order.status === 'paid')
    )
    
    const deliveredOrders = computed(() => 
      orders.value.filter(order => order.status === 'delivered')
    )
    
    const completedOrders = computed(() => 
      orders.value.filter(order => order.status === 'completed')
    )
    
    // 返回上一页
    const onClickLeft = () => {
      router.push('/profile')
    }
    
    // 组件挂载时获取订单数据
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      activeTab,
      loading,
      orders,
      allOrders,
      pendingOrders,
      paidOrders,
      deliveredOrders,
      completedOrders,
      onClickLeft
    }
  }
}
</script>

<style lang="less" scoped>
.orders-page {
  min-height: 100vh;
  background-color: var(--background-color);
  
  :deep(.van-nav-bar) {
    .van-icon,
    .van-nav-bar__text {
      color: var(--primary-color);
    }
  }
  
  .orders-content {
    padding-top: 46px;
    padding-bottom: 20px;
  }
  
  /* 标签页基本样式 */
  :deep(.van-tabs__wrap) {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  
  :deep(.van-tab--active) {
    color: var(--primary-color);
    font-weight: 500;
    position: relative;
  }
  
  :deep(.van-tabs__line) {
    background-color: var(--primary-color);
    transition: all 0.3s ease;
  }
  
  /* 标签内容动画 */
  .order-tab-content-enter-active,
  .order-tab-content-leave-active {
    transition: all 0.3s ease;
  }
  
  .order-tab-content-enter-from {
    opacity: 0;
    transform: translateX(20px);
  }
  
  .order-tab-content-leave-to {
    opacity: 0;
    transform: translateX(-20px);
    position: absolute;
  }
}
</style> 