<template>
  <div>
    <div v-if="!showUploadList" class="demo-upload-list" v-for="item in uploadList.fileList" :key="item.id">
      <template v-if="item.status === 'finished'">
        <img v-if="item.mediaType === 1 && item.url" :src="item.url" :alt="item.name" :onerror="onerror">
        <Icon :type="getType(item.mediaType)" v-else style="font-size: 50px;"></Icon>
        <div class="demo-upload-list-cover">
          <Icon :type="getIconType(item.mediaType)" @click.native="handleView(item)"></Icon>
          <Icon v-if="!disabled" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <!-- type="drag"-->
    <Upload
      v-show="showIconAdd"
      ref="upload"
      :show-upload-list="showUploadList"
      :default-file-list="cpDefaultFileList"
      :on-success="handleSuccess"
      :format="format"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-preview="handleView"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :on-error="handleError"
      :disabled="disabled"
      :multiple="multiple"
      :type="type"
      paste
      :accept="accept"
      :headers="headers"
      :action="actionUrl"
      :style="!showUploadList ? style : ''">
      <slot>
        <div v-if="showIconAdd && !showUploadList" style="width: 98px; height: 98px; line-height: 98px;">
          <Icon type="ios-add" size="20"></Icon>
        </div>
        <Button v-else class="ivu-btn ivu-btn-success ivu-btn ivu-btn-default" icon="ios-cloud-upload-outline" >上传文件</Button>
      </slot>
      <slot v-if="showUploadList" name="tip"></slot>
    </Upload>
    <slot v-if="!showUploadList" name="tip"></slot>
    <ul v-if="disabled && showUploadList" class="ivu-upload-list">
      <li
        v-for="file in uploadList.fileList"
        :key="file.id"
        class="ivu-upload-list-file ivu-upload-list-file-finished"
        @click="handleView(file)">
        <span>
          <Icon :type="formatIcon(file)"></Icon> {{ file.name }}
        </span>
      </li>
    </ul>
    <Modal title="查看图片" v-model="visible" :footer-hide="true">
      <img :src="url" v-if="visible" style="width: 100%;" :onerror="onerror">
    </Modal>
  </div>
</template>
<script>
import { getToken } from '@/libs/util'
import { getMediaListInfo } from '@/api/media'
import noImg from '@/assets/images/no-image.png'
import router from '@/router'
export default {
  name: 'FileUpload',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    defaultFileList: {
      type: Array,
      default() {
        return []
      }
    },
    maxSize: {
      type: Number,
      default: 20480
    },
    count: {
      type: Number,
      default: 5
    },
    format: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'png', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'zip']
      }
    },
    accept: {
      type: String,
      default: '.jpg, .jpeg, .png, .pdf, .xls, .xlsx, .doc, .docx, .zip'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    // 文件展现形式, text或者picture-card
    listType: {
      type: String,
      default: 'picture-card'
    },
    // 1: 本地存储, 2: 七牛OSS, 3: 阿里OSS
    storeType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      uploadList: {},
      cpDefaultFileList: [],
      url: '',
      visible: false,
      // showUploadList: false,
      style: 'display: inline-block; width: 98px; height: 98px;',
      onerror: 'this.src="' + noImg + '";this.onerror=null',
      actionUrl: this.$baseUrl + '/media/upload?storeType=' + this.storeType,
      headers: { Authorization: 'Bearer ' + getToken() }
    }
  },
  computed: {
    overCount() {
      return this.uploadList.fileList && this.uploadList.fileList.length >= this.count
    },
    showIconAdd() {
      return (!this.disabled && !this.overCount && this.listType === 'picture-card') || (!this.disabled && this.listType !== 'picture-card')
    },
    showUploadList() {
      return this.listType !== 'picture-card'
    },
    type() {
      return this.listType !== 'picture-card' ? 'select' : 'drag'
    }
  },
  methods: {
    handleView(file) {
      // 1.image,2.excel,3.word,4.pdf,5.zip
      if (file.mediaType === 1) {
        this.url = file.url
        this.visible = true
      } else if (file.mediaType === 4) {
        this.openWindow(file.url, file.originalMediaName)
      } else {
        // _blank, _parent, _self, _top, name
        this.openWindow(file.url, file.originalMediaName, '_self')
      }
    },
    async openWindow(url, title, name) {
      if (!name) name = title
      let win = await window.open(url, name)
      if (win && win.document) {
        win.document.title = title
        if (win.document.head) {
          win.document.head.title = title
        }
      }
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      if (!this.showUploadList) {
        fileList.splice(fileList.indexOf(file), 1)
      }
      this.value.splice(this.value.indexOf(file), 1)
      this.$emit('input', this.value)
    },
    handleSuccess(res, file, fileList) {
      if (res.code !== 2000) {
        // 因为没有使用axios, 所以如果token失效则应该跳转到登录页
        if (res.code && res.code === 1010) {
          router.replace({ path: '/login', query: { redirect: router.currentRoute.fullPath }})
        }
        this.$Message.error(res.msg)
        // 移除api端发生错误时的文件
        if (fileList && fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            let curFile = fileList[i]
            if (file.uid === curFile.uid) {
              fileList.splice(i, 1)
              return
            }
          }
        }
        return
      }
      if (res.data.storeType === 1) {
        file.url = res.data.mediaPath + '?access_token=' + getToken()
      } else {
        file.url = res.data.mediaPath
      }
      file.name = res.data.originalMediaName
      file.id = res.data.id
      file.accessType = res.data.accessType
      file.mediaPath = res.data.mediaPath
      file.originalMediaName = res.data.originalMediaName
      file.mimeType = res.data.mimeType
      file.mediaName = res.data.mediaName
      file.mediaType = res.data.mediaType
      file.storeType = res.data.storeType
      this.value.push(file)
      this.$emit('input', this.value)
    },
    handleFormatError(file, fileList) {
      this.$Notice.warning({
        title: '文件的格式错误',
        desc: '文件：' + file.name + ' 的格式错误, 请选择 ' + this.format.join('，') + '类型的文件。'
      })
    },
    handleError(error, file, fileList) {
      // let target = error.target
      // target instanceof XMLHttpRequest
      if (error) {
        console.log(error)
      }
      this.$Notice.error({
        title: '系统繁忙',
        desc: '请稍后再试'
      })
    },
    handleMaxSize(file, fileList) {
      this.$Notice.warning({
        title: '上传的文件太大',
        desc: '文件：' + file.name + '太大, 最大不能超过' + this.maxSize / 1024 + 'M。'
      })
    },
    handleBeforeUpload(file) {
      if (this.overCount) {
        this.$Notice.warning({
          title: '最多只能上传' + this.count + '个文件。'
        })
        return false
      }
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      // const arr = ['png', 'jpg', 'jpeg', 'pdf']
      if (!this.format.includes(fileExt)) {
        this.$Notice.warning({
          title: '文件类型错误', // .pdf, .doc, .docx, .xls, .xlsx
          desc: '文件：' + file.name + '不是' + this.format.join('，') + '文件，请选择允许的文件类型进行上传。'
        })
        return false
      }
      return true
    },
    async init(fileList) {
      this.value.splice(0, this.value.length)
      this.cpDefaultFileList = []
      if (fileList && fileList.length) {
        let ids = fileList.map(m => {
          let id
          if (typeof m === 'number') {
            id = m
          } else if (typeof m === 'string') {
            id = parseInt(m)
          } else if (typeof m === 'object' && m.id && typeof m.id === 'number') {
            id = m.id
          }
          return id
        })
        let newValue = []
        await getMediaListInfo(ids).then(async res => {
          let medias = res.data
          newValue = medias
          this.cpDefaultFileList = medias
        }).catch(error => {
          this.$Message.error(error.msg)
        })
        if (newValue.length) {
          newValue.forEach(m => this.value.push(m))
        }
      }
      this.$emit('input', this.value)
    },
    getType(mediaType) {
      let type = 'ios-document-outline'
      // 1.image,2.excel,3.word,4.pdf,5.zip
      switch (mediaType) {
        case 1:
          type = 'ios-image'
          break
        case 2:
          type = 'ios-stats'
          break
        case 3:
          type = 'ios-paper'
          break
        case 4:
          type = 'md-document'
          break
        default:
          type = 'ios-document-outline'
      }
      return type
    },
    getIconType(mediaType) {
      let type = 'ios-eye-outline'
      switch (mediaType) {
        case 1:
        case 4:
          type = 'ios-eye-outline'
          break
        default:
          type = 'md-download'
      }
      return type
    },
    formatIcon(file) {
      const format = file.name.split('.').pop().toLocaleLowerCase() || ''
      let type = 'ios-document-outline'
      if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
        type = 'ios-image'
      }
      if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
        type = 'ios-film'
      }
      if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
        type = 'ios-musical-notes'
      }
      if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
        type = 'md-document'
      }
      if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
        type = 'ios-stats'
      }
      if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
        type = 'ios-videocam'
      }
      return type
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload
  },
  watch: {
    defaultFileList: {
      immediate: true,
      handler(fileList) {
        this.init(fileList)
      }
    }
  }
}
</script>
<style scoped>
    .demo-upload-list{
        border: 1px solid #c0ccda;
        border-radius: 5px;
        box-sizing: border-box;
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        /* border: 1px solid transparent;
        border-radius: 4px; */
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 6px;
    }
    .demo-upload-list img{
        vertical-align: middle;
        width: 100%;
        /* height: 100%; */
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 25px;
        cursor: pointer;
        margin: 0 10px;
    }
</style>
