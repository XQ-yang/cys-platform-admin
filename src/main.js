// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import '@/assets/theme/index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/css/common.less'
import { formatDate } from '@/libs/tools.js'
import Bus from './bus'
// 实际打包时应该不引入mock
/* eslint-disable */
//if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(ViewUI)
Vue.prototype.$bus=Bus
const fileUrl = process.env.VUE_APP_FILE_URL
const baseUrl = process.env.VUE_APP_BASE_API_URL
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * @description 全局注册文件模板基础路径
 */
Vue.prototype.$fileUrl = fileUrl
/**
 * @description 全局注册后端基础路径
 */
Vue.prototype.$baseUrl = baseUrl
/**
 * @description 全局注册日期格式化函数
 */
Vue.prototype.$formatDate = formatDate
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
