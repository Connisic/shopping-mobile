import { defineStore } from 'pinia'
import { productAPI } from '@/services'

// 模拟商品分类数据
const mockCategories = [
  { id: 1, name: '女装', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 2, name: '男装', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 3, name: '手机数码', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 4, name: '家用电器', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 5, name: '美妆护肤', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 6, name: '箱包配饰', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 7, name: '运动户外', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' },
  { id: 8, name: '家居家纺', image: 'https://img01.yzcdn.cn/vant/cat.jpeg' }
]

// 模拟商品列表数据
const mockProducts = [
  {
    id: 1,
    title: '时尚休闲连衣裙夏季新款',
    price: 128.00,
    image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    sales: 368,
    description: '2023夏季新款时尚连衣裙'
  },
  {
    id: 2,
    title: '简约百搭男士T恤纯棉短袖',
    price: 69.90,
    image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    sales: 236,
    description: '舒适透气，简约时尚'
  },
  {
    id: 3,
    title: '多功能便携蓝牙音箱户外防水',
    price: 89.00,
    image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    sales: 127,
    description: '高品质音质，防水防尘'
  },
  {
    id: 4,
    title: '简约铝合金手机支架折叠式',
    price: 19.80,
    image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    sales: 432,
    description: '可调节角度，稳固支撑'
  }
]

// 模拟商品详情数据
const getMockProductDetail = (id) => {
  const product = mockProducts.find(p => p.id == id) || mockProducts[0]
  return {
    ...product,
    originPrice: product.price * 1.2,
    stock: 100,
    images: [product.image, product.image, product.image],
    specs: [
      {
        name: '颜色',
        values: ['黑色', '白色', '蓝色']
      },
      {
        name: '尺寸',
        values: ['S', 'M', 'L', 'XL']
      }
    ],
    skus: [
      {
        id: 1,
        price: product.price,
        stock: 100,
        specs: ['黑色', 'S']
      },
      {
        id: 2,
        price: product.price,
        stock: 100,
        specs: ['黑色', 'M']
      },
      // 其他SKU组合...
    ]
  }
}

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
        if (response && response.data && response.data.length > 0) {
          // 使用后端返回的数据
          this.setCategories(response.data)
          console.log('使用后端分类数据')
          return response.data
        } else {
          // 后端没有返回有效数据，使用假数据
          this.setCategories(mockCategories)
          console.log('使用假分类数据')
          return mockCategories
        }
      } catch (error) {
        console.error('获取分类失败：', error)
        // 请求失败，使用假数据
        this.setCategories(mockCategories)
        console.log('API错误，使用假分类数据')
        return mockCategories
      }
    },
    
    // 搜索商品
    async search(params) {
      try {
        const response = await productAPI.getProductList(params)
        if (response && response.data && response.data.goodsPage && response.data.goodsPage.records && response.data.goodsPage.records.length > 0) {
          // 使用后端返回的数据
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
          console.log('使用后端商品数据')
          
          return {
            items: products,
            total: goodsPage.total,
            page: goodsPage.current,
            pageSize: goodsPage.size
          }
        } else {
          // 后端没有返回有效数据，使用假数据
          this.setProducts(mockProducts)
          console.log('使用假商品数据')
          
          return {
            items: mockProducts,
            total: mockProducts.length,
            page: 1,
            pageSize: 10
          }
        }
      } catch (error) {
        console.error('搜索商品失败：', error)
        // 请求失败，使用假数据
        this.setProducts(mockProducts)
        console.log('API错误，使用假商品数据')
        
        return {
          items: mockProducts,
          total: mockProducts.length,
          page: 1,
          pageSize: 10
        }
      }
    },
    
    // 获取商品详情
    async fetchProductDetail(id) {
      try {
        const response = await productAPI.getProductDetail(id)
        if (response && response.data) {
          // 使用后端返回的数据
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
          console.log('使用后端商品详情数据')
          return product
        } else {
          // 后端没有返回有效数据，使用假数据
          const mockProduct = getMockProductDetail(id)
          this.setCurrentProduct(mockProduct)
          console.log('使用假商品详情数据')
          return mockProduct
        }
      } catch (error) {
        console.error('获取商品详情失败：', error)
        // 请求失败，使用假数据
        const mockProduct = getMockProductDetail(id)
        this.setCurrentProduct(mockProduct)
        console.log('API错误，使用假商品详情数据')
        return mockProduct
      }
    },
    
    // 获取推荐商品
    async fetchRecommendProducts() {
      try {
        const response = await productAPI.getRecommendProducts()
        if (response && response.data && response.data.records && response.data.records.length > 0) {
          // 使用后端返回的数据
          // 转换数据结构以适配前端组件
          const products = response.data.records.map(item => ({
            id: item.id,
            title: item.goodsName,
            price: item.price,
            image: item.headerPic,
            sales: item.sales
          }))
          
          this.setRecommendProducts(products)
          console.log('使用后端推荐商品数据')
          return products
        } else {
          // 后端没有返回有效数据，使用假数据
          this.setRecommendProducts(mockProducts)
          console.log('使用假推荐商品数据')
          return mockProducts
        }
      } catch (error) {
        console.error('获取推荐商品失败：', error)
        // 请求失败，使用假数据
        this.setRecommendProducts(mockProducts)
        console.log('API错误，使用假推荐商品数据')
        return mockProducts
      }
    }
  }
}) 