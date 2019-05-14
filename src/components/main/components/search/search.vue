<template>
  <div>
    <Input search placeholder="请输入查询条件"  v-if="isView"  />
  </div>
</template>
<script>
import { hasOneOf } from '@/libs/tools'
export default{
  name: 'Search',
  computed: {
    access() {
      return this.$store.state.user.btnRules
    },
    isView() {
      return hasOneOf(['retrospect', 'retrospectView'], this.access)
    }
  },
  methods: {
  }
}
</script>
