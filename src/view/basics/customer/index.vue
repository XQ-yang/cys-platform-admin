<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input v-model="listQuery.name"  @on-change="handleClear" placeholder="姓名" class="search-input"  clearable />
        <Input v-model="listQuery.phone" @on-change="handleClear" placeholder="手机号" class="search-input" clearable />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button  v-permission="{rule:'addCustomer'}"   @click="handleCreate" class="search-btn">新增</Button>
        <Button  v-permission="{rule:'editCustomer'}"  @click="handleImport" class="search-btn">导入</Button>
        <Button class="search-btn"  @click="downLoadFile">模板下载</Button>
      </div>
      <!--列表-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe></Table>
      <!--分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getCustomerList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
      <!--顾客新增弹出层-->
      <Modal
      v-model="dialogFormVisible"
      :title="textMap[dialogStatus]"
      :loading="formLoading"
      @on-ok="dialogStatus==='create'?createData():updateData()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="700"
      ok-text="提交"
      cancel-text="关闭">
        <Form ref="customerForm" :model="customerTemp" :rules="rules" :label-width="80" style="padding-right:20px;">
          <Row :gutter="48">
            <Col span="12">
              <Form-item label="姓名" prop="name">
                <Input type="text" v-model="customerTemp.name" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="手机号" prop="phone">
                <Input  type="text" v-model="customerTemp.phone" :maxlength="20"></Input>
              </Form-item>
            </Col>
          </Row>
        <Row :gutter="48">
            <Col span="12">
              <Form-item label="证件类型" prop="idType">
                <Select v-model="customerTemp.idType" v-bind:disabled="editCustomer"  placeholder="请选择" clearable>
                  <Option :value="1">身份证</Option>
                  <Option :value="2">香港身份证</Option>
                  <Option :value="3">港澳通行证</Option>
                  <Option :value="4">台湾通行证</Option>
                  <Option :value="5">护照</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="证件号" prop="idNumber">
                <Input  type="text" v-model="customerTemp.idNumber" v-bind:disabled="editCustomer" :maxlength="20"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="12">
              <Form-item label="性别" prop="gender">
                <RadioGroup v-model="customerTemp.gender" >
                  <Radio :label="0">未知</Radio>
                  <Radio :label="1">男</Radio>
                  <Radio :label="2">女</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="出生日期" prop="birthday">
                 <DatePicker type="date"  v-model="customerTemp.birthday" placeholder="请选择" style="width:100%;"></DatePicker>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
            <Col span="12">
              <Form-item label="联系地址" prop="contactAddress">
                <Input type="text" v-model="customerTemp.contactAddress" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="12">
               <Form-item label="渠道" prop="">
              <Select
                v-model="customerTemp.distributerId"
                placeholder="请选择"
                clearable
              >
                <Option
                  v-for="item in distributerList"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</Option>
              </Select>
            </Form-item>
              </Col>
          </Row>
         <Row :gutter="48">
            <Col span="12">
                <Form-item label="婚否" prop="maritalStatus">
                <Select v-model="customerTemp.maritalStatus"  placeholder="请选择" clearable>
                  <Option :value="0">未知</Option>
                  <Option :value="1">已婚</Option>
                  <Option :value="2">未婚</Option>
                  <Option :value="3">离异</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12" >
              <Form-item label="职业" prop="profession">
                <Input type="text" v-model="customerTemp.profession" :maxlength="50"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
             <Col span="12">
               <Form-item label="民族" prop="ethnic">
                <Input type="text" v-model="customerTemp.ethnic" :maxlength="20"></Input>
              </Form-item>
             </Col>
             <Col span="12">
              <Form-item label="血型" prop="bloodType">
                <Select v-model="customerTemp.bloodType" placeholder="请选择" clearable >
                  <Option value="未知">未知</Option>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="AB">AB</Option>
                  <Option value="O">O</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <!--顾客导入弹出层-->
      <Modal
      v-model="improtDialogFormVisible"
      title="顾客管理-数据导入"
      :loading="importLoading"
      @on-ok="importCustomer"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="1324"
      ok-text="提交"
      cancel-text="关闭">
        <div class="search-con search-con-top">
          <!--上传文件-->
          <Row>
            <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx"   class="search-input">
              <Button class="ivu-btn ivu-btn-success ivu-btn ivu-btn-default" icon="ios-cloud-upload-outline" :loading="uploadLoading">上传文件</Button>
            </Upload>
          </Row>
          <!--移除文件-->
          <Row>
            <div class="ivu-upload-list-file" v-if="file !== null">
              <Icon type="ios-stats"></Icon>
              {{file.name}}
              <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
            </div>
          </Row>
           <!--上传文件进度-->
          <Row>
            <transition name="fade">
              <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                <div v-if="progressPercent==100">
                  <Icon type="ios-checkmark-circle"></Icon>
                  <span>成功</span>
                </div>
              </Progress>
            </transition>
          </Row>
        </div>
        <div  style="height:400px;overflow-y:auto">
          <Table :data="uploadTableData" :columns="uploadTableColumns" :loading="tableLoading" height="400" border stripe></Table>
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import './index.less'
import { fetchList, editCustomer, addCustomer, getCustomerById, importCustomer } from '@/api/customer.js'
import { getAllDistributor } from '@/api/distributor.js'
import excel from '@/libs/excel'
export default {
  name: 'customer',
  filters: {
    genderFilter(gender) {
      const genderMap = ['未知', '男', '女']
      return genderMap[gender]
    },
    idTypeFilter(idType) {
      const idTypeMap = ['', '身份证', '香港身份证', '港澳通行证', '台湾通行证', '护照']
      return idTypeMap[idType]
    },
    maritalStatusFilter(maritalStatus) {
      const maritalStatusMap = ['未知', '已婚', '未婚', '离异']
      return maritalStatusMap[maritalStatus]
    }
  },
  data() {
    return {
      tableLoading: false,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        phone: ''
      },
      list: [],
      total: 0,
      tableColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize
          }
        },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        {
          title: '证件类型',
          key: 'idType',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.idTypeFilter(row.idType)
            return h(
              'div',
              text
            )
          }
        },
        { title: '证件号', key: 'idNumber', width: 185 },
        {
          title: '性别',
          key: 'gender',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.genderFilter(row.gender)
            return h(
              'div',
              text
            )
          }
        },
        { title: '民族', key: 'ethnic', tooltip: true },
        { title: '婚否',
          key: 'maritalStatus',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.maritalStatusFilter(row.maritalStatus)
            return h(
              'div',
              text
            )
          }
        },
        { title: '出生日期',
          key: 'birthday',
          tooltip: true,
          width: 125,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.birthday, 'yyyy-MM-dd')
            )
          }
        },
        { title: '血型', key: 'bloodType', tooltip: true },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 130,
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '3px 2px 2px 3px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'editCustomer' }
                  }
                ],
                on: {
                  click: () => {
                    this.handleUpdate(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '3px 2px 2px 3px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'customerView' }
                  }
                ],
                on: {
                  click: () => {
                    this.customerView(params.row)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      distributerList: [],
      editCustomer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      formLoading: true,
      customerTemp: {
        id: undefined,
        name: '',
        idNumber: '',
        idType: '',
        phone: '',
        gender: '',
        maritalStatus: 0,
        ethnic: '',
        bloodType: '未知',
        profession: '',
        birthday: '',
        contactAddress: '',
        distributerId: ''

      },
      rules: {
        name: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        idType: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        idNumber: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择', trigger: 'change' }
        ],
        phone: [
          { type: 'string',
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: '必填项,手机号格式不正确',
            trigger: 'blur'
          }
        ],
        gender: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        contactAddress: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      },
      // 导入顾客管理信息
      improtDialogFormVisible: false,
      importLoading: true,
      customerTemplateUrl: this.$fileUrl + 'template/customertemplate.xlsx',
      uploadLoading: false,
      file: null,
      showRemoveFile: false,
      progressPercent: 0,
      showProgress: false,
      uploadTableData: [],
      importCustomerTemp: {
        customerList: []
      },
      uploadTableColumns: [
        { type: 'index', title: '序号', width: 64, tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        {
          title: '证件类型',
          key: 'idType',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.idTypeFilter(row.idType)
            return h(
              'div',
              text
            )
          }
        },
        { title: '证件号', key: 'idNumber', width: 185 },
        {
          title: '性别',
          key: 'gender',
          width: 70,
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.genderFilter(row.gender)
            return h(
              'div',
              text
            )
          }
        },
        { title: '民族', key: 'ethnic', tooltip: true },
        { title: '婚否',
          key: 'maritalStatus',
          width: 70,
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.maritalStatusFilter(row.maritalStatus)
            return h(
              'div',
              text
            )
          }
        },
        { title: '出生日期',
          key: 'birthday',
          tooltip: true,
          width: 125,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.birthday, 'yyyy-MM-dd')
            )
          }
        },
        { title: '血型', key: 'bloodType', width: 70, tooltip: true },
        { title: '联系地址', key: 'contactAddress', tooltip: true },
        { title: '职业', key: 'profession', tooltip: true },
        {
          title: '渠道',
          key: 'distributerId',
          tooltip: true
        }
      ],
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      this.getAllDistributor()
      // 分页获取顾客列表
      this.getCustomerList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      this.getAllDistributor()
      // 分页获取顾客列表
      this.getCustomerList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  methods: {
    // 渠道数据s [shi]
    getAllDistributor() {
      getAllDistributor().then(res => {
        this.distributerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 分页获取顾客列表
    getCustomerList() {
      this.tableLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      })
    },
    // 顾客列表按条件查询
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getCustomerList()
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getCustomerList()
      }
    },
    // 打开新增顾客弹出框
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editCustomer = false
      this.resetCustomerTemp()
      this.$refs['customerForm'].resetFields()
    },
    // 身份证号格式验证
    isIdNumberCode(idType, idNumber) {
      if (idType === 1) {
        var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        return reg.test(idNumber)
      }
      return true
    },
    // 新增顾客信息
    createData() {
      this.$refs['customerForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 身份证号格式验证
        var isIdNumberCode = this.isIdNumberCode(this.customerTemp.idType, this.customerTemp.idNumber)
        if (!isIdNumberCode) {
          this.$Message.error('身份证号格式不正确')
          this.changeLoading()
          return false
        }
        addCustomer(this.customerTemp).then(res => {
          this.dialogFormVisible = false
          this.getCustomerList()
          this.changeLoading()
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    // 根据顾客id加载顾客信息
    getCustomerById(id) {
      getCustomerById(id).then(res => {
        this.customerTemp = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 打开修改顾客弹出框
    handleUpdate(row) {
      this.getCustomerById(row.id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editCustomer = true
      this.$refs['customerForm'].resetFields()
    },
    // 修改顾客信息
    updateData() {
      this.$refs['customerForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editCustomer(this.customerTemp).then(res => {
          this.dialogFormVisible = false
          this.getCustomerList()
          this.changeLoading()
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    // 重置表单页面赋值
    resetCustomerTemp() {
      this.customerTemp = {
        id: undefined,
        name: '',
        idNumber: '',
        idType: '',
        phone: '',
        gender: '',
        maritalStatus: 0,
        ethnic: '',
        bloodType: '',
        profession: '',
        birthday: '',
        contactAddress: '',
        distributerId: ''
      }
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.formLoading = false
      this.$nextTick(() => {
        this.formLoading = true
      })
    },
    // 下载模板
    downLoadFile() {
      window.location.href = this.customerTemplateUrl
    },
    // 点击导入按钮
    handleImport() {
      this.improtDialogFormVisible = true
      this.initUpload()
    },
    // 上传组件初始化
    initUpload() {
      this.file = null
      this.showProgress = false
      this.progressPercent = 0
      this.uploadTableData = []
    },
    // 上传文件前检查是否为exlce文件，文件类型正确则读取数据
    handleBeforeUpload(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 文件内容读取
    readFile(file) {
      const reader = new FileReader()
      // 读取文件
      reader.readAsArrayBuffer(file)
      // 开始上传文件，显示上传加载标志和进度条
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.showProgress = true
      }
      // 动态显示进度条
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      // 文件读取错误
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      // 文件读取成功，将数据显示在列表
      reader.onload = e => {
        this.$Notice.success({
          title: '用户上传',
          desc: '文件读取成功',
          duration: 4
        })
        const data = e.target.result
        const { results } = excel.read(data, 'array')
        const tableData = results.map(item => {
          let idType = 0
          if (item.证件类型 === '身份证') {
            idType = 1
          }
          if (item.证件类型 === '香港身份证') {
            idType = 2
          }
          if (item.证件类型 === '港澳通行证') {
            idType = 3
          }
          if (item.证件类型 === '台湾通行证') {
            idType = 4
          }
          if (item.证件类型 === '护照') {
            idType = 5
          }

          let maritalStatus = 0
          if (item.性别 === '已婚') {
            maritalStatus = 1
          }
          if (item.性别 === '未婚') {
            maritalStatus = 2
          }
          if (item.性别 === '离异') {
            maritalStatus = 3
          }

          let gender = 0
          if (item.性别 === '男') {
            gender = 1
          }
          if (item.性别 === '女') {
            gender = 2
          }
          // 转换日期格式
          item.出生日期 = this.$formatDate(item.出生日期, 'yyyy-MM-dd')
          return { name: item.顾客姓名, phone: item.手机号, idType: idType, idNumber: item.证件号, gender: gender, ethnic: item.民族, maritalStatus: maritalStatus, birthday: item.出生日期, bloodType: item.血型, contactAddress: item.联系地址, profession: item.职业, distributerId: item.渠道 }
        })
        this.uploadTableData = tableData
        this.uploadLoading = false
        this.showRemoveFile = true
      }
    },
    // 校验手机号格式
    isTelCode(str) {
      var reg = /^1[3456789]\d{9}$/
      return reg.test(str)
    },
    // 校验日期格式
    isDateCode(str) {
      var reg = /^(\d{4})-(\d{2})-(\d{2})$/
      return reg.test(str)
    },
    // 验证数据格式，只有有格式验证不通过就返回错误
    validateCode(uploadTableData) {
      var validateCode = true
      uploadTableData.forEach(element => {
        // 证件类型
        var idType = this.$options.filters.idTypeFilter(element.idType)
        // 验证出生日期格式
        var isDateCode = this.isDateCode(element.birthday)
        if (!isDateCode) {
          this.$Message.error(idType + element.idNumber + '的日期格式不正确')
          validateCode = validateCode && false
        }
        // 验证手机格式
        var isTelCode = this.isTelCode(element.phone)
        if (!isTelCode) {
          this.$Message.error(idType + element.idNumber + '的手机号格式不正确')
          validateCode = validateCode && false
        }
        // 验证身份证号格式
        var isIdNumberCode = this.isIdNumberCode(element.idType, element.idNumber)
        if (!isIdNumberCode) {
          this.$Message.error(this.$options.filters.idTypeFilter(element.idType) + element.idNumber + '的身份证号格式不正确')
          validateCode = validateCode && false
        }
        // 渠道验证
        const distributerName = element.distributerId
        if (distributerName) {
          const item = this.distributerList.find(m => m.name === distributerName)
          if (!item) {
            this.$Message.error(distributerName + ' 的渠道名称不存在')
            validateCode = validateCode && false
          }
        }
      })
      return validateCode
    },
    // 提交导入数据
    importCustomer() {
      // 导入数据不为空
      if (this.uploadTableData.length > 0) {
        let customerSet = new Set()
        this.uploadTableData.map(item => {
          customerSet.add(item.idType + item.idNumber)
        })
        let array = Array.from(customerSet)
        // 根据证件类型和证件号获取不重复的顾客信息
        if (array.length !== this.uploadTableData.length) {
          this.$Notice.warning({
            title: '提示',
            desc: '导入的文件中存在重复数据，请先删除后在导入!',
            duration: 4
          })
        } else {
          var validateCode = this.validateCode(this.uploadTableData)
          if (!validateCode) {
            this.changeImportLoading()
            return false
          }
          // 验证数据后转换渠道id数据，之前转换页面验证失败后会显示成功转换的id
          this.uploadTableData.forEach(element => {
            const distributerName = element.distributerId
            if (distributerName !== '') {
              const item = this.distributerList.find(m => m.name === distributerName)
              if (item) {
                element.distributerId = item.id
              }
            }
          })
          this.importCustomerTemp.customerList = this.uploadTableData
          importCustomer(this.importCustomerTemp).then(res => {
            this.improtDialogFormVisible = false
            this.getCustomerList()
            this.$Notice.success({
              title: '提示',
              desc: res.msg,
              duration: 4
            })
          }).catch(error => {
            this.improtDialogFormVisible = true
            this.$Notice.error({
              title: '提示',
              desc: error.msg,
              duration: 4
            })
          })
        }
      } else {
        this.$Notice.error({
          title: '提示',
          desc: '没有需要导入的数据',
          duration: 4
        })
      }
      this.changeImportLoading()
    },
    // 删除文件
    handleRemove() {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    // 重置loading状态 防止重复提交
    changeImportLoading() {
      this.importLoading = false
      this.$nextTick(() => {
        this.importLoading = true
      })
    },
    // 跳转到顾客信息查看
    customerView(row) {
      const route = {
        name: 'customerView',
        query: {
          customerId: row.id
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
<style scoped>
.ivu-table td{padding: 1px;}
</style>

