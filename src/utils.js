export const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00'
  return Number(price).toFixed(2)
}

// 格式化时间，保证两位数显示
export const formatTime = (time) => {
  return time < 10 ? `0${time}` : time
}

// 格式化日期显示
export const formatDate = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = formatTime(date.getMonth() + 1)
  const day = formatTime(date.getDate())
  const hour = formatTime(date.getHours())
  const minute = formatTime(date.getMinutes())
  
  return `${year}-${month}-${day} ${hour}:${minute}`
} 