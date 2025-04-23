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
            <van-icon name="photograph" class="photo-icon" @click="onTakePhoto" />
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
        <van-icon name="search" class="suggestion-icon" />
        <span v-html="highlightKeyword(item, keyword)"></span>
      </div>
    </div>

    <!-- 历史搜索 -->
    <div class="search-section" v-if="searchHistory.length">
      <div class="section-header">
        <span class="section-title">历史搜索</span>
        <van-icon name="delete" class="delete-icon" @click="clearHistory" />
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
        <span class="section-title">猜你想搜</span>
        <div class="refresh" @click="refreshSuggestions">
          <van-icon name="replay" class="refresh-icon" />
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
          <span class="section-title">YY热搜</span>
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
import { useSearchStore } from '@/stores'
import { Toast } from 'vant'

export default {
  name: 'Search',
  setup() {
    const router = useRouter()
    const searchStore = useSearchStore()
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
      searchHistory.value = searchStore.history
      
      // 获取热搜关键词
      await loadHotKeywords()
    })

    // 加载热搜关键词
    const loadHotKeywords = async () => {
      try {
        // 使用直接的Pinia属性访问
        hotSearchList.value = searchStore.hotKeywords.map((keyword, index) => ({
          id: index,
          keyword: keyword,
          tag: '',
          count: (Math.random() * 100).toFixed(1),
          trending: Math.random() > 0.3 ? 'up' : 'down'
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
          // 简单过滤热门搜索词作为建议
          suggestions.value = searchStore.hotKeywords
            .filter(item => item.toLowerCase().includes(keyword.value.toLowerCase()))
            .slice(0, 8)
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
      searchStore.addSearchHistory(keyword.value.trim())
      
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
        await searchStore.clearSearchHistory()
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
        // 随机打乱热词作为推荐
        suggestions.value = [...searchStore.hotKeywords]
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
  background-color: #f8f8f8;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  .search-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, @primary-color, darken(@primary-color, 10%));
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .back {
      padding: 6px;
      margin-right: 8px;
      color: #fff;
      border-radius: 50%;
      transition: background-color 0.3s;
      
      &:active {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    .search-input {
      flex: 1;

      :deep(.van-search) {
        padding: 0;

        .van-search__content {
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .van-field__right-icon {
          color: #666;
        }
        
        .photo-icon {
          color: @primary-color;
        }
      }
    }

    .search-btn {
      padding: 0 12px;
      margin-left: 12px;
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      position: relative;
      
      &:active {
        opacity: 0.8;
      }
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 16px;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .search-suggestions {
    padding: 16px;
    background-color: #fff;
    border-radius: 0 0 12px 12px;
    margin: 0 12px 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .suggestion-icon {
        margin-right: 12px;
        color: #999;
      }

      span {
        font-size: 14px;
        color: #333;
        
        .highlight {
          color: @primary-color;
          font-weight: bold;
        }
      }
      
      &:active {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }
  }

  .search-section {
    padding: 20px 16px;
    margin: 0 12px 12px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .section-title {
        font-size: 16px;
        color: #333;
        font-weight: 600;
        position: relative;
        padding-left: 12px;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 16px;
          background-color: @primary-color;
          border-radius: 2px;
        }
      }

      .hot-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .hot-icon {
          color: @primary-color;
          font-size: 18px;
        }
      }

      .refresh {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #999;
        font-size: 13px;
        padding: 6px 12px;
        background-color: #f8f8f8;
        border-radius: 16px;
        
        .refresh-icon {
          color: @primary-color;
        }
      }
      
      .delete-icon {
        color: #999;
        font-size: 18px;
        padding: 6px;
      }

      .rank-tabs {
        span {
          margin-left: 16px;
          color: #999;
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 16px;

          &.active {
            color: #fff;
            background-color: @primary-color;
            font-weight: 500;
          }
        }
      }
    }

    .search-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .tag-item {
        padding: 8px 16px;
        background-color: #f8f8f8;
        border-radius: 20px;
        font-size: 13px;
        color: #666;
        transition: all 0.3s;
        
        &:active {
          background-color: rgba(229, 62, 62, 0.1);
          color: @primary-color;
        }
      }
    }

    .search-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .grid-item {
        padding: 12px;
        background-color: #f8f8f8;
        border-radius: 8px;
        font-size: 13px;
        color: #666;
        transition: all 0.3s;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        
        &:active {
          background-color: rgba(229, 62, 62, 0.1);
          color: @primary-color;
        }
      }
    }

    .hot-list {
      .hot-item {
        display: flex;
        align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

        &:last-child {
          border-bottom: none;
        }

        .rank-num {
          width: 22px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          font-size: 14px;
          color: #999;
          font-weight: bold;
          border-radius: 4px;
          background-color: #f8f8f8;

          &.top {
            color: #fff;
            background-color: @primary-color;
          }
        }

        .hot-content {
          flex: 1;
          margin: 0 12px;

          .keyword {
            font-size: 15px;
            color: #333;
            margin-bottom: 4px;
            font-weight: 500;
          }

          .tag {
            display: inline-block;
            padding: 2px 6px;
            background-color: rgba(229, 62, 62, 0.1);
            border-radius: 4px;
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