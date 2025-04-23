<template>
  <div class="address-edit">
    <van-nav-bar
      :title="isAdd ? '新增地址' : '编辑地址'"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      safe-area-inset-top
    />
    
    <div class="address-edit-content">
      <van-address-edit
        :area-list="areaList"
        :address-info="addressInfo"
        :show-delete="!isAdd"
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['选择省', '选择市', '选择区']"
        save-button-text="保存"
        delete-button-text="删除"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useAddressStore } from '@/stores'

// 提供更完整的省市区数据
const areaList = {
  province_list: {
    110000: '北京市',
    330000: '浙江省',
    440000: '广东省',
    320000: '江苏省',
    620000: '甘肃省',
  },
  city_list: {
    110100: '北京市',
    330100: '杭州市',
    330200: '宁波市',
    330300: '温州市',
    330400: '嘉兴市',
    330500: '湖州市',
    330600: '绍兴市',
    330700: '金华市',
    330800: '衢州市',
    330900: '舟山市',
    331000: '台州市',
    331100: '丽水市',
    440100: '广州市',
    440300: '深圳市',
    320100: '南京市',
    320200: '无锡市',
    320300: '徐州市',
    620100: '兰州市',
  },
  county_list: {
    110101: '东城区',
    110102: '西城区',
    110105: '朝阳区',
    110106: '丰台区',
    110107: '石景山区',
    110108: '海淀区',
    330102: '上城区',
    330103: '下城区',
    330104: '江干区',
    330105: '拱墅区',
    330106: '西湖区',
    330108: '滨江区',
    330109: '萧山区',
    330110: '余杭区',
    330111: '富阳区',
    330112: '临安区',
    330122: '桐庐县',
    330127: '淳安县',
    330182: '建德市',
    440103: '荔湾区',
    440104: '越秀区',
    440105: '海珠区',
    440106: '天河区',
    440111: '白云区',
    440304: '福田区',
    440305: '南山区',
    440306: '宝安区',
    440307: '龙岗区',
    320102: '玄武区',
    320104: '秦淮区',
    320105: '建邺区',
    320106: '鼓楼区',
    320111: '浦口区',
    620102: '城关区',
    620103: '七里河区',
    620104: '西固区',
  },
}

export default {
  name: 'AddressEdit',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const addressStore = useAddressStore()
    
    // 是否为新增地址
    const isAdd = computed(() => route.query.type === 'add')
    
    // 当前编辑的地址ID
    const currentId = computed(() => route.query.id)
    
    // 地址信息
    const addressInfo = ref({})
    
    // 搜索结果
    const searchResult = ref([])
    
    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }
    
    // 保存地址
    const onSave = (content) => {
      // 拼接完整地址
      const fullAddress = {
        ...content,
        // 额外处理地址显示内容
        address: `${content.province}${content.city}${content.county}${content.addressDetail}`
      }
      
      if (isAdd.value) {
        // 新增地址
        addressStore.addAddress(fullAddress).then(() => {
          Toast('添加成功')
          router.back()
        })
      } else {
        // 编辑地址
        addressStore.updateAddress({
          id: currentId.value,
          ...fullAddress
        }).then(() => {
          Toast('修改成功')
          router.back()
        })
      }
    }
    
    // 删除地址
    const onDelete = () => {
      Dialog.confirm({
        title: '提示',
        message: '确定要删除此地址吗？',
      }).then(() => {
        addressStore.deleteAddress(currentId.value).then(() => {
          Toast('删除成功')
          router.back()
        })
      }).catch(() => {
        // 取消删除
      })
    }
    
    // 搜索地址
    const onChangeDetail = (val) => {
      if (val) {
        searchResult.value = [
          {
            name: '文三路 138 号东方通信大厦',
            address: '浙江省杭州市西湖区'
          },
          {
            name: '莫干山路 50 号',
            address: '浙江省杭州市拱墅区'
          },
          {
            name: '天目山路 280 号',
            address: '浙江省杭州市西湖区'
          }
        ]
      } else {
        searchResult.value = []
      }
    }
    
    // 页面加载时获取地址信息
    onMounted(() => {
      if (!isAdd.value && currentId.value) {
        const address = addressStore.list.find(item => item.id === currentId.value)
        if (address) {
          // 查找城市的areaCode
          let cityCode = ''
          for (const [code, name] of Object.entries(areaList.city_list)) {
            if (name === address.city || address.city?.includes(name)) {
              cityCode = code
              break
            }
          }
          
          // 查找区县的areaCode
          let countyCode = ''
          for (const [code, name] of Object.entries(areaList.county_list)) {
            if (name === address.county || address.county?.includes(name)) {
              countyCode = code
              break
            }
          }
          
          // 如果没找到完整的区县码，使用城市的子码加1
          if (!countyCode && cityCode) {
            countyCode = cityCode.substring(0, 4) + '01'
          }
          
          // 如果没有areaCode，使用找到的区县码
          const areaCode = address.areaCode || countyCode || cityCode
          
          addressInfo.value = {
            id: address.id,
            name: address.name,
            tel: address.tel,
            province: address.province,
            city: address.city,
            county: address.county,
            addressDetail: address.addressDetail || '',
            areaCode: areaCode,
            isDefault: address.isDefault
          }
        }
      }
    })
    
    return {
      isAdd,
      areaList,
      addressInfo,
      searchResult,
      onClickLeft,
      onSave,
      onDelete,
      onChangeDetail
    }
  }
}
</script>

<style lang="less" scoped>
.address-edit {
  min-height: 100vh;
  background-color: #f7f8fa;
  
  .address-edit-content {
    padding-top: 46px;
  }
  
  :deep(.van-address-edit__buttons) {
    margin-bottom: 50px;
  }
  
  :deep(.van-button--danger) {
    background-color: #e53e3e;
  }
  
  :deep(.van-switch--on) {
    background-color: #e53e3e;
  }
}
</style> 