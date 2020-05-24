import Mock from 'mockjs'
import {
  param2Obj
} from '@/utils/tools.js'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

Mock.setup({
  timeout: '350-600'
})

Mock.mock(/goods\/hot/, 'get', config => {
  let {
    limit,
    page
  } = param2Obj(config.url)

  let list = []

  let max = 153
  let select_count = limit
  if (limit * page > max) {
    select_count = max % limit
  }

  for (let i = 1; i <= select_count; i++) {
    let imgid = Mock.Random.integer(1, 10)
    list.push({
      id: limit * (page - 1) + i,
      url: `/imgs/goods/${imgid}.jpg`,
      price: Mock.Random.integer(100, 999),
      title: Mock.Random.ctitle(5, 10),
    })
  }

  return {
    data: {
      ret: 1,
      msg: 'success',
      list
    }
  }
});

export default Mock