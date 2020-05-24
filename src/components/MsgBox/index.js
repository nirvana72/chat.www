import Vue from 'vue'
import MsgBox from './index.vue'

let MsgBoxConstructor = Vue.extend(MsgBox)

let msgbox = {
  init(data) {
    let instance = new MsgBoxConstructor().$mount()
    let container = document.getElementById('app')
    container.appendChild(instance.$el)
    if (typeof (data) === 'string') {
      instance.msg = data
    }
    if (typeof (data) === 'object') {
      instance = Object.assign(instance, data)
    }
    instance.remove =  () => {
      container.removeChild(instance.$el)
    }
    return instance
  },
  alert(data) {
    let instance = this.init(data)
    instance.type = 'primary'
  },
  success(data) {
    let instance = this.init(data)
    instance.type = 'success'
  },
  error(data) {
    let instance = this.init(data)
    instance.type = 'error'
  },
  warning(data) {
    let instance = this.init(data)
    instance.type = 'warning'
  }
}

export default msgbox