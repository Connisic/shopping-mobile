import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

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
  confirmButtonColor: '#e53e3e'
})

// 使用插件
app.use(store)
app.use(router)

// 挂载应用
app.mount('#app')
