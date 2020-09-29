import Vue from 'vue'
import VueRouter from 'vue-router'
import rukouList from '../components/rukou.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'rukou',
    component: rukouList
  }, {
    path: '/rukou_edit',
    name: 'rukou_edit',
    component: () => import('@/components/rukou_edit.vue'),
  }, {
    path: '/fenlei',
    name: 'fenlei',
    component: () => import('@/components/fenlei.vue'),
  }, {
    path: '/fenlei_edit',
    name: 'fenlei_edit',
    component: () => import('@/components/fenlei_edit.vue'),
  }, {
    path: '/question',
    name: 'question',
    component: () => import('@/components/question.vue'),
  }, {
    path: '/question_edit',
    name: 'question_edit',
    component: () => import('@/components/question_edit.vue'),
  },
  {
    path: '/paixu',
    name: 'paixu',
    component: () => import('@/components/paixu.vue'),
  }, {
    path: '/kefu',
    name: 'kefu',
    component: () => import('@/components/kefu.vue'),
  }, {
    path: '/kefu_edit',
    name: 'kefu_edit',
    component: () => import('@/components/kefu_edit.vue'),
  },

]

const router = new VueRouter({
  routes
})

export default router