
import { routes, routerMap } from '@/router/routers'
const state = {
  routers: routes,
  hasGetRules: false
}

const mutations = {
  CONCAT_ROUTES(state, routerList) {
    state.routers = routerList.concat(routes)
  },
  setHasGetRules(state, status) {
    state.hasGetRules = status
  }
}

const getAccesRouterList = (routerMap, rules) => {
  return routerMap.filter(item => {
    if (rules.indexOf(item.access) > -1) {
      if (item.children)item.children = getAccesRouterList(item.children, rules)
      return true
    } else return false
  })
}
const actions = {
  concatRouters({ commit }, rules) {
    return new Promise((resolve, reject) => {
      try {
        let routerList = []
        routerList = getAccesRouterList(routerMap, rules)
        commit('CONCAT_ROUTES', routerList)
        commit('setHasGetRules', true)
        resolve(routerList)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default{
  state,
  mutations,
  actions
}
