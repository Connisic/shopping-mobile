import request from '@/utils/request'
import { API_BASE_URL } from '@/constants'

/**
 * 热门搜索关键词
 * @param {Number} limit 获取数量限制
 * @returns {Promise} 热门搜索关键词列表
 */
export function getHotSearchKeywords(limit = 10) {
  return request({
    url: `${API_BASE_URL}/search/hot-keywords`,
    method: 'get',
    params: { limit }
  })
}

/**
 * 获取搜索历史
 * @returns {Promise} 搜索历史列表
 */
export function getSearchHistory() {
  return request({
    url: `${API_BASE_URL}/search/history`,
    method: 'get'
  })
}

/**
 * 清空搜索历史
 * @returns {Promise} 清空结果
 */
export function clearSearchHistory() {
  return request({
    url: `${API_BASE_URL}/search/history`,
    method: 'delete'
  })
}

/**
 * 删除指定搜索历史
 * @param {String} keyword 关键词
 * @returns {Promise} 删除结果
 */
export function deleteSearchHistoryItem(keyword) {
  return request({
    url: `${API_BASE_URL}/search/history/${encodeURIComponent(keyword)}`,
    method: 'delete'
  })
}

/**
 * 搜索商品
 * @param {Object} params 搜索参数
 * @param {String} params.keyword 搜索关键词
 * @param {Number} [params.categoryId] 分类ID
 * @param {Number} [params.page=1] 页码
 * @param {Number} [params.size=10] 每页数量
 * @param {String} [params.sort] 排序字段
 * @param {String} [params.order] 排序方式
 * @param {Number} [params.minPrice] 最低价格
 * @param {Number} [params.maxPrice] 最高价格
 * @returns {Promise} 搜索结果
 */
export function searchProducts(params) {
  return request({
    url: `${API_BASE_URL}/search/products`,
    method: 'get',
    params
  })
}

/**
 * 搜索推荐
 * @param {String} keyword 关键词前缀
 * @param {Number} [limit=10] 获取数量限制
 * @returns {Promise} 推荐关键词列表
 */
export function getSearchSuggestions(keyword, limit = 10) {
  return request({
    url: `${API_BASE_URL}/search/suggestions`,
    method: 'get',
    params: { 
      keyword,
      limit
    }
  })
}

/**
 * 获取搜索筛选条件
 * @param {String} keyword 搜索关键词
 * @returns {Promise} 筛选条件数据
 */
export function getSearchFilters(keyword) {
  return request({
    url: `${API_BASE_URL}/search/filters`,
    method: 'get',
    params: { keyword }
  })
}

export default {
  getHotSearchKeywords,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryItem,
  searchProducts,
  getSearchSuggestions,
  getSearchFilters
} 