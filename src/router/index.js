import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { isTokenExpired } from '@/utils/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home.vue')
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/messages/Messages.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/message-detail',
    name: 'MessageDetail',
    component: () => import('../views/messages/MessageDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search/Search.vue')
  },
  {
    path: '/search-results',
    name: 'SearchResults',
    component: () => import('../views/search/SearchResult.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/product/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/cart/Cart.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/profile/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/order/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/order/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: () => import('../views/order/OrderSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/address/Address.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/address/edit',
    name: 'AddressEdit',
    component: () => import('../views/address/AddressEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('../views/order/OrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/seckill',
    name: 'Seckill',
    component: () => import('../views/seckill/Seckill.vue')
  },
  {
    path: '/seckill/:id',
    name: 'SeckillDetail',
    component: () => import('../views/seckill/SeckillDetail.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/user/Register.vue')
  },
  {
    path: '/product/review',
    name: 'Review',
    component: () => import('@/views/product/Review.vue'),
    meta: {
      title: '商品评价'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 检查该路由是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 使用Pinia获取用户状态
    const userStore = useUserStore()
    
    // 先检查token是否存在且有效
    if (!userStore.token || isTokenExpired()) {
      // token不存在或已过期，清除用户状态并重定向到登录页
      userStore.clearUser()
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // token有效，继续导航
      next()
    }
  } else {
    // 不需要登录，继续导航
    next()
  }
})

export default router 