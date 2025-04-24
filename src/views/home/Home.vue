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

    <!-- 推荐商品 -->
    <div class="goods-section">
      <div class="section-header">
        <div class="title">精选好物</div>
        <div class="more">
          查看更多 <van-icon name="arrow" />
        </div>
      </div>
      <div class="goods-grid">
        <div class="goods-item" v-for="item in recommendGoods" :key="item.id" @click="goToGoodsDetail(item.id)">
          <div class="goods-image">
            <img :src="item.image" :alt="item.title">
            <span class="goods-tag" v-if="item.tag">{{item.tag}}</span>
          </div>
          <div class="goods-info">
            <div class="goods-title">{{item.title}}</div>
            <div class="goods-price">
              <span class="price">¥{{item.price}}</span>
              <span class="original-price" v-if="item.originalPrice">¥{{item.originalPrice}}</span>
            </div>
            <div class="goods-extra">
              <span class="sales">{{item.sales}}人已购</span>
              <van-icon name="cart-o" class="cart-icon" />
            </div>
          </div>
        </div>
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
    
    // 推荐商品数据
    const recommendGoods = ref([
      {
        id: 1,
        title: 'iPhone 15 Pro Max 256GB 原色钛金属',
        price: 9999,
        originalPrice: 10999,
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        sales: '2.5万',
        tag: '新品'
      },
      {
        id: 2,
        title: '华为 Mate 60 Pro 12+512GB 雅川青',
        price: 6999,
        originalPrice: 7999,
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        sales: '1.8万',
        tag: '热销'
      },
      {
        id: 3,
        title: '小米 14 Pro 16+1TB 钛金属黑',
        price: 5999,
        originalPrice: 6499,
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        sales: '1.2万'
      },
      {
        id: 4,
        title: 'OPPO Find X7 Ultra 16+512GB 微醺',
        price: 6499,
        originalPrice: 6999,
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        sales: '9500',
        tag: '新品'
      }
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
    
    // 跳转到商品详情
    const goToGoodsDetail = (id) => {
      router.push(`/goods/${id}`)
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
      recommendGoods,
      countdown,
      themeColor,
      goToSearch,
      goToMore,
      goToSeckill,
      goToSeckillProduct,
      goToGoodsDetail,
      loadMore,
      formatTime
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
    background: linear-gradient(135deg, @primary-color, darken(@primary-color, 15%));
    padding: 12px 12px;
    
    :deep(.van-search) {
      padding: 0;
      background-color: transparent;
      
      .van-search__content {
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        
        .van-field__left-icon {
          color: @primary-color;
        }
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
    padding: 20px 0 10px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 12px;
      
      .category-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        margin-bottom: 8px;
        font-size: 24px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s ease;
        
        &:active {
          transform: scale(0.95);
        }
        
        &.bg-red {
          background: linear-gradient(135deg, #ffecec, #ffe4e4);
          color: @primary-color;
        }
        
        &.bg-yellow {
          background: linear-gradient(135deg, #fffbeb, #fff7dc);
          color: #fbbf24;
        }
        
        &.bg-green {
          background: linear-gradient(135deg, #ecfdf5, #e2f9ed);
          color: #059669;
        }
        
        &.bg-blue {
          background: linear-gradient(135deg, #eff6ff, #e5efff);
          color: #3b82f6;
        }
        
        &.bg-purple {
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          color: #7c3aed;
        }
      }
      
      .text-xs {
        font-size: 13px;
        color: #333;
        margin-top: 2px;
      }
    }
  }
  
  .coupon-bar {
    background: linear-gradient(to right, #fff1f0, #fff5f5);
    margin: 0 12px 12px;
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    color: @primary-color;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .ml-auto {
      margin-left: auto;
    }
    
    .mr-2 {
      margin-right: 10px;
    }
    
    .text-sm {
      font-size: 14px;
      font-weight: 500;
    }
    
    :deep(.van-button) {
      border-color: @primary-color;
      color: @primary-color;
      height: 28px;
      line-height: 26px;
      font-size: 13px;
      padding: 0 12px;
      border-radius: 14px;
      font-weight: 500;
      
      &:active {
        opacity: 0.8;
      }
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
  
  .goods-section {
    background-color: white;
    margin: 12px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        position: relative;
        padding-left: 12px;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 18px;
          background: @primary-color;
          border-radius: 2px;
        }
      }
      
      .more {
        color: #666;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 15px;
        background: #f8f8f8;
        
        .van-icon {
          margin-left: 4px;
          font-size: 12px;
        }
      }
    }
    
    .goods-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      padding: 0 2px;
      
      .goods-item {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s ease;
        
        &:active {
          transform: scale(0.98);
        }
        
        .goods-image {
          position: relative;
          padding-top: 100%;
          background: #f8f8f8;
          
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .goods-tag {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 4px 8px;
            background: @primary-color;
            color: white;
            font-size: 12px;
            border-radius: 4px;
            font-weight: 500;
          }
        }
        
        .goods-info {
          padding: 12px 14px;
          
          .goods-title {
            font-size: 14px;
            color: #333;
            line-height: 1.4;
            height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 8px;
          }
          
          .goods-price {
            margin-top: 6px;
            display: flex;
            align-items: baseline;
            
            .price {
              color: @primary-color;
              font-size: 18px;
              font-weight: bold;
              
              &::before {
                content: '¥';
                font-size: 14px;
                margin-right: 1px;
              }
            }
            
            .original-price {
              color: #999;
              font-size: 12px;
              text-decoration: line-through;
              margin-left: 6px;
              
              &::before {
                content: '¥';
                font-size: 12px;
              }
            }
          }
          
          .goods-extra {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .sales {
              color: #999;
              font-size: 12px;
              background: #f8f8f8;
              padding: 2px 6px;
              border-radius: 10px;
            }
            
            .cart-icon {
              color: @primary-color;
              font-size: 22px;
              padding: 6px;
              margin-right: -4px;
              border-radius: 50%;
              
              &:active {
                background-color: rgba(0, 0, 0, 0.05);
              }
            }
          }
        }
      }
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