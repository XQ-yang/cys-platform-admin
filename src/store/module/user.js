import { login, getUserInfo, logout, authorization } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    btnRules: [],
    roleIds: []
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
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
          const data = res.data
          // window.localStorage.removeItem('tagNaveList')
          commit('setToken', data.token)
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
      debugger
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            debugger
            const data = res.data
            commit('setAvator', data.avator)
            commit('setUserName', data.name)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access)
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
