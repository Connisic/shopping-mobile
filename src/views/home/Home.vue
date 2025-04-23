<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索特价商品"
        readonly
        @click="goToSearch"
      >
        <template #left-icon>
          <van-icon name="search" />
        </template>
        <template #right-icon>
          <van-icon name="photograph" />
        </template>
      </van-search>
    </div>

    <!-- 分类标签栏 -->
    <div class="tab-bar">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        :class="['tab', { active: activeTab === index }]"
        @click="activeTab = index"
        style="-webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none;"
      >
        {{ tab }}
      </div>
      <div class="tab" style="-webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none;">
        <van-icon name="more-o" />
      </div>
    </div>

    <!-- 分类图标区 -->
    <div class="category-icons">
      <div class="category-item" v-for="category in categories" :key="category.id">
        <div :class="['category-icon', category.bgColor]">
          <van-icon :name="category.icon" />
        </div>
        <span class="text-xs">{{ category.name }}</span>
      </div>
    </div>

    <!-- 优惠券区 -->
    <div class="coupon-bar">
      <van-icon name="coupon-o" class="mr-2" />
      <span class="text-sm">新人专享 | 全场满300减30</span>
      <van-button size="mini" class="ml-auto" :color="themeColor" plain>立即领取</van-button>
    </div>

    <!-- 限时秒杀 -->
    <div class="seckill-section">
      <div class="section-header">
        <div class="title">
          <span class="text">限时秒杀</span>
          <div class="countdown">
            <span class="countdown-text">距结束</span>
            <div class="countdown-number">
              <span class="time-block">{{ formatTime(countdown.hours) }}</span>
              <span class="colon">:</span>
              <span class="time-block">{{ formatTime(countdown.minutes) }}</span>
              <span class="colon">:</span>
              <span class="time-block">{{ formatTime(countdown.seconds) }}</span>
            </div>
          </div>
        </div>
        <div class="more" @click="goToSeckill">
          更多 <van-icon name="arrow" />
        </div>
      </div>
      <div class="seckill-list">
        <div class="seckill-item" 
          v-for="item in seckillProducts" 
          :key="item.id"
          @click="goToSeckillProduct(item.id)">
          <img :src="item.image" :alt="item.title">
          <div class="price">
            <span class="current">¥{{ item.price }}</span>
            <span class="original">¥{{ item.originPrice }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 品牌精选 -->
    <div class="brand-section">
      <div class="section-header">
        <span class="title">品牌精选</span>
      </div>
      <div class="brand-list">
        <div class="brand-item" v-for="brand in brands" :key="brand.id">
          <div class="brand-logo">
            <img :src="brand.logo" :alt="brand.name">
          </div>
          <span class="name">{{ brand.name }}</span>
        </div>
      </div>
    </div>

    <!-- 为你推荐 -->
    <div class="recommend-section">
      <div class="section-header">
        <span class="title">为你推荐</span>
        <div class="more" @click="goToMore">
          更多好货 <van-icon name="arrow" />
        </div>
      </div>
      <div class="product-list">
        <product-card 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
        />
      </div>
    </div>

    <!-- 加载更多 -->
    <load-more 
      :loading="loading" 
      :finished="finished"
      @load="loadMore"
    />

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTabbar" fixed route>
      <van-tabbar-item icon="home-o" to="/">
        <span class="tabbar-text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/messages">
        <span class="tabbar-text">消息</span>
      </van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/cart">
        <span class="tabbar-text">购物车</span>
      </van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/profile">
        <span class="tabbar-text">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore, useSeckillStore } from '@/stores'
import ProductCard from '@/components/ProductCard.vue'
import LoadMore from '@/components/LoadMore.vue'

export default {
  name: 'Home',
  components: {
    ProductCard,
    LoadMore
  },
  setup() {
    const router = useRouter()
    const productStore = useProductStore()
    const seckillStore = useSeckillStore()
    
    const keyword = ref('')
    const activeTab = ref(1)
    const activeTabbar = ref(0)
    const loading = ref(false)
    const finished = ref(false)
    const products = ref([])
    
    const tabs = ['关注', '推荐', '小时达', '数码日', '国补', '穿搭']
    const themeColor = '#e53e3e' // 主题色
    
    const categories = [
      { id: 1, name: 'YY直播', icon: 'video-o', bgColor: 'bg-red' },
      { id: 2, name: '超市百货', icon: 'cart-o', bgColor: 'bg-yellow' },
      { id: 3, name: '数码电器', icon: 'phone-circle-o', bgColor: 'bg-green' },
      { id: 4, name: '潮流服饰', icon: 'shopping-cart-o', bgColor: 'bg-blue' },
      { id: 5, name: '美食生鲜', icon: 'shop-o', bgColor: 'bg-purple' },
      { id: 6, name: '家用百货', icon: 'goods-collect-o', bgColor: 'bg-red' },
      { id: 7, name: '汽车用品', icon: 'logistics', bgColor: 'bg-yellow' },
      { id: 8, name: '进口好物', icon: 'gift-card-o', bgColor: 'bg-green' },
      { id: 9, name: '国际品牌', icon: 'diamond-o', bgColor: 'bg-blue' },
      { id: 10, name: '更多分类', icon: 'apps-o', bgColor: 'bg-purple' }
    ]
    
    // 从Pinia store获取秒杀数据
    const countdown = computed(() => seckillStore.countdown)
    const seckillProducts = computed(() => seckillStore.homeSeckillProducts)
    
    // 定时更新倒计时
    let timer = null
    
    // 开始倒计时
    const startCountdown = () => {
      // 立即执行一次
      seckillStore.updateCountdown()
      // 设置定时器，每秒更新一次
      timer = setInterval(() => {
        seckillStore.updateCountdown()
      }, 1000)
    }
    
    onMounted(() => {
      // 加载秒杀商品数据
      seckillStore.fetchSeckillProducts()
      // 开始倒计时
      startCountdown()
      // 加载推荐商品
      loadMore()
    })
    
    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })
    
    const brands = ref([
      { id: 1, name: '小米', logo: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
      { id: 2, name: '华为', logo: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
      { id: 3, name: '苹果', logo: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
      { id: 4, name: '耐克', logo: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
      { id: 5, name: '阿迪达斯', logo: 'https://img01.yzcdn.cn/vant/cat.jpeg' }
    ])
    
    // 跳转到搜索页
    const goToSearch = () => {
      router.push('/search')
    }
    
    // 查看更多
    const goToMore = () => {
      router.push('/more')
    }
    
    // 查看秒杀更多
    const goToSeckill = () => {
      router.push('/seckill')
    }
    
    // 查看秒杀产品
    const goToSeckillProduct = (id) => {
      router.push({
        path: `/seckill/${id}`
      })
    }
    
    // 加载更多
    const loadMore = async () => {
      if (loading.value || finished.value) return
      
      loading.value = true
      
      try {
        const res = await productStore.fetchProducts({
          page: products.value.length / 10 + 1,
          pageSize: 10
        })
        
        products.value.push(...res.products)
        
        if (products.value.length >= 30) { // 模拟数据，只加载30条
          finished.value = true
        }
      } catch (error) {
        console.error('加载商品失败', error)
      } finally {
        loading.value = false
      }
    }
    
    // 格式化时间，保证两位数显示
    const formatTime = (time) => {
      return time < 10 ? `0${time}` : time
    }
    
    return {
      keyword,
      activeTab,
      activeTabbar,
      tabs,
      categories,
      seckillProducts,
      brands,
      products,
      loading,
      finished,
      countdown,
      formatTime,
      themeColor,
      goToSearch,
      goToMore,
      goToSeckill,
      goToSeckillProduct,
      loadMore
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.home {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 50px;
  
  .search-bar {
    background-color: @primary-color;
    padding: 12px 12px;
    
    :deep(.van-search) {
      padding: 0;
      background-color: transparent;
      
      .van-search__content {
        background-color: #fff;
        border-radius: 20px;
      }
    }
  }
  
  .tab-bar {
    display: flex;
    padding: 10px 0;
    background-color: white;
    overflow-x: auto;
    white-space: nowrap;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    .tab {
      flex: none;
      padding: 0 15px;
      font-size: 14px;
      color: #666;
      position: relative;
      
      &.active {
        color: @primary-color;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background-color: @primary-color;
        }
      }
    }
  }
  
  .category-icons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    background-color: white;
    padding: 15px 0 5px;
    margin-bottom: 10px;
    
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 10px;
      
      .category-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-bottom: 5px;
        font-size: 18px;
        
        &.bg-red {
          background-color: #ffecec;
          color: @primary-color;
        }
        
        &.bg-yellow {
          background-color: #fffbeb;
          color: #fbbf24;
        }
        
        &.bg-green {
          background-color: #ecfdf5;
          color: @primary-color;
        }
        
        &.bg-blue {
          background-color: #eff6ff;
          color: @primary-color;
        }
        
        &.bg-purple {
          background-color: #f5f3ff;
          color: @primary-color;
        }
      }
      
      .text-xs {
        font-size: 12px;
        color: #333;
      }
    }
  }
  
  .coupon-bar {
    background-color: #fff1f0;
    margin: 0 10px 10px;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    color: @primary-color;
    
    .ml-auto {
      margin-left: auto;
    }
    
    .mr-2 {
      margin-right: 8px;
    }
    
    .text-sm {
      font-size: 13px;
    }
    
    :deep(.van-button) {
      border-color: @primary-color;
      color: @primary-color;
      height: 24px;
      line-height: 22px;
      font-size: 12px;
      padding: 0 10px;
    }
  }
  
  .seckill-section {
    margin: 12px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      
      .title {
        display: flex;
        align-items: center;
        
        .text {
          font-size: 16px;
          font-weight: bold;
          color: @primary-color;
          margin-right: 8px;
        }
        
        .countdown {
          display: flex;
          align-items: center;
          
          .countdown-text {
            font-size: 12px;
            color: #999;
            margin-right: 4px;
          }
          
          .countdown-number {
            display: flex;
            align-items: center;
            
            .time-block {
              display: inline-block;
              width: 24px;
              height: 24px;
              line-height: 24px;
              text-align: center;
              background-color: @primary-color;
              color: #fff;
              font-size: 14px;
              font-weight: bold;
              border-radius: 4px;
            }
            
            .colon {
              margin: 0 2px;
              color: @primary-color;
              font-weight: bold;
            }
          }
        }
      }
      
      .more {
        color: #666;
        font-size: 14px;
      }
    }
    
    .seckill-list {
      display: flex;
      padding: 0 12px 12px;
      overflow-x: auto;
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }
      
      .seckill-item {
        flex: 0 0 auto;
        width: 100px;
        margin-right: 12px;
        text-align: center;
        
        &:last-child {
          margin-right: 0;
        }
        
        img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .price {
          margin-top: 8px;
          
          .current {
            color: @primary-color;
            font-size: 16px;
            font-weight: bold;
          }
          
          .original {
            color: #999;
            font-size: 12px;
            text-decoration: line-through;
            margin-left: 4px;
          }
        }
      }
    }
  }
  
  .brand-section {
    background-color: white;
    margin-bottom: 10px;
    padding: 15px;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      
      .more {
        color: #999;
        font-size: 12px;
      }
    }
    
    .brand-list {
      display: flex;
      justify-content: space-between;
      
      .brand-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .brand-logo {
          width: 45px;
          height: 45px;
          border-radius: 30%;
          background-color: #f8f8f8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
          overflow: hidden;
          
          img {
            width: 40px;
            height: 40px;
            object-fit: cover;
          }
        }
        
        .name {
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
  
  .recommend-section {
    background-color: white;
    padding: 15px;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      
      .more {
        color: #999;
        font-size: 12px;
        display: flex;
        align-items: center;
      }
    }
    
    .product-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }
  
  .tabbar-text {
    font-size: 12px;
    transform: scale(0.9);
    display: block;
    margin-top: 2px;
  }
  
  :deep(.van-tabbar-item--active) {
    color: @primary-color;
  }
}
</style>

<style scoped>
/* 修复标签选项的触摸高亮问题 */
.tab-bar .tab {
  -webkit-user-select: none !important;
  user-select: none !important;
  -webkit-tap-highlight-color: transparent !important;
  tap-highlight-color: transparent !important;
  outline: none !important;
  cursor: pointer;
  -webkit-touch-callout: none !important;
}

/* 禁用文本选择和触摸高亮效果 */
* {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 保留文本选择的元素 */
input, textarea, .text-selectable {
  -webkit-user-select: text;
  user-select: text;
}
</style> 