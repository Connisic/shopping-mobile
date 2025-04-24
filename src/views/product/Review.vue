<template>
  <div class="review-page">
    <!-- 顶部导航栏 -->
    <div class="review-header">
      <van-icon name="arrow-left" class="back-icon" @click="onBack" />
      <div class="title">商品评价</div>
      <div class="placeholder"></div>
    </div>

    <!-- 评价统计 -->
    <div class="review-stats">
      <div class="stats-item">
        <div class="stats-value">4.8</div>
        <div class="stats-label">综合评分</div>
      </div>
      <div class="stats-item">
        <div class="stats-value">98%</div>
        <div class="stats-label">好评率</div>
      </div>
      <div class="stats-item">
        <div class="stats-value">2.3k</div>
        <div class="stats-label">累计评价</div>
      </div>
    </div>

    <!-- 评价标签 -->
    <div class="review-tags">
      <div 
        v-for="tag in tags" 
        :key="tag.name"
        class="tag-item"
        :class="{ active: tag.active }"
        @click="selectTag(tag)"
      >
        {{ tag.name }}
        <span class="tag-count">({{ tag.count }})</span>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <!-- 用户信息 -->
        <div class="user-info">
          <img :src="review.avatar" class="user-avatar" :alt="review.username">
          <div class="user-detail">
            <div class="username">{{ review.username }}</div>
            <div class="review-rating">
              <van-rate v-model="review.rating" readonly allow-half void-icon="star" void-color="#eee" />
              <span class="review-date">{{ review.date }}</span>
            </div>
          </div>
        </div>

        <!-- 评价内容 -->
        <div class="review-content">{{ review.content }}</div>

        <!-- 商品规格 -->
        <div class="product-sku">{{ review.sku }}</div>

        <!-- 评价图片 -->
        <div class="review-images" v-if="review.images && review.images.length">
          <div 
            v-for="(image, index) in review.images" 
            :key="index"
            class="image-item"
            @click="previewImage(review.images, index)"
          >
            <img :src="image" :alt="`评价图片${index + 1}`">
          </div>
        </div>

        <!-- 商家回复 -->
        <div class="shop-reply" v-if="review.reply">
          <span class="reply-label">商家回复：</span>
          {{ review.reply }}
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrapper" v-if="loading">
      <div class="loading-spinner">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="loading-text">加载中...</div>
    </div>

    <!-- 无更多数据 -->
    <div class="no-more" v-if="!loading && !hasMore">
      没有更多评价了
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ImagePreview } from 'vant'

export default {
  name: 'Review',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const hasMore = ref(true)
    
    // 评价标签
    const tags = ref([
      { name: '全部', count: 2342, active: true },
      { name: '好评', count: 2298, active: false },
      { name: '中评', count: 32, active: false },
      { name: '差评', count: 12, active: false },
      { name: '有图', count: 865, active: false },
      { name: '视频', count: 76, active: false }
    ])
    
    // 评价列表
    const reviews = ref([
      {
        id: 1,
        username: '张**',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        rating: 5,
        date: '2024-03-12',
        content: '商品质量非常好，做工精细，手感舒适，颜色也很漂亮，物流速度快，包装完整，非常满意的一次购物体验！',
        sku: '颜色：原色钛金属 | 容量：256GB',
        images: [
          'https://img01.yzcdn.cn/vant/cat.jpeg',
          'https://img01.yzcdn.cn/vant/cat.jpeg',
          'https://img01.yzcdn.cn/vant/cat.jpeg'
        ],
        reply: '感谢您的支持与认可，我们会继续努力提供更好的产品和服务！'
      },
      {
        id: 2,
        username: '李**',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        rating: 4.5,
        date: '2024-03-11',
        content: '整体还不错，就是价格稍微有点贵，希望以后能有更多优惠活动。',
        sku: '颜色：自然黑 | 容量：128GB'
      },
      {
        id: 3,
        username: '王**',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        rating: 5,
        date: '2024-03-10',
        content: '已经是第三次购买了，一如既往的好评！店家服务态度很好，发货速度快，商品品质有保证。',
        sku: '颜色：原色钛金属 | 容量：512GB',
        images: [
          'https://img01.yzcdn.cn/vant/cat.jpeg',
          'https://img01.yzcdn.cn/vant/cat.jpeg'
        ]
      }
    ])
    
    // 返回上一页
    const onBack = () => {
      router.back()
    }
    
    // 选择标签
    const selectTag = (tag) => {
      tags.value.forEach(t => {
        t.active = t === tag
      })
      // 重新加载评价列表
      loadReviews()
    }
    
    // 预览图片
    const previewImage = (images, startPosition) => {
      ImagePreview({
        images,
        startPosition,
        closeable: true
      })
    }
    
    // 加载评价列表
    const loadReviews = () => {
      loading.value = true
      // 模拟API请求
      setTimeout(() => {
        loading.value = false
        // 模拟无更多数据
        if (reviews.value.length >= 10) {
          hasMore.value = false
        }
      }, 1000)
    }
    
    onMounted(() => {
      loadReviews()
    })
    
    return {
      loading,
      hasMore,
      tags,
      reviews,
      onBack,
      selectTag,
      previewImage
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.review-page {
  min-height: 100vh;
  background-color: #f8f8f8;

  .review-header {
    background: linear-gradient(135deg, @primary-color, darken(@primary-color, 15%));
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .back-icon {
      font-size: 20px;
      padding: 4px;
    }
    
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    
    .placeholder {
      width: 28px;
    }
  }

  .review-stats {
    background: white;
    display: flex;
    padding: 16px;
    margin-bottom: 8px;
    
    .stats-item {
      flex: 1;
      text-align: center;
      
      &:not(:last-child) {
        border-right: 1px solid #f5f5f5;
      }
      
      .stats-value {
        font-size: 20px;
        font-weight: bold;
        color: @primary-color;
        margin-bottom: 4px;
      }
      
      .stats-label {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .review-tags {
    background: white;
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
    
    .tag-item {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      color: #666;
      background: #f5f5f5;
      transition: all 0.3s ease;
      
      &.active {
        background: rgba(@primary-color, 0.1);
        color: @primary-color;
      }
      
      .tag-count {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .review-list {
    padding: 12px;
    
    .review-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.05);
          margin-right: 12px;
          object-fit: cover;
        }
        
        .user-detail {
          flex: 1;
          
          .username {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }
          
          .review-rating {
            display: flex;
            align-items: center;
            
            :deep(.van-rate) {
              font-size: 12px;
              color: @primary-color;
            }
            
            .review-date {
              font-size: 12px;
              color: #999;
              margin-left: 8px;
            }
          }
        }
      }
      
      .review-content {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        margin-bottom: 12px;
      }
      
      .product-sku {
        font-size: 12px;
        color: #999;
        margin-bottom: 12px;
      }
      
      .review-images {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
        
        .image-item {
          width: calc((100% - 16px) / 3);
          position: relative;
          padding-bottom: calc((100% - 16px) / 3);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      
      .shop-reply {
        font-size: 13px;
        color: #666;
        background: #f8f8f8;
        padding: 8px 12px;
        border-radius: 6px;
        
        .reply-label {
          color: #999;
        }
      }
    }
  }

  .loading-wrapper {
    padding: 20px 0;
    text-align: center;
    
    .loading-spinner {
      display: inline-flex;
      position: relative;
      width: 30px;
      height: 30px;
      
      span {
        position: absolute;
        width: 6px;
        height: 6px;
        background: @primary-color;
        border-radius: 50%;
        animation: spinner 1.2s linear infinite;
        
        &:nth-child(1) {
          animation-delay: 0s;
          top: 12px;
          left: 0;
        }
        
        &:nth-child(2) {
          animation-delay: -0.3s;
          top: 4px;
          left: 4px;
        }
        
        &:nth-child(3) {
          animation-delay: -0.6s;
          top: 0;
          left: 12px;
        }
        
        &:nth-child(4) {
          animation-delay: -0.9s;
          top: 4px;
          right: 4px;
        }
      }
    }
    
    .loading-text {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
  }

  .no-more {
    text-align: center;
    font-size: 12px;
    color: #999;
    padding: 16px 0;
  }
}

@keyframes spinner {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 