<template>
  <div>
    <Input search placeholder="请输入样本条码"  v-if="isView" @on-search="searchSampleCode" />
  </div>
</template>
<script>
import { hasOneOf } from '@/libs/tools'
import { getBySampleCode } from '@/api/retrospect'
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
    searchSampleCode(e) {
      if (e) {
        getBySampleCode(e).then(res => {
          if (res.data) {
            const route = {
              name: 'retrospectView',
              query: {
                sampleId: res.data.id
              }
            }
            this.$router.push(route)
          } else {
            this.$Message.info('样本条码不存在')
          }
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }
    }
  }
}
</script>
