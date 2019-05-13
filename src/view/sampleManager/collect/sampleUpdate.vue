<template>
  <div>
   <Form ref="sampleRegisterForm" :model="sampleTemp" :rules="rules" :loading="registerFormLoading" :label-width="100" >
      <Card title="样本信息">
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="样本条码" prop="sampleCode">
                <Input type="text" v-model="sampleTemp.sampleCode" :maxlength="20" disabled ></Input>
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
            <Col span="8">
              <Form-item label="顾客姓名" prop="customerName">
                <Input type="text" v-model="sampleTemp.customerName" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="证件类型" prop="customerIdType">
                <Select v-model="sampleTemp.customerIdType" placeholder="请选择" disabled clearable>
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
                <Input type="text" v-model="sampleTemp.customerIdNumber" :maxlength="20" disabled></Input>
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
                <DatePicker type="date"  :value="sampleTemp.customerBirthday" @on-change="sampleTemp.customerBirthday=$event"  :options="maxDate"  placeholder="请选择"  style="width:100%;"></DatePicker>
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
                :default-file-list="defaultHealthSurveyFileList"
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
                :default-file-list="defaultInformateConsentFileList"
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
              <Form-item label="附件" prop="contractFile">
                <Upload
                ref="contractUpload"
                :action="actionUrl"
                :headers="headers"
                accept=".pdf, .png, .jpg, .jpeg"
                :default-file-list="defaultContractFileList"
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
            <Form-item label="附件">
                <Upload
                ref="physicalUpload"
                :action="actionUrl"
                :headers="headers"
                accept=".pdf, .png, .jpg, .jpeg"
                :default-file-list="defaultphysicalFileList"
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
          <Row :gutter="56">
            <Col span="8">
              <Form-item label="采集时间" prop="collectTime">
                 <DatePicker type="datetime" placeholder="请选择" :value="sampleTemp.collectTime" @on-change="sampleTemp.collectTime=$event" :options="maxDate"   format="yyyy-MM-dd HH:mm"  style="width:100%;" ></DatePicker>
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
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import { getUserList as getCarrierList, getUserInfo } from '@/api/user'
import { getUnDeleteProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { getSampleById, updateSample } from '@/api/collect.js'
import { mapMutations } from 'vuex'
export default {
  name: 'sampleUpdate',
  data() {
    return {
      maxDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      registerFormLoading: true,
      sampleTypeList: [],
      projectTypeList: [],
      carrierList: [],
      hospitalList: [],
      sampleId: '',
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
        customerMaritalStatus: '',
        customerEthnic: '',
        customerBloodType: '',
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
        collectQuantity: 0,
        collectQuantityUnit: 0,
        carrierId: '',
        carrier: ''
      },
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { 'Authorization': getToken() },
      defaultHealthSurveyFileList: [],
      defaultInformateConsentFileList: [],
      defaultContractFileList: [],
      defaultphysicalFileList: [],
      rules: {
        sampleCode: [
          { type: 'string',
            required: true,
            message: '必填项，不能为空',
            trigger: 'change'
          },
          { type: 'string',
            required: true,
            pattern: /^[0-9a-zA-Z]+$/,
            message: '样本条码格式不正确',
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
          { required: true, message: '请选择', trigger: 'change' }
        ],
        collectQuantity: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项，请输入正整数',
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
          { required: true, message: '请选择', trigger: 'change' }
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
            message: '必填项，不能为空',
            trigger: 'change'
          },
          { type: 'string',
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        customerGender: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
        ],
        customerContactAddress: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 获取承运人
    this.getCarrierList()
    // 加载样本信息
    this.getSampleInformation()
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
    // 加载样本信息
    getSampleInformation() {
      this.sampleId = this.$route.query.sampleId
      if (this.sampleId) {
        getSampleById(this.sampleId).then(res => {
          getUnDeleteProjectTypeBySampleType(res.data.sampleCollect.sampleType).then(res => {
            // 填充项目类型列表数据
            this.projectTypeList = res.data
          }).then(() => {
            // 样本信息
            this.sampleTemp = res.data.sampleCollect
            // 顾客信息
            this.sampleTemp.customer = res.data.customer
            this.fillCustomerTemp(res.data.customer)
            // 已上传健康调查文件列表
            if (res.data.healthSurveyFile && res.data.healthSurveyFile.length) {
              this.defaultHealthSurveyFileList = res.data.healthSurveyFile.map(media => {
                media.name = media.originalMediaName
                media.url = media.mediaPath
                return media
              })
            } else {
              this.defaultHealthSurveyFileList = []
            }
            // 已上传知情同意书文件列表
            if (res.data.informateConsentFile && res.data.informateConsentFile.length) {
              this.defaultInformateConsentFileList = res.data.informateConsentFile.map(media => {
                media.name = media.originalMediaName
                media.url = media.mediaPath
                return media
              })
            } else {
              this.defaultInformateConsentFileList = []
            }
            // 已上传制备存储技术服务合同书文件列表
            if (res.data.storageTechnologyContractFile && res.data.storageTechnologyContractFile.length) {
              this.defaultContractFileList = res.data.storageTechnologyContractFile.map(media => {
                media.name = media.originalMediaName
                media.url = media.mediaPath
                return media
              })
            } else {
              this.defaultContractFileList = []
            }
            // 已上传客户体检资料文件列表
            if (res.data.physicalFile && res.data.physicalFile.length) {
              this.defaultphysicalFileList = res.data.physicalFile.map(media => {
                media.name = media.originalMediaName
                media.url = media.mediaPath
                return media
              })
            } else {
              this.defaultphysicalFileList = []
            }
          }).catch(error => {
            this.$Message.error(error.msg)
          })
          // 采集人(修改为当前登录用户)
          this.getUserInfo()
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }
    },
    // 顾客对象赋值给临时对象
    fillCustomerTemp(customer) {
      this.sampleTemp.customerName = customer.name
      this.sampleTemp.customerBirthday = customer.birthday
      this.sampleTemp.customerIdType = customer.idType
      this.sampleTemp.customerIdNumber = customer.idNumber
      this.sampleTemp.customerPhone = customer.phone
      this.sampleTemp.customerGender = customer.gender
      this.sampleTemp.customerContactAddress = customer.contactAddress
      this.sampleTemp.customerMaritalStatus = customer.maritalStatus
      this.sampleTemp.customerEthnic = customer.ethnic
      this.sampleTemp.customerBloodType = customer.bloodType
      this.sampleTemp.customerProfession = customer.profession
    },
    // 赋值将验证正确的临时对象赋值给顾客对象
    fillCustomer(sampleTemp) {
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

        this.fillCustomer(this.sampleTemp)
        updateSample(this.sampleTemp).then(res => {
          this.changeLoading()
          this.$Message.success('提交成功')
          this.closeTag({
            name: 'sampleUpdate',
            query: {
              id: 'sampleUpdate',
              sampleId: this.$route.query.sampleId
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
        name: 'sampleUpdate',
        query: {
          id: 'sampleUpdate',
          sampleId: this.$route.query.sampleId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'sampleUpdate' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取承运人
      this.getCarrierList()
      // 加载样本信息
      this.getSampleInformation()
    }
  }
}
</script>
