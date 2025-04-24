<template>
  <div class="search-page">
    <!-- 顶部搜索区 -->
    <div class="search-header">
      <div class="search-bar">
        <van-search
          v-model="keyword"
          placeholder="搜索商品"
          :autofocus="true"
          shape="round"
          @search="onSearch"
          @focus="onFocus"
        >
          <template #left-icon>
            <van-icon name="search" />
          </template>
          <template #right-icon>
            <van-icon name="clear" v-if="keyword" @click="keyword = ''" />
          </template>
        </van-search>
        <div class="cancel-btn" @click="onBack">取消</div>
      </div>
    </div>

    <!-- 搜索内容区 -->
    <div class="search-content">
    <!-- 历史搜索 -->
      <div class="search-section" v-if="showHistory">
      <div class="section-header">
          <div class="title">历史搜索</div>
          <van-icon name="delete" class="clear-icon" @click="clearHistory" />
      </div>
      <div class="search-tags">
          <span 
            v-for="(item, index) in historyList" 
          :key="index" 
            class="tag"
          @click="onTagClick(item)"
        >
          {{ item }}
          </span>
      </div>
    </div>

    <!-- 猜你想搜 -->
    <div class="search-section">
      <div class="section-header">
          <div class="title">猜你想搜</div>
        </div>
        <div class="search-tags">
          <span 
            v-for="(item, index) in suggestList" 
          :key="index" 
            class="tag"
          @click="onTagClick(item)"
        >
          {{ item }}
          </span>
      </div>
    </div>

      <!-- 热门搜索 -->
    <div class="search-section">
      <div class="section-header">
          <div class="title">热门搜索</div>
        </div>
        <div class="hot-search-list">
          <div 
            v-for="(item, index) in hotSearchList" 
          :key="index" 
            class="hot-search-item"
          @click="onTagClick(item.keyword)"
        >
            <div class="rank-num" :class="{'top-rank': index < 3}">
              <van-icon :name="'bar-chart-' + (index + 1)" v-if="index < 3" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="keyword">{{ item.keyword }}</div>
            <div class="hot-tag" v-if="item.tag">{{ item.tag }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Search',
  setup() {
    const router = useRouter()
    const keyword = ref('')
    const showHistory = ref(true)

    // 历史搜索
    const historyList = ref([
      '华为手机', 'iPhone 15', '小米手机', '耳机', '充电器'
    ])

    // 猜你想搜
    const suggestList = ref([
      '手机壳', '数据线', '平板电脑', '智能手表', '蓝牙耳机',
      '充电宝', '手机支架', '钢化膜'
    ])

    // 热门搜索
    const hotSearchList = ref([
      { keyword: 'iPhone 15 Pro', tag: '新品' },
      { keyword: '华为 Mate 60', tag: '热门' },
      { keyword: '小米 14', tag: '新品' },
      { keyword: 'OPPO Find X7' },
      { keyword: 'vivo X100' },
      { keyword: '三星 S24' },
      { keyword: 'AirPods Pro' },
      { keyword: '华为手表' },
      { keyword: '小米平板' },
      { keyword: 'iPad Pro' }
    ])

    const onSearch = () => {
      if (keyword.value.trim()) {
        // 执行搜索
        router.push({
          path: '/search-result',
          query: { keyword: keyword.value }
        })
      }
    }

    const onBack = () => {
      router.back()
    }

    const onFocus = () => {
      showHistory.value = true
    }

    const clearHistory = () => {
      historyList.value = []
    }

    const onTagClick = (tag) => {
      keyword.value = tag
      onSearch()
    }

    return {
      keyword,
      showHistory,
      historyList,
      suggestList,
      hotSearchList,
      onSearch,
      onBack,
      onFocus,
      clearHistory,
      onTagClick
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.search-page {
  min-height: 100vh;
  background-color: #f8f8f8;

  .search-header {
    background: linear-gradient(135deg, @primary-color, darken(@primary-color, 15%));
    padding: 8px 0;

    .search-bar {
    display: flex;
    align-items: center;
      padding: 0 12px;

      :deep(.van-search) {
        flex: 1;
        padding: 0;
        background: transparent;

        .van-search__content {
          height: 36px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

          .van-field__left-icon {
            color: @primary-color;
          }

          .van-field__right-icon {
            color: #999;
            font-size: 16px;
          }
          
          .van-field__control {
            height: 36px;
            font-size: 14px;
        }
      }
    }

      .cancel-btn {
      padding: 0 12px;
        font-size: 14px;
        color: white;
      }
    }
  }

  .search-content {
    padding: 12px;

  .search-section {
      background: white;
      border-radius: 16px;
    padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
        margin-bottom: 12px;
      
        .title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        position: relative;
          padding-left: 12px;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
            background: @primary-color;
            border-radius: 1.5px;
        }
      }

        .clear-icon {
          color: #999;
          font-size: 16px;
          padding: 4px;
        }
      }

      .search-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .tag {
          padding: 6px 12px;
          background: #f5f5f5;
          color: #666;
          font-size: 13px;
          border-radius: 15px;
        transition: all 0.2s ease;
        
        &:active {
            background: #eee;
            transform: scale(0.95);
          }
        }
      }
      
      .hot-search-list {
        .hot-search-item {
      display: flex;
          align-items: center;
          padding: 10px 0;

          .rank-num {
            width: 24px;
            height: 24px;
        display: flex;
        align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #999;
          margin-right: 12px;

            &.top-rank {
              color: @primary-color;
              font-size: 16px;
            }
          }

          .keyword {
            flex: 1;
            font-size: 14px;
            color: #333;
          }

          .hot-tag {
            font-size: 12px;
            color: @primary-color;
            background: rgba(@primary-color, 0.1);
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style> 