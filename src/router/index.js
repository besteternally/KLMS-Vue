import Vue from 'vue'
import Router from 'vue-router'
import rootLeaf from '../components/root/Root'
import branch from '../components/branch/Branch'

Vue.use(Router)

const routes = [
  {
    path: '/rootLeaf',
    component: rootLeaf
  },
  {
    path: '/branch',
    component: branch
  }
]
var router = new Router({
  routes
})
export default router
