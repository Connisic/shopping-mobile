<template>
  <div class="seckill-detail-page">
    <!-- 导航栏 -->
    <van-nav-bar
      title="秒杀详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div v-if="!loading">
      <div v-if="currentProduct" class="product-content">
        <!-- 商品轮播图 -->
        <div class="product-swipe">
          <van-swipe :autoplay="3000" indicator-color="#e53e3e">
            <van-swipe-item>
              <img :src="currentProduct.image" :alt="currentProduct.title">
            </van-swipe-item>
          </van-swipe>
        </div>
        
        <!-- 秒杀价格和倒计时 -->
        <div class="seckill-price-section">
          <div class="price-info">
            <div class="current-price">¥{{ currentProduct.price }}</div>
            <div class="original-price">¥{{ currentProduct.originPrice }}</div>
            <div class="discount-tag">{{ calculateDiscount(currentProduct.price, currentProduct.originPrice) }}折</div>
          </div>
          <div class="countdown-info">
            <span class="countdown-label">距结束</span>
            <div class="countdown">
              <span class="time">{{ formatTime(countdown.hours) }}</span>
              <span class="colon">:</span>
              <span class="time">{{ formatTime(countdown.minutes) }}</span>
              <span class="colon">:</span>
              <span class="time">{{ formatTime(countdown.seconds) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 商品标题 -->
        <div class="product-title">
          <div class="seckill-tag">秒杀</div>
          <h2>{{ currentProduct.title }}</h2>
        </div>
        
        <!-- 销售信息 -->
        <div class="sales-info">
          <div class="sales-progress">
            <div class="progress-label">
              <span>已售{{ currentProduct.soldPercentage }}%</span>
              <span>剩余{{ currentProduct.stockCount }}件</span>
            </div>
            <van-progress :percentage="currentProduct.soldPercentage" color="#e53e3e" />
          </div>
        </div>
        
        <!-- 商品详情 -->
        <div class="product-desc">
          <h3>商品详情</h3>
          <div class="desc-content">{{ currentProduct.introduction || '暂无详情' }}</div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <van-empty image="error" description="商品不存在或已下架" />
      </div>
    </div>
    
    <div v-else class="loading-container">
      <van-loading type="spinner" color="#e53e3e" />
    </div>
    
    <!-- 底部按钮 -->
    <div class="action-bar">
      <div class="action-buttons">
        <van-button 
          type="danger" 
          block 
          :disabled="isOutOfStock || isSeckillEnded"
          @click="onBuyNow"
        >
          {{ buttonText }}
        </van-button>
      </div>
    </div>
    
    <!-- 下单确认弹窗 -->
    <van-popup
      v-model:show="showOrderPopup"
      position="bottom"
      round
      :style="{ height: '50%' }"
    >
      <div class="order-popup">
        <div class="popup-header">
          <div class="product-info">
            <img :src="currentProduct?.image" alt="" class="product-image">
            <div class="product-detail">
              <div class="product-title">{{ currentProduct?.title }}</div>
              <div class="product-price">¥{{ currentProduct?.price }}</div>
            </div>
          </div>
          <van-icon name="close" class="close-icon" @click="showOrderPopup = false" />
        </div>
        
        <div class="popup-content">
          <div class="quantity-selector">
            <span class="quantity-label">购买数量</span>
            <van-stepper 
              v-model="quantity" 
              theme="round" 
              button-size="22" 
              :min="1" 
              :max="maxBuyQuantity"
            />
          </div>
        </div>
        
        <div class="popup-footer">
          <van-button type="danger" block @click="confirmOrder">立即抢购</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { formatTime } from '@/utils'

export default {
  name: 'SeckillDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const loading = ref(true)
    const quantity = ref(1)
    const showOrderPopup = ref(false)
    
    // 获取路由参数中的商品ID
    const productId = computed(() => Number(route.params.id))
    
    // 从store中获取秒杀数据
    const countdown = computed(() => store.getters['seckill/countdown'])
    const currentProduct = computed(() => store.getters['seckill/currentSeckillProduct'])
    
    // 计算最大可购买数量
    const maxBuyQuantity = computed(() => {
      if (!currentProduct.value) return 1
      return Math.min(currentProduct.value.stockCount || 1, 5) // 最多购买5件
    })
    
    // 判断是否已售罄
    const isOutOfStock = computed(() => {
      return currentProduct.value && currentProduct.value.stockCount <= 0
    })
    
    // 判断秒杀是否已结束
    const isSeckillEnded = computed(() => {
      return countdown.value.hours === 0 && 
             countdown.value.minutes === 0 && 
             countdown.value.seconds === 0
    })
    
    // 按钮文本
    const buttonText = computed(() => {
      if (isOutOfStock.value) return '已售罄'
      if (isSeckillEnded.value) return '活动已结束'
      return '立即抢购'
    })
    
    // 定时器
    let timer = null
    
    // 加载商品详情
    const loadProductDetail = async () => {
      try {
        loading.value = true
        await store.dispatch('seckill/fetchSeckillProductDetail', productId.value)
      } catch (error) {
        console.error('加载商品详情失败：', error)
        Toast('加载商品详情失败')
      } finally {
        loading.value = false
      }
    }
    
    // 开始倒计时
    const startCountdown = () => {
      // 立即执行一次
      store.dispatch('seckill/updateCountdown')
      // 设置定时器，每秒更新一次
      timer = setInterval(() => {
        store.dispatch('seckill/updateCountdown')
      }, 1000)
    }
    
    onMounted(async () => {
      await loadProductDetail()
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
    
    // 立即购买按钮点击事件
    const onBuyNow = () => {
      if (isOutOfStock.value) {
        Toast('商品已售罄')
        return
      }
      
      if (isSeckillEnded.value) {
        Toast('活动已结束')
        return
      }
      
      showOrderPopup.value = true
    }
    
    // 确认下单
    const confirmOrder = async () => {
      if (!currentProduct.value) return
      
      try {
        // 构造订单数据
        const orderData = {
          cartGoods: [{
            goodId: currentProduct.value.goodsId,
            goodsName: currentProduct.value.title,
            price: currentProduct.value.price,
            num: quantity.value,
            headerPic: currentProduct.value.image
          }]
        }
        
        Toast.loading({
          message: '抢购中...',
          forbidClick: true,
        })
        
        // 创建秒杀订单
        const order = await store.dispatch('seckill/createSeckillOrder', orderData)
        
        showOrderPopup.value = false
        Toast.success('抢购成功！')
        
        // 跳转到订单详情页
        router.push({
          path: `/order/${order.id}`,
          query: { from: 'seckill' }
        })
      } catch (error) {
        console.error('创建订单失败：', error)
        Toast.fail('抢购失败，请稍后重试')
      }
    }
    
    return {
      loading,
      quantity,
      showOrderPopup,
      currentProduct,
      countdown,
      isOutOfStock,
      isSeckillEnded,
      buttonText,
      maxBuyQuantity,
      formatTime,
      onClickLeft,
      calculateDiscount,
      onBuyNow,
      confirmOrder
    }
  }
}
</script>

<style lang="less" scoped>
.seckill-detail-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 50px;
  
  :deep(.van-nav-bar) {
    background-color: #e53e3e;
    
    .van-nav-bar__title {
      color: #fff;
      font-weight: bold;
    }
    
    .van-icon,
    .van-nav-bar__text {
      color: #fff;
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
  
  .product-content {
    padding-top: 46px;
    
    .product-swipe {
      height: 300px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .seckill-price-section {
      background-color: #e53e3e;
      color: #fff;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .price-info {
        display: flex;
        align-items: baseline;
        
        .current-price {
          font-size: 24px;
          font-weight: bold;
          margin-right: 8px;
        }
        
        .original-price {
          font-size: 14px;
          text-decoration: line-through;
          opacity: 0.8;
          margin-right: 8px;
        }
        
        .discount-tag {
          background-color: #fff;
          color: #e53e3e;
          font-size: 12px;
          padding: 2px 4px;
          border-radius: 2px;
        }
      }
      
      .countdown-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        
        .countdown-label {
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .countdown {
          display: flex;
          align-items: center;
          
          .time {
            display: inline-block;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background-color: #fff;
            color: #e53e3e;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
          }
          
          .colon {
            margin: 0 2px;
          }
        }
      }
    }
    
    .product-title {
      background-color: #fff;
      padding: 15px;
      position: relative;
      
      .seckill-tag {
        display: inline-block;
        background-color: #e53e3e;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        margin-bottom: 8px;
      }
      
      h2 {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding-right: 20px;
      }
    }
    
    .sales-info {
      background-color: #fff;
      padding: 15px;
      margin-top: 10px;
      
      .sales-progress {
        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
      }
    }
    
    .product-desc {
      background-color: #fff;
      padding: 15px;
      margin-top: 10px;
      
      h3 {
        font-size: 16px;
        margin: 0 0 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f2f2f2;
      }
      
      .desc-content {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }
    }
  }
  
  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
    z-index: 10;
    
    .action-buttons {
      padding: 10px 15px;
    }
  }
  
  .order-popup {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .popup-header {
      padding: 15px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #f2f2f2;
      
      .product-info {
        display: flex;
        
        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 10px;
        }
        
        .product-detail {
          .product-title {
            font-size: 14px;
            margin-bottom: 8px;
            line-height: 1.4;
            max-width: 200px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .product-price {
            font-size: 16px;
            font-weight: bold;
            color: #e53e3e;
          }
        }
      }
      
      .close-icon {
        font-size: 20px;
        color: #999;
      }
    }
    
    .popup-content {
      flex: 1;
      padding: 15px;
      
      .quantity-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .quantity-label {
          font-size: 14px;
        }
      }
    }
    
    .popup-footer {
      padding: 15px;
      border-top: 1px solid #f2f2f2;
    }
  }
}
</style> 