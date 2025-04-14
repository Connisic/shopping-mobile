import { ref } from 'vue'

const bus = {}
const listeners = {}

// 监听事件
bus.on = function(event, callback) {
  if (!listeners[event]) {
    listeners[event] = []
  }
  listeners[event].push(callback)
}

// 触发事件
bus.emit = function(event, ...args) {
  if (listeners[event]) {
    listeners[event].forEach(callback => {
      callback(...args)
    })
  }
}

// 移除特定事件监听器
bus.off = function(event, callback) {
  if (listeners[event]) {
    if (callback) {
      const index = listeners[event].indexOf(callback)
      if (index > -1) {
        listeners[event].splice(index, 1)
      }
    } else {
      listeners[event] = []
    }
  }
}

// 全局共享的深色模式状态
const isDarkMode = ref(document.documentElement.getAttribute('data-theme') === 'dark')

// 导出事件总线和共享状态
export { bus, isDarkMode } 