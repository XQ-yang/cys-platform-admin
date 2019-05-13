<template>
  <div>
   <Form :label-width="90">
      <Card title="顾客信息">
        <Row :gutter="48">
            <Col span="8">
              <Form-item label="姓名" prop="name">
                <Input type="text" v-model="customerTemp.name" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="手机号" prop="phone">
                <Input  type="text" v-model="customerTemp.phone" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="性别" prop="gender">
                <RadioGroup v-model="customerTemp.gender">
                  <Radio :label="0" disabled>未知</Radio>
                  <Radio :label="1" disabled>男</Radio>
                  <Radio :label="2" disabled>女</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
          </Row>
        <Row :gutter="48">
            <Col span="8">
              <Form-item label="证件类型" prop="idType">
                <Select v-model="customerTemp.idType" placeholder="请选择" clearable disabled>
                  <Option :value="1">身份证</Option>
                  <Option :value="2">香港身份证</Option>
                  <Option :value="3">港澳通行证</Option>
                  <Option :value="4">台湾通行证</Option>
                  <Option :value="5">护照</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="证件号" prop="idNumber">
                <Input  type="text" v-model="customerTemp.idNumber" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
             <Col span="8">
              <Form-item label="出生日期" prop="birthday">
                 <DatePicker type="date"  v-model="customerTemp.birthday" placeholder="请选择" style="width:100%;" disabled></DatePicker>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
            <Col span="8">
              <Form-item label="联系地址" prop="contactAddress">
                <Input type="text" v-model="customerTemp.contactAddress" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
               <Form-item label="渠道" prop="">
              <Select
                v-model="customerTemp.distributerId"
                placeholder=""
                disabled
              >
                <Option
                  v-for="item in distributerList"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</Option>
              </Select>
            </Form-item>
              </Col>
            <Col span="8">
               <Form-item label="民族" prop="ethnic">
                <Input type="text" v-model="customerTemp.ethnic" :maxlength="20" disabled></Input>
              </Form-item>
             </Col>
          </Row>
         <Row :gutter="48">
            <Col span="8">
                <Form-item label="婚否" prop="maritalStatus">
                <Select v-model="customerTemp.maritalStatus"  placeholder="" clearable disabled>
                  <Option :value="0">未知</Option>
                  <Option :value="1">已婚</Option>
                  <Option :value="2">未婚</Option>
                  <Option :value="3">离异</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="8" >
              <Form-item label="职业" prop="profession">
                <Input type="text" v-model="customerTemp.profession" :maxlength="50" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="血型" prop="bloodType">
                <Select v-model="customerTemp.bloodType" placeholder="" clearable disabled>
                  <Option value="未知">未知</Option>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="AB">AB</Option>
                  <Option value="O">O</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
      </Card>
      <Card v-for="contractTemp in contractList" :key="contractTemp.id" title="合同信息">
         <Row :gutter="48">
            <Col span="8">
              <Form-item label="合同编号" prop="contractCode">
                <Input type="text" v-model="contractTemp.contract.contractCode" disabled ></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="存储数量" prop="storageQuantity">
                <Input type="text" v-model="contractTemp.contract.storageQuantity" disabled ></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="到期时间" prop="dueTime">
                <Input type="text" v-model="contractTemp.contract.dueTime" disabled ></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="金额" prop="amount">
                <Input type="text" v-model="contractTemp.contract.amount" disabled ></Input>
              </Form-item>
            </Col>
            <Col span="16">
                <Form-item label="合同附件">
                  <Alert v-for="item in contractTemp.contractFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
                </Form-item>
              </Col>
          </Row>
      </Card>
      <Card v-for="sampleTemp in sampleList" :key="sampleTemp.id" title="样本信息">
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
import { getInfoByCustomerId } from '@/api/customer.js'
import { getAllProjectType, getSampleTypeList } from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
import { getUserList as getCarrierList } from '@/api/user'
import { getAllDistributor } from '@/api/distributor.js'
import { mapMutations } from 'vuex'
export default {
  name: 'customerView',
  data() {
    return {
      customerId: '',
      customerTemp: {},
      distributerList: [],
      contractList: {},
      sampleList: {},
      sampleTypeList: [],
      projectTypeList: [],
      hospitalList: [],
      carrierList: []
    }
  },
  mounted() {
    // 渠道列表
    this.getAllDistributor()
    // 根据顾客id加载顾客相关信息
    this.getInfoByCustomerId()
    // 获取样本类型列表
    this.getSampleTypeList()
    // 获取所有项目类型
    this.getAllProjectType()
    // 获取所有采集医院
    this.getAllHospital()
    // 获取承运人
    this.getCarrierList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 根据顾客id加载顾客相关信息
    getInfoByCustomerId() {
      var customerId = this.$route.query.customerId
      getInfoByCustomerId(customerId).then(res => {
        this.customerTemp = res.data.customer
        this.contractList = res.data.contractList
        this.sampleList = res.data.sampleList
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
    // 获取所有项目类型
    getAllProjectType() {
      getAllProjectType().then(res => {
        this.projectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 渠道数据s [shi]
    getAllDistributor() {
      getAllDistributor().then(res => {
        this.distributerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取所有采集医院
    getAllHospital() {
      getAllHospital().then(res => {
        this.hospitalList = res.data
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
    // 关闭查看
    close() {
      this.closeTag({
        name: 'customerView',
        query: {
          customerId: this.$route.query.customerId
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'customerView' && this.customerId !== this.$route.query.customerId) {
        this.customerId = this.$route.query.customerId
      }
    },
    customerId() {
      // 根据顾客id加载顾客相关信息
      this.getInfoByCustomerId()
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取所有项目类型
      this.getAllProjectType()
      // 获取所有采集医院
      this.getAllHospital()
      // 获取承运人
      this.getCarrierList()
    }
  }
}
</script>
