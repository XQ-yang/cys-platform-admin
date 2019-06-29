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
      // 上传成功后OSS会通过res返回如下对象,拿到改对象然后我们要进行保存本地数据库的操作
      /**
       *
       * {
        bucket: 'vue-cys-platform'
        etag: 'A393B4FC1617F7338EAF0BA6623F11FD'
        height: '820'
        mimeType: 'image/jpeg'
        object: 'cys-platform/dHeyaWc6YM.jpg'
        size: '319305'
        url: 'http://vue-cys-platform.oss-cn-shenzhen.aliyuncs.com\cys-platform/dHeyaWc6YM.jpg'
        width: '1600'
      }
       *
       */
    }
  }
}

</script>
<style>
</style>
