/**
 * 颜色管理工具 - 提供统一的颜色变量用于JavaScript中
 */

// 品牌颜色
export const BRAND_COLOR = '#ff0000'
export const BRAND_COLOR_DARK = '#cc0000' // darken 10%
export const BRAND_COLOR_LIGHT = '#ff9999' // lighten 30%

// 主题颜色映射
export const COLORS = {
  // 主要颜色
  PRIMARY: BRAND_COLOR,
  SUCCESS: BRAND_COLOR, // 成功色（覆盖默认绿色）
  WARNING: '#faad14',   // 警告色
  DANGER: BRAND_COLOR,  // 危险色
  INFO: '#40a9ff',      // 信息色

  // 社交平台颜色
  WECHAT: BRAND_COLOR,  // 微信绿色（已覆盖为主题红色）
  ALIPAY: '#1677ff',    // 支付宝蓝色
  QQ: '#0085FF',        // QQ蓝色
  WEIBO: '#E6162D',     // 微博红色

  // 辅助色
  BLUE: '#40a9ff',
  GREEN: BRAND_COLOR,   // 覆盖默认绿色为主题红色
  ORANGE: '#faad14',
  GRAY: '#999',
  GRAY_LIGHT: '#f5f5f5',
  GRAY_DARK: '#666',

  // 文字颜色
  TEXT: '#333',
  TEXT_SECONDARY: '#666',
  TEXT_PLACEHOLDER: '#999',

  // 边框颜色
  BORDER: '#eee',

  // 背景颜色
  BACKGROUND: '#f7f8fa',
  CARD_BACKGROUND: '#ffffff',

  // 状态颜色
  STATUS_PENDING: '#ff976a',  // 待付款
  STATUS_PAID: '#1989fa',     // 待发货
  STATUS_DELIVERED: BRAND_COLOR, // 待收货
  STATUS_COMPLETED: '#969799', // 已完成
  STATUS_CANCELLED: '#969799', // 已取消
}

/**
 * 根据主题获取合适的颜色
 * @param {string} colorKey - 颜色的键名
 * @param {string} theme - 主题 'light' 或 'dark'
 * @returns {string} 主题对应的颜色值
 */
export function getThemeColor(colorKey, theme = 'light') {
  if (theme === 'dark') {
    // 深色模式下的颜色映射
    const darkColors = {
      [COLORS.PRIMARY]: '#ff3333',
      [COLORS.WECHAT]: '#ff3333',
      [COLORS.GREEN]: '#ff3333',
      [COLORS.BLUE]: '#59b6ff',
      [COLORS.ALIPAY]: '#4c99ff',
      [COLORS.QQ]: '#33a0ff',
      [COLORS.WEIBO]: '#ff4d66',
      [COLORS.STATUS_PENDING]: '#ffb191',
      [COLORS.STATUS_PAID]: '#4ca4ff',
      [COLORS.STATUS_DELIVERED]: '#ff3333',
      [COLORS.STATUS_COMPLETED]: '#b8b8b8',
      [COLORS.STATUS_CANCELLED]: '#b8b8b8',
    }
    
    return darkColors[colorKey] || colorKey
  }
  
  return colorKey
}

export default COLORS 