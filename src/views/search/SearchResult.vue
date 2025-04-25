<template>
  <div class="search-result">
    <!-- 顶部搜索区 -->
    <div class="search-header">
      <div class="search-bar">
        <van-search
          v-model="keyword"
          placeholder="搜索商品"
          shape="round"
          @search="onSearch"
          @cancel="onCancel"
          show-action
        >
          <template #left-icon>
            <van-icon name="arrow-left" @click="goBack" />
          </template>
        </van-search>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div 
        class="filter-item" 
        :class="{ active: sortBy === 'default' }"
        @click="setSortBy('default')"
      >综合</div>
      <div 
        class="filter-item" 
        :class="{ active: sortBy === 'sales-desc' }"
        @click="setSortBy('sales-desc')"
      >销量</div>
      <div 
        class="filter-item price-item" 
        :class="{ 
          'active': sortBy === 'price-asc' || sortBy === 'price-desc',
          'price-asc': sortBy === 'price-asc',
          'price-desc': sortBy === 'price-desc'
        }"
        @click="togglePriceSort"
      >
        价格
        <span class="price-arrows">
          <van-icon name="arrow-up" :class="{ active: sortBy === 'price-asc' }" />
          <van-icon name="arrow-down" :class="{ active: sortBy === 'price-desc' }" />
        </span>
      </div>
      <div 
        class="filter-item" 
        @click="showFilterPopup = true"
      >
        筛选
        <van-icon name="filter-o" />
      </div>
    </div>

    <!-- 搜索结果列表 -->
    <div class="search-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="product-grid">
            <div 
              class="product-item" 
              v-for="item in productList" 
              :key="item.id"
              @click="goToProductDetail(item.id)"
            >
              <div class="product-image">
                <van-image lazy-load :src="item.image" fit="cover" />
              </div>
              <div class="product-info">
                <div class="product-title">{{ item.title }}</div>
                <div class="product-price">
                  <span class="price">¥{{ formatPrice(item.price) }}</span>
                  <span class="origin-price" v-if="item.originPrice">¥{{ formatPrice(item.originPrice) }}</span>
                </div>
                <div class="product-extra">
                  <span class="sales">{{ item.sales || '0' }}人付款</span>
                  <van-icon name="cart-o" class="cart-icon" @click.stop="addToCart(item)" />
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 筛选弹出层 -->
    <van-popup
      v-model:show="showFilterPopup"
      position="right"
      :style="{ height: '100%', width: '80%' }"
    >
      <div class="filter-popup">
        <div class="filter-popup-header">
          <div class="filter-title">筛选</div>
          <van-icon name="cross" @click="showFilterPopup = false" />
        </div>
        
        <div class="filter-popup-content">
          <!-- 价格区间 -->
          <div class="filter-section">
            <div class="section-title">价格区间</div>
            <div class="price-range">
              <van-field v-model="minPrice" type="digit" placeholder="最低价" />
              <span class="separator">-</span>
              <van-field v-model="maxPrice" type="digit" placeholder="最高价" />
            </div>
          </div>
          
          <!-- 分类选择 -->
          <div class="filter-section">
            <div class="section-title">商品分类</div>
            <div class="category-list">
              <div 
                v-for="(cat, index) in categories" 
                :key="index"
                :class="['category-item', { active: selectedCategory === cat.id }]"
                @click="selectedCategory = cat.id"
              >
                {{ cat.name }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="filter-popup-footer">
          <van-button plain block @click="resetFilter">重置</van-button>
          <van-button type="danger" block @click="applyFilter">确定</van-button>
        </div>
      </div>
    </van-popup>
    
    <!-- 空状态 -->
    <van-empty 
      v-if="productList.length === 0 && !loading && !refreshing" 
      description="暂无相关商品" 
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore, useCartStore, useProductStore } from '@/stores'
import { Toast } from 'vant'
import { formatPrice } from '@/utils'

export default {
  name: 'SearchResult',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchStore = useSearchStore()
    const cartStore = useCartStore()
    const productStore = useProductStore()
    
    // 搜索关键词
    const keyword = ref(route.query.keyword || '')
    
    // 商品列表
    const productList = ref([])
    
    // 加载状态
    const loading = ref(false)
    const refreshing = ref(false)
    const finished = ref(false)
    
    // 排序方式
    const sortBy = ref('default')
    
    // 筛选弹窗
    const showFilterPopup = ref(false)
    
    // 价格区间
    const minPrice = ref('')
    const maxPrice = ref('')
    
    // 选中的分类
    const selectedCategory = ref('')
    
    // 分类列表
    const categories = ref([
      { id: 1, name: '手机数码' },
      { id: 2, name: '电脑办公' },
      { id: 3, name: '家用电器' },
      { id: 4, name: '食品生鲜' },
      { id: 5, name: '服饰鞋包' },
      { id: 6, name: '美妆护肤' },
      { id: 7, name: '家居家装' },
      { id: 8, name: '母婴玩具' }
    ])
    
    // 页码
    const page = ref(1)
    const pageSize = ref(10)
    
    // 监听关键词变化
    watch(keyword, (newVal) => {
      if (newVal !== route.query.keyword) {
        router.replace({ 
          path: '/search/result', 
          query: { keyword: newVal } 
        })
      }
    })
    
    // 监听路由参数变化
    watch(() => route.query.keyword, (newVal) => {
      if (newVal && newVal !== keyword.value) {
        keyword.value = newVal
        resetSearchParams()
        searchProducts()
      }
    })
    
    // 重置搜索参数
    const resetSearchParams = () => {
      page.value = 1
      productList.value = []
      finished.value = false
    }
    
    // 搜索商品
    const searchProducts = async () => {
      if (!keyword.value) return
      
      loading.value = true
      
      try {
        // 构造搜索参数
        const params = {
          keyword: keyword.value,
          page: page.value,
          size: pageSize.value,
          sortBy: sortBy.value,
          category: selectedCategory.value,
          minPrice: minPrice.value,
          maxPrice: maxPrice.value
        }
        
        // 调用搜索接口
        const result = await searchStore.search(keyword.value, page.value, pageSize.value)
        
        // 更新商品列表
        if (page.value === 1) {
          productList.value = result.items
        } else {
          productList.value = [...productList.value, ...result.items]
        }
        
        // 判断是否已加载全部数据
        finished.value = productList.value.length >= result.total
        
        // 更新页码
        page.value++
      } catch (error) {
        console.error('搜索商品失败', error)
        Toast('搜索商品失败')
      } finally {
        loading.value = false
        refreshing.value = false
      }
    }
    
    // 搜索
    const onSearch = () => {
      if (!keyword.value) {
        Toast('请输入搜索关键词')
        return
      }
      
      resetSearchParams()
      router.replace({ 
        path: '/search/result', 
        query: { keyword: keyword.value } 
      })
      searchProducts()
    }
    
    // 取消搜索
    const onCancel = () => {
      router.back()
    }
    
    // 返回上一页
    const goBack = () => {
      router.back()
    }
    
    // 设置排序方式
    const setSortBy = (type) => {
      sortBy.value = type
      resetSearchParams()
      searchProducts()
    }
    
    // 切换价格排序
    const togglePriceSort = () => {
      if (sortBy.value === 'price-asc') {
        sortBy.value = 'price-desc'
      } else {
        sortBy.value = 'price-asc'
      }
      resetSearchParams()
      searchProducts()
    }
    
    // 重置筛选条件
    const resetFilter = () => {
      minPrice.value = ''
      maxPrice.value = ''
      selectedCategory.value = ''
    }
    
    // 应用筛选条件
    const applyFilter = () => {
      showFilterPopup.value = false
      resetSearchParams()
      searchProducts()
    }
    
    // 下拉刷新
    const onRefresh = () => {
      resetSearchParams()
      searchProducts()
    }
    
    // 加载更多
    const onLoad = () => {
      searchProducts()
    }
    
    // 跳转到商品详情页
    const goToProductDetail = (id) => {
      router.push(`/product/${id}`)
    }
    
    // 添加到购物车
    const addToCart = (item) => {
      const productData = {
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        count: 1
      }
      
      cartStore.addToCart(productData)
      Toast.success('已加入购物车')
    }
    
    // 商品详情
    const fetchProductDetail = async (id) => {
      try {
        await productStore.fetchProductDetail(id)
        return productStore.currentProduct
      } catch (error) {
        console.error('获取商品详情失败', error)
        Toast.fail('获取商品详情失败')
        return null
      }
    }
    
    onMounted(() => {
      if (keyword.value) {
        searchProducts()
      }
    })
    
    return {
      keyword,
      productList,
      loading,
      refreshing,
      finished,
      sortBy,
      showFilterPopup,
      minPrice,
      maxPrice,
      selectedCategory,
      categories,
      formatPrice,
      onSearch,
      onCancel,
      goBack,
      setSortBy,
      togglePriceSort,
      resetFilter,
      applyFilter,
      onRefresh,
      onLoad,
      goToProductDetail,
      addToCart
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
  
  .search-header {
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    
    .search-bar {
      padding: 8px 0;
      
      :deep(.van-search__content) {
        background-color: #f5f5f5;
      }
      
      :deep(.van-icon-arrow-left) {
        font-size: 20px;
        color: #333;
      }
    }
  }
  
  .filter-bar {
    display: flex;
    background-color: white;
    padding: 10px 15px;
    border-bottom: 1px solid #ebedf0;
    position: sticky;
    top: 54px;
    z-index: 99;
    
    .filter-item {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #323233;
      position: relative;
      padding: 6px 0;
      
      &.active {
        color: #ee0a24;
        font-weight: 500;
      }
      
      &.price-item {
        display: flex;
        align-items: center;
        justify-content: center;
        
        .price-arrows {
          display: flex;
          flex-direction: column;
          margin-left: 4px;
          
          .van-icon {
            font-size: 10px;
            line-height: 1;
            color: #969799;
            
            &.active {
              color: #ee0a24;
            }
          }
        }
        
        &.price-asc .van-icon-arrow-up {
          color: #ee0a24;
        }
        
        &.price-desc .van-icon-arrow-down {
          color: #ee0a24;
        }
      }
    }
  }
  
  .search-content {
    flex: 1;
    overflow-y: auto;
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 8px;
      
      .product-item {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        
        .product-image {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          position: relative;
          
          :deep(.van-image) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
        
        .product-info {
          padding: 8px;
          
          .product-title {
            font-size: 14px;
            color: #323233;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.3;
            height: 2.6em;
          }
          
          .product-price {
            margin-top: 6px;
            
            .price {
              font-size: 16px;
              font-weight: 500;
              color: #ee0a24;
            }
            
            .origin-price {
              font-size: 12px;
              color: #969799;
              text-decoration: line-through;
              margin-left: 5px;
            }
          }
          
          .product-extra {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
            
            .sales {
              font-size: 12px;
              color: #969799;
            }
            
            .cart-icon {
              font-size: 20px;
              color: #ee0a24;
            }
          }
        }
      }
    }
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
      border-bottom: 1px solid #ebedf0;
      
      .filter-title {
        font-size: 16px;
        font-weight: 500;
      }
      
      .van-icon {
        font-size: 20px;
      }
    }
    
    .filter-popup-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      
      .filter-section {
        margin-bottom: 20px;
        
        .section-title {
          font-size: 14px;
          color: #323233;
          margin-bottom: 10px;
        }
        
        .price-range {
          display: flex;
          align-items: center;
          
          .separator {
            margin: 0 10px;
            color: #969799;
          }
          
          :deep(.van-field) {
            flex: 1;
          }
        }
        
        .category-list {
          display: flex;
          flex-wrap: wrap;
          
          .category-item {
            width: calc(33.33% - 8px);
            margin-right: 12px;
            margin-bottom: 12px;
            padding: 6px 0;
            text-align: center;
            font-size: 14px;
            border-radius: 4px;
            background-color: #f7f8fa;
            
            &:nth-child(3n) {
              margin-right: 0;
            }
            
            &.active {
              color: #ee0a24;
              background-color: rgba(238, 10, 36, 0.1);
            }
          }
        }
      }
    }
    
    .filter-popup-footer {
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      border-top: 1px solid #ebedf0;
    }
  }
  
  :deep(.van-empty) {
    padding: 80px 0;
  }
}
</style> 