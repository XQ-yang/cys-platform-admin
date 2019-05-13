<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span>
     <Icon type="md-person" :size="18"/>
         {{userName}}
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
      </span>
       <!-- <Avatar :src="userAvator"/> -->
      <DropdownMenu slot="list">
        <DropdownItem name="userInfo">个人中心</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapMutations([
      'setHasGetRules',
      'CONCAT_ROUTES'
    ]),
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.setHasGetRules(false)
            this.$router.push({
              name: 'login'
            })
            window.location.reload()
          })
          break
        case 'userInfo':
          const route = {
            name: 'ownspace'
          }
          this.$router.push(route)
          break
      }
    }
  }
}
</script>
