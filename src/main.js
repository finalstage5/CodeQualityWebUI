// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.css';
import axios from 'axios'
import wave from './directive/index'
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.use(Router);
Vue.use(ElementUI);
Vue.use(wave);

Vue.prototype.$axios = axios
Vue.config.productionTip = false
axios.defaults.baseURL = '/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h=>h(App)
})
