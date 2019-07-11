<template>
  <div>
        <Upload
        multiple
        :max-size="10240"
        accept=".pdf, .png, .jpg, .jpeg"
        :format="['pdf','jpeg','png','jpg']"
        :action="actionUrl"
        :data="uploadData"
        :on-success="handleSuccess"
        >
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload>
  </div>
</template>

<script>
export default {
  name: 'EditorSlideUpload',
  props: {
    // OSS 返回的上传地址
    actionUrl: {
      type: String,
      default: ''
    },
    // 上传时需要携带的数据
    uploadData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {

    }
  }
}

</script>
<style>
</style>
