<!-- create by lester -->
<template>
  <div>
    <Upload
        multiple
        type="drag"
        :headers="headers"
        :action="actionUrl">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>Click or drag files here to upload</p>
        </div>
    </Upload>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
export default {
  name: '',
  data() {
    return {
      actionUrl: this.$baseUrl + '/upload/local',
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  components: {},
  mounted() {},
  computed: {},
  methods: {}
}

</script>
<style>
</style>
