<!-- create by lester -->
<template>
  <div>
    <tinymce :height="300" v-model="content" id='tinymce'></tinymce>
  </div>
</template>

<script>
import tinymce from '_c/Tinymce'
export default {
  name: '',
  data() {
    return {
    }
  },
  components: {
    tinymce
  },

  mounted() {

  },
  computed: {},

  methods: {
  },
  destroyed() {

  }
}

</script>
<style>
</style>
