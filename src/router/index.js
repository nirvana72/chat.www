import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js'
import authRouter from './auth.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { login: true, title: 'index' },
      component: () => import('@/views/home/index.vue'),
    },
    authRouter
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  if (to.meta.login && store.getters.session.uid < 0) {
    next('/auth/login')
    return
  }

  next()
  // setTimeout(() => { next(); }, 10000);
})

router.afterEach(function () {
  NProgress.done();
})

export default router
