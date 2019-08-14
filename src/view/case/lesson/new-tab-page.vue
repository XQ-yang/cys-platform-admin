<template>
  <div>
    <Button @click="close" class="search-btn">关闭</Button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  data() {
    return {
    }
  },

  components: {},

  mounted() {},
  computed: {},

  methods: {
    ...mapMutations(['closeTag']),
    close() {
      this.closeTag({
        name: 'addlesson',
        query: {
          id: 'addlesson'
        }
      })
    }
  }
}

</script>
<style>
</style>
