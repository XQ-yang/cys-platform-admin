<template>
  <div>
   <Form ref="sampleRegisterForm" :model="sampleTemp" :loading="registerFormLoading" :label-width="100" class="form-table" >
      <Card title="样本信息">
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="样本条码" prop="sampleCode">
                <Input type="text" v-model="sampleTemp.sampleCode" disabled ></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="样本类型" prop="sampleType">
                    <RadioGroup v-model="sampleTemp.sampleType">
                        <Radio v-for="item in sampleTypeList" :label="item.sampleTypeId" :key="item.sampleTypeId" disabled>
                               <span>{{item.sampleTypeName}}</span>
                        </Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="项目类型" prop="projectType">
                    <Select v-model="sampleTemp.projectType" clearable disabled>
                      <Option v-for="item in projectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                   </Select>
              </Form-item>
            </Col>
          </Row>
           <Row :gutter="48">
            <Col span="8">
              <Form-item label="采集医院" prop="collectHospita">
                <Select v-model="sampleTemp.collectHospita" placeholder="" disabled clearable>
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
                <Input type="text" v-model="sampleTemp.customerName" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="证件类型" prop="customerIdType">
                <Select v-model="sampleTemp.customerIdType"  placeholder="" disabled clearable>
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
                <Input type="text" v-model="sampleTemp.customerPhone" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="性别" prop="customerGender">
                <RadioGroup v-model="sampleTemp.customerGender" >
                  <Radio :label="0" disabled>未知</Radio>
                  <Radio :label="1" disabled>男</Radio>
                  <Radio :label="2" disabled>女</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="年龄" prop="age">
                <Input type="text" v-model="sampleTemp.age" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="血型" prop="customerBloodType">
                <Select v-model="sampleTemp.customerBloodType" placeholder="" disabled clearable>
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
                <Select v-model="sampleTemp.customerMaritalStatus"  placeholder="" disabled clearable>
                  <Option :value="0">未知</Option>
                  <Option :value="1">已婚</Option>
                  <Option :value="2">未婚</Option>
                  <Option :value="3">离异</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="职业" prop="customerProfession">
                <Input type="text" v-model="sampleTemp.customerProfession" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
            <Col span="16">
              <Form-item label="联系地址" prop="customerContactAddress">
                <Input type="text" v-model="sampleTemp.customerContactAddress" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="民族" prop="customerEthnic">
                <Input type="text" v-model="sampleTemp.customerEthnic" disabled></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
           <Col span="8">
              <Form-item label="健康调查" prop="healthSurvey">
                <RadioGroup v-model="sampleTemp.healthSurvey" >
                  <Radio :label="1" disabled>符合要求</Radio>
                  <Radio :label="2" disabled>不符合要求</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
              <Col span="16">
                <Form-item label="附件">
                  <Alert v-for="item in healthSurveyFileList" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
                </Form-item>
              </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="知情同意书" prop="informateConsent">
                 <RadioGroup v-model="sampleTemp.informateConsent" >
                  <Radio :label="1" disabled>已签订</Radio>
                  <Radio :label="2" disabled>未签订</Radio>
                </RadioGroup>
              </Form-item>
             </Col>
              <Col span="16">
                <Form-item label="附件">
                  <Alert v-for="item in informateConsentFileList" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
                </Form-item>
              </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="制备储存技术服务合同书" prop="storageTechnologyContract">
                <RadioGroup v-model="sampleTemp.storageTechnologyContract" >
                  <Radio :label="1" disabled>已签订</Radio>
                  <Radio :label="2" disabled>未签订</Radio>
                </RadioGroup>
              </Form-item>
             </Col>
              <Col span="16">
                <Form-item label="附件">
                  <Alert v-for="item in contractFileList" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
                </Form-item>
              </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <span>客户体检资料</span>
             </Col>
              <Col span="16">
                <Form-item label="附件">
                  <Alert v-for="item in physicalFileList" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
                </Form-item>
              </Col>
          </Row>
      </Card>
      <Card title="采集信息">
           <Row :gutter="48">
            <Col span="8">
              <Form-item label="采集时间" prop="collectTime">
                 <DatePicker type="datetime" v-model="sampleTemp.collectTime"  format="yyyy-MM-dd HH:mm" disabled  style="width:100%;"></DatePicker>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集地点" prop="collectSite">
                <Input type="text" v-model="sampleTemp.collectSite" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集人" prop="collector">
                <Input type="text" v-model="sampleTemp.collector" disabled></Input>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
          <Col span="8">
            <Row>
               <Col span="14">
                  <Form-item label="采集数量" prop="collectQuantity">
                    <Input type="text" v-model="sampleTemp.collectQuantity" :maxlength="11" disabled number></Input>
                  </Form-item>
                </Col>
                <Col span="10">
                  <Form-item label="" prop="collectQuantityUnit" :label-width="5">
                    <Select v-model="sampleTemp.collectQuantityUnit" placeholder="" disabled  clearable>
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
                   <Select v-model="sampleTemp.carrierId" :label-in-value="true" placeholder="" disabled filterable clearable>
                       <Option v-for="item in carrierList" :key="item.id" :value="item.id">{{item.realName}}</Option>
                   </Select>
              </Form-item>
            </Col>
            <CoL span="8">
            </Col> -->
      </Row>
      </Card>
          <div class="form-btn">
               <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close">关闭</Button>
          </div>
    </Form>
  </div>
</template>

<script>
import { getUserList as getCarrierList } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { getSampleById } from '@/api/collect.js'
import { mapMutations } from 'vuex'
import { getAge } from '@/libs/tools.js'
export default {
  name: 'sampleView',
  data() {
    return {
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
        age: '',
        // 采集信息
        healthSurvey: '',
        informateConsent: '',
        storageTechnologyContract: '',
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
      healthSurveyFileList: [],
      informateConsentFileList: [],
      contractFileList: [],
      physicalFileList: []
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
          getProjectTypeBySampleType(res.data.sampleCollect.sampleType).then(res => {
            // 填充项目类型列表数据
            this.projectTypeList = res.data
          }).then(() => {
            // 样本信息
            this.sampleTemp = res.data.sampleCollect
            // 顾客信息
            this.sampleTemp.customer = res.data.customer
            this.fillCustomerTemp(res.data.customer)
            // 健康调查文件
            if (res.data.healthSurveyFile && res.data.healthSurveyFile.length) {
              this.healthSurveyFileList = res.data.healthSurveyFile
            } else {
              this.healthSurveyFileList = []
            }
            // 知情同意书文件
            if (res.data.informateConsentFile && res.data.informateConsentFile.length) {
              this.informateConsentFileList = res.data.informateConsentFile
            } else {
              this.informateConsentFileList = []
            }
            // 制备存储技术服务合同书文件
            if (res.data.storageTechnologyContractFile && res.data.storageTechnologyContractFile.length) {
              this.contractFileList = res.data.storageTechnologyContractFile
            } else {
              this.contractFileList = []
            }
            // 客户体检资料
            if (res.data.physicalFile && res.data.physicalFile.length) {
              this.physicalFileList = res.data.physicalFile
            } else {
              this.physicalFileList = []
            }
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }
    },
    // 顾客对象赋值给临时对象
    fillCustomerTemp(customer) {
      this.sampleTemp.customerName = customer.name
      this.sampleTemp.age = getAge(customer.birthday)
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
    // 关闭查看
    close() {
      this.closeTag({
        name: 'sampleView',
        query: {
          sampleId: this.$route.query.sampleId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'sampleView' && this.sampleId !== this.$route.query.sampleId) {
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
