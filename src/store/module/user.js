import { login, getUserInfo, logout, authorization } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    realName: '',
    userId: '',
    token: getToken(),
    hasGetInfo: false,
    btnRules: [],
    roleIds: []
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
    setRules(state, rules) {
      state.btnRules = rules
    },
    setRoleIds(state, roleIds) {
      state.roleIds = roleIds
    }
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          window.localStorage.removeItem('tagNaveList')
          commit('setToken', res.access_token)
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
          const data = res.data.map(item => {
            return item.code
          })
          commit('setRules', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
