<template>
  <div>
    <h2>comc组件</h2>
    <h3>姓名：{{name}}</h3>
    <h3>年龄：{{age}}</h3>
  </div>
</template>

<script>
export default {
  name: 'comc',
  data() {
    return {
      name: '',
      age: ''
    }
  },

  components: {},

  mounted() {
    this.$bus.$on('send-a', name => {
      console.log(name)
      this.name = name
    })
    this.$bus.$on('send-b', age => {
      this.age = age
    })
  },
  destroyed() {
    this.$bus.$off('send-a')
    this.$bus.$off('send-b')
  },
  computed: {},

  methods: {}
}

</script>
<style>
</style>
