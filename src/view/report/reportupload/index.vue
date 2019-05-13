<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="报告名称" class="search-input" v-model="listQuery.reportName"/>
        <Input @on-change="handleClear"  clearable placeholder="操作人" class="search-input" v-model="listQuery.createBy"/>
        <DatePicker @on-change="handleDateClear" type="date" v-model="listQuery.startDate"  format="yyyy-MM-dd" placeholder="上传日期开始" style="width: 180px;margin-right:10px;" ></DatePicker>
        <DatePicker @on-change="handleDateClear" type="date" v-model="listQuery.endDate"  format="yyyy-MM-dd" placeholder="上传日期结束" style="width: 180px;margin-right:10px;"></DatePicker>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'addReport'}" @click="createHandle" class="search-btn">上传</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
            <Button v-permission="{rule:'viewReport'}" type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">查看</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'delReport'}" type="error" size="small">删除</Button>
            </Poptip>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
      <!--弹出层-->
      <Modal
      v-model="dialogFormVisible"
      title="报告上传"
      :loading="loading"
      @on-ok="createData"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="500"
      ok-text="提交"
      cancel-text="关闭"
      >
        <Form ref="uploadForm" :model="reportFileTemp" :rules="rules" :label-width="90" style="padding-right:20px;">
          <Row>
            <Col span="24">
              <Form-item label="报告名称" prop="reportName">
                <Input type="text" v-model="reportFileTemp.reportName" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="24">
              <Form-item label="报告类型" prop="type">
                <Select v-model="reportFileTemp.type" clearable placeholder="请选择">
                  <Option :value="1">定期检测报告</Option>
                  <Option :value="2">巡检报告</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="24">
              <Form-item label="创建人" prop="createBy" >
                <Input type="text" v-model="reportFileTemp.createBy" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
            <Col span="24">
              <Form-item>
                <Upload
                ref="upload"
                :action="actionUrl"
                :headers="headers"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
                :on-preview="handleUploadPreview"
                accept=".pdf"
                class="search-input"
                :on-exceeded-size="handleMaxSize"
                :max-size="102400"
                :show-upload-list="true"
                type="drag"
                :on-remove="removeFile">
                  <div>
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>报告上传</p>
                  </div>
                </Upload>
              </Form-item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { getToken } from '@/libs/util'
import { fetchList, addReportFile, deleteReportFile } from '@/api/reportUpload'
export default {
  name: 'reportupload',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '报告名称', key: 'reportName' },
        { title: '创建人', key: 'createBy' },
        { title: '文件类型',
          key: 'type',
          render: (h, params) => {
            return h('div',
              params.row.type === 1 ? '定期检测报告' : '巡检报告'
            )
          }
        },
        { title: '创建时间',
          key: 'createTime',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      tableLoading: false,
      loading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        reportName: '',
        createBy: '',
        startDate: '',
        endDate: ''
      },
      reportFileTemp: {
        id: undefined,
        reportName: '',
        fileName: '',
        filePath: '',
        createTime: new Date(),
        updateTime: new Date(),
        createBy: '',
        updateBy: '',
        quarter: 0,
        mediaId: '',
        type: ''
      },
      rules: {
        reportName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        type: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ]

      },
      uploadLoading: false,
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { 'Authorization': getToken() },
      uploadList: [],
      isFirstEnter: true
    }
  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
    if (this.isFirstEnter) {
    // 获取列表数据
      this.getList()
      this.uploadList = this.$refs.upload.fileList
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取列表数据
      this.getList()
      this.uploadList = this.$refs.upload.fileList
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置表单页面赋值
    resetReportFileTemp() {
      this.reportFileTemp = {
        id: undefined,
        reportName: '',
        fileName: '',
        filePath: '',
        createTime: new Date(),
        updateTime: new Date(),
        createBy: '',
        updateBy: '',
        quarter: 0
      }
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    createHandle() {
      this.dialogFormVisible = true
      this.$refs.upload.clearFiles()
      this.$refs['uploadForm'].resetFields()
    },
    createData() {
      if (this.reportFileTemp.filePath === '') {
        this.$Message.error('请选中需要上传的报告')
        return this.changeLoading()
      }
      this.$refs['uploadForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addReportFile(this.reportFileTemp).then(res => {
          this.changeLoading()
          this.dialogFormVisible = false
          this.$Message.success(res.msg)
          this.getList()
        }).catch(error => {
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    handleUpdate(row) {
      window.open(row.filePath)
    },
    handleDelete(id) {
      deleteReportFile(id).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    },
    // 上传文件前检查上传文件的后缀名
    handleBeforeUpload(file) {
      // 上传前先清空已上传的文件列表
      this.$refs.upload.clearFiles()
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf') {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是PDF文件，请选择后缀为.pdf的文件进行上传。'
        })
        return false
      }
      return true
    },
    handleUploadPreview(file) {
      window.open(file.mediaPath)
    },
    handleMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$Message.error(res.msg)
        this.$refs.upload.clearFiles()
        return
      }
      this.reportFileTemp.reportName = res.data.originalMediaName
      this.reportFileTemp.fileName = res.data.originalMediaName
      this.reportFileTemp.createTime = res.data.createTime
      this.reportFileTemp.mediaId = res.data.id
      this.reportFileTemp.filePath = res.data.mediaPath
      this.reportFileTemp.createBy = this.$store.state.user.userName
      file.id = res.data.id
      file.mediaPath = res.data.mediaPath
      let date = new Date()
      const currMonth = date.getMonth() + 1
      let currQuarter = Math.floor((currMonth % 3 === 0 ? (currMonth / 3) : (currMonth / 3 + 1)))
      this.reportFileTemp.quarter = currQuarter
      // this.createData()
    },
    handleDateClear(v) {
      if (v === '') {
        this.getList()
      }
    },
    removeFile() {
      this.$refs['uploadForm'].resetFields()
    }
  }
}
</script>
