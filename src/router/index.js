import Vue from 'vue'
import VueRouter from 'vue-router'
import tubiao from '../views/tubiao.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'tubiao',
    component: tubiao
  },
  
]

const router = new VueRouter({
  routes
})

export default router