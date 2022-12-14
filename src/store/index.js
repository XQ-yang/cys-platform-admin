import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import router from './module/router'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    router
  },
  getters
})
