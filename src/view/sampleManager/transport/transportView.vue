<template>
  <div>
   <Form :label-width="90"  class="form-table">
      <Card title="样本信息" >
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
                      <Option v-for="item in projectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                   </Select>
              </Form-item>
            </Col>
          </Row>
        <Row :gutter="48">
             <Col span="8">
              <Form-item label="采集时间" prop="collectTime">
                 <DatePicker type="datetime" v-model="sampleTemp.collectTime"  format="yyyy-MM-dd HH:mm" disabled  style="width:100%;"></DatePicker>
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
    <Form ref="transportForm" :model="transportTemp" :loading="transportFormLoading" :label-width="120" class="form-table" >
      <Card title="运输交接信息" >
       <Row :gutter="48">
            <Col span="7">
              <Form-item label="包装完好" prop="isPackageGood">
                    <RadioGroup v-model="transportTemp.isPackageGood" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="transportTemp.isPackagePoorReason" disabled></Input>
            </Col>
         </Row>
       <Row :gutter="48">
            <Col span="7">
              <Form-item label="样本编码一致" prop="isSampleCodeConsistent">
                    <RadioGroup v-model="transportTemp.isSampleCodeConsistent" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="transportTemp.isSampleCodeInconsistentReason" disabled></Input>
            </Col>
       </Row>
       <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷藏" prop="isColdStorage">
                    <RadioGroup v-model="transportTemp.isColdStorage" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
               <Input type="text" v-model="transportTemp.isHotStorageReason" disabled></Input>
            </Col>
        </Row>
      <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷链运输" prop="isColdTransporte">
                    <RadioGroup v-model="transportTemp.isColdTransporte" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
              <Input type="text" v-model="transportTemp.isHotTransporteReason" disabled></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="接收意见" prop="receiveOpinion">
                    <RadioGroup v-model="transportTemp.receiveOpinion" >
                        <Radio :label="1" disabled>符合要求</Radio>
                        <Radio :label="2" disabled>不符合要求</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17"  style="padding-left:0;">
             <Input type="text" v-model="transportTemp.unqualityReason" disabled></Input>
            </Col>
        </Row>
       <Row :gutter="48">
            <Col span="8">
              <Form-item  label="冷藏箱" prop="cooler">
                  <Input type="text" v-model="transportTemp.cooler" disabled></Input>
              </Form-item>
            </Col>
              <Col span="8">
              <Form-item  label="温度记录仪" prop="temperatureRecorder">
                  <Input type="text" v-model="transportTemp.temperatureRecorder" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item  label="起运时温度" prop="startTemperature">
                  <Input type="text" v-model="transportTemp.startTemperature" style="width:80%" disabled></Input>℃
              </Form-item>
            </Col>
        </Row>
       <Row :gutter="48">
            <Col span="8">
              <Form-item  label="起运时间" prop="startTime">
                 <DatePicker type="datetime" v-model="transportTemp.startTime"  format="yyyy-MM-dd HH:mm" disabled  style="width:100%;" ></DatePicker>
              </Form-item>
            </Col>
            <!-- <Col span="8">
              <Form-item  label="承运人" prop="carrierId">
                   <Select v-model="sampleTemp.carrierId"  disabled clearable>
                       <Option v-for="item in carrierList" :key="item.id" :value="item.id" disabled >{{item.realName}}</Option>
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
               <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close">关闭</Button>
          </div>
    </Form>
  </div>
</template>
<script>
import { getUserList as getCarrierList } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { mapMutations } from 'vuex'
import { getTransportById } from '@/api/transport.js'
export default {
  name: 'transportView',
  data() {
    return {
      sampleTypeList: [],
      projectTypeList: [],
      carrierList: [],
      hospitalList: [],
      transportId: '',
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
        carrierId: '',
        carrier: '',
        collectQuantity: '',
        collectQuantityUnit: ''
      },
      // 运输信息
      transportFormLoading: true,
      transportTemp: {
        id: undefined,
        sampleId: '',
        sampleCode: '',
        isPackageGood: '',
        isPackagePoorReason: '',
        isSampleCodeConsistent: '',
        isSampleCodeInconsistentReason: '',
        isColdStorage: '',
        isHotStorageReason: '',
        isColdTransporte: '',
        isHotTransporteReason: '',
        cooler: '',
        temperatureRecorder: '',
        startTemperature: '',
        startTime: new Date(),
        transporter: '',
        transporterId: '',
        receiveOpinion: '',
        unqualityReason: ''
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
    // 加载运输信息
    this.getTransportById()
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
    // 加载运输信息
    getTransportById() {
      this.transportId = this.$route.query.transportId
      getTransportById(this.transportId).then(res => {
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
          this.transportTemp = res.data.sampleTransport
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      })
    },
    // 关闭表单
    close() {
      this.closeTag({
        name: 'transportView',
        query: {
          id: 'transportView',
          transportId: this.transportId
        }
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.transportFormLoading = false
      this.$nextTick(() => {
        this.transportFormLoading = true
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'transportView' && this.transportId !== this.$route.query.transportId) {
        this.transportId = this.$route.query.transportId
      }
    },
    transportId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取承运人
      this.getCarrierList()
      // 加载运输信息
      this.getTransportById()
    }
  }
}
</script>
