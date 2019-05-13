<template>
  <div>
   <Form :label-width="90" ref="sampleForm" :model="sampleTemp">
      <Card title="样本信息">
          <Row :gutter="48">
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
          <Row :gutter="48">
             <Col span="8">
              <Form-item label="采集时间" prop="collectTime">
                 <DatePicker type="datetime" v-model="sampleTemp.collectTime"  format="yyyy-MM-dd HH:mm" style="width:100%;" disabled ></DatePicker>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集人" prop="collector">
                <Input type="text" v-model="sampleTemp.collector" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采集地点" prop="collectSite">
                <Input type="text" v-model="sampleTemp.collectSite" disabled></Input>
              </Form-item>
            </Col>
            </Row>
             <Row :gutter="48">
             <Col span="8">
              <Form-item label="采集数量" prop="collectQuantity">
                <Input type="text" v-model="sampleTemp.collectQuantity" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="数量单位" prop="collectQuantityUnit">
                 <Select v-model="sampleTemp.collectQuantityUnit" disabled  clearable>
                      <Option :value="1">管</Option>
                      <Option :value="2">个</Option>
                      <Option :value="3">ml</Option>
                  </Select>
              </Form-item>
            </Col>
          </Row>
      </Card>
    </Form>
    <Form ref="receiveForm" :model="receiveTemp" :rules="rules" :loading="receiveFormLoading" :label-width="120" >
      <Card title="接收人员填写">
          <Row :gutter="48">
            <Col span="7">
              <Form-item label="包装完好" prop="isPackageGood">
                    <RadioGroup v-model="receiveTemp.isPackageGood" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
               <Input type="text" v-model="receiveTemp.isPackagePoorReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
         </Row>
          <Row :gutter="48">
            <Col span="7">
              <Form-item label="样本编码一致" prop="isSampleCodeConsistent">
                    <RadioGroup v-model="receiveTemp.isSampleCodeConsistent" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="receiveTemp.isSampleCodeInconsistentReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
       </Row>
         <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷藏" prop="isColdStorage">
                    <RadioGroup v-model="receiveTemp.isColdStorage" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="receiveTemp.isHotStorageReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
        </Row>
          <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷链运输" prop="isColdTransporte">
                    <RadioGroup v-model="receiveTemp.isColdTransporte" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="receiveTemp.isHotTransporteReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="接收意见" prop="receiveOpinion">
                    <RadioGroup v-model="receiveTemp.receiveOpinion" >
                        <Radio :label="1">符合要求</Radio>
                        <Radio :label="2">不符合要求</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
             <Input type="text" v-model="receiveTemp.unqualityReason" placeholder="如果选择不符合要求，请填写理由" :maxlength="500"></Input>
            </Col>
        </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item  label="冷藏箱" prop="cooler">
                  <Input type="text" v-model="receiveTemp.cooler" placeholder="冷藏箱编号" :maxlength="50"></Input>
              </Form-item>
            </Col>
              <Col span="8">
              <Form-item  label="温度记录仪" prop="temperatureRecorder">
                  <Input type="text" v-model="receiveTemp.temperatureRecorder" placeholder="温度记录仪编号" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item  label="接收时温度" prop="reciveTemperature">
                  <Input type="text" v-model="receiveTemp.reciveTemperature" style="width:80%" :maxlength="6"></Input> ℃
              </Form-item>
            </Col>
        </Row>
         <Row :gutter="48">
            <Col span="8">
              <Form-item  label="接收时间" prop="reciveTime">
                 <DatePicker type="datetime" placeholder="请选择" v-model="receiveTemp.reciveTime" :options="maxDate"  format="yyyy-MM-dd HH:mm"  style="width:100%;"  ></DatePicker>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item  label="交接人" prop="transporter">
                   <Input type="text" v-model="receiveTemp.transporter" disabled></Input>
              </Form-item>
            </Col>
              <Col span="8">
              <Form-item  label="接收人" prop="reciver">
                 <Input type="text" v-model="receiveTemp.reciver" disabled></Input>
              </Form-item>
            </Col>
        </Row>
         <Row :gutter="48">
            <Col span="8">
              <Form-item label="样本来源" prop="sampleOrigin">
                    <Input type="text" v-model="receiveTemp.sampleOrigin" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="16">
              <Form-item  label="备注" prop="remark">
                  <Input type="text" v-model="receiveTemp.remark" :maxlength="500"></Input>
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
import { getUserInfo } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { addReceive, getSampelById } from '@/api/receive.js'
import { mapMutations } from 'vuex'
export default {
  name: 'sampleReceive',
  data() {
    const validateNumber = (rule, value, callback) => {
      var reg = /^\d{1,2}$|^\d{1,2}[.]\d{1,2}$|^(\-|\+)?\d{1,2}$|^(\-|\+)?\d{1,2}[.]\d{1,2}$/
      if (value && !reg.test(value)) {
        callback(new Error('请输入整数部分和小数部分分别最多两位的数字'))
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
      sampleTypeList: [],
      projectTypeList: [],
      hospitalList: [],
      transporter: '',
      sampleId: '',
      // 样本信息
      sampleTemp: {
        customerName: '',
        customerPhone: '',
        sampleCode: '',
        sampleType: '',
        projectType: '',
        collectHospita: '',
        collectTime: '',
        collectSite: '',
        collectorId: '',
        collector: '',
        collectQuantity: '',
        collectQuantityUnit: ''
      },
      // 验收信息
      receiveFormLoading: true,
      receiveTemp: {
        sampleId: '',
        sampleCode: '',
        sampleOrigin: '',
        isPackageGood: 1,
        isPackagePoorReason: '',
        isSampleCodeConsistent: 1,
        isSampleCodeInconsistentReason: '',
        isColdStorage: 1,
        isHotStorageReason: '',
        isColdTransporte: 1,
        isHotTransporteReason: '',
        cooler: '',
        temperatureRecorder: '',
        reciveTemperature: '',
        reciveTime: new Date(),
        reciver: '',
        reciverId: '',
        remark: '',
        receiveOpinion: 1,
        unqualityReason: '',
        transporterId: '',
        transporter: ''
      },
      rules: {
        isPackageGood: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isSampleCodeConsistent: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isColdStorage: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isColdTransporte: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        receiveOpinion: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        reciveTemperature: [
          { validator: validateNumber }
        ]
      }
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 接收人
    this.getUserInfo()
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
    // 获取接收人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.receiveTemp.reciver = res.data.realName
        this.receiveTemp.reciverId = res.data.id
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
          // 验收信息
          this.receiveTemp.sampleId = res.data.sample.id
          this.receiveTemp.transporterId = res.data.sampleTransport.transporterId
          this.receiveTemp.transporter = res.data.sampleTransport.transporter
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 选择否，必须填写理由
    validateReason() {
      if (this.receiveTemp.isPackageGood === 2 && this.receiveTemp.isPackagePoorReason === '') {
        this.$Message.error('请填写包装不完好理由')
        return false
      }
      if (this.receiveTemp.isSampleCodeConsistent === 2 && this.receiveTemp.isSampleCodeInconsistentReason === '') {
        this.$Message.error('请填写样本编码不一致理由')
        return false
      }
      if (this.receiveTemp.isColdStorage === 2 && this.receiveTemp.isHotStorageReason === '') {
        this.$Message.error('请填写不冷藏理由')
        return false
      }
      if (this.receiveTemp.isColdTransporte === 2 && this.receiveTemp.isHotTransporteReason === '') {
        this.$Message.error('请填写不冷链运输理由')
        return false
      }
      if (this.receiveTemp.receiveOpinion === 2 && this.receiveTemp.unqualityReason === '') {
        this.$Message.error('请填写不符合要求理由')
        return false
      }
      return true
    },
    // 提交表单，保存验收信息
    submit() {
      this.$refs['receiveForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 选择否的请填写理由
        if (!this.validateReason()) {
          return false
        }
        addReceive(this.receiveTemp).then(res => {
          this.changeLoading()
          this.$Message.success('提交成功')
          this.closeTag({
            name: 'sampleReceive',
            query: {
              id: 'sampleReceive',
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
      this.receiveFormLoading = false
      this.$nextTick(() => {
        this.receiveFormLoading = true
      })
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'sampleReceive',
        query: {
          id: 'sampleReceive',
          sampleId: this.sampleId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'sampleReceive' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 接收人
      this.getUserInfo()
      // 加载样本信息
      this.getSampleInformation()
    }
  }
}
</script>
