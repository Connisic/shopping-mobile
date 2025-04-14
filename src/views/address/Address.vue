<template>
  <div class="address">
    <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="address-content">
      <van-address-list
        v-model="chosenAddressId"
        :list="formattedAddressList"
        :disabled-list="disabledList"
        :disabled-text="disabledText"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      />
    </div>
    
    <van-empty v-if="addressList.length === 0" description="暂无收货地址" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Address',
  setup() {
    const router = useRouter()
    const store = useStore()
    const chosenAddressId = ref('1')
    
    // 从store获取地址列表
    const addressList = computed(() => store.state.address.list)
    
    // 格式化后的地址列表，确保完全符合Vant要求
    const formattedAddressList = computed(() => {
      return addressList.value.map(item => ({
        id: item.id,
        name: item.name,
        tel: item.tel,
        address: `${item.province}${item.city}${item.county}${item.addressDetail}`,
        isDefault: item.isDefault ? true : false
      }))
    })
    
    const disabledList = ref([])
    const disabledText = '以下地址超出配送范围'
    
    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }
    
    // 添加地址
    const onAdd = () => {
      router.push({
        path: '/address/edit',
        query: { type: 'add' }
      })
    }
    
    // 编辑地址
    const onEdit = (item) => {
      router.push({
        path: '/address/edit',
        query: { 
          type: 'edit',
          id: item.id
        }
      })
    }
    
    // 选择地址
    const onSelect = (item) => {
      const fromCheckout = router.currentRoute.value.query.from === 'checkout'
      
      if (fromCheckout) {
        // 如果是从结算页面跳转来的，选择地址后返回
        store.commit('user/SET_DEFAULT_ADDRESS', item.id)
        router.back()
      }
    }
    
    return {
      chosenAddressId,
      addressList,
      formattedAddressList,
      disabledList,
      disabledText,
      onClickLeft,
      onAdd,
      onEdit,
      onSelect
    }
  }
}
</script>

<style lang="less" scoped>
.address {
  min-height: 100vh;
  background-color: #f7f8fa;
  
  .address-content {
    padding-top: 46px;
    padding-bottom: 50px;
  }
  
  :deep(.van-address-list) {
    padding-bottom: 80px;
  }
  
  :deep(.van-address-list__bottom) {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
  }
  
  :deep(.van-button--danger) {
    background-color: #e53e3e;
  }
  
  :deep(.van-radio__icon--checked .van-icon) {
    background-color: #e53e3e;
    border-color: #e53e3e;
  }
  
  .van-empty {
    padding-top: 120px;
  }
}
</style> 