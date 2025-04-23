<template>
  <div class="seckill-page">
    <!-- 导航栏 -->
    <van-nav-bar
      title="限时秒杀"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <!-- 倒计时 -->
    <div class="countdown-section">
      <div class="countdown-content">
        <div class="countdown-title">
          <van-icon name="clock-o" class="clock-icon" />
          <span>距结束仅剩</span>
        </div>
        <div class="countdown-number">
          <span class="time-block">{{ formatTime(countdown.hours) }}</span>
          <span class="colon">:</span>
          <span class="time-block">{{ formatTime(countdown.minutes) }}</span>
          <span class="colon">:</span>
          <span class="time-block">{{ formatTime(countdown.seconds) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 秒杀商品列表 -->
    <div class="seckill-list" v-if="!loading">
      <div v-if="seckillProducts.length > 0">
        <div class="seckill-item" v-for="item in seckillProducts" :key="item.id" @click="goToProductDetail(item.id)">
          <div class="product-image">
            <img :src="item.image" :alt="item.title">
            <div class="seckill-tag">秒杀</div>
          </div>
          <div class="product-info">
            <div class="product-title">{{ item.title }}</div>
            <div class="product-price">
              <span class="current-price">¥{{ item.price }}</span>
              <span class="original-price">¥{{ item.originPrice }}</span>
              <div class="discount-tag">{{ calculateDiscount(item.price, item.originPrice) }}折</div>
            </div>
            <div class="product-action">
              <div class="sales-info">已售{{ item.soldPercentage }}%</div>
              <van-button type="danger" size="small" round>立即抢购</van-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-empty image="search" description="暂无秒杀商品" />
      </div>
    </div>
    
    <!-- 加载中 -->
    <div v-else class="loading-container">
      <van-loading type="spinner" color="#e53e3e" />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSeckillStore } from '@/stores'
import { Toast } from 'vant'
import { formatTime } from '@/utils'

export default {
  name: 'SeckillPage',
  setup() {
    const router = useRouter()
    const seckillStore = useSeckillStore()
    const loading = ref(true)
    
    // 从store获取秒杀数据
    const endTime = computed(() => seckillStore.endTime)
    const countdown = computed(() => seckillStore.countdown)
    const seckillProducts = computed(() => seckillStore.seckillProducts)
    
    // 定时更新倒计时
    let timer = null
    
    // 加载秒杀商品数据
    const loadSeckillProducts = async () => {
      try {
        loading.value = true
        await seckillStore.fetchSeckillProducts()
      } catch (error) {
        console.error('加载秒杀商品失败：', error)
        Toast('加载秒杀商品失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
    
    // 开始倒计时
    const startCountdown = () => {
      // 立即执行一次
      seckillStore.updateCountdown()
      // 设置定时器，每秒更新一次
      timer = setInterval(() => {
        seckillStore.updateCountdown()
      }, 1000)
    }
    
    onMounted(async () => {
      // 加载秒杀商品数据
      await loadSeckillProducts()
      // 启动倒计时
      startCountdown()
    })
    
    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })
    
    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }
    
    // 计算折扣
    const calculateDiscount = (price, originPrice) => {
      if (!price || !originPrice || originPrice === 0) return "0.0"
      const discount = (price / originPrice * 10).toFixed(1)
      return discount
    }
    
    // 跳转到商品详情页
    const goToProductDetail = (id) => {
      router.push({
        path: `/product/${id}`,
        query: {
          isSeckill: true,
          endTime: endTime.value
        }
      })
    }
    
    return {
      loading,
      countdown,
      formatTime,
      seckillProducts,
      onClickLeft,
      calculateDiscount,
      goToProductDetail
    }
  }
}
</script>

<style lang="less" scoped>
.seckill-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 20px;
  
  :deep(.van-nav-bar) {
    background-color: #ee0a24;
    
    .van-nav-bar__title {
      color: #fff;
      font-weight: bold;
    }
    
    .van-icon,
    .van-nav-bar__text {
      color: #fff;
    }
  }
  
  .countdown-section {
    margin-top: 46px;
    background-color: #ee0a24;
    padding: 15px;
    
    .countdown-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      
      .countdown-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .clock-icon {
          margin-right: 5px;
        }
      }
      
      .countdown-number {
        display: flex;
        align-items: center;
        
        .time-block {
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          background-color: #fff;
          color: #ee0a24;
          font-size: 18px;
          font-weight: bold;
          border-radius: 4px;
        }
        
        .colon {
          margin: 0 5px;
          color: #fff;
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }
  
  .empty-state {
    padding: 40px 0;
  }
  
  .seckill-list {
    padding: 12px;
    
    .seckill-item {
      display: flex;
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      
      .product-image {
        position: relative;
        width: 120px;
        height: 120px;
        flex-shrink: 0;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .seckill-tag {
          position: absolute;
          top: 0;
          left: 0;
          background-color: #ee0a24;
          color: #fff;
          font-size: 12px;
          padding: 2px 6px;
          border-bottom-right-radius: 8px;
        }
      }
      
      .product-info {
        flex: 1;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .product-title {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .product-price {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .current-price {
            font-size: 18px;
            font-weight: bold;
            color: #ee0a24;
            margin-right: 6px;
          }
          
          .original-price {
            color: #999;
            font-size: 12px;
            text-decoration: line-through;
            margin-right: 6px;
          }
          
          .discount-tag {
            background-color: #ffecec;
            color: #ee0a24;
            font-size: 12px;
            padding: 1px 4px;
            border-radius: 2px;
          }
        }
        
        .product-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .sales-info {
            color: #999;
            font-size: 12px;
          }
          
          :deep(.van-button) {
            background-color: #ee0a24;
            border-color: #ee0a24;
            height: 28px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style> 