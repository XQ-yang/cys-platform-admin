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
    <Form ref="receiveForm" :model="receiveTemp" :loading="receiveFormLoading" :label-width="120" >
      <Card title="接收人员填写">
         <Row :gutter="48">
            <Col span="7">
              <Form-item label="包装完好" prop="isPackageGood">
                    <RadioGroup v-model="receiveTemp.isPackageGood" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
             <Input type="text" v-model="receiveTemp.isPackagePoorReason" disabled></Input>
            </Col>
         </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="样本编码一致" prop="isSampleCodeConsistent">
                    <RadioGroup v-model="receiveTemp.isSampleCodeConsistent" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
             <Input type="text" v-model="receiveTemp.isSampleCodeInconsistentReason" disabled></Input>
            </Col>
       </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷藏" prop="isColdStorage">
                    <RadioGroup v-model="receiveTemp.isColdStorage" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="receiveTemp.isHotStorageReason" disabled></Input>
            </Col>
        </Row>
       <Row :gutter="48">
            <Col span="7">
              <Form-item label="冷链运输" prop="isColdTransporte">
                    <RadioGroup v-model="receiveTemp.isColdTransporte" >
                        <Radio :label="1" disabled>是</Radio>
                        <Radio :label="2" disabled>否</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
             <Input type="text" v-model="receiveTemp.isHotTransporteReason" disabled></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="7">
              <Form-item label="接收意见" prop="receiveOpinion">
                    <RadioGroup v-model="receiveTemp.receiveOpinion" >
                        <Radio :label="1" disabled>符合要求</Radio>
                        <Radio :label="2" disabled>不符合要求</Radio>
                    </RadioGroup>
              </Form-item>
            </Col>
            <Col span="17" style="padding-left:0;">
              <Input type="text" v-model="receiveTemp.unqualityReason" disabled></Input>
            </Col>
        </Row>
        <Row :gutter="48">
            <Col span="8">
              <Form-item  label="冷藏箱" prop="cooler">
                  <Input type="text" v-model="receiveTemp.cooler" disabled></Input>
              </Form-item>
            </Col>
              <Col span="8">
              <Form-item  label="温度记录仪" prop="temperatureRecorder">
                  <Input type="text" v-model="receiveTemp.temperatureRecorder" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item  label="接收时温度" prop="reciveTemperature">
                  <Input type="text" v-model="receiveTemp.reciveTemperature"  style="width:80%" number disabled></Input> ℃
              </Form-item>
            </Col>
        </Row>
       <Row :gutter="48">
            <Col span="8">
              <Form-item  label="接收时间" prop="reciveTime">
                 <DatePicker type="datetime" v-model="receiveTemp.reciveTime"  format="yyyy-MM-dd HH:mm" disabled  style="width:100%;"></DatePicker>
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
                    <Input type="text" v-model="receiveTemp.sampleOrigin" disabled></Input>
              </Form-item>
            </Col>
            <Col span="16">
              <Form-item  label="备注" prop="remark">
                  <Input type="text" v-model="receiveTemp.remark" disabled></Input>
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
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { getReceiveById } from '@/api/receive.js'
import { mapMutations } from 'vuex'
export default {
  name: 'receiveView',
  data() {
    return {
      sampleTypeList: [],
      projectTypeList: [],
      hospitalList: [],
      transporter: '',
      receiveId: '',
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
        reciveTemperature: 0,
        reciveTime: new Date(),
        reciver: '',
        reciverId: '',
        remark: '',
        receiveOpinion: '',
        unqualityReason: '',
        transporter: ''
      }
    }
  },
  mounted() {
    // 获取所有采集医院
    this.getAllHospital()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 加载样本验收信息
    this.getReceiveById()
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
    // 加载样本验收信息
    getReceiveById() {
      this.receiveId = this.$route.query.receiveId
      getReceiveById(this.receiveId).then(res => {
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
          this.receiveTemp = res.data.sampleReciver
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'receiveView',
        query: {
          id: 'receiveView',
          receiveId: this.receiveId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'receiveView' && this.receiveId !== this.$route.query.receiveId) {
        this.receiveId = this.$route.query.receiveId
      }
    },
    receiveId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 加载样本验收信息
      this.getReceiveById()
    }
  }
}
</script>
