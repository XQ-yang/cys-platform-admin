<template>
  <div>
    <Upload
        ref="upload"
        multiple
        type="drag"
        :max-size="10240"
        accept=".pdf, .png, .jpg, .jpeg"
        :format="['pdf','jpeg','png','jpg']"
        :before-upload="beforeUploadHandle"
        :action="uploadHost"
        :on-success="handleSuccess"
        :data="uploadData"
        >
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击上传</p>
        </div>
    </Upload>
  </div>
</template>

<script>
import { oss } from '@/libs/oss'
export default {
  name: '',
  data() {
    return {
      // 附件上传的url地址
      uploadHost: '',
      // 附件上传携带参数
      uploadData: {},
      // 上传后返回的存储文件名
      fileName: '',
      // 上传后返回的文件存储地址
      filePath: ''
    }
  },

  components: {},
  mounted() {},
  computed: {},

  methods: {
    beforeUploadHandle(file) {
      return oss(file.name).then(res => {
        this.uploadHost = res.host
        this.uploadData = res
      })
    },
    handleSuccess(res, file, fileList) {
      console.log(res)
    }
  }
}

</script>
<style>
</style>
