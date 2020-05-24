import Vue from 'vue'
import Vuex from 'vuex'
import { mergeLeft } from '@/utils/tools'

Vue.use(Vuex)

function getSessionFromLocalstorage() {
  const session = localStorage.getItem('app.session')
  if (session) {
    return JSON.parse(session)
  }
  return {
    uid: -1,
    nickname: '',
    avatar: 1,
    token: '',
    refreshtoken: '',
    time: '',
  }
}

export default new Vuex.Store({
  state: {
    session: getSessionFromLocalstorage(),
    includedCacheRootName: [], // 动态keepalive
  },
  getters: {
    session: state => state.session,
    includedCacheRootName: state => state.includedCacheRootName,
  },
  mutations: {
    setSession(state, _session) {
      state.session = mergeLeft(state.session, _session)
      state.session.time = new Date().getTime()
      localStorage.setItem('app.session', JSON.stringify(state.session))
    },
    clearSession(state) {
      localStorage.removeItem('app.session')
      state.session = getSessionFromLocalstorage()
    },
    addCacheRootName(state, rootName) {
      if (rootName === 'home') {
        state.includedCacheRootName = []
      }
      state.includedCacheRootName.push(rootName)
    },
    removeCacheRootName(state) {
      state.includedCacheRootName.pop()
      if (state.includedCacheRootName.length === 0) {
        state.includedCacheRootName = ['home']
      }
    },
  },
  actions: {},
})