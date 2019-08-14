<template>
  <div>
    <Button type="info" @click="uploadClick">upload</Button>
    <Modal
      v-model="dialogVisible"
      title="图片上传"
      :loading="loading"
      @on-ok="submitHandle"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="700"
      >
      <div style="height:300px">
        <Upload
          ref="upload"
          multiple
          type="drag"
          :max-size="10240"
          accept=".png, .jpg, .jpeg"
          :format="['jpeg','png','jpg']"
          :action="uploadHost"
          :data="uploadData"
          :before-upload="beforeUpdate"
          :on-success="handleSuccess"
          >
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>Click or drag files here to upload</p>
          </div>
        </Upload>
      </div>
    </Modal>
  </div>
</template>

<script>
import { oss } from '@/libs/oss'
export default {
  name: 'EditorSlideUpload',
  data() {
    return {
    // 附件上传的url地址
      uploadHost: '',
      // 附件上传携带参数
      uploadData: {},
      dialogVisible: false,
      loading: true,
      fileList: []
    }
  },
  methods: {
    uploadClick() {
      // this.$refs.upload.clearFiles()
      this.dialogVisible = true
    },
    // 上传之前需要做一些什么
    beforeUpdate(file) {
      return oss(file.name).then(res => {
        this.uploadHost = res.host
        this.uploadData = res
      })
    },
    // 上传成功后的回调方法
    handleSuccess(res, file) {
      console.log(res)
    },
    // 添加图片到富文本编辑器
    submitHandle() {
      this.fileList = this.$refs.upload.fileList
      const arr = this.fileList.map(item => {
        item.url = item.response.data.resignUrl
        return item
      })
      this.$emit('successCBK', arr)
      this.fileList = []
      this.dialogVisible = false
    }
  }
}

</script>
<style>
</style>
