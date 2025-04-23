import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// 引入颜色管理工具
import { BRAND_COLOR, COLORS } from '@/utils/colors'

// 引入CSS重置样式，必须最先加载
import '@/assets/css/reset.css'
// 引入点击高亮修复CSS (必须在Vant样式前引入)
import '@/assets/css/fix-highlight.css'

// 引入Vant样式
import 'vant/lib/index.css'

// 引入单个组件
import { 
  Button, Icon, Tabbar, TabbarItem, Swipe, SwipeItem,
  Grid, GridItem, Card, Cell, CellGroup, Tag, Search,
  DropdownMenu, DropdownItem, List, PullRefresh, Tab, Tabs,
  Checkbox, CheckboxGroup, Stepper, SubmitBar, Image as VanImage,
  Empty, Field, Form, Radio, RadioGroup, Steps, Loading, Toast,
  NavBar, Sticky, Badge, Popup, Dialog, Divider, SwipeCell,
  AddressList, AddressEdit, ContactCard, ContactList, ContactEdit,
  Switch
} from 'vant'

// 引入全局样式
import '@/styles/global.less'
import '@/styles/theme.less'
import '@/styles/vant-dark.css'
import '@/styles/dark-override.css'
import '@/styles/specific-pages-dark.css'
import '@/styles/extreme-dark.css'
import '@/styles/order-page.css'
// 引入按钮焦点修复样式
import '@/assets/css/global.css'
// 引入颜色修复CSS（覆盖绿色为红色）- 必须最后加载
import '@/assets/css/fix-color.css'

// rem适配
import 'amfe-flexible'

// 引入事件总线和全局状态
import { isDarkMode } from '@/utils/eventBus'

// 初始化主题
const theme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', theme)
// 设置Vant深色模式
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
  document.body.classList.add('dark')
  document.querySelector('html').className = 'dark'
  isDarkMode.value = true
} else {
  document.documentElement.classList.remove('dark')
  document.body.classList.remove('dark')
  document.querySelector('html').className = ''
  isDarkMode.value = false
}

// 设置Vant全局主题色
document.documentElement.style.setProperty('--van-primary-color', BRAND_COLOR);
document.documentElement.style.setProperty('--van-success-color', BRAND_COLOR);
document.documentElement.style.setProperty('--van-danger-color', BRAND_COLOR);
document.documentElement.style.setProperty('--van-warning-color', COLORS.WARNING);
// 直接覆盖Vant的绿色变量
document.documentElement.style.setProperty('--van-green', BRAND_COLOR);

// 创建Vue实例
const app = createApp(App)

// 注册Vant组件
app.use(Button)
app.use(Icon)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Swipe)
app.use(SwipeItem)
app.use(Grid)
app.use(GridItem)
app.use(Card)
app.use(Cell)
app.use(CellGroup)
app.use(Tag)
app.use(Search)
app.use(DropdownMenu)
app.use(DropdownItem)
app.use(List)
app.use(PullRefresh)
app.use(Tab)
app.use(Tabs)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Stepper)
app.use(SubmitBar)
app.use(VanImage)
app.use(Empty)
app.use(Field)
app.use(Form)
app.use(Radio)
app.use(RadioGroup)
app.use(Steps)
app.use(Loading)
app.use(NavBar)
app.use(Sticky)
app.use(Badge)
app.use(Popup)
app.use(Dialog)
app.use(Divider)
app.use(SwipeCell)
app.use(AddressList)
app.use(AddressEdit)
app.use(ContactCard)
app.use(ContactList)
app.use(ContactEdit)
app.use(Switch)

// 设置Toast默认选项
Toast.setDefaultOptions({
  duration: 2000,
  forbidClick: true
})

// 设置Dialog默认选项
Dialog.setDefaultOptions({
  confirmButtonColor: BRAND_COLOR
})

// 使用插件
app.use(pinia)
app.use(router)

// 挂载应用
app.mount('#app')
