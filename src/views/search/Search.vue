<template>
  <div class="search">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="back" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
      <div class="search-input">
        <van-search
          v-model="keyword"
          placeholder="高级鸡料包"
          shape="round"
          background="transparent"
          @search="onSearch"
          @clear="onClear"
          @input="onKeywordInput"
        >
          <template #right-icon>
            <van-icon name="photograph" @click="onTakePhoto" />
          </template>
        </van-search>
      </div>
      <div class="search-btn" @click="onSearch">搜索</div>
    </div>

    <!-- 搜索建议 -->
    <div class="search-suggestions" v-if="showSuggestions && keyword && suggestions.length">
      <div 
        v-for="(item, index) in suggestions" 
        :key="index" 
        class="suggestion-item"
        @click="onTagClick(item)"
      >
        <van-icon name="search" />
        <span v-html="highlightKeyword(item, keyword)"></span>
      </div>
    </div>

    <!-- 历史搜索 -->
    <div class="search-section" v-if="searchHistory.length">
      <div class="section-header">
        <span>历史搜索</span>
        <van-icon name="delete" @click="clearHistory" />
      </div>
      <div class="search-tags">
        <div v-for="(item, index) in searchHistory" 
          :key="index" 
          class="tag-item"
          @click="onTagClick(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- 猜你想搜 -->
    <div class="search-section">
      <div class="section-header">
        <span>猜你想搜</span>
        <div class="refresh" @click="refreshSuggestions">
          <van-icon name="replay" />
          <span>换一批</span>
        </div>
      </div>
      <div class="search-grid">
        <div v-for="(item, index) in suggestions" 
          :key="index" 
          class="grid-item"
          @click="onTagClick(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- YY热搜 -->
    <div class="search-section">
      <div class="section-header">
        <div class="hot-title">
          <van-icon name="fire" class="hot-icon" />
          <span>YY热搜</span>
        </div>
        <div class="rank-tabs">
          <span class="active">榜单</span>
          <span>明星同款</span>
        </div>
      </div>
      <div class="hot-list">
        <div v-for="(item, index) in hotSearchList" 
          :key="index" 
          class="hot-item"
          @click="onTagClick(item.keyword)"
        >
          <div class="rank-num" :class="{ top: index < 3 }">{{ index + 1 }}</div>
          <div class="hot-content">
            <div class="keyword">{{ item.keyword }}</div>
            <div class="tag" v-if="item.tag">{{ item.tag }}</div>
          </div>
          <div class="hot-count">
            热度{{ item.count }}万
            <van-icon name="arrow-up" v-if="item.trending === 'up'" class="trend up" />
            <van-icon name="arrow-down" v-if="item.trending === 'down'" class="trend down" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'

export default {
  name: 'Search',
  setup() {
    const router = useRouter()
    const store = useStore()
    const keyword = ref('')
    
    // 从store获取历史搜索
    const searchHistory = ref([])
    // 搜索建议
    const suggestions = ref([])
    // 热搜关键词
    const hotSearchList = ref([])
    // 是否显示搜索建议
    const showSuggestions = ref(false)

    // 初始化数据
    onMounted(async () => {
      // 获取历史搜索
      await store.dispatch('search/getSearchHistory')
      searchHistory.value = store.getters['search/searchHistory']
      
      // 获取热搜关键词
      await loadHotKeywords()
    })

    // 加载热搜关键词
    const loadHotKeywords = async () => {
      try {
        await store.dispatch('search/getHotKeywords', 10)
        const hotKeywords = store.getters['search/hotKeywords']
        
        // 格式化热搜数据
        hotSearchList.value = hotKeywords.map((item, index) => ({
          id: item.id || index,
          keyword: item.keyword,
          tag: item.tag || '',
          count: (item.count / 10000).toFixed(1) || '0',
          trending: item.trending || (Math.random() > 0.3 ? 'up' : 'down')
        }))
      } catch (error) {
        console.error('获取热搜关键词失败', error)
      }
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    // 监听输入，获取搜索建议
    const onKeywordInput = async () => {
      if (keyword.value.trim()) {
        try {
          await store.dispatch('search/getSearchSuggestions', {
            keyword: keyword.value.trim(),
            limit: 8
          })
          suggestions.value = store.getters['search/suggestions']
          showSuggestions.value = true
        } catch (error) {
          console.error('获取搜索建议失败', error)
        }
      } else {
        suggestions.value = []
        showSuggestions.value = false
      }
    }

    // 搜索
    const onSearch = () => {
      if (!keyword.value.trim()) {
        Toast('请输入搜索关键词')
        return
      }
      
      // 添加到搜索历史
      store.dispatch('search/addSearchHistory', keyword.value.trim())
      
      // 重置搜索参数，仅保留关键词
      store.dispatch('search/resetSearchParams', keyword.value.trim())
      
      // 跳转到搜索结果页
      router.push({
        path: '/search-results',
        query: { keyword: keyword.value.trim() }
      })
    }

    // 清空输入框
    const onClear = () => {
      keyword.value = ''
      suggestions.value = []
      showSuggestions.value = false
    }

    // 调用相机功能
    const onTakePhoto = () => {
      Toast('相机功能暂未实现')
    }

    // 清空历史记录
    const clearHistory = async () => {
      try {
        await store.dispatch('search/clearSearchHistory')
        searchHistory.value = []
        Toast('历史记录已清空')
      } catch (error) {
        console.error('清空历史记录失败', error)
      }
    }

    // 点击标签搜索
    const onTagClick = (tag) => {
      keyword.value = tag
      onSearch()
    }

    // 刷新推荐搜索词
    const refreshSuggestions = async () => {
      try {
        await store.dispatch('search/getHotKeywords', 8)
        const hotKeywords = store.getters['search/hotKeywords']
        
        // 随机打乱热词作为推荐
        suggestions.value = hotKeywords
          .map(item => item.keyword)
          .sort(() => Math.random() - 0.5)
          .slice(0, 8)
        
        Toast('已更新推荐')
      } catch (error) {
        console.error('刷新推荐搜索词失败', error)
      }
    }

    // 高亮关键词
    const highlightKeyword = (text, keyword) => {
      if (!keyword || !text) return text
      
      const reg = new RegExp(keyword, 'gi')
      return text.replace(reg, match => `<span class="highlight">${match}</span>`)
    }

    return {
      keyword,
      searchHistory,
      suggestions,
      hotSearchList,
      showSuggestions,
      goBack,
      onSearch,
      onClear,
      onKeywordInput,
      onTakePhoto,
      clearHistory,
      onTagClick,
      refreshSuggestions,
      highlightKeyword
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.search {
  min-height: 100vh;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  .search-header {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: @primary-color;

    .back {
      padding: 4px;
      margin-right: 8px;
      color: #fff;
    }

    .search-input {
      flex: 1;

      :deep(.van-search) {
        padding: 0;

        .van-search__content {
          background-color: #fff;
        }

        .van-field__right-icon {
          color: #999;
        }
      }
    }

    .search-btn {
      padding: 0 12px;
      color: #fff;
      font-size: 14px;
    }
  }

  .search-suggestions {
    padding: 16px;
    border-bottom: 8px solid #f7f8fa;

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .van-icon {
        margin-right: 8px;
      }

      span {
        font-size: 14px;
        color: #333;
        
        .highlight {
          color: @primary-color;
          font-weight: bold;
        }
      }
    }
  }

  .search-section {
    padding: 16px;
    border-bottom: 8px solid #f7f8fa;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      color: #333;

      .hot-title {
        display: flex;
        align-items: center;
        gap: 4px;

        .hot-icon {
          color: @primary-color;
        }
      }

      .refresh {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #999;
        font-size: 12px;
      }

      .rank-tabs {
        span {
          margin-left: 16px;
          color: #999;
          font-size: 12px;

          &.active {
            color: #333;
            font-weight: bold;
          }
        }
      }
    }

    .search-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .tag-item {
        padding: 6px 12px;
        background-color: #f7f8fa;
        border-radius: 4px;
        font-size: 12px;
        color: #666;
      }
    }

    .search-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .grid-item {
        padding: 8px 12px;
        background-color: #f7f8fa;
        border-radius: 4px;
        font-size: 12px;
        color: #666;
      }
    }

    .hot-list {
      .hot-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .rank-num {
          width: 20px;
          font-size: 14px;
          color: #999;
          font-weight: bold;

          &.top {
            color: @primary-color;
          }
        }

        .hot-content {
          flex: 1;
          margin: 0 12px;

          .keyword {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }

          .tag {
            display: inline-block;
            padding: 2px 6px;
            background-color: #fff1f1;
            border-radius: 2px;
            font-size: 10px;
            color: @primary-color;
          }
        }

        .hot-count {
          font-size: 12px;
          color: #999;
          display: flex;
          align-items: center;
          gap: 4px;

          .trend {
            &.up {
              color: @primary-color;
            }

            &.down {
              color: #52c41a;
            }
          }
        }
      }
    }
  }
}
</style> 