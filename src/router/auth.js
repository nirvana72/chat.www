/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/App.vue'

const authRouter = {
  path: '/auth',
  component: Layout,
  children: [
    {
      path: 'login',
      name: 'auth-login',
      meta: { title: '登录' },
      component: () => import('@/views/auth/login'),
    }]
}

export default authRouter