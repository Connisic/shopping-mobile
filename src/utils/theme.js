/**
 * 主题切换工具类
 * 提供主题切换功能和主题状态管理
 */

// 主题类型
export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark'
};

/**
 * 设置主题
 * @param {string} theme 主题名称 ('light' | 'dark')
 */
export function setTheme(theme) {
  // 保存主题设置到localStorage
  localStorage.setItem('theme', theme);
  
  // 设置文档的data-theme属性
  document.documentElement.setAttribute('data-theme', theme);
  
  // 设置body的data-theme属性
  document.body.setAttribute('data-theme', theme);
  
  // 如果是深色模式，添加dark类名
  if (theme === THEME_TYPES.DARK) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
  
  // 触发主题变化事件
  const event = new CustomEvent('theme-change', { detail: { theme } });
  window.dispatchEvent(event);
}

/**
 * 获取当前主题
 * @returns {string} 当前主题名称
 */
export function getCurrentTheme() {
  return localStorage.getItem('theme') || THEME_TYPES.LIGHT;
}

/**
 * 切换主题
 * 在亮色和暗色模式之间切换
 */
export function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEME_TYPES.LIGHT ? THEME_TYPES.DARK : THEME_TYPES.LIGHT;
  setTheme(newTheme);
  return newTheme;
}

/**
 * 初始化主题
 * 应用在localStorage中保存的主题或默认主题
 */
export function initTheme() {
  const savedTheme = localStorage.getItem('theme') || THEME_TYPES.LIGHT;
  setTheme(savedTheme);
}

export default {
  THEME_TYPES,
  setTheme,
  getCurrentTheme,
  toggleTheme,
  initTheme
}; 