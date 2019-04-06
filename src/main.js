// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import App from './App'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(iView)
Vue.use(VueResource)
Vue.use(elementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
