// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill'
require('es6-symbol/implement')
import axios from 'axios'
// import '@/mock'
import store from './store'
import PouchDB from 'pouchdb'
//datePicker中文
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Antd)
Vue.use(ElementUI);//由于ant 针对于Vue 封装的不是太全  部分UI无法满足项目需求 借此使用饿了么
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted () {
    var db = new PouchDB('admindb')
    db.get('currUser').then(doc => {
      this.$store.commit('account/setuser', doc.user)
    })
  }
})
