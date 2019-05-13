<template>
  <div>
    <Form
      ref="contractRegisterForm"
      :model="contractTemp"
      :rules="rules"
      :loading="registerFormLoading"
      :label-width="100"
    >
      <Card title="合同信息">
        <Row :gutter="48">
          <Col span="12">
            <Form-item label="样本类型" prop="sampleType">
              <RadioGroup v-model="contractTemp.sampleType" @on-change="changeSampleType($event)">
                <Radio
                  v-for="item in sampleTypeList"
                  :label="item.sampleTypeId"
                  :key="item.sampleTypeId"
                >
                  <span>{{item.sampleTypeName}}</span>
                </Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="项目类型" prop="projectType">
              <Select
                v-model="contractTemp.projectType"
                placeholder="请选择"
                clearable
                :style="inputWdth"
              >
                <Option
                  v-for="item in projectTypeList"
                  :key="item.id"
                  :value="item.id"
                >{{item.projectTypeName}}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="12">
            <Form-item label="合同编号" prop="contractCode">
              <Input
                type="text"
                v-model="contractTemp.contractCode"
                :maxlength="50"
                :style="inputWdth"
              ></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="存储数量" prop="storageQuantity">
              <Input
                type="text"
                v-model="contractTemp.storageQuantity"
                :maxlength="11"
                :style="inputWdth"
                number
              ></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="12">
            <Form-item label="到期时间" prop="dueTime">
              <DatePicker
                type="datetime"
                placeholder="请选择"
                v-model="contractTemp.dueTime"
                format="yyyy-MM-dd"
                :style="inputWdth"
              ></DatePicker>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="金额" prop="amount">
              <Input
                type="text"
                v-model="contractTemp.amount"
                :maxlength="11"
                :style="inputWdth"
                number
              ></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <Card title="供者资料">
        <Row :gutter="48" style="position:relative;">
          <div style="position:absolute; width:120px;height:25px; left:120px; top:-54px;">
            <a @click="choiceExistCustomer" title="选择已有顾客">
              <Icon type="md-people" size="30" style="color:#25b4b8;"/>
            </a>
          </div>
          <Col span="8">
            <Form-item label="顾客姓名" prop="customerName">
              <Input type="text" v-model="contractTemp.customerName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="证件类型" prop="customerIdType">
              <Select v-model="contractTemp.customerIdType" disabled placeholder>
                <Option :value="1">身份证</Option>
                <Option :value="2">香港身份证</Option>
                <Option :value="3">港澳通行证</Option>
                <Option :value="4">台湾通行证</Option>
                <Option :value="5">护照</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="证件号" prop="customerIdNumber">
              <Input type="text" v-model="contractTemp.customerIdNumber" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="手机号" prop="customerPhone">
              <Input type="text" v-model="contractTemp.customerPhone" :maxlength="20"></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="性别" prop="customerGender">
              <RadioGroup v-model="contractTemp.customerGender">
                <Radio :label="0">未知</Radio>
                <Radio :label="1">男</Radio>
                <Radio :label="2">女</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="出生日期" prop="customerBirthday">
              <DatePicker
                type="date"
                v-model="contractTemp.customerBirthday"
                placeholder="请选择"
                style="width:100%;"
              ></DatePicker>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="血型" prop="customerBloodType">
              <Select v-model="contractTemp.customerBloodType" placeholder disabled>
                <Option value="未知">未知</Option>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="AB">AB</Option>
                <Option value="O">O</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="婚否" prop="customerMaritalStatus">
              <Select v-model="contractTemp.customerMaritalStatus" placeholder disabled>
                <Option :value="0">未知</Option>
                <Option :value="1">已婚</Option>
                <Option :value="2">未婚</Option>
                <Option :value="3">离异</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="职业" prop="customerProfession">
              <Input type="text" v-model="contractTemp.customerProfession" :maxlength="50" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="16">
            <Form-item label="联系地址" prop="customerContactAddress">
              <Input type="text" v-model="contractTemp.customerContactAddress" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="民族" prop="customerEthnic">
              <Input type="text" v-model="contractTemp.customerEthnic" disabled></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <Card title>
        <Row :gutter="12">
          <Col span="24">
            <Form-item
              label="上传合同附件"
              prop="contractFile"
              class="ivu-form-item-required"
              :label-width="120"
            >
              <Upload
                ref="upload"
                :action="actionUrl"
                :headers="headers"
                multiple
                paste
                accept=".pdf"
                :before-upload="handleBeforeUpload"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleUploadSuccess"
                :on-preview="handleUploadPreview"
                :on-remove="handleRemove"
              >
                <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button>
                <span style="margin-left:10px;font-size:12px;color:red;">(请上传pdf格式的文件,最大100M)</span>
              </Upload>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
        <Button
          class="ivu-btn ivu-btn-primary ivu-btn-large"
          style="margin-left:20px"
          @click="close"
        >关闭</Button>
      </div>
    </Form>
    <!--弹出层（选择已有顾客）-->
    <Modal
      v-model="dialoExistCustomerFormVisible"
      title="选择已有顾客"
      :loading="dialogExistCustomerLoading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="1100"
    >
      <!--顾客信息查询条件-->
      <div class="search-con search-con-top">
        <Input
          v-model="customerQuery.name"
          @on-change="handleClear"
          placeholder="顾客姓名"
          class="search-input"
          style="width:200px;"
          clearable
        />
        <Input
          v-model="customerQuery.phone"
          @on-change="handleClear"
          placeholder="手机号"
          class="search-input"
          style="width:200px;"
          clearable
        />
        <Input
          v-model="customerQuery.idNumber"
          @on-change="handleClear"
          placeholder="证件号"
          class="search-input"
          style="width:200px;"
          clearable
        />
        <Button @click="handleSearch" class="search-btn">搜索</Button>
      </div>
      <!--列表-->
      <Table
        ref="customerRowTable"
        :data="customerList"
        :columns="customerColumns"
        :loading="customLoading"
        @on-row-dblclick="handleRowChange"
        height="350"
        stripe
        border
        highlight-row
      ></Table>
      <!--分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="customerQuery.pageNumber"
            :page-size.sync="customerQuery.pageSize"
            @on-change="getCustomerList"
            show-total
            prev-text="上一页"
            next-text="下一页"
          ></Page>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import { fetchList as getCustomerList } from '@/api/customer'
import {
  getProjectTypeBySampleType,
  getSampleTypeList
} from '@/api/projectType.js'
import {
  addContract,
  isExistContractCode,
  getEditData
} from '@/api/contract.js'
import { deleteFileAndData } from '@/api/media.js'
import { mapMutations } from 'vuex'
export default {
  name: 'addContract',
  filters: {
    genderFilter(gender) {
      const genderMap = ['未知', '男', '女']
      return genderMap[gender]
    },
    idTypeFilter(idType) {
      const idTypeMap = [
        '',
        '身份证',
        '香港身份证',
        '港澳通行证',
        '台湾通行证',
        '护照'
      ]
      return idTypeMap[idType]
    },
    maritalStatusFilter(maritalStatus) {
      const maritalStatusMap = ['未知', '已婚', '未婚', '离异']
      return maritalStatusMap[maritalStatus]
    }
  },
  data() {
    const validateContractFile = (rule, value, callback) => {
      if (
        !this.$refs.upload.fileList ||
        this.$refs.upload.fileList.length <= 0
      ) {
        callback(new Error('请上传至少一已改pdf文件'))
      } else {
        callback()
      }
    }
    return {
      maxDate: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now()
        }
      },
      editCustomer: false,
      registerFormLoading: true,
      sampleTypeList: [],
      projectTypeList: [],
      mediaList: [],
      uploadList: [],
      // 合同信息表单
      oldcontractCode: '', // 编辑验证
      contractTemp: {
        id: undefined,
        projectType: '',
        sampleType: '',
        contractCode: '',
        customerId: '',
        storageQuantity: '',
        dueTime: '',
        amount: '',
        contractFile: '',
        customerName: '',
        customerBirthday: '',
        customerIdType: '',
        customerIdNumber: '',
        customerPhone: '',
        customerGender: '',
        customerContactAddress: '',
        customer: {
          id: '',
          name: '',
          phone: '',
          birthday: '',
          idType: '',
          idNumber: '',
          gender: '',
          maritalStatus: '',
          ethnic: '',
          bloodType: '',
          profession: '',
          contactAddress: ''
        }
      },
      rules: {
        contractCode: [
          {
            type: 'string',
            required: true,
            pattern: /^[0-9a-zA-Z]+$/,
            message: '必填项,合同编号格式不正确',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === this.oldcontractCode) {
                callback()
                return
              }
              isExistContractCode(value).then(res => {
                if (res.data) {
                  callback(new Error('合同编码已存在'))
                } else {
                  callback()
                }
              })
            },
            trigger: 'blur'
          }
        ],
        sampleType: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        projectType: [
          {
            type: 'string',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        dueTime: [
          { type: 'date', required: true, message: '请选择', trigger: 'change' }
        ],
        storageQuantity: [
          {
            type: 'integer',
            required: true,
            message: '请输入整数',
            trigger: 'blur'
          }
        ],
        amount: [
          {
            type: 'number',
            required: true,
            message: '请输入正数',
            trigger: 'blur'
          }
        ],
        // 子对象顾客信息验证
        customerName: [
          {
            type: 'string',
            required: true,
            message: '必填项，不能为空',
            trigger: 'blur'
          }
        ],
        customerBirthday: [
          { type: 'date', required: true, message: '请选择', trigger: 'change' }
        ],
        customerIdType: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        customerIdNumber: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        customerPhone: [
          {
            type: 'string',
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: '必填项,手机号格式不正确',
            trigger: 'blur'
          }
        ],
        customerGender: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        contracFile: [{ validator: validateContractFile, trigger: 'change' }]
      },
      // 选择已有顾客信息
      dialoExistCustomerFormVisible: false,
      dialogExistCustomerLoading: true,
      customLoading: true,
      customerQuery: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        phone: '',
        idNumber: ''
      },
      customerList: [],
      total: 0,
      customerColumns: [
        { type: 'index', title: '序号', width: 70 },
        { title: '顾客姓名', key: 'name' },
        { title: '手机号', key: 'phone', width: 130 },
        {
          title: '证件类型',
          key: 'idType',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.idTypeFilter(row.idType)
            return h('div', text)
          }
        },
        { title: '证件号', key: 'idNumber', width: 190 },
        {
          title: '性别',
          key: 'Gender',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.genderFilter(row.gender)
            return h('div', text)
          }
        },
        {
          title: '婚否',
          key: 'maritalStatus',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.maritalStatusFilter(
              row.maritalStatus
            )
            return h('div', text)
          }
        },
        {
          title: '出生日期',
          key: 'birthday',
          width: 125,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.birthday, 'yyyy-MM-dd')
            )
          }
        },
        { title: '血型', key: 'bloodType' }
      ],
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { Authorization: getToken() }
    }
  },
  mounted() {
    // 获取样本类型列表
    this.getSampleTypeList()
    // 编辑处化数据
    this.initData()
  },
  computed: {
    inputWdth: function() {
      return 'width:200px'
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    initData() {
      let contractId = this.$route.query.contractId
      if (contractId) {
        this.contractTemp.id = contractId
        getEditData(contractId)
          .then(res => {
            this.contractTemp = Object.assign({}, res.data.contract)
            this.oldcontractCode = this.contractTemp.contractCode
            this.contractTemp.customerId = res.data.customer.id
            this.contractTemp.customerName = res.data.customer.name
            this.contractTemp.customerPhone = res.data.customer.phone
            this.contractTemp.customerBirthday = res.data.customer.birthday
            this.contractTemp.customerIdType = res.data.customer.idType
            this.contractTemp.customerIdNumber = res.data.customer.idNumber
            this.contractTemp.customerGender = res.data.customer.gender
            this.contractTemp.customerEthnic = res.data.customer.ethnic
            this.contractTemp.customerMaritalStatus =
              res.data.customer.maritalStatus
            this.contractTemp.customerBloodType = res.data.customer.bloodType
            this.contractTemp.customerProfession = res.data.customer.profession
            this.contractTemp.customerContactAddress =
              res.data.customer.contactAddress
            this.contractTemp.customer = Object.assign({}, res.data.customer)

            this.mediaList = res.data.mediaList
            this.refreshUploadList()
            getProjectTypeBySampleType(res.data.contract.sampleType)
              .then(res => {
                this.projectTypeList = res.data
              })
              .catch(error => {
                this.$Message.error(error.msg)
              })
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      }
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList()
        .then(res => {
          this.sampleTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 切换样本类型时修改项目类型下拉数据
    changeSampleType(sampleType) {
      getProjectTypeBySampleType(sampleType)
        .then(res => {
          this.contractTemp.projectType = ''
          this.projectTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 选择已有客户(打开弹出层)
    choiceExistCustomer() {
      this.dialoExistCustomerFormVisible = true
      this.getCustomerList()
    },
    // 顾客信息按条件查询
    handleSearch() {
      this.customerQuery.pageNumber = 1
      this.getCustomerList()
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getCustomerList()
      }
    },
    // 获取顾客列表数据
    getCustomerList() {
      this.dialogExistCustomerLoading = true
      getCustomerList(this.customerQuery).then(res => {
        this.customerList = res.data.list
        this.total = res.data.totalRow
        this.dialogExistCustomerLoading = false
        this.customLoading = false
      })
    },
    // 顾客信息选中事件，选中已有顾客并加载到样本信息登记页面
    handleRowChange(currentRow, oldCurrentRow) {
      // 重置顾客信息验证
      this.$refs['contractRegisterForm'].fields.forEach(function(e) {
        if (
          e.prop === 'customerName' ||
          e.prop === 'customerIdType' ||
          e.prop === 'customerIdNumber' ||
          e.prop === 'customerPhone' ||
          e.prop === 'customerGender' ||
          e.prop === 'customerBirthday' ||
          e.prop === 'customerBloodType' ||
          e.prop === 'customerMaritalStatus' ||
          e.prop === 'customerProfession' ||
          e.prop === 'customerContactAddress' ||
          e.prop === 'customerEthnic'
        ) {
          e.resetField()
        }
      })

      this.dialoExistCustomerFormVisible = false
      // 编辑证件类型，证件号不可修改
      this.editCustomer = true
      this.contractTemp.customerId = currentRow.id
      this.contractTemp.customerName = currentRow.name
      this.contractTemp.customerPhone = currentRow.phone
      if (currentRow.birthday) {
        this.contractTemp.customerBirthday = new Date(currentRow.birthday)
      }
      this.contractTemp.customerIdType = currentRow.idType
      this.contractTemp.customerIdNumber = currentRow.idNumber
      this.contractTemp.customerGender = currentRow.gender
      this.contractTemp.customerEthnic = currentRow.ethnic
      this.contractTemp.customerMaritalStatus = currentRow.maritalStatus
      this.contractTemp.customerBloodType = currentRow.bloodType
      this.contractTemp.customerProfession = currentRow.profession
      this.contractTemp.customerContactAddress = currentRow.contactAddress
    },
    // 赋值顾客信息
    fillCustomer(contractTemp) {
      this.contractTemp.customer.id = this.contractTemp.customerId
      this.contractTemp.customer.name = this.contractTemp.customerName
      this.contractTemp.customer.birthday = this.contractTemp.customerBirthday
      this.contractTemp.customer.idType = this.contractTemp.customerIdType
      this.contractTemp.customer.idNumber = this.contractTemp.customerIdNumber
      this.contractTemp.customer.phone = this.contractTemp.customerPhone
      this.contractTemp.customer.gender = this.contractTemp.customerGender
      this.contractTemp.customer.contactAddress = this.contractTemp.customerContactAddress
      this.contractTemp.customer.maritalStatus = this.contractTemp.customerMaritalStatus
      this.contractTemp.customer.ethnic = this.contractTemp.customerEthnic
      this.contractTemp.customer.bloodType = this.contractTemp.customerBloodType
      this.contractTemp.customer.profession = this.contractTemp.customerProfession
    },
    // 上传文件前检查上传文件的后缀名
    handleBeforeUpload(file) {
      const fileExt = file.name
        .split('.')
        .pop()
        .toLocaleLowerCase()
      if (fileExt !== 'pdf') {
        this.$Notice.warning({
          title: '文件类型错误',
          desc:
            '文件：' +
            file.name +
            '不是PDF文件，请选择后缀为.pdf的文件进行上传。'
        })
        return false
      }
      return true
    },
    handleMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    // 打开选择上传文件
    handleUploadPreview(file) {
      window.open(file.mediaPath || file.url)
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
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
      file.id = res.data.id
      file.mediaPath = res.data.mediaPath
      if (fileList && fileList.length > 0) {
        let start = 0
        for (let i = 0; i < fileList.length; i++) {
          let curFile = fileList[i]
          if (res.data.id === curFile.id) {
            start++
            if (start === 2) {
              this.$Message.error('该文件已在文件列表')
              fileList.splice(i, 1)
              return
            }
          }
        }
      }
    },
    refreshUploadList() {
      this.uploadList = this.mediaList
        .map(f => {
          return {
            id: f.id,
            name: f.name,
            url: f.url,
            status: 'finished'
          }
        })
        .concat(
          this.$refs.upload.fileList.map(file => {
            return {
              id: file.id,
              name: file.name,
              url: file.url,
              status: file.status
            }
          })
        )
    },
    handleRemove(item) {
      deleteFileAndData(item.id)
        .then(res => {
          if (res.data) {
            const fileList = this.$refs.upload.fileList
            let index = -1
            fileList.forEach((m, i) => {
              if (m.id === item.id) {
                index = i
              }
            })
            this.$refs.upload.fileList.splice(index, 1)
            this.uploadList.splice(index, 1)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(error => {
          this.changeLoading()
          this.$Message.error(error.msg)
        })
    },
    // 提交表单，保存样本信息
    submit() {
      this.$refs['contractRegisterForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }

        this.fillCustomer(this.contractTemp)
        this.contractTemp.contractFile = this.$refs.upload.fileList
          .map(file => file.id)
          .join(',')
        addContract(this.contractTemp)
          .then(res => {
            this.changeLoading()
            this.$Message.success('提交成功')
            this.close()
          })
          .catch(error => {
            this.changeLoading()
            this.$Message.error(error.msg)
          })
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.registerFormLoading = false
      this.$nextTick(() => {
        this.registerFormLoading = true
      })
    },
    // 关闭表单
    close() {
      if (this.contractTemp.id) {
        this.closeTag({
          name: 'editContract',
          query: {
            id: 'editContract',
            contractId: this.contractTemp.id
          }
        })
      } else {
        this.closeTag({
          name: 'addContract',
          query: {
            id: 'addContract'
          }
        })
      }
    }
  }
}
</script>
<style>
.upload-list {
  display: block;
  list-style: none; /*去掉小圆点*/
  margin-left: 32px;
}
.upload-list .upload-list-div {
  height: 28px;
  text-align: left;
  line-height: 28px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  width: auto;
  display: inline-block;
}
.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  /* left: 0; */
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  width: 24px;
  border-radius: 4px;
}
.upload-list:hover .upload-list-cover {
  display: block;
}
.upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 4px 4px 2px;
}
</style>
