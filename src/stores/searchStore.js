import { defineStore } from 'pinia'
import { productAPI } from '@/services'

export const useSearchStore = defineStore('search', {
  state: () => ({
    // 搜索历史
    history: JSON.parse(localStorage.getItem('search_history') || '[]'),
    // 热门搜索词
    hotKeywords: [
      '手机',
      '电脑',
      '平板',
      '耳机',
      '智能手表',
      '数码相机',
      '游戏机',
      '小家电'
    ],
    // 搜索建议
    suggestions: [],
    // 搜索结果
    searchResults: [],
    // 分页信息
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0
    },
    // 搜索过滤条件
    filters: {
      category: '',
      priceRange: '',
      sortBy: 'default' // default, price-asc, price-desc, sales-desc
    },
    // 搜索关键词
    searchKeyword: '',
    // 加载状态
    loading: false,
    // 是否没有更多数据
    finished: false
  }),
  
  actions: {
    // 添加搜索历史
    addSearchHistory(keyword) {
      if (!keyword) return
      
      // 移除旧的相同关键词
      const index = this.history.indexOf(keyword)
      if (index !== -1) {
        this.history.splice(index, 1)
      }
      
      // 添加到历史列表头部
      this.history.unshift(keyword)
      
      // 保持历史记录不超过10个
      if (this.history.length > 10) {
        this.history.pop()
      }
      
      // 保存到localStorage
      localStorage.setItem('search_history', JSON.stringify(this.history))
    },
    
    // 清空搜索历史
    clearSearchHistory() {
      this.history = []
      localStorage.removeItem('search_history')
    },
    
    // 设置搜索建议
    setSuggestions(suggestions) {
      this.suggestions = suggestions
    },
    
    // 获取搜索建议
    getSearchSuggestions(keyword) {
      // 从热门搜索词中过滤
      if (!keyword) {
        this.suggestions = []
        return
      }
      
      this.suggestions = this.hotKeywords
        .filter(item => item.toLowerCase().includes(keyword.toLowerCase()))
        .slice(0, 8)
      
      return this.suggestions
    },
    
    // 设置搜索结果
    setSearchResults(results) {
      this.searchResults = results
    },
    
    // 设置分页信息
    setPagination(pagination) {
      this.pagination = pagination
    },
    
    // 设置过滤条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    
    // 重置搜索参数
    resetSearchParams(keyword) {
      this.searchKeyword = keyword || '';
      this.searchResults = [];
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      };
      this.resetFilters();
      this.setLoading(false);
      this.setFinished(false);
    },
    
    // 重置过滤条件
    resetFilters() {
      this.filters = {
        category: '',
        priceRange: '',
        sortBy: 'default'
      }
    },
    
    // 设置加载状态
    setLoading(loading) {
      this.loading = loading
    },
    
    // 设置是否加载完成
    setFinished(finished) {
      this.finished = finished
    },
    
    // 搜索商品
    async search(keyword, page = 1, pageSize = 10) {
      try {
        this.setLoading(true)
        
        // 添加到搜索历史
        if (keyword) {
          this.addSearchHistory(keyword)
        }
        
        // 构造搜索参数
        const params = {
          keyword,
          page,
          pageSize,
          category: this.filters.category,
          minPrice: this.filters.priceRange ? this.filters.priceRange.split('-')[0] : '',
          maxPrice: this.filters.priceRange ? this.filters.priceRange.split('-')[1] : '',
          sortBy: this.filters.sortBy
        }
        
        const response = await productAPI.searchProducts(params)
        const { items, total } = response.data
        
        // 更新数据
        if (page === 1) {
          this.setSearchResults(items)
        } else {
          this.searchResults = [...this.searchResults, ...items]
        }
        
        // 更新分页
        this.setPagination({
          currentPage: page,
          pageSize,
          total
        })
        
        // 判断是否已加载完全部数据
        this.setFinished(page * pageSize >= total)
        
        return {
          items,
          total
        }
      } catch (error) {
        console.error('搜索商品失败：', error)
        return {
          items: [],
          total: 0
        }
      } finally {
        this.setLoading(false)
      }
    },
    
    // 加载更多搜索结果
    async loadMore(keyword) {
      if (this.loading || this.finished) return
      
      const nextPage = this.pagination.currentPage + 1
      return await this.search(keyword, nextPage, this.pagination.pageSize)
    }
  }
}) 