<template>
  <div>
   <Form ref="sampleRegisterForm" :model="sampleTemp" :rules="rules" :loading="registerFormLoading" :label-width="100" >
      <Card title="样本信息">
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="样本条码" prop="sampleCode">
                <Input type="text" v-model="sampleTemp.sampleCode" :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="样本类型" prop="sampleType">
                    <RadioGroup v-model="sampleTemp.sampleType" @on-change="changeSampleType($event)"  >
                        <Radio v-for="item in sampleTypeList" :label="item.sampleTypeId" :key="item.sampleTypeId">
                               <span>{{item.sampleTypeName}}</span>
                        </Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="项目类型" prop="projectType">
                   <Select v-model="sampleTemp.projectType" placeholder="请选择"  clearable>
                      <Option v-for="item in projectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                   </Select>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
            <Col span="8">
              <Form-item label="采集医院" prop="collectHospita">
                <Select v-model="sampleTemp.collectHospita" placeholder="请选择"  clearable>
                  <Option v-for="item in hospitalList" :key="item.id" :value="item.id" >{{item.hospitalName}}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
      </Card>
      <Card title="供者资料">
        <Row :gutter="48" style="position:relative;">
            <div style="position:absolute; width:120px;height:25px; left:120px; top:-54px;"> <a @click="choiceExistCustomer" title="选择已有顾客"><Icon type="md-people" size="30"  style="color:#25b4b8;"/></a></div>
            <Col span="8">
              <Form-item label="顾客姓名" prop="customerName">
                <Input type="text" v-model="sampleTemp.customerName" :maxlength="50" ></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="证件类型" prop="customerIdType">
                <Select v-model="sampleTemp.customerIdType" v-bind:disabled="editCustomer"  placeholder="请选择" clearable>
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
                <Input type="text" v-model="sampleTemp.customerIdNumber" v-bind:disabled="editCustomer" :maxlength="20"></Input>
              </Form-item>
            </Col>
          </Row>
        <Row :gutter="48">
            <Col span="8">
              <Form-item label="手机号" prop="customerPhone">
                <Input type="text" v-model="sampleTemp.customerPhone" :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="性别" prop="customerGender">
                <RadioGroup v-model="sampleTemp.customerGender" >
                  <Radio :label="0">未知</Radio>
                  <Radio :label="1">男</Radio>
                  <Radio :label="2">女</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="出生日期" prop="customerBirthday">
                <DatePicker type="date"  v-model="sampleTemp.customerBirthday" :options="maxDate" placeholder="请选择" style="width:100%;"></DatePicker>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="血型" prop="customerBloodType">
                <Select v-model="sampleTemp.customerBloodType" placeholder="请选择" clearable>
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
                <Select v-model="sampleTemp.customerMaritalStatus"  placeholder="请选择" clearable>
                  <Option :value="0">未知</Option>
                  <Option :value="1">已婚</Option>
                  <Option :value="2">未婚</Option>
                  <Option :value="3">离异</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="职业" prop="customerProfession">
                <Input type="text" v-model="sampleTemp.customerProfession" :maxlength="50"></Input>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
            <Col span="16">
              <Form-item label="联系地址" prop="customerContactAddress">
                <Input type="text" v-model="sampleTemp.customerContactAddress" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="民族" prop="customerEthnic">
                <Input type="text" v-model="sampleTemp.customerEthnic"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
          <Col span="8">
              <Form-item label="健康调查" prop="healthSurvey">
                <RadioGroup v-model="sampleTemp.healthSurvey" >
                  <Radio :label="1">符合要求</Radio>
                  <Radio :label="2">不符合要求</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="16">
              <Form-item label="附件" prop="healthSurveyFile">
                <Upload
                ref="healthSurveyUpload"
                :action="actionUrl"
                :headers="headers"
                accept=".pdf, .png, .jpg, .jpeg"
                :before-upload="healthSurveyBeforeUpload"
                :max-size="102400"
                :on-exceeded-size="healthSurveyMaxSize"
                :on-success="healthSurveyUploadSuccess"
                :on-preview="healthSurveyUploadPreview"
                multiple
                paste >
                  <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传png, jpg, jpeg或pdf格式的文件,最大100M)</span>
                </Upload>
              </Form-item>
            </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
              <Form-item label="知情同意书" prop="informateConsent">
                 <RadioGroup v-model="sampleTemp.informateConsent" >
                  <Radio :label="1">已签订</Radio>
                  <Radio :label="2">未签订</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="16">
              <Form-item label="附件" prop="informateConsentFile">
                <Upload
                ref="informateConsentUpload"
                :action="actionUrl"
                :headers="headers"
                accept=".pdf, .png, .jpg, .jpeg"
                :before-upload="informateConsentBeforeUpload"
                :max-size="102400"
                :on-exceeded-size="informateConsentMaxSize"
                :on-success="informateConsentUploadSuccess"
                :on-preview="informateConsentUploadPreview"
                multiple
                paste >
                  <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传png, jpg, jpeg或pdf格式的文件,最大100M)</span>
                </Upload>
              </Form-item>
            </Col>
        </Row>
        <Row :gutter="48">
           <Col span="8">
              <Form-item label="制备储存技术服务合同书" prop="storageTechnologyContract">
                <RadioGroup v-model="sampleTemp.storageTechnologyContract" >
                  <Radio :label="1">已签订</Radio>
                  <Radio :label="2">未签订</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="16">
              <Form-item label="附件" prop="storageTechnologyContractFile">
                <Upload
                ref="contractUpload"
                :action="actionUrl"
                :headers="headers"
                accept=".pdf, .png, .jpg, .jpeg"
                :before-upload="contractBeforeUpload"
                :max-size="102400"
                :on-exceeded-size="contractMaxSize"
                :on-success="contractUploadSuccess"
                :on-preview="contractUploadPreview"
                multiple
                paste >
                  <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传png, jpg, jpeg或pdf格式的文件,最大100M)</span>
                </Upload>
              </Form-item>
            </Col>
        </Row>
        <Row :gutter="48">
           <Col span="8">
              <span>客户体检资料</span>
            </Col>
            <Col span="16">
              <Form-item label="附件" prop="physicalFile">
                <Upload
                ref="physicalUpload"
                :action="actionUrl"
                :headers="headers"
                accept=".pdf, .png, .jpg, .jpeg"
                :before-upload="physicalBeforeUpload"
                :max-size="102400"
                :on-exceeded-size="physicalMaxSize"
                :on-success="physicalUploadSuccess"
                :on-preview="physicalUploadPreview"
                multiple
                paste >
                  <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传png, jpg, jpeg或pdf格式的文件,最大100M)</span>
                </Upload>
              </Form-item>
            </Col>
        </Row>
      </Card>
      <Card title="采集信息">
         <Row :gutter="48">
            <Col span="8">
              <Form-item label="采集时间" prop="collectTime">
                 <DatePicker type="datetime" placeholder="请选择" v-model="sampleTemp.collectTime" :options="maxDate" format="yyyy-MM-dd HH:mm" style="width:100%;" ></DatePicker>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集地点" prop="collectSite">
                <Input type="text" v-model="sampleTemp.collectSite" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集人" prop="collector">
                <Input type="text" v-model="sampleTemp.collector" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
          <Col span="8">
            <Row>
               <Col span="14">
                  <Form-item label="采集数量" prop="collectQuantity">
                    <Input type="text" v-model="sampleTemp.collectQuantity" :maxlength="11"></Input>
                  </Form-item>
                </Col>
                <Col span="10">
                  <Form-item label="" prop="collectQuantityUnit" :label-width="5">
                    <Select v-model="sampleTemp.collectQuantityUnit" placeholder="请选择"  clearable>
                          <Option :value="1">管</Option>
                          <Option :value="2">个</Option>
                          <Option :value="3">ml</Option>
                      </Select>
                  </Form-item>
                </Col>
            </Row>
          </Col>
          <!-- <Col span="8">
              <Form-item label="承运人" prop="carrierId">
                   <Select v-model="sampleTemp.carrierId" :label-in-value="true" placeholder="请选择" filterable clearable>
                       <Option v-for="item in carrierList" :key="item.id" :value="item.id">{{item.realName}}</Option>
                   </Select>
              </Form-item>
            </Col>
            <CoL span="8">
            </Col> -->
      </Row>
      </Card>
           <div class="form-btn">
               <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
               <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
          </div>
    </Form>
    <!--弹出层（选择已有顾客）-->
      <Modal
      v-model="dialoExistCustomerFormVisible"
      title="选择已有顾客"
      :loading="dialogExistCustomerLoading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide = "true"
      width="1100">
      <!--顾客信息查询条件-->
      <div class="search-con search-con-top">
        <Input v-model="customerQuery.name" @on-change="handleClear" placeholder="顾客姓名" class="search-input"  style="width:200px;" clearable />
        <Input v-model="customerQuery.phone" @on-change="handleClear" placeholder="手机号" class="search-input"  style="width:200px;" clearable  />
        <Input v-model="customerQuery.idNumber" @on-change="handleClear" placeholder="证件号" class="search-input"  style="width:200px;" clearable   />
        <Button @click="handleSearch" class="search-btn">搜索</Button>
      </div>
      <!--列表-->
      <Table ref="customerRowTable"  :data="customerList" :columns="customerColumns" :loading="customLoading" @on-row-dblclick="handleRowChange" height="350" stripe border highlight-row></Table>
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
            next-text="下一页"></Page>
        </div>
      </div>
      </Modal>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import { getUserList as getCarrierList, getUserInfo } from '@/api/user'
import { fetchList as getCustomerList } from '@/api/customer'
import { getUnDeleteProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { createSample } from '@/api/collect.js'
import { mapMutations } from 'vuex'
export default {
  name: 'unReserveCreate',
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
      maxDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      editCustomer: false,
      registerFormLoading: true,
      sampleTypeList: [],
      projectTypeList: [],
      carrierList: [],
      hospitalList: [],
      // 样本信息表单
      sampleTemp: {
        // 供者资料
        customerId: '',
        customerName: '',
        customerBirthday: '',
        customerIdType: '',
        customerIdNumber: '',
        customerPhone: '',
        customerGender: '',
        customerContactAddress: '',
        customerMaritalStatus: 0,
        customerEthnic: '',
        customerBloodType: '未知',
        customerProfession: '',
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
        },
        // 样本基础信息
        id: undefined,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        originSampleId: '',
        originSampleCode: '',
        // 采集信息
        healthSurvey: '',
        informateConsent: '',
        storageTechnologyContract: '',
        healthSurveyFile: '',
        informateConsentFile: '',
        storageTechnologyContractFile: '',
        physicalFile: '',
        collectHospita: '',
        collectTime: new Date(),
        collectSite: '',
        collectorId: '',
        collector: '',
        collectQuantity: '',
        collectQuantityUnit: '',
        carrierId: '',
        carrier: ''
      },
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { 'Authorization': getToken() },
      rules: {
        sampleCode: [
          { type: 'string',
            required: true,
            pattern: /^[0-9a-zA-Z]+$/,
            message: '必填项,样本条码格式不正确',
            trigger: 'blur'
          }
        ],
        sampleType: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        projectType: [
          { type: 'string', required: true, message: '请选择', trigger: 'change' }
        ],
        healthSurvey: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        informateConsent: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        storageTechnologyContract: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        collectTime: [
          { type: 'date', required: true, message: '请选择', trigger: 'change' }
        ],
        collectQuantity: [
          { type: 'string',
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项,请输入正整数',
            trigger: 'blur'
          }
        ],
        collectQuantityUnit: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        carrierId: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        // 子对象顾客信息验证
        customerName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        customerBirthday: [
          { type: 'date', required: true, message: '请选择', trigger: 'change' }
        ],
        customerIdType: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        customerIdNumber: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        customerPhone: [
          { type: 'string',
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: '必填项,手机号格式不正确',
            trigger: 'blur'
          }
        ],
        customerGender: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        customerContactAddress: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
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
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.customerQuery.pageNumber - 1) * this.customerQuery.pageSize
          }
        },
        { title: '顾客姓名', key: 'name' },
        { title: '手机号', key: 'phone', width: 130 },
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
        { title: '证件号', key: 'idNumber', width: 190 },
        {
          title: '性别',
          key: 'Gender',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.genderFilter(row.gender)
            return h(
              'div',
              text
            )
          }
        },
        { title: '婚否',
          key: 'maritalStatus',
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
          width: 125,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.birthday, 'yyyy-MM-dd')
            )
          } },
        { title: '血型', key: 'bloodType' }
      ]
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 采集人
    this.getUserInfo()
    // 获取承运人
    this.getCarrierList()
    // 获取样本类型列表
    this.getSampleTypeList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 获取所有采集医院
    getAllHospital() {
      getAllHospital().then(res => {
        this.hospitalList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换样本类型时修改项目类型下拉数据
    changeSampleType(sampleType) {
      getUnDeleteProjectTypeBySampleType(sampleType).then(res => {
        this.sampleTemp.projectType = ''
        this.projectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取采集人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.sampleTemp.collector = res.data.realName
        this.sampleTemp.collectorId = res.data.id
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取承运人
    getCarrierList() {
      getCarrierList().then(res => {
        this.carrierList = res.data
      }).catch(error => {
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
      this.$refs['sampleRegisterForm'].fields.forEach(function(e) {
        if (e.prop === 'customerName' ||
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
      this.sampleTemp.customerId = currentRow.id
      this.sampleTemp.customerName = currentRow.name
      this.sampleTemp.customerPhone = currentRow.phone
      this.sampleTemp.customerBirthday = currentRow.birthday
      this.sampleTemp.customerIdType = currentRow.idType
      this.sampleTemp.customerIdNumber = currentRow.idNumber
      this.sampleTemp.customerGender = currentRow.gender
      this.sampleTemp.customerEthnic = currentRow.ethnic
      this.sampleTemp.customerMaritalStatus = currentRow.maritalStatus
      this.sampleTemp.customerBloodType = currentRow.bloodType
      this.sampleTemp.customerProfession = currentRow.profession
      this.sampleTemp.customerContactAddress = currentRow.contactAddress
    },
    // 赋值顾客信息
    fillCustomer(sampleTemp) {
      this.sampleTemp.customer.id = this.sampleTemp.customerId
      this.sampleTemp.customer.name = this.sampleTemp.customerName
      this.sampleTemp.customer.birthday = this.sampleTemp.customerBirthday
      this.sampleTemp.customer.idType = this.sampleTemp.customerIdType
      this.sampleTemp.customer.idNumber = this.sampleTemp.customerIdNumber
      this.sampleTemp.customer.phone = this.sampleTemp.customerPhone
      this.sampleTemp.customer.gender = this.sampleTemp.customerGender
      this.sampleTemp.customer.contactAddress = this.sampleTemp.customerContactAddress
      this.sampleTemp.customer.maritalStatus = this.sampleTemp.customerMaritalStatus
      this.sampleTemp.customer.ethnic = this.sampleTemp.customerEthnic
      this.sampleTemp.customer.bloodType = this.sampleTemp.customerBloodType
      this.sampleTemp.customer.profession = this.sampleTemp.customerProfession
    },
    // 身份证号格式验证
    isIdNumberCode(idType, idNumber) {
      if (idType === 1) {
        var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        var isIdNumberCode = reg.test(idNumber)
        if (!isIdNumberCode) {
          this.$Message.error('身份证号格式不正确')
          return false
        }
      }
      return true
    },
    healthSurveyBeforeUpload(file) {
      // 上传前先清空已上传的文件列表
      this.$refs.healthSurveyUpload.clearFiles()
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf' && fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是PDF或图片文件，请选择后缀为.pdf, .png, .jpg, .jpeg的文件进行上传。'
        })
        return false
      }
      return true
    },
    healthSurveyMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    // 打开选择上传文件
    healthSurveyUploadPreview(file) {
      window.open(file.mediaPath)
    },
    // 上传文件成功
    healthSurveyUploadSuccess(res, file, fileList) {
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
    informateConsentBeforeUpload(file) {
      // 上传前先清空已上传的文件列表
      this.$refs.informateConsentUpload.clearFiles()
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf' && fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是PDF或图片文件，请选择后缀为.pdf, .png, .jpg, .jpeg的文件进行上传。'
        })
        return false
      }
      return true
    },
    informateConsentMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    // 打开选择上传文件
    informateConsentUploadPreview(file) {
      window.open(file.mediaPath)
    },
    // 上传文件成功
    informateConsentUploadSuccess(res, file, fileList) {
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
    contractBeforeUpload(file) {
      // 上传前先清空已上传的文件列表
      this.$refs.contractUpload.clearFiles()
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf' && fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是PDF或图片文件，请选择后缀为.pdf, .png, .jpg, .jpeg的文件进行上传。'
        })
        return false
      }
      return true
    },
    contractMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    // 打开选择上传文件
    contractUploadPreview(file) {
      window.open(file.mediaPath)
    },
    // 上传文件成功
    contractUploadSuccess(res, file, fileList) {
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
    physicalBeforeUpload(file) {
      // 上传前先清空已上传的文件列表
      this.$refs.physicalUpload.clearFiles()
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf' && fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是PDF或图片文件，请选择后缀为.pdf, .png, .jpg, .jpeg的文件进行上传。'
        })
        return false
      }
      return true
    },
    physicalMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    // 打开选择上传文件
    physicalUploadPreview(file) {
      window.open(file.mediaPath)
    },
    // 上传文件成功
    physicalUploadSuccess(res, file, fileList) {
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
    // 提交表单，保存样本信息
    submit() {
      this.$refs['sampleRegisterForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.sampleTemp.healthSurveyFile = this.$refs.healthSurveyUpload.fileList.map(file => file.id)
        this.sampleTemp.informateConsentFile = this.$refs.informateConsentUpload.fileList.map(file => file.id)
        this.sampleTemp.storageTechnologyContractFile = this.$refs.contractUpload.fileList.map(file => file.id)
        this.sampleTemp.physicalFile = this.$refs.physicalUpload.fileList.map(file => file.id)

        // 身份证号格式验证
        var isIdNumberCode = this.isIdNumberCode(this.sampleTemp.customerIdType, this.sampleTemp.customerIdNumber)
        if (!isIdNumberCode) {
          this.changeLoading()
          return false
        }
        this.fillCustomer(this.sampleTemp)
        createSample(this.sampleTemp).then(res => {
          this.changeLoading()
          this.$Message.success('提交成功')
          this.closeTag({
            name: 'unReserveCreate',
            query: {
              id: 'unReserveCreate'
            }
          })
        }).catch(error => {
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
      this.closeTag({
        name: 'unReserveCreate',
        query: {
          id: 'unReserveCreate'
        }
      })
    }
  }
}
</script>
