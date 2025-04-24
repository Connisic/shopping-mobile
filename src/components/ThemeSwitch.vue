<template>
  <div class="theme-switch">
    <div class="switch-wrapper" @click="toggleTheme">
      <div class="icon-wrapper">
        <van-icon name="sunny-o" class="light-icon" v-if="isDarkMode" />
        <van-icon name="moon-o" class="dark-icon" v-else />
      </div>
      <span class="switch-text">{{ isDarkMode ? '切换到亮色模式' : '切换到深色模式' }}</span>
      <van-switch
        v-model="isDarkMode"
        size="24px"
        class="theme-toggle"
        @click.stop
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { toggleTheme, getCurrentTheme, THEME_TYPES } from '@/utils/theme';

export default {
  name: 'ThemeSwitch',
  setup() {
    const isDarkMode = ref(false);
    
    // 初始化时检查当前主题
    onMounted(() => {
      const currentTheme = getCurrentTheme();
      isDarkMode.value = currentTheme === THEME_TYPES.DARK;
      
      // 监听主题变化事件
      window.addEventListener('theme-change', handleThemeChange);
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('theme-change', handleThemeChange);
    });
    
    // 主题变化事件处理
    const handleThemeChange = (event) => {
      isDarkMode.value = event.detail.theme === THEME_TYPES.DARK;
    };
    
    // 切换主题
    const handleChange = (checked) => {
      isDarkMode.value = checked;
      toggleTheme();
    };
    
    // 点击整个区域也切换主题
    const toggleThemeSwitch = () => {
      isDarkMode.value = !isDarkMode.value;
      toggleTheme();
    };
    
    return {
      isDarkMode,
      handleChange,
      toggleTheme: toggleThemeSwitch
    };
  }
};
</script>

<style lang="scss" scoped>
.theme-switch {
  width: 100%;
  padding: 12px 16px;
  background-color: var(--card-background);
  
  .switch-wrapper {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
    
    .icon-wrapper {
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      
      .light-icon {
        color: #ffb84d;
        font-size: 20px;
      }
      
      .dark-icon {
        color: #5181b8;
        font-size: 20px;
      }
    }
    
    .switch-text {
      flex: 1;
      font-size: 14px;
      color: var(--text-color);
    }
    
    .theme-toggle {
      :deep(.van-switch__node) {
        background-color: #fff;
        
        &::before {
          background-color: var(--primary-color);
          opacity: 0.2;
        }
      }
      
      &.van-switch--on {
        background-color: var(--primary-color);
      }
    }
  }
}
</style> 