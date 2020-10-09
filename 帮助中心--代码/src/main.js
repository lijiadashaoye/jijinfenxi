import Vue from 'vue'
import App from './App.vue'
import router from './router'

import as from "axios";
import axios from "./api.js";
as.defaults.baseURL = 'http://192.168.10.199:8080/omp'; // 测试用
// as.defaults.baseURL = self.location.origin + '/' + self.location.pathname.split('/')[1];


as.defaults.withCredentials = true;
Vue.prototype.$axios = as;
Vue.prototype.$http = axios;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')