import { defineStore } from 'pinia'
import { productAPI } from '@/services'

// 根据商品规格生成SKUs
function generateSkus(product) {
  if (!product.specifications || product.specifications.length === 0) {
    return [{
      id: 0,
      price: product.price,
      stock: 100,
      specs: []
    }]
  }
  
  // 提取所有规格选项
  const specs = product.specifications.map(spec => 
    spec.specificationOptions.map(opt => opt.optionName)
  )
  
  // 生成规格组合
  const combinations = generateCombinations(specs)
  
  // 为每个组合创建一个SKU
  return combinations.map((combo, index) => ({
    id: index + 1,
    price: product.price,
    stock: 100,
    specs: combo
  }))
}

// 生成所有可能的规格组合
function generateCombinations(arrays) {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return arrays[0].map(item => [item])
  
  const result = []
  const restCombinations = generateCombinations(arrays.slice(1))
  
  for (const item of arrays[0]) {
    for (const combo of restCombinations) {
      result.push([item, ...combo])
    }
  }
  
  return result
}

export const useProductStore = defineStore('product', {
  state: () => ({
    categories: [],
    products: [],
    currentProduct: null,
    recommendProducts: []
  }),
  
  actions: {
    // 设置分类列表
    setCategories(categories) {
      this.categories = categories
    },
    
    // 设置商品列表
    setProducts(products) {
      this.products = products
    },
    
    // 设置当前商品
    setCurrentProduct(product) {
      this.currentProduct = product
    },
    
    // 设置推荐商品
    setRecommendProducts(products) {
      this.recommendProducts = products
    },
    
    // 获取分类列表
    async fetchCategories() {
      try {
        const response = await productAPI.getCategories()
        this.setCategories(response.data)
        return response.data
      } catch (error) {
        console.error('获取分类失败：', error)
        return []
      }
    },
    
    // 搜索商品
    async search(params) {
      try {
        const response = await productAPI.getProductList(params)
        const goodsPage = response.data.goodsPage
        
        // 转换数据结构以适配前端组件
        const products = goodsPage.records.map(item => ({
          id: item.id,
          title: item.goodsName,
          price: item.price,
          image: item.headerPic,
          sales: item.sales,
          description: item.introduction
        }))
        
        this.setProducts(products)
        
        return {
          items: products,
          total: goodsPage.total,
          page: goodsPage.current,
          pageSize: goodsPage.size
        }
      } catch (error) {
        console.error('搜索商品失败：', error)
        return {
          items: [],
          total: 0,
          page: 1,
          pageSize: 10
        }
      }
    },
    
    // 获取商品详情
    async fetchProductDetail(id) {
      try {
        const response = await productAPI.getProductDetail(id)
        const productData = response.data
        
        // 转换数据结构以适配前端组件
        const product = {
          id: productData.id,
          title: productData.goodsName,
          price: productData.price,
          originPrice: productData.price * 1.2, // 假设原价高20%
          sales: productData.sales || 0,
          stock: 100, // 假设库存为100
          images: productData.images ? productData.images.map(img => img.imageUrl) : [productData.headerPic],
          description: productData.introduction,
          // 处理规格
          specs: productData.specifications ? productData.specifications.map(spec => ({
            name: spec.specName,
            values: spec.specificationOptions.map(opt => opt.optionName)
          })) : [],
          // 生成SKUs
          skus: generateSkus(productData)
        }
        
        this.setCurrentProduct(product)
        return product
      } catch (error) {
        console.error('获取商品详情失败：', error)
        return null
      }
    },
    
    // 获取推荐商品
    async fetchRecommendProducts() {
      try {
        const response = await productAPI.getRecommendProducts()
        
        // 转换数据结构以适配前端组件
        const products = response.data.records.map(item => ({
          id: item.id,
          title: item.goodsName,
          price: item.price,
          image: item.headerPic,
          sales: item.sales
        }))
        
        this.setRecommendProducts(products)
        return products
      } catch (error) {
        console.error('获取推荐商品失败：', error)
        return []
      }
    }
  }
}) 