<template>
  <div>
    <!--样本信息-->
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
   <!--申请信息-->
   <Form ref="outApplyForm" :model="outApplyTemp" :label-width="130" >
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
              <Form-item label="出库数量" prop="outQuantity">
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
                  <DatePicker type="datetime" v-model="outApplyTemp.outStoreApplyTime"  format="yyyy-MM-dd HH:mm" placeholder="请选择" disabled></DatePicker>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="出库申请人" prop="outStoreApplyUserName">
                  <Input type="text" v-model="outApplyTemp.outStoreApplyUserName" disabled></Input>
                </Form-item>
              </Col>
           </Row>
          </Card>
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
     <!--库存出库信息-->
  <Form ref="outStockForm" :model="outStockTemp" :label-width="130" >
        <Card title="出库信息填写">
          <!--细胞位置信息及细胞信息-->
          <Row v-show="outCell" style="margin-left:0px;margin-bottom:0px;font-weight:bold">
              <Col span="8">
                <Form-item label="细胞出库位置:">
                </Form-item>
              </Col>
           </Row>
          <Table v-show="outCell" ref="cellSelection" :data="cellLocationList" :columns="cellLocationColumns" height="280"  border stripe></Table>
          <!--血清位置信息及血清信息-->
          <Row v-show="outSerum" style="margin-left:0px;font-weight:bold">
              <Col span="8">
                <Form-item label="血清出库位置:">
                </Form-item>
              </Col>
           </Row>
          <Table v-show="outSerum" ref="serumSelection" :data="serumLocationList" :columns="serumLocationColumns" height="280"  border stripe></Table>
          <!--细胞库存出库信息-->
            <Row :gutter="48" style="margin-top:20px;">
              <Col span="8">
                <Form-item label="出库时间" prop="outStoreTime" >
                  <DatePicker type="datetime" v-model="outStockTemp.outStoreTime" :options="maxDate"  format="yyyy-MM-dd HH:mm" placeholder="请选择" disabled></DatePicker>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="出库人" prop="outStoreUserName">
                  <Input type="text" v-model="outStockTemp.outStoreUserName" disabled></Input>
                </Form-item>
              </Col>
           </Row>
          </Card>
    </Form>
    <Form ref="outReviewForm" :model="outReviewTemp" :rules="rules" :label-width="130" >
       <Card title="审核信息填写">
            <Row :gutter="48">
              <Col span="7">
                <Form-item label="标识清晰完整" prop="isLogoClearComplete">
                      <RadioGroup v-model="outReviewTemp.isLogoClearComplete" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17"  style="padding-left:0;">
                <Input type="text" v-model="outReviewTemp.isLogoUnclearUncompleteReason" placeholder="如果选择否，请填写理由"  :maxlength="50"></Input>
              </Col>
           </Row>
            <Row :gutter="48">
              <Col span="7">
                <Form-item label="无可见异物" prop="isInvisibleForeign">
                      <RadioGroup v-model="outReviewTemp.isInvisibleForeign" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17" style="padding-left:0;">
                <Input type="text" v-model="outReviewTemp.isVisibleForeignReason" placeholder="如果选择否，请填写理由"  :maxlength="50"></Input>
              </Col>
          </Row>
          <Row :gutter="48">
              <Col span="7">
                <Form-item label="外观清洁无污染" prop="isAppearanceCleanNopollution">
                      <RadioGroup v-model="outReviewTemp.isAppearanceCleanNopollution" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17"  style="padding-left:0;">
                <Input type="text" v-model="outReviewTemp.isAppearanceUncleanPollutionReason" placeholder="如果选择否，请填写理由"  :maxlength="50"></Input>
              </Col>
          </Row>
          <Row :gutter="48">
              <Col span="7">
                <Form-item label="瓶口完好密封" prop="isBottleWellSealed">
                      <RadioGroup v-model="outReviewTemp.isBottleWellSealed" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17"  style="padding-left:0;">
                <Input type="text" v-model="outReviewTemp.isBottleBadUnsealedReason" placeholder="如果选择否，请填写理由" :maxlength="50"></Input>
              </Col>
          </Row>
          <Row :gutter="48">
              <Col span="7">
                <Form-item label="无细胞沉淀" prop="isCellNoprecipitation">
                      <RadioGroup v-model="outReviewTemp.isCellNoprecipitation" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="outReviewTemp.isCellPrecipitationReason" placeholder="如果选择否，请填写理由"  :maxlength="50"></Input>
              </Col>
          </Row>
          <Row :gutter="48">
              <Col span="7">
                <Form-item label="质检报告齐全" prop="isQualityComplete">
                      <RadioGroup v-model="outReviewTemp.isQualityComplete" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="outReviewTemp.isQualityUncompleteReason" placeholder="如果选择否，请填写理由"  :maxlength="50"></Input>
              </Col>
          </Row>
          <Row :gutter="48">
              <Col span="7">
                <Form-item label="同意出库" prop="isApprove">
                      <RadioGroup v-model="outReviewTemp.isApprove" >
                          <Radio :label="1">是</Radio>
                          <Radio :label="2">否</Radio>
                      </RadioGroup>
                </Form-item>
              </Col>
              <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="outReviewTemp.isUnApproveReason" placeholder="如果选择否，请填写理由"  :maxlength="50"></Input>
              </Col>
          </Row>
          <Row :gutter="48">
              <Col span="8">
                <Form-item  label="其他" prop="other">
                    <Input type="text" v-model="outReviewTemp.other"  :maxlength="50"></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item  label="审核时间" prop="reviewTime">
                  <DatePicker type="datetime" v-model="outReviewTemp.reviewTime" :options="maxDate" format="yyyy-MM-dd HH:mm" placeholder="请选择" style="width:100%;"></DatePicker>
                </Form-item>
              </Col>
                <Col span="8">
                <Form-item  label="审核人" prop="reviewer">
                  <Input type="text" v-model="outReviewTemp.reviewer" disabled></Input>
                </Form-item>
              </Col>
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
import { mapMutations } from 'vuex'
import { num2e } from '@/libs/tools.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { getUserList as getReceiverList, getUserInfo } from '@/api/user'
import { getAllDistributor } from '@/api/distributor'
import { getOutStockViewInfo } from '@/api/outStock.js'
import { addOutReview } from '@/api/outReview.js'
export default {
  name: 'outReviewOfStock',
  data() {
    return {
      maxDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
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
      // 出库申请信息
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
      receiverList: [],
      cultureProjectTypeList: [],
      dialoTransferCultureVisible: false,
      dialogTransferCultureLoading: true,
      cultureTemp: {
        sampleCode: '',
        sampleType: 3,
        projectType: '',
        receiveTime: new Date(),
        receiverId: '',
        collectQuantity: '',
        collectQuantityUnit: ''
      },
      // 库存出库
      outStockTemp: {
        id: '',
        cellLocationIds: [],
        serumLocationIds: [],
        outStoreTime: new Date(),
        outStoreUserName: '',
        outStoreUserId: ''
      },
      // 细胞信息及位置信息
      cellLocationList: [],
      cellLocationColumns: [
        { type: 'index', title: '序号', width: 70, tooltip: true },
        { title: '存储位置',
          key: 'potCode',
          width: 250,
          tooltip: true,
          render: (h, params) => {
            var location = params.row.potCode + ' 罐-' +
                           params.row.regionCode + ' 区-' +
                           params.row.towerCode + ' 塔-' +
                           params.row.boxCode + ' 盒-' +
                           params.row.latticeNum + ' 号管'
            return h(
              'div',
              location
            )
          }
        },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '细胞总量',
          key: 'cellTotal',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              num2e(params.row.cellTotal)
            )
          }
        },
        { title: '细胞活率',
          key: 'cellViability',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.cellViability + '%'
            )
          }
        },
        { title: '培养日期',
          key: 'cultureTime',
          width: 170,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      // 血清信息及位置信息
      serumLocationList: [],
      serumLocationColumns: [
        { type: 'index', title: '序号', width: 70, tooltip: true },
        { title: '存储位置',
          key: 'potCode',
          width: 250,
          tooltip: true,
          render: (h, params) => {
            var location = params.row.fridgeCode + ' 冰箱-' +
                           params.row.layerCode + ' 层-' +
                           params.row.rackCode + ' 架-' +
                           params.row.cuvetteNum + ' 号管'
            return h(
              'div',
              location
            )
          }
        },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '细胞总量',
          key: 'cellTotal',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              num2e(params.row.cellTotal)
            )
          }
        },
        { title: '细胞活率',
          key: 'cellViability',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.cellViability + '%'
            )
          }
        },
        { title: '培养日期',
          key: 'cultureTime',
          width: 170,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      // 审核信息
      outReviewFormLoading: true,
      outReviewTemp: {
        sampleId: '',
        cellOutStoreId: '',
        isLogoClearComplete: 1,
        isLogoUnclearUncompleteReason: '',
        isInvisibleForeign: 1,
        isVisibleForeignReason: '',
        isAppearanceCleanNopollution: 1,
        isAppearanceUncleanPollutionReason: '',
        isBottleWellSealed: 1,
        isBottleBadUnsealedReason: '',
        isCellNoprecipitation: 1,
        isCellPrecipitationReason: '',
        isQualityComplete: 1,
        isQualityUncompleteReason: '',
        other: '',
        reviewTime: new Date(),
        reviewerId: '',
        reviewer: '',
        isApprove: 1,
        isUnApproveReason: ''
      },
      rules: {
        isLogoClearComplete: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isInvisibleForeign: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isAppearanceCleanNopollution: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isBottleWellSealed: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isCellNoprecipitation: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isQualityComplete: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isApprove: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        reviewTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      },
      outSerum: false,
      outCell: false
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 获取所有渠道
    this.getAllDistributor()
    // 接收人下拉数据
    this.getReceiverList()
    // 默认培养样本只有制备
    this.cultureChangeSampleType(3)
    // 加载库存出库查看信息
    this.getOutStockViewInfo()
    // 审核人
    this.getUserInfo()
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
    // 获取审核人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.outReviewTemp.reviewer = res.data.realName
        this.outReviewTemp.reviewerId = res.data.id
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
    getOutStockViewInfo() {
      this.cellOutStoreId = this.$route.query.cellOutStoreId
      getOutStockViewInfo(this.cellOutStoreId).then(res => {
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          // 填充项目类型列表数据
          this.projectTypeList = res.data
        }).then(() => {
          // 出库细胞
          if (res.data.cellLocationList && res.data.cellLocationList.length > 0) {
            this.outCell = true
          }
          // 出库血清
          if (res.data.serumLocationList && res.data.serumLocationList.length > 0) {
            this.outSerum = true
          }
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
          // 库存出库信息
          this.outStockTemp.id = res.data.outstorage.id
          this.outStockTemp.outStoreUserName = res.data.outstorage.outStoreUserName
          this.cellLocationList = res.data.cellLocationList
          this.serumLocationList = res.data.serumLocationList
          // 审核信息
          this.outReviewTemp.sampleId = res.data.sample.id
          this.outReviewTemp.cellOutStoreId = res.data.outstorage.id
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 查看培养信息
    editCulture() {
      this.dialoTransferCultureVisible = true
    },
    // 选择否，必须填写理由
    validateReason() {
      if (this.outReviewTemp.isLogoClearComplete === 2 && this.outReviewTemp.isLogoUnclearUncompleteReason === '') {
        this.$Message.error('请填写标识不清晰完整理由')
        return false
      }
      if (this.outReviewTemp.isInvisibleForeign === 2 && this.outReviewTemp.isVisibleForeignReason === '') {
        this.$Message.error('请填写有可见异物理由')
        return false
      }
      if (this.outReviewTemp.isAppearanceCleanNopollution === 2 && this.outReviewTemp.isAppearanceUncleanPollutionReason === '') {
        this.$Message.error('请填写外观不清洁有污染理由')
        return false
      }
      if (this.outReviewTemp.isBottleWellSealed === 2 && this.outReviewTemp.isBottleBadUnsealedReason === '') {
        this.$Message.error('请填写瓶口不完好密封理由')
        return false
      }
      if (this.outReviewTemp.isCellNoprecipitation === 2 && this.outReviewTemp.isCellPrecipitationReason === '') {
        this.$Message.error('请填写有细胞沉淀理由')
        return false
      }
      if (this.outReviewTemp.isQualityComplete === 2 && this.outReviewTemp.isQualityUncompleteReason === '') {
        this.$Message.error('请填写质检报告不齐全理由')
        return false
      }
      if (this.outReviewTemp.isApprove === 2 && this.outReviewTemp.isUnApproveReason === '') {
        this.$Message.error('请填写不同意出库理由')
        return false
      }
      return true
    },
    // 提交表单，保存出库审核信息
    submit() {
      this.$refs['outReviewForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 选择否的请填写理由
        if (!this.validateReason()) {
          return false
        }
        addOutReview(this.outReviewTemp).then(res => {
          this.changeLoading()
          this.$Message.success('提交成功')
          this.closeTag({
            name: 'outReviewOfStock',
            query: {
              id: 'outReviewOfStock',
              cellOutStoreId: this.cellOutStoreId
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
      this.outReviewFormLoading = false
      this.$nextTick(() => {
        this.outReviewFormLoading = true
      })
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'outReviewOfStock',
        query: {
          id: 'outReviewOfStock',
          cellOutStoreId: this.cellOutStoreId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'outReviewOfStock' && this.cellOutStoreId !== this.$route.query.cellOutStoreId) {
        this.cellOutStoreId = this.$route.query.cellOutStoreId
      }
    },
    cellOutStoreId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取所有渠道
      this.getAllDistributor()
      // 接收人下拉数据
      this.getReceiverList()
      // 默认培养样本只有制备
      this.cultureChangeSampleType(3)
      // 加载库存出库查看信息
      this.getOutStockViewInfo()
      // 审核人
      this.getUserInfo()
    }
  }
}
</script>
