<template>
  <div>
   <Form ref="sampleForm" :model="sampleTemp" :label-width="130">
      <Card title="样本信息">
          <Row :gutter="48" >
            <Col span="8">
              <Form-item label="顾客姓名" prop="customerName">
                <Input type="text" v-model="sampleTemp.customerName" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="手机号" prop="customerPhone">
                <Input type="text" v-model="sampleTemp.customerPhone" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集医院" prop="collectHospita">
                <Select v-model="sampleTemp.collectHospita" placeholder="" disabled clearable>
                  <Option v-for="item in hospitalList" :key="item.id" :value="item.id" >{{item.hospitalName}}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="样本条码" prop="sampleCode">
                <Input type="text" v-model="sampleTemp.sampleCode" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="样本类型" prop="sampleType">
                <RadioGroup v-model="sampleTemp.sampleType" >
                  <Radio v-for="item in sampleTypeList" :label="item.sampleTypeId" :key="item.sampleTypeId" disabled>
                    <span>{{item.sampleTypeName}}</span>
                  </Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="项目类型" prop="projectType">
                    <Select v-model="sampleTemp.projectType"  placeholder="" clearable disabled>
                      <Option v-for="item in projectTypeList" :key="item.id" :value="item.id">{{item.projectTypeName}}</Option>
                   </Select>
              </Form-item>
            </Col>
          </Row>
      </Card>
   </Form>
   <Form ref="ApplyViewForm" :model="outApplyTemp" :loading="ApplyViewFormLoading" :label-width="130" >
      <Card title="使用人信息">
           <Row :gutter="48">
              <Col span="8">
                <Form-item label="使用人姓名" prop="userName" >
                  <Input type="text" v-model="outApplyTemp.userName" :maxlength="50" disabled></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="性别" prop="userGender">
                  <RadioGroup v-model="outApplyTemp.userGender">
                    <Radio :label="0" disabled>未知</Radio>
                    <Radio :label="1" disabled>男</Radio>
                    <Radio :label="2" disabled>女</Radio>
                  </RadioGroup>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="年龄" prop="userAge">
                  <Input type="text" v-model="outApplyTemp.userAge" :maxlength="3" disabled></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="48">
              <Col span="8">
                <Form-item label="证件类型" prop="userIdType" >
                  <Select v-model="outApplyTemp.userIdType" placeholder="" clearable disabled>
                    <Option :value="1">身份证</Option>
                    <Option :value="2">香港身份证</Option>
                    <Option :value="3">港澳通行证</Option>
                    <Option :value="4">台湾通行证</Option>
                    <Option :value="5">护照</Option>
                  </Select>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="证件号" prop="userIdNumber">
                  <Input type="text" v-model="outApplyTemp.userIdNumber" :maxlength="20" disabled></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="手机号" prop="userTelephone">
                  <Input type="text" v-model="outApplyTemp.userTelephone" :maxlength="20" disabled></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="48">
             <Col span="8">
              <Form-item label="出库数量" prop="outQuantity" class="ivu-form-item-required">
                <Input type="text" v-model="outApplyTemp.outQuantity" disabled></Input>
              </Form-item>
            </Col>
             <Col span="8">
                <Form-item label="住院号" prop="userAdmissionNumber">
                  <Input type="text" v-model="outApplyTemp.userAdmissionNumber" :maxlength="20" disabled></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="转入培养" prop="isTransferCulture" >
                  <RadioGroup v-model="outApplyTemp.isTransferCulture">
                      <Radio :label="1" disabled>是</Radio>
                      <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
                     <a v-show="isEditCulture"  @click="editCulture" class="ivu-btn ivu-btn-success"  style="font-size:14px; margin-left:20px;">查看培养信息</a>
                </Form-item>
              </Col>
              <Col span="8">
              </Col>
            </Row>
          </Card>
          <Card title="运输信息">
             <Row :gutter="48">
               <Col span="8">
                <Form-item label="运输方式" prop="transportMode" >
                  <RadioGroup v-model="outApplyTemp.transportMode" >
                      <Radio :label="1" disabled>自提</Radio>
                      <Radio :label="2" disabled>异地运输</Radio>
                    </RadioGroup>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="取件人姓名" prop="pickerName">
                  <Input type="text" v-model="outApplyTemp.pickerName" disabled></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="手机号" prop="pickerPhone">
                  <Input type="text" v-model="outApplyTemp.pickerPhone" disabled></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="48">
              <Col span="8">
                <Form-item label="客户来源渠道" prop="customerSourceChannelId">
                   <Select v-model="outApplyTemp.customerSourceChannelId" :label-in-value="true" placeholder="" filterable clearable disabled>
                       <Option v-for="item in customerSourceChannelList" :key="item.id" :value="item.id">{{item.name}}</Option>
                   </Select>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="出库申请时间" prop="outStoreApplyTime" >
                  <DatePicker type="datetime" v-model="outApplyTemp.outStoreApplyTime"  format="yyyy-MM-dd HH:mm" placeholder="" style="width:100%;" disabled></DatePicker>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="出库申请人" prop="outStoreApplyUserName">
                  <Input type="text" v-model="outApplyTemp.outStoreApplyUserName" disabled></Input>
                </Form-item>
              </Col>
           </Row>
          </Card>
          <div class="form-btn">
              <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
          </div>
     </Form>
        <!--弹出层（转入培养）-->
          <Modal
          v-model="dialoTransferCultureVisible"
          title="转入培养"
          :loading="dialogTransferCultureLoading"
          class-name="vertical-center-modal"
          @on-ok="submitCulture()"
          :mask-closable="false"
          :footer-hide = "true"
          width="700">
          <Form ref="cultureForm" :model="cultureTemp" :label-width="90" style="padding-right:20px;">
              <Row>
                <Col span="12">
                  <Form-item label="样本条码" prop="sampleCode" >
                    <Input type="text" v-model="cultureTemp.sampleCode" :maxlength="20" disabled></Input>
                  </Form-item>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <Form-item label="样本类型" prop="sampleType">
                    <RadioGroup v-model="cultureTemp.sampleType" >
                      <Radio :label="1" disabled>自存</Radio>
                      <Radio :label="2" disabled>捐献</Radio>
                      <Radio :label="3" disabled>制备</Radio>
                    </RadioGroup>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="项目类型" prop="projectType">
                    <Select v-model="cultureTemp.projectType" placeholder=""  clearable disabled>
                      <Option v-for="item in cultureProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                    </Select>
                  </Form-item>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <Form-item label="接收时间" prop="receiveTime" >
                    <DatePicker type="datetime" v-model="cultureTemp.receiveTime" format="yyyy-MM-dd HH:mm" placeholder="" disabled></DatePicker>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="接收人" prop="receiverId">
                    <Select v-model="cultureTemp.receiverId" :label-in-value="true" placeholder="" filterable clearable disabled>
                      <Option v-for="item in receiverList" :key="item.id" :value="item.id">{{item.realName}}</Option>
                    </Select>
                  </Form-item>
                </Col>
              </Row>
          </Form>
      </Modal>
   </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { getOutApplyInfo } from '@/api/outApply.js'
import { getUserList as getReceiverList } from '@/api/user'
import { getAllDistributor } from '@/api/distributor'
export default {
  name: 'outStoreApplyView',
  data() {
    return {
      cellOutStoreId: '',
      sampleTypeList: [],
      // 样本信息表单
      projectTypeList: [],
      hospitalList: [],
      sampleTemp: {
        customerName: '',
        customerPhone: '',
        sampleCode: '',
        sampleType: '',
        projectType: ''
      },
      // 细胞出库申请信息
      ApplyViewFormLoading: true,
      customerSourceChannelList: [],
      outApplyTemp: {
        sampleId: '',
        userAdmissionNumber: '',
        userName: '',
        userGender: '',
        userAge: '',
        userIdType: '',
        userIdNumber: '',
        userTelephone: '',
        transportMode: 1,
        pickerId: '',
        pickerPhone: '',
        customerSourceChannel: '',
        outStoreApplyTime: new Date(),
        outStoreApplyUserName: '',
        outStoreApplyUserId: '',
        isTransferCulture: 2,
        // 转入培养样本信息
        culture: {
          sampleCode: '',
          sampleType: '',
          projectType: '',
          receiveTime: new Date(),
          receiverId: '',
          collectQuantity: '',
          collectQuantityUnit: ''
        }
      },
      // 转入培养表单信息
      isEditCulture: false,
      dialoTransferCultureVisible: false,
      dialogTransferCultureLoading: true,
      receiverList: [],
      cultureProjectTypeList: [],
      cultureTemp: {
        sampleCode: '',
        sampleType: 3,
        projectType: '',
        receiveTime: new Date(),
        receiverId: '',
        collectQuantity: '',
        collectQuantityUnit: ''
      }
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 加载出库申请信息
    this.getOutStoreInfo()
    // 获取所有渠道
    this.getAllDistributor()
    // 接收人下拉数据
    this.getReceiverList()
    // 默认培养样本只有制备
    this.cultureChangeSampleType(3)
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
    // 填充项目类型下拉框（培养样本信息）
    fillCultureProjectType(sampleType) {
      getProjectTypeBySampleType(sampleType).then(res => {
        this.cultureProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换样本类型时修改项目类型下拉数据（培养样本信息）
    cultureChangeSampleType(sampleType) {
      getProjectTypeBySampleType(sampleType).then(res => {
        this.cultureTemp.projectType = ''
        this.cultureProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 加载出库申请信息
    getOutStoreInfo() {
      this.cellOutStoreId = this.$route.query.cellOutStoreId
      getOutApplyInfo(this.cellOutStoreId).then(res => {
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          // 填充项目类型列表数据
          this.projectTypeList = res.data
        }).then(() => {
          // 样本信息
          this.sampleTemp = res.data.sample
          // 顾客信息
          this.sampleTemp.customerName = res.data.customer.name
          this.sampleTemp.customerPhone = res.data.customer.phone
          // 出库申请信息
          this.outApplyTemp = res.data.outstorage
          this.outApplyTemp.culture = {}
          // 编辑培养信息
          if (res.data.outstorage.isTransferCulture === 1) {
            this.isEditCulture = true
          }
          // 培养信息
          if (res.data.culture != null) {
            this.fillCultureProjectType(res.data.culture.sampleType)
            this.outApplyTemp.culture = res.data.culture
            this.cultureTemp = res.data.culture
          }
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取所有渠道
    getAllDistributor() {
      getAllDistributor().then(res => {
        this.customerSourceChannelList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取接收人
    getReceiverList() {
      getReceiverList().then(res => {
        this.receiverList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 查看培养信息
    editCulture() {
      this.dialoTransferCultureVisible = true
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'outStoreApplyView',
        query: {
          id: 'outStoreApplyView',
          cellOutStoreId: this.cellOutStoreId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'outStoreApplyView' && this.cellOutStoreId !== this.$route.query.cellOutStoreId) {
        this.cellOutStoreId = this.$route.query.cellOutStoreId
      }
    },
    cellOutStoreId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 加载出库申请信息
      this.getOutStoreInfo()
      // 获取所有渠道
      this.getAllDistributor()
      // 接收人下拉数据
      this.getReceiverList()
      // 默认培养样本只有制备
      this.cultureChangeSampleType(3)
    }
  }
}
</script>
