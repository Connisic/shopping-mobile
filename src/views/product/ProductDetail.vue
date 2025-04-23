<template>
  <div class="product-detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="商品详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    
    <div v-if="product">
      <!-- 商品图片轮播 -->
      <div class="swiper">
        <van-swipe :autoplay="3000" indicator-color="#e53e3e">
          <van-swipe-item v-for="(image, index) in product.images" :key="index">
            <van-image :src="image" fit="cover" class="product-image" />
          </van-swipe-item>
        </van-swipe>
      </div>
      
      <!-- 商品信息 -->
      <div class="product-info">
        <div class="product-price">
          <span class="price">¥{{ formatPrice(product.price) }}</span>
          <span class="origin-price" v-if="product.originPrice">
            ¥{{ formatPrice(product.originPrice) }}
          </span>
          <span v-if="isSeckill" class="seckill-tag">秒杀</span>
        </div>
        <div class="product-title">{{ product.title }}</div>
        <div class="product-sales">销量: {{ product.sales }}</div>
        
        <!-- 秒杀倒计时 -->
        <div v-if="isSeckill" class="seckill-countdown">
          <span>距结束仅剩：</span>
          <div class="countdown-number">
            <span class="time-block">{{ formatTime(countdown.hours) }}</span>
            <span class="colon">:</span>
            <span class="time-block">{{ formatTime(countdown.minutes) }}</span>
            <span class="colon">:</span>
            <span class="time-block">{{ formatTime(countdown.seconds) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 商品规格 -->
      <div class="product-attrs" @click="showSpecPopup = true">
        <div class="attr-label">选择</div>
        <div class="attr-value">{{ selectedAttrText }}</div>
        <van-icon name="arrow" />
      </div>
      
      <!-- 商品详情Tab -->
      <div class="product-tabs">
        <van-tabs v-model:active="activeTab" swipeable color="#e53e3e" title-active-color="#e53e3e">
          <van-tab title="商品详情">
            <div class="product-description" v-html="product.description"></div>
          </van-tab>
          <van-tab title="规格参数">
            <div class="product-params">
              <div class="param-item" v-for="(spec, index) in product.specs" :key="index">
                <div class="param-label">{{ spec.name }}</div>
                <div class="param-value">{{ spec.values.join('，') }}</div>
              </div>
            </div>
          </van-tab>
          <van-tab title="评价">
            <div class="product-reviews">
              <empty description="暂无评价" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      
      <!-- 商品操作栏 (替换GoodsAction) -->
      <div class="action-bar">
        <div class="action-icons">
          <div class="action-icon" @click="contactService">
            <van-icon name="chat-o" />
            <span>客服</span>
          </div>
          <div class="action-icon" @click="goToCart">
            <van-icon name="cart-o" />
            <van-badge :content="cartCount || ''" :max="99" v-if="cartCount" />
            <span>购物车</span>
          </div>
        </div>
        <div class="action-buttons">
          <van-button 
            v-if="!isSeckill"
            type="warning" 
            block 
            @click="showSpecPopup = true"
          >加入购物车</van-button>
          <van-button 
            type="danger" 
            block 
            @click="() => { buyMode = true; showSpecPopup = true; }"
          >{{ isSeckill ? '立即秒杀' : '立即购买' }}</van-button>
        </div>
      </div>
      
      <!-- 规格选择弹窗 (替换SKU) -->
      <van-popup
        v-model:show="showSpecPopup"
        position="bottom"
        round
        :style="{ maxHeight: '70%' }"
      >
        <div class="spec-popup">
          <div class="spec-header">
            <div class="spec-image">
              <van-image :src="product.images[0]" width="100" height="100" fit="cover" radius="4" />
            </div>
            <div class="spec-info">
              <div class="price">¥{{ formatPrice(product.price) }}</div>
              <div class="title">{{ product.title }}</div>
              <div class="selected">已选：{{ selectedAttrText }}</div>
            </div>
            <van-icon name="cross" class="close-icon" @click="showSpecPopup = false" />
          </div>
          
          <div class="spec-content">
            <div v-for="(spec, specIndex) in product.specs" :key="specIndex" class="spec-group">
              <div class="spec-title">{{ spec.name }}</div>
              <div class="spec-values">
                <span 
                  v-for="(value, valueIndex) in spec.values" 
                  :key="valueIndex"
                  class="spec-value"
                  :class="{ active: selectedSpecs[specIndex] === value }"
                  @click="selectSpec(specIndex, value)"
                >
                  {{ value }}
                </span>
              </div>
            </div>
            
            <div class="amount-picker">
              <div class="amount-title">购买数量</div>
              <van-stepper v-model="quantity" min="1" max="10" />
            </div>
          </div>
          
          <div class="spec-footer">
            <van-button 
              type="danger" 
              block 
              :disabled="!isSpecSelected"
              @click="confirmSelection"
            >
              确定
            </van-button>
          </div>
        </div>
      </van-popup>
    </div>
    
    <div v-else class="loading-container">
      <van-loading type="spinner" color="#e53e3e" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore, useProductStore, useSeckillStore } from '@/stores'
import { Toast } from 'vant'
import { formatPrice, formatTime } from '@/utils'
import Empty from '@/components/Empty.vue'

export default {
  name: 'ProductDetail',
  components: {
    Empty
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const cartStore = useCartStore()
    const productStore = useProductStore()
    const seckillStore = useSeckillStore()
    
    // 商品ID
    const productId = computed(() => Number(route.params.id))
    
    // 是否为秒杀商品
    const isSeckill = computed(() => route.query.isSeckill === 'true')
    
    // 从store获取秒杀数据
    const countdown = computed(() => seckillStore.countdown)
    
    let timer = null;
    
    // 商品数据
    const product = computed(() => productStore.currentProduct)
    
    // 购物车商品数量
    const cartCount = computed(() => cartStore.totalCount)
    
    // Tab激活状态
    const activeTab = ref(0)
    
    // 是否显示规格选择弹窗
    const showSpecPopup = ref(false)
    
    // 是否为立即购买模式
    const buyMode = ref(false)
    
    // 选中的规格
    const selectedSpecs = ref([])
    
    // 购买数量
    const quantity = ref(1)
    
    // 选中的规格文本
    const selectedAttrText = computed(() => {
      if (selectedSpecs.value.length === 0 || selectedSpecs.value.includes(undefined)) {
        return '请选择规格'
      }
      return selectedSpecs.value.join('，')
    })
    
    // 是否已选择完所有规格
    const isSpecSelected = computed(() => {
      if (!product.value) return false
      return product.value.specs.length === 0 || 
        (selectedSpecs.value.length === product.value.specs.length && 
        !selectedSpecs.value.includes(undefined))
    })
    
    // 获取选中规格对应的SKU
    const getSelectedSku = () => {
      if (!product.value || !isSpecSelected.value) return null
      
      if (product.value.skus.length === 0) {
        // 没有SKU，直接返回商品信息
        return {
          id: 0,
          price: product.value.price
        }
      }
      
      // 查找匹配的SKU
      return product.value.skus.find(sku => {
        return sku.specs.every((value, index) => value === selectedSpecs.value[index])
      }) || null
    }
    
    // 导航栏返回按钮
    const onClickLeft = () => {
      router.back()
    }
    
    // 跳转到购物车
    const goToCart = () => {
      router.push('/cart')
    }
    
    // 联系客服
    const contactService = () => {
      Toast('联系客服功能开发中')
    }
    
    // 选择规格
    const selectSpec = (specIndex, value) => {
      // 确保数组长度足够
      if (selectedSpecs.value.length <= specIndex) {
        selectedSpecs.value = Array(product.value.specs.length).fill(undefined)
      }
      
      // 更新选中的规格
      selectedSpecs.value[specIndex] = value
    }
    
    // 确认选择
    const confirmSelection = () => {
      const sku = getSelectedSku()
      
      if (!sku) {
        Toast('请选择完整规格')
        return
      }
      
      const productData = {
        id: product.value.id,
        skuId: sku.id,
        title: product.value.title,
        price: sku.price,
        image: product.value.images[0],
        count: quantity.value
      }
      
      // 添加到购物车
      cartStore.addToCart(productData)
      
      if (buyMode.value) {
        // 立即购买模式
        // 清除其他商品的选中状态
        const cartItems = cartStore.cartItems
        cartItems.forEach(item => {
          if (item.id !== productData.id) {
            cartStore.toggleChecked({ id: item.id, checked: false })
          }
        })
        
        // 跳转到结算页
        router.push('/checkout')
      } else {
        Toast.success('已加入购物车')
      }
      
      // 重置状态
      showSpecPopup.value = false
      buyMode.value = false
      quantity.value = 1
    }
    
    // 开始倒计时
    const startCountdown = () => {
      if (isSeckill.value) {
        // 立即执行一次
        seckillStore.updateCountdown()
        // 设置定时器，每秒更新一次
        timer = setInterval(() => {
          seckillStore.updateCountdown()
        }, 1000)
      }
    }
    
    // 获取商品详情
    const fetchProductDetail = async () => {
      try {
        await productStore.fetchProductDetail(productId.value)
        
        // 初始化选中规格数组
        if (product.value && product.value.specs.length > 0) {
          selectedSpecs.value = Array(product.value.specs.length).fill(undefined)
        }
      } catch (error) {
        console.error('获取商品详情失败', error)
        Toast.fail('获取商品详情失败')
      }
    }
    
    // 跳转到商品详情页
    const goToProductDetail = (id) => {
      router.push({
        path: `/product/${id}`,
        query: {
          isSeckill: true
        }
      })
    }
    
    onMounted(() => {
      fetchProductDetail()
      startCountdown()
    })
    
    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })
    
    return {
      product,
      activeTab,
      showSpecPopup,
      selectedSpecs,
      selectedAttrText,
      quantity,
      isSpecSelected,
      cartCount,
      buyMode,
      selectSpec,
      confirmSelection,
      isSeckill,
      countdown,
      formatTime,
      formatPrice,
      onClickLeft,
      contactService,
      goToCart,
      goToProductDetail
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.product-detail {
  min-height: 100vh;
  padding-bottom: 50px;
  background-color: @gray-light;
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .swiper {
    .product-image {
      width: 100%;
      height: 375px;
      display: block;
    }
  }
  
  .product-info {
    background-color: #fff;
    padding: 15px;
    
    .product-price {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .price {
        color: #e53e3e;
        font-size: 20px;
        font-weight: bold;
        margin-right: 10px;
      }
      
      .origin-price {
        color: #999;
        font-size: 14px;
        text-decoration: line-through;
      }
      
      .seckill-tag {
        background-color: #ee0a24;
        color: #fff;
        font-size: 12px;
        padding: 1px 5px;
        border-radius: 4px;
        margin-left: 8px;
      }
    }
    
    .product-title {
      font-size: 16px;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    
    .product-sales {
      color: #666;
      font-size: 14px;
    }
    
    .seckill-countdown {
      display: flex;
      align-items: center;
      margin-top: 15px;
      background-color: #fff8f8;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      color: #ee0a24;
      
      span {
        margin-right: 8px;
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
          background-color: #ee0a24;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          border-radius: 4px;
        }
        
        .colon {
          margin: 0 3px;
        }
      }
    }
  }
  
  .product-attrs {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #fff;
    margin-bottom: 8px;
    
    .attr-label {
      font-size: 14px;
      color: @gray;
      margin-right: 8px;
    }
    
    .attr-value {
      flex: 1;
      font-size: 14px;
    }
  }
  
  .product-tabs {
    margin-bottom: 50px;
    background-color: #fff;
    
    .product-description {
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .product-params {
      padding: 16px;
      
      .param-item {
        display: flex;
        margin-bottom: 12px;
        
        .param-label {
          width: 80px;
          font-size: 14px;
          color: @gray;
        }
        
        .param-value {
          flex: 1;
          font-size: 14px;
        }
      }
    }
    
    .product-reviews {
      padding: 16px;
    }
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  z-index: 9;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  
  .action-icons {
    display: flex;
    width: 30%;
    
    .action-icon {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: @gray-dark;
      position: relative;
      
      .van-icon {
        font-size: 20px;
        margin-bottom: 2px;
      }
      
      .van-badge {
        position: absolute;
        top: -4px;
        right: 20%;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    width: 70%;
    
    .van-button {
      flex: 1;
      height: 50px;
      margin: 0;
      border: none;
      border-radius: 0;
    }
  }
}

.spec-popup {
  .spec-header {
    display: flex;
    padding: 16px;
    position: relative;
    border-bottom: 1px solid @border-color;
    
    .spec-image {
      margin-right: 12px;
    }
    
    .spec-info {
      flex: 1;
      overflow: hidden;
      
      .price {
        font-size: 20px;
        color: @red;
        margin-bottom: 4px;
      }
      
      .title {
        font-size: 14px;
        margin-bottom: 8px;
        @extend .ellipsis;
      }
      
      .selected {
        font-size: 12px;
        color: @gray-dark;
      }
    }
    
    .close-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 18px;
      color: @gray;
    }
  }
  
  .spec-content {
    padding: 16px;
    max-height: 350px;
    overflow-y: auto;
    
    .spec-group {
      margin-bottom: 16px;
      
      .spec-title {
        font-size: 14px;
        margin-bottom: 8px;
      }
      
      .spec-values {
        display: flex;
        flex-wrap: wrap;
        
        .spec-value {
          display: inline-block;
          padding: 5px 12px;
          margin: 0 8px 8px 0;
          border: 1px solid @border-color;
          border-radius: 4px;
          font-size: 12px;
          
          &.active {
            color: @red;
            border-color: @red;
            background-color: fade(@red, 5%);
          }
        }
      }
    }
    
    .amount-picker {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      
      .amount-title {
        font-size: 14px;
      }
    }
  }
  
  .spec-footer {
    padding: 16px;
    border-top: 1px solid @border-color;
  }
}
</style> 