import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;

import as from "axios";
as.defaults.baseURL = 'http://localhost:6634';
// http响应拦截器
as.interceptors.response.use(res => {
  if (res.status == 200) {
    return res.data
  }
});
Vue.prototype.$axios = as;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')