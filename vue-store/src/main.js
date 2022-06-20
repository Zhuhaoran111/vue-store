import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//全局引入mint-ui
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(MintUI);

//全局引入vant框架
import Vant from 'vant';
import 'vant/lib/index.css'
Vue.use(Vant)
//引入fun-tab插件
// import { createApp } from 'vue'
// import FunTab from 'fun-tab'

// const app = createApp(App)
// app.use(FunTab)

// app.mount('#app')

import LyTab from 'ly-tab'

Vue.use(LyTab)




//公共css文件
import '@/assets/css/common.css'

//字体图标演示css文件
import '@/assets/css/iconfont.css'

//引入淘宝的无线适配文件
import '@/assets/js/flexible.js'






Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
