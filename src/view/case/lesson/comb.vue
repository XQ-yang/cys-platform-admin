<template>
  <div>
    <h2>B组件</h2>
    <Button @click="send">将数据发送给C</Button>
  </div>
</template>

<script>
export default {
  name: 'comb',
  data() {
    return {
      age: '20'
    }
  },

  components: {},

  mounted() {},
  computed: {},

  methods: {
    send() {
      this.$bus.$emit('send-b', this.age)
    }
  }
}

</script>
<style>
</style>
