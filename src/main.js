import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局样式文件
import '@/assets/css/global.css'
// 引入字体图标
import '@/assets/font/iconfont'

Vue.config.productionTip = false

// 请求根路径的配置
axios.defaults.baseURL = 'http://192.168.1.3:8886/api/'
// axios.defaults.baseURL = 'http://192.168.1.3:3000/api/'
// 将axios挂载到Vue的原型实例上
Vue.prototype.$http = axios

// 将全局echarts对象挂载到Vue的原型对象上
Vue.prototype.$echarts = window.echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
