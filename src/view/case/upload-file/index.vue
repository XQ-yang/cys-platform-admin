<!-- create by lester -->
<template>
  <div>
    <Upload
        ref="upload"
        multiple
        type="drag"
        :max-size="10240"
        accept=".pdf, .png, .jpg, .jpeg, .xls, .xlsx"
        :format="['pdf','jpeg','png','jpg','xls','xlsx']"
        :before-upload="beforeUploadHandle"
        :on-exceeded-size="exceededSizeHandel"
        :headers="headers"
        :action="actionUrl"
        :on-success="handleSuccess"
        :on-error="errorHandle"
        :on-format-error="handleFormatError"
        >
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击上传</p>
        </div>
    </Upload>
    <file-upload
      v-model="uploadList1"
      :default-file-list="defaultFileList"
      :storeType="3"
      :count="5"
      :format="['jpg', 'jpeg', 'png', 'gif']"
      accept=".jpg, .jpeg, .png, .gif" >
      <div slot="tip" class="tip-style">注意: 最大20M, 必须为jpg, jpeg, png, gif格式</div>
    </file-upload>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import FileUpload from '_c/upload'
export default {
  name: '',
  components: {
    FileUpload
  },
  data() {
    return {
      defaultFileList: [27, 28],
      uploadList: [],
      uploadList1: [],
      actionUrl: this.$baseUrl + '/upload/local_single',
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList
  },
  computed: {},
  methods: {
    // 文件上传前钩子函数,上传前可以做一系列的操作！
    beforeUploadHandle(file) {

    },
    // 操作文件大小的回调函数
    exceededSizeHandel(file, fileList) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过10M。'
      })
    },
    // 文件上传成功的回调
    handleSuccess(res, file, fileList) {
      // console.log(this.uploadList)
    },
    // 上传出错的回调
    // eslint-disable-next-line handle-callback-err
    errorHandle(error, file, fileList) {

    },
    handleFormatError(file, fileList) {
      this.$Notice.error({
        title: '文件格式错误',
        desc: '文件名为：' + file.name + '的格式错误，请选择.pdf, .png, .jpg, .jpeg,xls,xlsx式文件上传！'
      })
    }
  }
}

</script>
<style scoped>
.tip-style {
  color: red;
  font-size: 12px;
}
</style>
