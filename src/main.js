import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Msgbox from '@/components/MsgBox'
import '@/style/index.scss'
import router from '@/router/index.js'
import store from '@/store.js'
import Request from '@/utils/request.js'
import '@/mockjs/index.js'
import 'normalize.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.prototype.$msgbox = Msgbox

Vue.prototype.$Ajax = Request

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')