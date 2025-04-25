# 移动电商项目

这是一个基于Vue3 + Vant的移动电商项目。

## 技术栈

- 框架：Vue 3，Vue Router，Pinia
- UI组件库：Vant 3
- 打包工具：Webpack
- CSS预处理器：Less

## 项目运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run serve

# 构建生产版本
npm run build
```

## 目录结构

- `src/`：源代码目录
  - `assets/`：静态资源（图片、字体等）
  - `components/`：公共组件
  - `router/`：路由配置
  - `stores/`：Pinia 状态管理
  - `styles/`：样式文件
  - `utils/`：工具函数
  - `views/`：页面视图

## 主题与颜色管理

项目使用了统一的颜色管理系统，包括：

1. **CSS变量**：在 `src/styles/theme.less` 中定义了全局CSS变量，支持亮色和暗色模式
   ```css
   :root {
     --primary-color: #ff0000;
     --background-color: #f7f8fa;
     /* 其他变量... */
   }
   ```

2. **LESS变量**：在 `src/styles/variables.less` 中定义了LESS变量
   ```less
   @brand-color: #ff0000;
   @primary-color: @brand-color;
   /* 其他变量... */
   ```

3. **JavaScript常量**：在 `src/utils/colors.js` 中定义了JS常量
   ```js
   export const BRAND_COLOR = '#ff0000'
   export const COLORS = {
     PRIMARY: BRAND_COLOR,
     /* 其他颜色... */
   }
   ```

### 如何使用

- 在CSS中使用CSS变量：`color: var(--primary-color);`
- 在LESS中使用LESS变量：`color: @primary-color;`
- 在JavaScript中导入使用：
  ```js
  import { COLORS } from '@/utils/colors'
  
  element.style.color = COLORS.PRIMARY
  ```

## 主要功能

- 首页、分类、购物车、我的
- 商品列表、商品详情
- 购物车、结算
- 订单管理
- 个人中心

## API调用流程

### 1. 首页加载流程

当用户进入首页时，会进行以下API调用：

```javascript
// 1. 获取秒杀列表展示
await seckillStore.fetchSeckillProducts()
// API: /user/seckillGoods/findPage (GET)
// 功能: 获取首页展示的秒杀商品列表
// 参数: page=1, size=10 (可选)
// 返回: 秒杀商品列表数据

// 2. 获取推荐商品列表
await productStore.fetchRecommendProducts()
// API: /user/recommend/searchPage (GET)
// 功能: 获取首页推荐商品列表
// 参数: page=0, size=6 (可选)
// 返回: 推荐商品列表数据
```

### 2. 搜索功能流程

当用户使用搜索功能时，会进行以下API调用：

```javascript
// 1. 输入搜索词调用自动补充，提示词接口
const keyword = "搜索内容" // 用户输入的内容
const suggestions = await searchAPI.getSearchSuggestions(keyword)
// API: /user/goodsSearch/autoSuggest (GET)
// 功能: 根据用户输入的关键词提供搜索建议
// 参数: keyword - 用户输入的关键词
// 返回: 搜索建议列表

// 2. 点击搜索，调用搜索接口
const searchParams = {
  keyword: "搜索内容",  // 搜索关键词
  page: 1,             // 页码
  size: 10,            // 每页数量
  category: "",        // 分类过滤(可选)
  minPrice: "",        // 最低价格(可选)
  maxPrice: "",        // 最高价格(可选)
  sortBy: "default"    // 排序方式(可选): default,price-asc,price-desc,sales-desc
}
const searchResults = await searchAPI.searchProducts(searchParams)
// API: /user/goodsSearch/search (POST)
// 功能: 根据搜索条件查询商品
// 参数: 搜索参数对象
// 返回: 搜索结果列表数据
```

### 3. 查看商品详情流程

当用户点击商品查看详情时，会进行以下API调用：

```javascript
// 点击商品，调用查看商品详情接口
const productId = 12345 // 商品ID
const productDetail = await productAPI.getProductDetail(productId)
// API: /user/goodsSearch/findDesc (GET)
// 功能: 获取商品详细信息
// 参数: id - 商品ID
// 返回: 商品详情数据，包含标题、价格、图片、描述等信息
```

## 数据流向图

首页加载流程:
```
用户进入首页 -> seckillStore.fetchSeckillProducts() -> 获取秒杀商品列表 -> 更新UI
               -> productStore.fetchRecommendProducts() -> 获取推荐商品列表 -> 更新UI
```

搜索功能流程:
```
用户输入关键词 -> searchAPI.getSearchSuggestions() -> 显示搜索建议
用户点击搜索 -> searchAPI.searchProducts() -> 显示搜索结果
```

商品详情流程:
```
用户点击商品 -> productAPI.getProductDetail() -> 获取商品详情 -> 显示商品详情页
```

--轻量级服务器docker安装除es和kibana的容器
--ESC服务器部署各种服务和es+kibana
--web应用级服务器部署前端