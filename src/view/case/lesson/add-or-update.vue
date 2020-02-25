<template>
  <div>
    <ul>
      <li v-for="(item,index) in list" @click="clickName(item)" :key="index">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'addOrUpdate',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      name: 'lester'
    }
  },

  components: {},

  mounted() {},
  computed: {},

  methods: {
    clickName(item) {
      this.$emit('myEnvet', item)
    }
  }
}

</script>
<style>
</style>
