import searchAPI from '@/services/search'

const state = {
  // 热门搜索关键词
  hotKeywords: [],
  // 搜索历史
  searchHistory: [],
  // 搜索建议
  suggestions: [],
  // 搜索结果
  searchResults: {
    list: [],
    total: 0,
    page: 1,
    size: 10,
    loading: false,
    finished: false
  },
  // 搜索筛选条件
  filters: {
    categories: [],
    price: {
      min: 0,
      max: 0
    },
    brands: [],
    tags: []
  },
  // 当前搜索参数
  searchParams: {
    keyword: '',
    categoryId: null,
    page: 1,
    size: 10,
    sort: '',
    order: '',
    minPrice: null,
    maxPrice: null
  }
}

const getters = {
  hotKeywords: state => state.hotKeywords,
  searchHistory: state => state.searchHistory,
  suggestions: state => state.suggestions,
  searchResults: state => state.searchResults,
  filters: state => state.filters,
  searchParams: state => state.searchParams,
  searchKeyword: state => state.searchParams.keyword
}

const mutations = {
  SET_HOT_KEYWORDS(state, keywords) {
    state.hotKeywords = keywords
  },
  SET_SEARCH_HISTORY(state, history) {
    state.searchHistory = history
  },
  ADD_SEARCH_HISTORY(state, keyword) {
    // 如果已存在，先删除
    const index = state.searchHistory.findIndex(item => item === keyword)
    if (index !== -1) {
      state.searchHistory.splice(index, 1)
    }
    // 添加到第一位
    state.searchHistory.unshift(keyword)
    // 最多保留20条历史记录
    if (state.searchHistory.length > 20) {
      state.searchHistory.pop()
    }
    // 保存到本地存储
    localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
  },
  REMOVE_SEARCH_HISTORY(state, keyword) {
    const index = state.searchHistory.findIndex(item => item === keyword)
    if (index !== -1) {
      state.searchHistory.splice(index, 1)
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
    }
  },
  CLEAR_SEARCH_HISTORY(state) {
    state.searchHistory = []
    localStorage.removeItem('searchHistory')
  },
  SET_SUGGESTIONS(state, suggestions) {
    state.suggestions = suggestions
  },
  SET_SEARCH_RESULTS(state, { list, total, page }) {
    state.searchResults.list = page === 1 ? list : [...state.searchResults.list, ...list]
    state.searchResults.total = total
    state.searchResults.page = page
    state.searchResults.finished = list.length < state.searchResults.size || page * state.searchResults.size >= total
  },
  SET_SEARCH_LOADING(state, loading) {
    state.searchResults.loading = loading
  },
  RESET_SEARCH_RESULTS(state) {
    state.searchResults.list = []
    state.searchResults.total = 0
    state.searchResults.page = 1
    state.searchResults.loading = false
    state.searchResults.finished = false
  },
  SET_FILTERS(state, filters) {
    state.filters = filters
  },
  SET_SEARCH_PARAMS(state, params) {
    state.searchParams = { ...state.searchParams, ...params }
  },
  RESET_SEARCH_PARAMS(state, keyword = '') {
    state.searchParams = {
      keyword,
      categoryId: null,
      page: 1,
      size: 10,
      sort: '',
      order: '',
      minPrice: null,
      maxPrice: null
    }
  }
}

const actions = {
  // 获取热门搜索关键词
  async getHotKeywords({ commit }, limit) {
    try {
      const response = await searchAPI.getHotSearchKeywords(limit)
      commit('SET_HOT_KEYWORDS', response.data)
      return response.data
    } catch (error) {
      console.error('获取热门搜索关键词失败', error)
      return []
    }
  },
  
  // 获取搜索历史
  async getSearchHistory({ commit }) {
    try {
      // 先从本地存储获取
      const localHistory = localStorage.getItem('searchHistory')
      if (localHistory) {
        const history = JSON.parse(localHistory)
        commit('SET_SEARCH_HISTORY', history)
        return history
      }
      
      // 如果没有本地存储，则从服务器获取
      const response = await searchAPI.getSearchHistory()
      commit('SET_SEARCH_HISTORY', response.data)
      return response.data
    } catch (error) {
      console.error('获取搜索历史失败', error)
      return []
    }
  },
  
  // 添加搜索历史
  addSearchHistory({ commit }, keyword) {
    if (!keyword) return
    commit('ADD_SEARCH_HISTORY', keyword.trim())
  },
  
  // 删除指定搜索历史
  async removeSearchHistory({ commit }, keyword) {
    try {
      commit('REMOVE_SEARCH_HISTORY', keyword)
      await searchAPI.deleteSearchHistoryItem(keyword)
    } catch (error) {
      console.error('删除搜索历史失败', error)
    }
  },
  
  // 清空搜索历史
  async clearSearchHistory({ commit }) {
    try {
      commit('CLEAR_SEARCH_HISTORY')
      await searchAPI.clearSearchHistory()
    } catch (error) {
      console.error('清空搜索历史失败', error)
    }
  },
  
  // 获取搜索建议
  async getSearchSuggestions({ commit }, { keyword, limit }) {
    if (!keyword) {
      commit('SET_SUGGESTIONS', [])
      return []
    }
    try {
      const response = await searchAPI.getSearchSuggestions(keyword, limit)
      commit('SET_SUGGESTIONS', response.data)
      return response.data
    } catch (error) {
      console.error('获取搜索建议失败', error)
      return []
    }
  },
  
  // 搜索商品
  async searchProducts({ commit, state }, params = {}) {
    try {
      // 合并搜索参数
      const searchParams = { ...state.searchParams, ...params }
      
      commit('SET_SEARCH_LOADING', true)
      commit('SET_SEARCH_PARAMS', searchParams)
      
      const response = await searchAPI.searchProducts(searchParams)
      
      commit('SET_SEARCH_RESULTS', {
        list: response.data.list || [],
        total: response.data.total || 0,
        page: searchParams.page
      })
      
      return response.data
    } catch (error) {
      console.error('搜索商品失败', error)
      commit('SET_SEARCH_RESULTS', { list: [], total: 0, page: 1 })
      return { list: [], total: 0 }
    } finally {
      commit('SET_SEARCH_LOADING', false)
    }
  },
  
  // 获取搜索筛选条件
  async getSearchFilters({ commit }, keyword) {
    try {
      const response = await searchAPI.getSearchFilters(keyword)
      commit('SET_FILTERS', response.data)
      return response.data
    } catch (error) {
      console.error('获取搜索筛选条件失败', error)
      return state.filters
    }
  },
  
  // 重置搜索结果
  resetSearchResults({ commit }) {
    commit('RESET_SEARCH_RESULTS')
  },
  
  // 重置搜索参数
  resetSearchParams({ commit }, keyword) {
    commit('RESET_SEARCH_PARAMS', keyword)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 