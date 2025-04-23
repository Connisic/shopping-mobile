<template>
  <div class="settings">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    
    <div class="settings-content">
      <!-- 账号与安全 -->
      <div class="settings-group">
        <div class="group-title">账号与安全</div>
        <van-cell-group inset>
          <van-cell title="个人信息" is-link @click="goToProfile" />
          <van-cell title="修改密码" is-link @click="goToChangePassword" />
          <van-cell title="隐私设置" is-link @click="goToPrivacy" />
        </van-cell-group>
      </div>
      
      <!-- 通用设置 -->
      <div class="settings-group">
        <div class="group-title">通用设置</div>
        <van-cell-group inset>
          <van-cell title="通知设置" is-link @click="goToNotification">
            <template #right-icon>
              <van-switch v-model="settings.notification" size="20" />
            </template>
          </van-cell>
          <van-cell title="深色模式">
            <template #right-icon>
              <van-switch v-model="settings.darkMode" size="20" />
            </template>
          </van-cell>
          <van-cell title="字体大小" is-link @click="showFontSizePopup = true">
            <template #value>
              <span>{{ fontSizeOptions[settings.fontSize] }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      
      <!-- 其他设置 -->
      <div class="settings-group">
        <div class="group-title">其他设置</div>
        <van-cell-group inset>
          <van-cell title="清除缓存" @click="clearCache" />
          <van-cell title="关于我们" is-link @click="goToAbout" />
          <van-cell title="帮助中心" is-link @click="goToHelp" />
        </van-cell-group>
      </div>
      
      <!-- 退出登录按钮 -->
      <div class="logout-button">
        <van-button type="danger" block @click="confirmLogout">退出登录</van-button>
      </div>
    </div>
    
    <!-- 字体大小选择弹窗 -->
    <van-popup v-model:show="showFontSizePopup" position="bottom" round>
      <div class="font-size-popup">
        <div class="popup-header">
          <div class="popup-title">选择字体大小</div>
          <van-icon name="cross" class="close-icon" @click="showFontSizePopup = false" />
        </div>
        <div class="popup-content">
          <van-radio-group v-model="settings.fontSize">
            <van-cell-group>
              <van-cell v-for="(option, index) in fontSizeOptions" :key="index" clickable @click="settings.fontSize = index">
                <template #title>
                  <span :style="{ fontSize: index === 2 ? '16px' : index === 1 ? '14px' : '18px' }">{{ option }}</span>
                </template>
                <template #right-icon>
                  <van-radio :name="index" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useUserStore } from '@/stores'
import { bus, isDarkMode } from '@/utils/eventBus'

export default {
  name: 'Settings',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 弹窗控制
    const showFontSizePopup = ref(false)
    
    // 设置选项
    const settings = reactive({
      notification: true,
      darkMode: isDarkMode.value,
      fontSize: 1, // 0: 小, 1: 中, 2: 大
    })
    
    // 监听深色模式切换
    watch(() => settings.darkMode, (newVal) => {
      if (newVal) {
        document.documentElement.setAttribute('data-theme', 'dark')
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
        document.querySelector('html').className = 'dark'
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
        document.querySelector('html').className = ''
        localStorage.setItem('theme', 'light')
      }
      
      // 发送主题变化事件
      bus.emit('theme-change', newVal ? 'dark' : 'light')
      isDarkMode.value = newVal
    })
    
    // 字体大小选项
    const fontSizeOptions = ['小', '中', '大']
    
    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }
    
    // 跳转到个人信息页面
    const goToProfile = () => {
      Toast('个人信息页面开发中')
    }
    
    // 跳转到修改密码页面
    const goToChangePassword = () => {
      Toast('修改密码页面开发中')
    }
    
    // 跳转到隐私设置页面
    const goToPrivacy = () => {
      Toast('隐私设置页面开发中')
    }
    
    // 跳转到通知设置页面
    const goToNotification = () => {
      Toast('通知设置页面开发中')
    }
    
    // 跳转到关于我们页面
    const goToAbout = () => {
      Toast('关于我们页面开发中')
    }
    
    // 跳转到帮助中心页面
    const goToHelp = () => {
      Toast('帮助中心页面开发中')
    }
    
    // 清除缓存
    const clearCache = () => {
      Dialog.confirm({
        title: '确认清除',
        message: '确定要清除应用缓存吗？',
      })
        .then(() => {
          // 执行清除缓存的逻辑
          Toast.success('缓存已清除')
        })
        .catch(() => {
          // 取消操作
        })
    }
    
    // 退出登录
    const confirmLogout = () => {
      Dialog.confirm({
        title: '退出登录',
        message: '确定要退出登录吗？',
      })
        .then(() => {
          // 执行退出登录的逻辑
          userStore.logout()
          Toast.success('已退出登录')
          router.push('/')
        })
        .catch(() => {
          // 取消操作
        })
    }
    
    return {
      showFontSizePopup,
      settings,
      fontSizeOptions,
      onClickLeft,
      goToProfile,
      goToChangePassword,
      goToPrivacy,
      goToNotification,
      goToAbout,
      goToHelp,
      clearCache,
      confirmLogout
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.settings {
  min-height: 100vh;
  background-color: var(--background-color);
  
  .settings-content {
    padding: 12px 0;
    padding-bottom: 70px; // 为悬浮按钮留出空间
    
    .settings-group {
      margin-bottom: 20px;
      
      .group-title {
        padding: 0 16px;
        margin-bottom: 8px;
        font-size: 14px;
        color: var(--text-color-secondary);
      }
    }
    
    .logout-button {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      padding-bottom: calc(16px + constant(safe-area-inset-bottom));
      padding-bottom: calc(16px + env(safe-area-inset-bottom));
      background-color: var(--card-background);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      z-index: 999;
    }
  }
  
  .font-size-popup {
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
      
      .popup-title {
        font-size: @font-size-lg;
        font-weight: 500;
      }
      
      .close-icon {
        font-size: 20px;
        color: var(--gray);
      }
    }
    
    .popup-content {
      padding: 10px 0;
      max-height: 60vh;
    }
  }
}
</style> 