<template>
  <div class="search-results">
    <div class="search-header">
      <van-icon name="arrow-left" class="back-icon" @click="onClickLeft" />
      <van-search
        v-model="keyword"
        placeholder="男士运动外套衬衫"
        show-action
        shape="round"
        background="transparent"
        @search="onSearch"
        @cancel="onClickLeft"
        @clear="onClear"
      >
        <template #action>
          <van-icon name="search" size="18" />
        </template>
      </van-search>
    </div>
    
    <div class="category-tabs">
      <van-tabs v-model:active="activeTab" sticky swipeable animated>
        <van-tab title="综合"></van-tab>
        <van-tab title="销量"></van-tab>
        <van-tab title="天猫"></van-tab>
        <van-tab title="店铺"></van-tab>
        <van-tab title="上新"></van-tab>
        <van-tab title="筛选"></van-tab>
      </van-tabs>
    </div>
    
    <!-- 筛选弹窗 -->
    <van-popup v-model:show="showFilter" position="right" :style="{ width: '80%', height: '100%' }">
      <div class="filter-popup">
        <div class="filter-popup-header">
          <div class="filter-popup-title">筛选条件</div>
          <van-icon name="cross" @click="showFilter = false" />
        </div>
        
        <div class="filter-popup-content">
          <div class="filter-section">
            <div class="filter-section-title">价格区间</div>
            <div class="price-range">
              <van-field v-model="filter.minPrice" type="digit" placeholder="最低价" />
              <span class="separator">-</span>
              <van-field v-model="filter.maxPrice" type="digit" placeholder="最高价" />
            </div>
          </div>
        </div>
        
        <div class="filter-popup-footer">
          <van-button plain block @click="onReset">重置</van-button>
          <van-button type="danger" block @click="onConfirm">确认</van-button>
        </div>
      </div>
    </van-popup>
    
    <div class="product-list" v-if="products.length">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <div class="product-card">
          <div class="product-image">
            <van-image :src="product.image" fit="cover" lazy-load @click="goToProduct(product.id)" />
            <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
          </div>
          <div class="product-content">
            <div class="product-source">
              <van-tag plain :type="product.source === '天猫' ? 'danger' : 'primary'" size="small">{{ product.source }}</van-tag>
            </div>
            <div class="product-title" @click="goToProduct(product.id)">{{ product.title }}</div>
            <div class="product-price-info">
              <div class="price">¥{{ product.price }}</div>
              <div class="sales">{{ product.sales }}+人付款</div>
            </div>
            <div class="product-extra-info">
              <span v-if="product.isNew" class="new-tag">新品</span>
              <span v-if="product.freeShipping" class="ship-tag">直降{{ product.discount }}元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-state-container" v-if="!loading && products.length === 0">
      <template v-if="hasSearched">
        <van-empty description="暂无相关商品" />
        <p class="empty-tip">试试其他关键词，或者查看热门商品</p>
      </template>
      <template v-else>
        <van-icon name="search" size="48" class="search-icon" />
        <p class="empty-tip">请输入关键词开始搜索</p>
      </template>
    </div>
    
    <div v-if="loading" class="loading-container">
      <van-loading class="loading-spinner" type="spinner" color="#1989fa" size="24px" />
      <p class="loading-text">正在搜索中，请稍候...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useStore } from 'vuex'

export default {
  name: 'SearchResults',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    
    // 搜索关键词
    const keyword = ref('')
    // 商品列表
    const products = ref([])
    // 是否正在加载
    const loading = ref(false)
    // 是否已经加载全部数据
    const finished = ref(false)
    // 当前页码
    const page = ref(1)
    // 排序方式
    const activeTab = ref(0)
    // 筛选条件
    const filter = ref({
      minPrice: '',
      maxPrice: ''
    })
    // 显示筛选弹窗
    const showFilter = ref(false)
    // 是否已经搜索过
    const hasSearched = ref(false)
    
    // 返回按钮
    const onClickLeft = () => {
      router.back()
    }
    
    // 执行搜索
    const onSearch = () => {
      if (keyword.value.trim()) {
        resetSearch()
        hasSearched.value = true
        loadProducts()
      } else {
        Toast('请输入搜索关键词')
      }
    }
    
    // 清除搜索关键词
    const onClear = () => {
      keyword.value = ''
      resetSearch()
      hasSearched.value = false
    }
    
    // 重置搜索
    const resetSearch = () => {
      page.value = 1
      products.value = []
      finished.value = false
    }
    
    // 跳转到商品详情
    const goToProduct = (id) => {
      router.push(`/product/${id}`)
    }
    
    // Tab切换
    const handleTabChange = () => {
      resetSearch()
      loadProducts()
      if (activeTab.value === 5) {
        showFilter.value = true
      }
    }
    
    // 重置筛选
    const onReset = () => {
      filter.value.minPrice = ''
      filter.value.maxPrice = ''
    }
    
    // 确认筛选
    const onConfirm = () => {
      showFilter.value = false
      resetSearch()
      loadProducts()
    }
    
    // 加载商品列表
    const loadProducts = async () => {
      if (loading.value) return
      
      loading.value = true
      
      try {
        // 调用store中的searchProducts action
        await store.dispatch('search/searchProducts', {
          keyword: keyword.value,
          page: page.value,
          ...filter.value.minPrice ? { minPrice: Number(filter.value.minPrice) } : {},
          ...filter.value.maxPrice ? { maxPrice: Number(filter.value.maxPrice) } : {}
        })
        
        // 根据激活的标签设置排序参数
        const sortParams = getSortParams()
        if (sortParams.sort) {
          await store.dispatch('search/searchProducts', {
            ...sortParams
          })
        }
        
        // 更新搜索历史
        store.dispatch('search/addSearchHistory', keyword.value)
      } catch (error) {
        console.error('搜索商品失败', error)
        Toast('搜索失败，请重试')
      } finally {
        loading.value = false
      }
    }
    
    // 根据标签获取排序参数
    const getSortParams = () => {
      switch (activeTab.value) {
        case 1: // 销量
          return { sort: 'sales', order: 'desc' }
        case 2: // 天猫
          return { sort: 'source', order: 'asc' }
        case 3: // 店铺
          return { sort: 'shopRank', order: 'desc' }
        case 4: // 上新
          return { sort: 'createTime', order: 'desc' }
        default:
          return { sort: '', order: '' }
      }
    }
    
    // 初始化数据
    const initData = async () => {
      const query = route.query
      keyword.value = query.keyword || ''
      
      if (keyword.value) {
        resetSearch()
        hasSearched.value = true
        await nextTick()
        loadProducts()
      }
    }
    
    // 监听Tab变化
    watch(activeTab, () => {
      handleTabChange();
    });
    
    // 组件挂载后加载数据
    onMounted(() => {
      if (route.query.keyword) {
        keyword.value = route.query.keyword.toString()
        // 将URL参数中的关键词存入store
        store.dispatch('search/resetSearchParams', keyword.value)
        // 获取搜索结果
        loadProducts()
        hasSearched.value = true
      }
    })
    
    // 加载更多
    const onLoadMore = async () => {
      if (loading.value || finished.value) return
      
      const nextPage = store.getters['search/searchResults'].page + 1
      await loadProducts({
        page: nextPage
      })
    }
    
    return {
      keyword,
      products,
      loading,
      finished,
      activeTab,
      filter,
      showFilter,
      hasSearched,
      onClickLeft,
      onSearch,
      onClear,
      onReset,
      onConfirm,
      goToProduct,
      onLoadMore
    }
  }
}
</script>

<style lang="less" scoped>
.search-results {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 50px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  
  .search-header {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .back-icon {
      font-size: 20px;
      margin-right: 8px;
    }
    
    :deep(.van-search) {
      flex: 1;
      padding: 0;
      
      .van-search__content {
        background-color: #f5f5f5;
      }
    }
  }
  
  .category-tabs {
    :deep(.van-tabs__wrap) {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    :deep(.van-tab) {
      flex: 1;
      min-width: auto;
    }
  }
  
  .product-list {
    padding: 8px;
    
    .product-item {
      margin-bottom: 8px;
    }
    
    .product-card {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 8px;
      
      .product-image {
        position: relative;
        
        .van-image {
          width: 100%;
          height: 160px;
        }
        
        .product-tag {
          position: absolute;
          top: 0;
          left: 0;
          background-color: #ff5000;
          color: #fff;
          font-size: 12px;
          padding: 2px 6px;
          border-bottom-right-radius: 8px;
        }
      }
      
      .product-content {
        padding: 8px 12px;
        
        .product-source {
          margin-bottom: 4px;
        }
        
        .product-title {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        
        .product-price-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          
          .price {
            font-size: 16px;
            color: #ff5000;
            font-weight: 500;
          }
          
          .sales {
            font-size: 12px;
            color: #999;
          }
        }
        
        .product-extra-info {
          display: flex;
          gap: 8px;
          
          .new-tag,
          .ship-tag {
            display: inline-block;
            font-size: 12px;
            color: #999;
            padding: 1px 4px;
            border: 1px solid #eee;
            border-radius: 2px;
          }
        }
      }
    }
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
  }
  
  .loading-spinner {
    margin-bottom: 16px;
  }
  
  .loading-text {
    font-size: 14px;
    color: #999;
  }
  
  .empty-state-container {
    padding: 40px 16px;
    text-align: center;
    
    .search-icon {
      color: #ccc;
      margin-bottom: 16px;
    }
  }
  
  .empty-tip {
    font-size: 14px;
    color: #999;
    margin-top: 16px;
  }
  
  .filter-popup {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .filter-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05);
      
      .filter-popup-title {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .filter-popup-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      
      .filter-section {
        margin-bottom: 20px;
        
        .filter-section-title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .price-range {
          display: flex;
          align-items: center;
          
          .separator {
            margin: 0 8px;
            color: #999;
          }
        }
      }
    }
    
    .filter-popup-footer {
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.05);
    }
  }
}
</style> 