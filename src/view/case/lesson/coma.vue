<template>
  <div>
    <h2>A组件</h2>
    <Button @click="send">将数据发送给C</Button>
    <h3>provide:{{userName}}</h3>
  </div>
</template>

<script>
export default {
  name: 'coma',
  inject: ['userName'],
  data() {
    return {
      name: 'lester'
    }
  },

  components: {},

  mounted() {
    // console.log(this.$parent)
  },
  computed: {},

  methods: {
    send() {
      this.$bus.$emit('send-a', this.name)
    }
  }
}

</script>
<style>
</style>
