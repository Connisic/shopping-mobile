<template>
  <div class="product-card" @click="handleClick">
    <div class="product-image">
      <van-image :src="product.image" fit="cover" lazy-load />
    </div>
    <div class="product-content">
      <div class="product-title ellipsis-2">{{ product.title }}</div>
      <div class="product-price">
        <span class="price">¥{{ formatPrice(product.price) }}</span>
        <span class="origin-price" v-if="product.originPrice">¥{{ formatPrice(product.originPrice) }}</span>
      </div>
      <div class="product-bottom">
        <div class="product-sales">销量 {{ product.sales }}</div>
        <van-icon name="cart-o" class="cart-icon" @click.stop="addToCart" />
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    
    // 点击商品卡片跳转到商品详情页
    const handleClick = () => {
      router.push(`/product/${props.product.id}`)
    }
    
    // 点击购物车图标添加商品到购物车
    const addToCart = () => {
      store.dispatch('cart/addToCart', {
        id: props.product.id,
        title: props.product.title,
        price: props.product.price,
        image: props.product.image,
        count: 1
      })
      Toast({
        message: '已加入购物车',
        icon: 'success'
      })
    }
    
    return {
      formatPrice,
      handleClick,
      addToCart
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.product-card {
  width: 100%;
  background-color: #fff;
  border-radius: @radius-md;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .product-image {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
    overflow: hidden;
    
    .van-image {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
  
  .product-content {
    padding: @space-md;
    
    .product-title {
      font-size: @font-size-md;
      color: @text-color;
      line-height: 1.4;
      height: 2.8em;
      margin-bottom: @space-sm;
    }
    
    .product-price {
      display: flex;
      align-items: center;
      margin-bottom: @space-sm;
      
      .price {
        font-size: @font-size-lg;
        color: @red;
        font-weight: bold;
        margin-right: @space-sm;
      }
      
      .origin-price {
        font-size: @font-size-sm;
        color: @gray;
        text-decoration: line-through;
      }
    }
    
    .product-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .product-sales {
        font-size: @font-size-sm;
        color: @gray;
      }
      
      .cart-icon {
        font-size: 22px;
        color: @red;
        padding: @space-xs;
      }
    }
  }
}
</style> 