<template>
  <div>
    <tinymce :height="300" v-model="content" id='tinymceId'></tinymce>
  </div>
</template>

<script>
import tinymce from '_c/Tinymce'
export default {
  name: '',
  data() {
    return {
      content: ''
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
