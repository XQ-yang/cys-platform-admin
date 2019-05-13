import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import router from './module/router'
import sample from './module/sample'
import storage from './module/storage'
import outstorage from './module/outstorage'
import outApply from './module/outApply'
import outStock from './module/outStock'
import outReview from './module/outReview'
import outSignature from './module/outSignature'
import retrospect from './module/retrospect'
import getters from './getters'
import flowStop from './module/flowStop'
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
    router,
    sample,
    storage,
    outstorage,
    outApply,
    outStock,
    outReview,
    outSignature,
    retrospect,
    flowStop
  },
  getters
})
