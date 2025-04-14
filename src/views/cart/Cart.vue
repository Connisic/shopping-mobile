<template>
  <div class="cart">
    <!-- 头部导航栏 -->
    <div class="header">
      <div class="title">购物车</div>
      <div class="right-text" @click="toggleEdit">{{ isEdit ? '完成' : '管理' }}</div>
    </div>

    <!-- 购物车为空时显示 -->
    <div class="empty-cart" v-if="!cartList.length">
      <div class="empty-icon">
        <van-icon name="shopping-cart-o" size="60" color="#ddd" />
      </div>
      <div class="empty-text">购物车还是空的，快去选购吧</div>
      <van-button round type="danger" size="small" to="/" class="empty-button">去购物</van-button>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list" v-else>
      <!-- 店铺商品组 -->
      <div v-for="shop in cartList" :key="shop.id" class="shop-group">
        <!-- 店铺信息 -->
        <div class="shop-info">
          <div class="shop-checkbox">
            <van-checkbox @click="() => toggleShop(shop)" :checked="shop.checked" icon-size="24" checked-color="#e53e3e" />
          </div>
          <div class="shop-icon-name">
            <van-icon name="shop-o" size="20" class="shop-icon" />
            <span class="shop-name-text">{{ shop.name }}</span>
          </div>
          <div class="coupon" v-if="shop.coupon">
            <van-tag plain type="primary" size="medium" color="#666">{{ shop.coupon }}</van-tag>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="goods-list">
          <div v-for="item in shop.goods" :key="item.id" class="goods-item" @click="viewProduct(item)">
            <div class="item-checkbox">
              <van-checkbox @click.stop="() => toggleItem(shop, item)" :checked="item.checked" icon-size="24" checked-color="#e53e3e" />
            </div>
            <div class="goods-content">
              <van-image 
                :src="item.image" 
                :alt="item.title" 
                class="goods-image"
                radius="4"
                fit="cover"
                loading-icon="photo-o"
                error-icon="photo-fail-o"
              />
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="goods-attrs">
                  <span class="goods-attr">颜色：{{ getItemColor(item) }}</span>
                  <span class="goods-attr" v-if="getItemSize(item)">尺寸：{{ getItemSize(item) }}</span>
                </div>
                <div class="goods-bottom">
                  <div class="price">¥{{ formatPrice(item.price) }}</div>
                  <div class="quantity-control" @click.stop>
                    <div class="quantity-btn minus" @click="decreaseQuantity(shop, item)">-</div>
                    <div class="quantity-input">{{ item.quantity }}</div>
                    <div class="quantity-btn plus" @click="increaseQuantity(shop, item)">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <div class="recommend" v-if="cartList.length">
      <div class="title">猜你喜欢</div>
      <!-- 推荐商品列表 -->
      <div class="recommend-list">
        <div class="recommend-item" v-for="(item, index) in recommendList" :key="index" @click="viewProduct(item)">
          <van-image :src="item.image" fit="cover" class="recommend-item-image" radius="4" />
          <div class="recommend-item-title">{{ item.title }}</div>
          <div class="recommend-item-price">¥{{ formatPrice(item.price) }}</div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="cart-submit-bar" v-if="cartList.length">
      <div class="select-all">
        <van-checkbox @click="toggleAll" :checked="isAllSelected" icon-size="24" checked-color="#e53e3e" />
        <span class="select-all-text">全选</span>
      </div>
      <div class="price-info" v-if="!isEdit">
        <div class="total">合计：<span class="price-text">¥{{ formatPrice(totalPrice) }}</span></div>
        <div class="discount-text" v-if="hasDiscount">已优惠¥{{ formatPrice(discount) }}</div>
      </div>
      <div class="submit-button" @click="isEdit ? deleteSelected() : onSubmit()" :class="{ 'disabled': selectedCount === 0 }">
        {{ isEdit ? '删除' : `去结算(${selectedCount})` }}
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTabbar" fixed route>
      <van-tabbar-item icon="wap-home-o" to="/">
        <span class="tabbar-text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/messages">
        <span class="tabbar-text">消息</span>
      </van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/cart">
        <span class="tabbar-text">购物车</span>
      </van-tabbar-item>
      <van-tabbar-item icon="contact" to="/profile">
        <span class="tabbar-text">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'

export default {
  name: 'Cart',
  setup() {
    const router = useRouter()
    const activeTabbar = ref(2)
    const isEdit = ref(false)
    const loading = ref(false)

    // 购物车数据
    const cartList = ref([
      {
        id: 1,
        name: '数码电器旗舰店',
        checked: false,
        coupon: '店铺优惠券可用',
        goods: [
          {
            id: 1,
            title: '蓝牙耳机无线双耳适用苹果华为小米运动跑步',
            image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
            sku: '颜色：纯净白',
            price: 89.00,
            quantity: 1,
            checked: false
          },
          {
            id: 2,
            title: '超薄小米华为笔记本电脑包内胆包保护套13.3英寸',
            image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
            sku: '颜色：深空灰 | 尺寸：13.3英寸',
            price: 29.90,
            quantity: 1,
            checked: false
          }
        ]
      },
      {
        id: 2,
        name: '潮流服饰专营店',
        checked: false,
        coupon: '免运费',
        goods: [
          {
            id: 3,
            title: '夏季薄款男士休闲裤冰丝速干裤子直筒宽松运动长裤',
            image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
            sku: '颜色：黑色 | 尺码：L',
            price: 49.90,
            quantity: 2,
            checked: false
          }
        ]
      }
    ])

    // 推荐商品列表
    const recommendList = ref([
      {
        id: 101,
        title: '时尚休闲连衣裙夏季新款',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 128.00
      },
      {
        id: 102,
        title: '简约百搭男士T恤纯棉短袖',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 69.90
      },
      {
        id: 103,
        title: '简约铝合金手机支架折叠式',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 19.80
      },
      {
        id: 104,
        title: '多功能便携蓝牙音箱户外防水',
        image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        price: 89.00
      }
    ])

    // 计算属性
    const isAllSelected = computed(() => {
      if (cartList.value.length === 0) return false
      return cartList.value.every(shop => shop.checked) &&
        cartList.value.every(shop => shop.goods.every(item => item.checked))
    })

    const totalPrice = computed(() => {
      return cartList.value.reduce((total, shop) => {
        return total + shop.goods.reduce((shopTotal, item) => {
          return shopTotal + (item.checked ? item.price * item.quantity : 0)
        }, 0)
      }, 0)
    })

    const totalCount = computed(() => {
      return cartList.value.reduce((total, shop) => {
        return total + shop.goods.reduce((count, item) => count + item.quantity, 0)
      }, 0)
    })

    const selectedCount = computed(() => {
      return cartList.value.reduce((total, shop) => {
        return total + shop.goods.reduce((count, item) => {
          return count + (item.checked ? item.quantity : 0)
        }, 0)
      }, 0)
    })

    const discount = computed(() => {
      return 30 // 示例优惠金额
    })

    const hasDiscount = computed(() => {
      return discount.value > 0
    })

    // 格式化价格，避免JS浮点数计算问题
    const formatPrice = (price) => {
      if (price === undefined || price === null) return '0.00'
      return parseFloat(price).toFixed(2)
    }

    // 方法
    const savedSelection = ref(null)

    const toggleEdit = () => {
      if (isEdit.value) {
        // 从编辑模式退出，恢复之前保存的选中状态
        if (savedSelection.value) {
          cartList.value.forEach((shop, shopIndex) => {
            const savedShop = savedSelection.value[shopIndex]
            if (savedShop) {
              shop.checked = savedShop.checked
              shop.goods.forEach((item, itemIndex) => {
                if (savedShop.goods[itemIndex]) {
                  item.checked = savedShop.goods[itemIndex].checked
                }
              })
            }
          })
        }
      } else {
        // 进入编辑模式，保存当前选中状态
        savedSelection.value = JSON.parse(JSON.stringify(cartList.value.map(shop => ({
          checked: shop.checked,
          goods: shop.goods.map(item => ({ checked: item.checked }))
        }))))
        
        // 清除所有选中状态
        cartList.value.forEach(shop => {
          shop.checked = false
          shop.goods.forEach(item => {
            item.checked = false
          })
        })
      }
      
      isEdit.value = !isEdit.value
    }

    const toggleAll = () => {
      // 使用nextTick避免递归更新
      nextTick(() => {
        const newValue = !isAllSelected.value
        cartList.value.forEach(shop => {
          shop.checked = newValue
          shop.goods.forEach(item => {
            item.checked = newValue
          })
        })
      })
    }

    const toggleShop = (shop) => {
      // 使用nextTick避免递归更新
      nextTick(() => {
        const newStatus = !shop.checked
        shop.checked = newStatus
        shop.goods.forEach(good => {
          good.checked = newStatus
        })
      })
    }

    const toggleItem = (shop, item) => {
      // 先切换商品的选中状态
      nextTick(() => {
        item.checked = !item.checked
        
        // 然后更新店铺的选中状态
        const allChecked = shop.goods.every(good => good.checked)
        shop.checked = allChecked
      })
    }

    const updateQuantity = (shop, item) => {
      try {
        // 确保数量为整数
        item.quantity = parseInt(item.quantity)
        if (isNaN(item.quantity) || item.quantity < 1) {
          item.quantity = 1
        }
        // 更新商品数量
        console.log(`商品 ${item.title} 数量更新为：${item.quantity}`)
        // 这里可以添加更新购物车的API调用
      } catch (error) {
        console.error('更新数量时出错:', error)
        Toast('数量更新失败，请重试')
      }
    }

    // 处理数量超限
    const onOverLimit = () => {
      Toast('商品数量已达到限制')
    }

    // 删除单个商品
    const deleteItem = (shop, item) => {
      Dialog.confirm({
        title: '确认删除',
        message: '确定要删除这个商品吗？',
      }).then(() => {
        shop.goods = shop.goods.filter(good => good.id !== item.id)
        // 如果店铺没有商品了，移除店铺
        if (shop.goods.length === 0) {
          cartList.value = cartList.value.filter(s => s.id !== shop.id)
        }
        Toast('商品已删除')
      }).catch(() => {
        // 用户取消
      })
    }

    const onSubmit = () => {
      if (selectedCount.value === 0) {
        Toast('请选择要结算的商品')
        return
      }
      
      // 筛选出已选中的商品
      const selectedItems = []
      cartList.value.forEach(shop => {
        shop.goods.forEach(item => {
          if (item.checked) {
            selectedItems.push({
              ...item,
              shopId: shop.id,
              shopName: shop.name
            })
          }
        })
      })
      
      // 存储选中的商品到localStorage
      try {
        localStorage.setItem('checkoutItems', JSON.stringify(selectedItems))
      } catch (error) {
        console.error('保存结算商品时出错:', error)
      }
      
      router.push('/checkout')
    }

    const deleteSelected = () => {
      if (selectedCount.value === 0) {
        Toast('请选择要删除的商品')
        return
      }
      
      Dialog.confirm({
        title: '确认删除',
        message: '确定要删除选中的商品吗？',
      }).then(() => {
        cartList.value = cartList.value.map(shop => {
          shop.goods = shop.goods.filter(item => !item.checked)
          return shop
        }).filter(shop => shop.goods.length > 0)
        Toast('已删除选中商品')
      }).catch(() => {
        // 用户取消
      })
    }

    // 查看商品详情
    const viewProduct = (product) => {
      if (!product || !product.id) {
        console.error('无效的商品信息', product);
        return;
      }
      
      // 阻止编辑模式下的商品点击
      if (isEdit.value) {
        return;
      }
      
      // 跳转到商品详情页
      router.push(`/product/${product.id}`);
    }

    // 获取购物车数据
    const fetchCartData = () => {
      loading.value = true
      // 模拟API请求，实际开发中请替换为真实的API调用
      setTimeout(() => {
        // 实际项目中这里会从API获取数据
        loading.value = false
      }, 500)
    }

    // 商品数量减少
    const decreaseQuantity = (shop, item) => {
      if (item.quantity > 1) {
        item.quantity--;
        updateQuantity(shop, item);
      }
    }
    
    // 商品数量增加
    const increaseQuantity = (shop, item) => {
      if (item.quantity < 99) {
        item.quantity++;
        updateQuantity(shop, item);
      } else {
        onOverLimit();
      }
    }

    // 解析SKU为属性
    const parseSkuToProps = (sku) => {
      if (!sku) return {};
      const result = {};
      try {
        const parts = sku.split('|').map(part => part.trim());
        parts.forEach(part => {
          if (part.includes('：')) {
            const [key, value] = part.split('：');
            if (key.includes('颜色')) {
              result.color = value;
            } else if (key.includes('尺寸') || key.includes('尺码')) {
              result.size = value;
            }
          }
        });
      } catch (error) {
        console.error('解析SKU出错:', error);
      }
      return result;
    }

    // 构建商品属性的计算属性
    const getItemColor = (item) => {
      if (item.color) return item.color;
      
      const sku = item.sku;
      if (sku) {
        const color = sku.match(/颜色：([^|]+)/);
        return color ? color[1] : '默认';
      }
      return '默认';
    }

    const getItemSize = (item) => {
      if (item.size) return item.size;
      
      const sku = item.sku;
      if (sku) {
        const size = sku.match(/尺寸：([^|]+)/) || sku.match(/尺码：([^|]+)/);
        return size ? size[1] : null;
      }
      return null;
    }

    // 处理商品数据
    const processProductData = () => {
      cartList.value.forEach(shop => {
        shop.goods.forEach(item => {
          if (item.sku) {
            const props = parseSkuToProps(item.sku);
            if (!item.color && props.color) item.color = props.color;
            if (!item.size && props.size) item.size = props.size;
          }
        });
      });
    }

    onMounted(() => {
      fetchCartData()
      processProductData()
    })

    return {
      activeTabbar,
      isEdit,
      loading,
      cartList,
      recommendList,
      isAllSelected,
      totalPrice,
      totalCount,
      selectedCount,
      discount,
      hasDiscount,
      formatPrice,
      toggleEdit,
      toggleAll,
      toggleShop,
      toggleItem,
      updateQuantity,
      onOverLimit,
      deleteItem,
      onSubmit,
      deleteSelected,
      viewProduct,
      decreaseQuantity,
      increaseQuantity,
      parseSkuToProps,
      getItemColor,
      getItemSize,
      processProductData,
      savedSelection
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.cart {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 100px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: @primary-color;
    color: white;
    position: sticky;
    top: 0;
    z-index: 1000;
    
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    
    .right-text {
      font-size: 14px;
    }
  }

  .empty-cart {
    padding-top: 80px;
    text-align: center;

    .empty-icon {
      margin-bottom: 20px;
    }

    .empty-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }

    .empty-button {
      width: 120px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: @primary-color;
      color: white;
      border-radius: 18px;
      font-size: 14px;
    }
  }

  .cart-list {
    .shop-group {
      margin-top: 8px;
      background-color: #fff;

      .shop-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px solid #f5f5f5;

        .shop-checkbox {
          margin-right: 10px;
          
          :deep(.van-checkbox) {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        .shop-icon-name {
          display: flex;
          align-items: center;
          font-size: 14px;
          flex: 1;
          
          .shop-icon {
            margin-right: 8px;
          }
          
          .shop-name-text {
            font-weight: 500;
          }
        }
        
        .coupon {
          font-size: 12px;
        }
      }

      .goods-list {
        .goods-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          position: relative;
          
          &:active {
            background-color: #f9f9f9;
          }
          
          &::after {
            content: '';
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: 0;
            height: 1px;
            background-color: #f5f5f5;
          }
          
          &:last-child::after {
            display: none;
          }

          .item-checkbox {
            margin-right: 10px;
            
            :deep(.van-checkbox) {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .goods-content {
            flex: 1;
            display: flex;
            margin-left: 8px;

            .goods-image {
              width: 80px;
              height: 80px;
              margin-right: 10px;
              flex-shrink: 0;
              cursor: pointer;
            }

            .goods-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-width: 0;
              cursor: pointer;

              .goods-title {
                font-size: 14px;
                color: #000;
                margin-bottom: 4px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                
                &:active {
                  color: @primary-color;
                }
              }

              .goods-attrs {
                margin-top: 6px;
                font-size: 12px;
                color: #999;
                .goods-attr {
                  margin-right: 10px;
                }
              }

              .goods-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .price {
                  font-size: 16px;
                  color: @primary-color;
                  font-weight: bold;
                }
                
                .quantity-control {
                  display: flex;
                  align-items: center;

                  .quantity-btn {
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    background-color: #f5f5f5;
                    border: 1px solid #ddd;
                    cursor: pointer;
                  }
                  
                  .quantity-input {
                    width: 36px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    border: 1px solid #ddd;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .recommend {
    margin-top: 10px;
    padding: 12px;
    background-color: #fff;

    .title {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
    }

    .recommend-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      
      .recommend-item {
        .recommend-item-image {
          width: 100%;
          height: 140px;
          margin-bottom: 6px;
        }
        
        .recommend-item-title {
          font-size: 13px;
          color: #333;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .recommend-item-price {
          font-size: 14px;
          color: @primary-color;
          font-weight: bold;
        }
      }
    }
  }

  .cart-submit-bar {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 50px;
    background-color: #fff;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
    
    .select-all {
      margin-right: 12px;
      display: flex;
      align-items: center;
      
      :deep(.van-checkbox__icon) {
        border-color: #999;
      }
      
      .select-all-text {
        margin-left: 8px;
        font-size: 14px;
      }
    }
    
    .price-info {
      flex: 1;
      
      .total {
        font-size: 14px;
        color: #333;
        
        .price-text {
          color: @primary-color;
          font-size: 16px;
          font-weight: bold;
        }
      }
      
      .discount-text {
        font-size: 12px;
        color: @primary-color;
      }
    }
    
    .submit-button {
      width: 120px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: @primary-color;
      color: white;
      border-radius: 18px;
      font-size: 14px;
      
      &.disabled {
        background-color: #ccc;
      }
    }
  }
  
  .tabbar-text {
    font-size: 12px;
    transform: scale(0.9);
    display: block;
    margin-top: 2px;
  }
  
  :deep(.van-tabbar-item--active) {
    color: @primary-color;
  }
}
</style> 