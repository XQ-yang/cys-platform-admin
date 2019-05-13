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
                    <Select v-model="sampleTemp.projectType" clearable disabled>
                      <Option v-for="item in projectTypeList" :key="item.id" :value="item.id">{{item.projectTypeName}}</Option>
                   </Select>
              </Form-item>
            </Col>
          </Row>
      </Card>
   </Form>
   <Form ref="outApplyForm" :model="outApplyTemp" :rules="rules" :loading="outApplyFormLoading" :label-width="130" >
      <Card title="使用人信息">
           <Row :gutter="48">
              <Col span="8">
                <Form-item label="使用人姓名" prop="userName" >
                  <Input type="text" v-model="outApplyTemp.userName" :maxlength="50"></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="性别" prop="userGender">
                  <RadioGroup v-model="outApplyTemp.userGender" >
                    <Radio :label="0">未知</Radio>
                    <Radio :label="1">男</Radio>
                    <Radio :label="2">女</Radio>
                  </RadioGroup>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="年龄" prop="userAge">
                  <Input type="text" v-model="outApplyTemp.userAge" :maxlength="3"></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="48">
              <Col span="8">
                <Form-item label="证件类型" prop="userIdType" >
                  <Select v-model="outApplyTemp.userIdType" placeholder="请选择" clearable>
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
                  <Input type="text" v-model="outApplyTemp.userIdNumber" :maxlength="20"></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="手机号" prop="userTelephone">
                  <Input type="text" v-model="outApplyTemp.userTelephone" :maxlength="20"></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="48">
             <Col span="8">
              <Form-item label="出库数量" prop="outQuantity">
                <Input type="text" v-model="outApplyTemp.outQuantity"></Input>
              </Form-item>
            </Col>
             <Col span="8">
                <Form-item label="住院号" prop="userAdmissionNumber">
                  <Input type="text" v-model="outApplyTemp.userAdmissionNumber" :maxlength="20"></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="转入培养" prop="isTransferCulture" >
                  <RadioGroup v-model="outApplyTemp.isTransferCulture"  @on-change="changeTransferCulture($event)"  >
                      <Radio :label="1">是</Radio>
                      <Radio :label="2">否</Radio>
                    </RadioGroup>
                     <a v-show="isEditCulture"  @click="editCulture" class="ivu-btn ivu-btn-success"  style="font-size:14px; margin-left:20px;">编辑培养信息</a>
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
                      <Radio :label="1">自提</Radio>
                      <Radio :label="2">异地运输</Radio>
                    </RadioGroup>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="取件人姓名" prop="pickerName">
                  <Input type="text" v-model="outApplyTemp.pickerName"></Input>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="手机号" prop="pickerPhone">
                  <Input type="text" v-model="outApplyTemp.pickerPhone"></Input>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="48">
              <Col span="8">
                <Form-item label="客户来源渠道" prop="customerSourceChannelId">
                   <Select v-model="outApplyTemp.customerSourceChannelId" :label-in-value="true" placeholder="请选择" filterable clearable>
                       <Option v-for="item in customerSourceChannelList" :key="item.id" :value="item.id">{{item.name}}</Option>
                   </Select>
                </Form-item>
              </Col>
              <Col span="8">
                <Form-item label="出库申请时间" prop="outStoreApplyTime" >
                  <DatePicker type="datetime" v-model="outApplyTemp.outStoreApplyTime" :options="maxDate"  format="yyyy-MM-dd HH:mm" placeholder="请选择"></DatePicker>
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
               <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
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
          width="700">
          <Form ref="cultureForm" :model="cultureTemp" :rules="cultureRules" :label-width="90" style="padding-right:20px;">
              <Row>
                <Col span="12">
                  <Form-item label="样本条码" prop="sampleCode" >
                    <Input type="text" v-model="cultureTemp.sampleCode" :maxlength="20"></Input>
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
                    <Select v-model="cultureTemp.projectType" placeholder="请选择"  clearable>
                      <Option v-for="item in cultureProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                    </Select>
                  </Form-item>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <Form-item label="接收时间" prop="receiveTime" >
                    <DatePicker type="datetime" v-model="cultureTemp.receiveTime" :options="maxDate"  format="yyyy-MM-dd HH:mm" placeholder="请选择" ></DatePicker>
                  </Form-item>
                </Col>
                <Col span="12">
                  <Form-item label="接收人" prop="receiverId">
                    <Select v-model="cultureTemp.receiverId" :label-in-value="true" placeholder="请选择" filterable clearable>
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
import { getUserList as getReceiverList, getUserInfo } from '@/api/user'
import { getAllDistributor } from '@/api/distributor'
import { addOutApply, getSampelById } from '@/api/outApply.js'
export default {
  name: 'outStoreApply',
  data() {
    const validateNumber = (rule, value, callback) => {
      var reg = /^\d+$/
      if (value && !reg.test(value)) {
        callback(new Error('请输入正整数或0'))
      } else {
        callback()
      }
    }
    const validateTelephone = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/
      if (value && !reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      maxDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      sampleId: '',
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
      outApplyFormLoading: true,
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
        outQuantity: '',
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
      rules: {
        transportMode: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        outStoreApplyTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        outQuantity: [
          { type: 'string',
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项,请输入正整数',
            trigger: 'blur'
          }
        ],
        userGender: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        userAge: [
          { validator: validateNumber }
        ],
        userTelephone: [
          { validator: validateTelephone }
        ],
        pickerPhone: [
          { validator: validateTelephone }
        ]
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
      },
      cultureRules: {
        sampleCode: [
          { type: 'string',
            required: true,
            pattern: /^[0-9a-zA-Z]+$/,
            message: '必填项,样本条码格式不正确',
            trigger: 'blur'
          }
        ],
        sampleType: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        projectType: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        collectQuantity: [
          { type: 'number', required: true, message: '请输入数字', trigger: 'blur' }
        ],
        collectQuantityUnit: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        receiverId: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        receiveTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 加载样本信息
    this.getSampleInformation()
    // 出库申请人
    this.getUserInfo()
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
    // 切换样本类型时修改项目类型下拉数据（培养样本信息）
    cultureChangeSampleType(sampleType) {
      getProjectTypeBySampleType(sampleType).then(res => {
        this.cultureTemp.projectType = ''
        this.cultureProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 加载样本信息
    getSampleInformation() {
      this.sampleId = this.$route.query.sampleId
      getSampelById(this.sampleId).then(res => {
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
          this.outApplyTemp.sampleId = this.sampleId
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
    // 获取出库申请人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.outApplyTemp.outStoreApplyUserName = res.data.realName
        this.outApplyTemp.outStoreApplyUserId = res.data.id
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
    // 编辑培养信息
    editCulture() {
      this.dialoTransferCultureVisible = true
    },
    // 切换是否培养
    changeTransferCulture(isTransferCulture) {
      if (isTransferCulture === 1) {
        this.isEditCulture = true
        this.dialoTransferCultureVisible = true
      } else {
        this.isEditCulture = false
        // 转入培养选择否，清空培养样本信息及表单
        this.cultureTemp.sampleCode = ''
        this.cultureTemp.sampleType = ''
        this.cultureTemp.projectType = ''
        this.cultureTemp.receiveTime = new Date()
        this.cultureTemp.receiverId = ''
        this.outApplyTemp.culture.sampleCode = ''
        this.outApplyTemp.culture.sampleType = ''
        this.outApplyTemp.culture.projectType = ''
        this.outApplyTemp.culture.receiveTime = new Date()
        this.outApplyTemp.culture.receiverId = ''
        this.outApplyTemp.culture.collectQuantity = ''
        this.outApplyTemp.culture.collectQuantityUnit = ''
      }
    },
    // 如果转入培养，则培养样本信息必填
    isCulture() {
      if (this.outApplyTemp.isTransferCulture === 1 &&
         (!this.outApplyTemp.culture.sampleCode ||
          !this.outApplyTemp.culture.sampleType ||
          !this.outApplyTemp.culture.projectType ||
          !this.outApplyTemp.culture.receiveTime ||
          !this.outApplyTemp.culture.receiverId)) {
        this.$Message.error('转入培养，请先完善培养样本信息')
        return false
      }
      return true
    },
    // 填写培养样本信息
    submitCulture() {
      this.$refs['cultureForm'].validate(valid => {
        if (!valid) {
          return this.cultureChangeLoading()
        }
        this.dialoTransferCultureVisible = false
        this.outApplyTemp.culture.sampleCode = this.cultureTemp.sampleCode
        this.outApplyTemp.culture.sampleType = this.cultureTemp.sampleType
        this.outApplyTemp.culture.projectType = this.cultureTemp.projectType
        this.outApplyTemp.culture.receiveTime = this.cultureTemp.receiveTime
        this.outApplyTemp.culture.receiverId = this.cultureTemp.receiverId
        this.outApplyTemp.culture.collectQuantity = this.cultureTemp.collectQuantity
        this.outApplyTemp.culture.collectQuantityUnit = this.cultureTemp.collectQuantityUnit
      })
    },
    // 重置loading状态 防止重复提交(培养样本表单)
    cultureChangeLoading() {
      this.dialogTransferCultureLoading = false
      this.$nextTick(() => {
        this.dialogTransferCultureLoading = true
      })
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
    // 提交表单，保存运输信息
    submit() {
      this.$refs['outApplyForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        if (!this.isCulture()) {
          return false
        }
        // 身份证号格式验证
        var isIdNumberCode = this.isIdNumberCode(this.outApplyTemp.userIdType, this.outApplyTemp.userIdNumber)
        if (!isIdNumberCode) {
          this.changeLoading()
          return false
        }
        addOutApply(this.outApplyTemp).then(res => {
          this.changeLoading()
          this.$Message.success('提交成功')
          this.closeTag({
            name: 'outStoreApply',
            query: {
              id: 'outStoreApply',
              sampleId: this.sampleId
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
      this.outApplyFormLoading = false
      this.$nextTick(() => {
        this.outApplyFormLoading = true
      })
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'outStoreApply',
        query: {
          id: 'outStoreApply',
          sampleId: this.sampleId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'outStoreApply' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 加载样本信息
      this.getSampleInformation()
      // 出库申请人
      this.getUserInfo()
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
