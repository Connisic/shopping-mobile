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
