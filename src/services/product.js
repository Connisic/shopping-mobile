import request from './request'

/**
 * 获取商品分类列表
 * @returns {Promise} 分类列表数据
 */
export function getCategories() {
  return request({
    url: '/user/category/list',
    method: 'get'
  })
}

/**
 * 获取商品列表
 * @param {Object} params 查询参数
 * @param {Number} [params.page=1] 页码
 * @param {Number} [params.size=10] 每页数量
 * @param {String} [params.keyword] 搜索关键词
 * @param {Number} [params.categoryId] 分类ID
 * @param {Number} [params.lowPrice] 最低价格
 * @param {Number} [params.highPrice] 最高价格
 * @param {String} [params.sort] 排序字段
 * @param {String} [params.order] 排序方式（asc/desc）
 * @returns {Promise} 商品列表数据
 */
export function getProductList(params) {
  return request({
    url: '/user/goodsSearch/search',
    method: 'post',
    data: params
  })
}

/**
 * 获取商品详情
 * @param {Number|String} id 商品ID
 * @returns {Promise} 商品详情数据
 */
export function getProductDetail(id) {
  return request({
    url: `/user/goodsSearch/findDesc`,
    method: 'get',
    params: { id }
  })
}

/**
 * 获取推荐商品列表
 * @param {Number} [page=0] 页码
 * @param {Number} [size=6] 获取数量
 * @returns {Promise} 推荐商品列表数据
 */
export function getRecommendProducts(page = 0, size = 6) {
  return request({
    url: '/user/recommend/searchPage',
    method: 'get',
    params: { page, size }
  })
}

/**
 * 获取热门商品列表
 * @param {Number} [count=6] 获取数量
 * @returns {Promise} 热门商品列表数据
 */
export function getHotProducts(count = 6) {
  return request({
    url: '/user/goods/hot',
    method: 'get',
    params: { count }
  })
}

/**
 * 获取相似商品列表
 * @param {Number|String} id 商品ID
 * @param {Number} [count=6] 获取数量
 * @returns {Promise} 相似商品列表数据
 */
export function getSimilarProducts(id, count = 6) {
  return request({
    url: `/user/goods/similar/${id}`,
    method: 'get',
    params: { count }
  })
}

/**
 * 获取商品评价列表
 * @param {Number|String} id 商品ID
 * @param {Object} params 查询参数
 * @param {Number} [params.page=1] 页码
 * @param {Number} [params.size=10] 每页数量
 * @param {Number} [params.type] 评价类型（0-全部，1-好评，2-中评，3-差评）
 * @returns {Promise} 商品评价列表数据
 */
export function getProductReviews(id, params) {
  return request({
    url: `/user/recommend/getComment`,
    method: 'get',
    params
  })
}

// 发表商品评价
export function addProductReview(goodsId, comment, score) {
  return request({
    url: '/user/recommend/addComment',
    method: 'post',
    params: {
      goodsId,
      comment,
      score
    }
  })
}

// 搜索关键词自动补全
export function getAutoSuggest(keyword) {
  return request({
    url: '/user/goodsSearch/autoSuggest',
    method: 'get',
    params: { keyword }
  })
}

// 获取商品分类树
export function getProductTypes(parentId) {
  return request({
    url: '/productType/findByParentId',
    method: 'get',
    params: { parentId }
  })
} 