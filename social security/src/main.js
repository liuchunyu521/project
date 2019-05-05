// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.less'
//import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill'
require('es6-symbol/implement')
import axios from 'axios'
import pako from 'pako'
// import '@/mock'
import store from './store'
import PouchDB from 'pouchdb'
//datePicker中文
import moment from 'moment';
import 'moment/locale/zh-cn';

import {
  Affix,
  Anchor,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  message,
  Menu,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
} from 'ant-design-vue';

moment.locale('zh-cn');


Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(pako)
//Vue.use(Antd)
Vue.use(ElementUI);//由于ant 针对于Vue 封装的不是太全  部分UI无法满足项目需求 借此使用饿了么

Vue.$notification = notification;
Vue.$message = message;
Vue.use(Affix),
  Vue.use(Anchor),
  Vue.use(AutoComplete),
  Vue.use(Alert),
  Vue.use(Avatar),
  Vue.use(BackTop),
  Vue.use(Badge),
  Vue.use(Breadcrumb),
  Vue.use(Button),
  Vue.use(Calendar),
  Vue.use(Card),
  Vue.use(Collapse),
  Vue.use(Carousel),
  Vue.use(Cascader),
  Vue.use(Checkbox),
  Vue.use(Col),
  Vue.use(DatePicker),
  Vue.use(Divider),
  Vue.use(Dropdown),
  Vue.use(Form),
  Vue.use(Icon),
  Vue.use(Input),
  Vue.use(InputNumber),
  Vue.use(Layout),
  Vue.use(List),
  Vue.use(LocaleProvider),
 // Vue.use(message),
  Vue.use(Menu),
  Vue.use(Modal),
  //Vue.use(notification),
  Vue.use(Pagination),
  Vue.use(Popconfirm),
  Vue.use(Popover),
  Vue.use(Progress),
  Vue.use(Radio),
  Vue.use(Rate),
  Vue.use(Row),
  Vue.use(Select),
  Vue.use(Slider),
  Vue.use(Spin),
  Vue.use(Steps),
  Vue.use(Switch),
  Vue.use(Table),
  Vue.use(Transfer),
  Vue.use(Tree),
  Vue.use(TreeSelect),
  Vue.use(Tabs),
  Vue.use(Tag),
  Vue.use(TimePicker),
  Vue.use(Timeline),
  Vue.use(Tooltip),
  Vue.use(Upload),
  Vue.use(Drawer),
  Vue.use(Skeleton),

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
