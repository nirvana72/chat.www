import axios from 'axios'
import store from '@/store'
import Msgbox from '@/components/MsgBox'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_APIHOST,
  timeout: 60000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.session.uid > 0) {
      config.headers['Authorization'] = 'Bearer ' + store.getters.session.token
      config.headers['ClientVersion'] = '20200511'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 此处统一提示失败信息 * 200状态下的， 非服务端abort 500错误
    if (response.data.ret && response.data.ret < 0) {
      Msgbox.error(response.data.msg)
    }
    return response.data
  },
  async (error) => { // 非200状态
    if (error.response && error.response.data) {
      // console.log(error.response.data)
      if (error.response.data.ret === -99) {
        // api token 验证超时
        const refreshResponseResult = await axios.get(`${process.env.VUE_APP_BASE_API}/auth/refresh_token`, { params: { refreshToken: store.getters.session.refreshtoken } })
        if (refreshResponseResult.data.ret < 0) {
          // token 刷新失败
          store.dispatch('user/clearSession')
          Msgbox.error({ msg: '登录信息过期,需要重新登录', callback: () => { window.location.href = '/' } })
        } else {
          // 新获取的token 赋值到session
          store.dispatch('user/setSession', refreshResponseResult.data)
          // console.log('重新登录完成，刷新本地token')
          // eslint-disable-next-line require-atomic-updates
          error.response.config.headers['Authorization'] = 'Bearer ' + store.getters.session.token
          // console.log('重新访问之前的请求')
          const result = await axios.request(error.response.config)
          if (result) {
            // console.log('重新访问之前的请求完成')
            return Promise.resolve(result.data)
          }
        }
      } else if (error.response.data.ret === -98) {
        // api token 验证出错
        store.dispatch('user/clearSession')
        Msgbox.error({ msg: '登录信息验证出错', callback: () => { window.location.href = '/' } })
      } else {
        // 与token无关 统一弹出出错信息
        Msgbox.error({ tit: `http: ${error.response.status}, ret: ${error.response.data.ret}`, msg: error.response.data.msg })
      }
    } else {
      console.log(error) // for debug
      Msgbox.error('未知错误，查看console')
    }
    return Promise.reject(error)
  }
)

export default service