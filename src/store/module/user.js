import { login, getUserInfo, logout, authorization } from '@/api/user'
import { setToken, getToken, localSave } from '@/libs/util'

export default {
  state: {
    userName: '',
    realName: '',
    userId: '',
    token: getToken(),
    hasGetInfo: false,
    btnRules: [], // 按钮权限
    routerRules: [], // 路由菜单权限
    roleIds: [],
    refreshToken: ''// 刷新token
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setRealName(state, realName) {
      state.realName = realName
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setBtnRules(state, rules) {
      state.btnRules = rules
    },
    setRoleIds(state, roleIds) {
      state.roleIds = roleIds
    },
    setRouterRules(state, routesName) {
      state.routerRules = routesName
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken
      localSave('refreshToken', refreshToken)
    }
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        debugger
        login({
          userName,
          password
        }).then(res => {
          debugger
          window.localStorage.removeItem('tagNaveList')
          commit('setToken', res.access_token)
          commit('setRefreshToken', res.refresh_token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          window.localStorage.removeItem('tagNaveList')
          window.localStorage.removeItem('refreshToken')
          commit('setToken', '')
          commit('setHasGetInfo', false)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setUserId', data.id)
            commit('setUserName', data.username)
            commit('setRealName', data.realName)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    authorization({ state, commit }) {
      return new Promise((resolve, reject) => {
        authorization().then(res => {
          const dataRoutesNames = res.data.ownerMenuList.filter(item => item.type === 0).map(item => {
            return item.permission
          })
          // 筛选按钮权限字段
          const dataBtnRules = res.data.ownerMenuList.filter(item => item.type === 1).map(item => {
            return item.permission
          })
          commit('setRouterRules', dataRoutesNames)
          commit('setBtnRules', dataBtnRules)
          resolve(dataRoutesNames)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
