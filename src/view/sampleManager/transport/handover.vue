<template>
  <div>
   <Form :label-width="90" ref="sampleForm" :model="sampleTemp">
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
          <Row :gutter="48">
             <Col span="8">
              <Form-item label="采集时间" prop="collectTime">
                 <DatePicker type="datetime" v-model="sampleTemp.collectTime"  format="yyyy-MM-dd HH:mm" disabled style="width:100%;"></DatePicker>
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
    <Form ref="transportForm" :model="transportTemp" :rules="rules" :loading="transportFormLoading" :label-width="120" >
      <Card title="运输交接信息">
         <Row :gutter="48">
            <Col span="7" >
              <Form-item label="包装完好" prop="isPackageGood">
                    <RadioGroup v-model="transportTemp.isPackageGood" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
               <Input type="text" v-model="transportTemp.isPackagePoorReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
         </Row>
         <Row :gutter="48">
            <Col span="7">
              <Form-item label="样本编码一致" prop="isSampleCodeConsistent">
                    <RadioGroup v-model="transportTemp.isSampleCodeConsistent" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="transportTemp.isSampleCodeInconsistentReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
       </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷藏" prop="isColdStorage">
                    <RadioGroup v-model="transportTemp.isColdStorage" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="transportTemp.isHotStorageReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷链运输" prop="isColdTransporte">
                    <RadioGroup v-model="transportTemp.isColdTransporte" >
                        <Radio :label="1">是</Radio>
                        <Radio :label="2">否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
               <Input type="text" v-model="transportTemp.isHotTransporteReason" placeholder="如果选择否，请填写理由" :maxlength="500"></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="接收意见" prop="receiveOpinion">
                    <RadioGroup v-model="transportTemp.receiveOpinion" >
                        <Radio :label="1">符合要求</Radio>
                        <Radio :label="2">不符合要求</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="transportTemp.unqualityReason" placeholder="如果选择不符合要求，请填写理由" :maxlength="500"></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="8">
              <Form-item  label="冷藏箱" prop="cooler">
                  <Input type="text" v-model="transportTemp.cooler" placeholder="冷藏箱编号" :maxlength="50"></Input>
              </Form-item>
            </Col>
              <Col span="8">
              <Form-item  label="温度记录仪" prop="temperatureRecorder">
                  <Input type="text" v-model="transportTemp.temperatureRecorder" placeholder="温度记录仪编号" :maxlength="50"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item  label="起运时温度" prop="startTemperature">
                  <Input type="text" v-model="transportTemp.startTemperature"  style="width:80%" :maxlength="6"></Input> ℃
              </Form-item>
            </Col>
        </Row>
       <Row :gutter="48">
            <Col span="8">
              <Form-item  label="起运时间" prop="startTime">
                 <DatePicker type="datetime" placeholder="请选择" v-model="transportTemp.startTime" :options="maxDate"  format="yyyy-MM-dd HH:mm"  style="width:100%;" ></DatePicker>
              </Form-item>
            </Col>
            <!-- <Col span="8">
              <Form-item  label="承运人" prop="carrierId">
                   <Select v-model="sampleTemp.carrierId" placeholder="" disabled >
                       <Option v-for="item in carrierList" :key="item.id" :value="item.id" >{{item.realName}}</Option>
                   </Select>
              </Form-item>
            </Col> -->
              <Col span="8">
              <Form-item  label="运输人" prop="transporter">
                 <Input type="text" v-model="transportTemp.transporter" disabled></Input>
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
import { getUserList as getCarrierList, getUserInfo } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { addTransport, getSampelById } from '@/api/transport.js'
import { mapMutations } from 'vuex'
export default {
  name: 'transportHandover',
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
      carrierList: [],
      hospitalList: [],
      sampleId: '',
      // 样本信息表单
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
        carrierId: '',
        carrier: '',
        collectQuantity: '',
        collectQuantityUnit: ''
      },
      // 运输信息
      transportFormLoading: true,
      transportTemp: {
        sampleId: '',
        sampleCode: '',
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
        startTemperature: '',
        startTime: new Date(),
        transporter: '',
        transporterId: '',
        receiveOpinion: 1,
        unqualityReason: ''
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
        startTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        receiveOpinion: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        startTemperature: [
          { validator: validateNumber }
        ]
      }
    }
  },
  created() {

  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 运输人
    this.getUserInfo()
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
    // 获取运输人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.transportTemp.transporter = res.data.realName
        this.transportTemp.transporterId = res.data.id
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
          // 运输信息
          this.transportTemp.sampleId = res.data.sample.id
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 选择否，必须填写理由
    validateReason() {
      if (this.transportTemp.isPackageGood === 2 && this.transportTemp.isPackagePoorReason === '') {
        this.$Message.error('请填写包装不完好理由')
        return false
      }
      if (this.transportTemp.isSampleCodeConsistent === 2 && this.transportTemp.isSampleCodeInconsistentReason === '') {
        this.$Message.error('请填写样本编码不一致理由')
        return false
      }
      if (this.transportTemp.isColdStorage === 2 && this.transportTemp.isHotStorageReason === '') {
        this.$Message.error('请填写不冷藏理由')
        return false
      }
      if (this.transportTemp.isColdTransporte === 2 && this.transportTemp.isHotTransporteReason === '') {
        this.$Message.error('请填写不冷链运输理由')
        return false
      }
      if (this.transportTemp.receiveOpinion === 2 && this.transportTemp.unqualityReason === '') {
        this.$Message.error('请填写不符合要求理由')
        return false
      }
      return true
    },
    // 提交表单，保存运输信息
    submit() {
      this.$refs['transportForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 选择否的请填写理由
        if (!this.validateReason()) {
          return false
        }
        addTransport(this.transportTemp).then(res => {
          this.changeLoading()
          this.$Message.success('提交成功')
          this.closeTag({
            name: 'transportHandover',
            query: {
              id: 'transportHandover',
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
      this.transportFormLoading = false
      this.$nextTick(() => {
        this.transportFormLoading = true
      })
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'transportHandover',
        query: {
          id: 'transportHandover',
          sampleId: this.sampleId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'transportHandover' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 运输人
      this.getUserInfo()
      // 获取承运人
      this.getCarrierList()
      // 加载样本信息
      this.getSampleInformation()
    }
  }
}
</script>
