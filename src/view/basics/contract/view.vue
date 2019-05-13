<template>
  <div>
    <Form
      ref="contractRegisterForm"
      :model="contractTemp"
      :loading="registerFormLoading"
      :label-width="100"
    >
      <Card title="合同信息">
        <Row :gutter="48">
          <Col span="12">
            <Form-item label="样本类型" >
              <RadioGroup v-model="contractTemp.sampleType"  >
                <Radio
                  v-for="item in sampleTypeList"
                  :label="item.sampleTypeId"
                  :key="item.sampleTypeId"
                  disabled
                >
                  <span>{{item.sampleTypeName}}</span>
                </Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="项目类型">
              <Select
                v-model="contractTemp.projectType"
                :style="inputWdth"
                disabled
              >
                <Option
                  v-for="item in projectTypeList"
                  :key="item.id"
                  :value="item.id"
                >{{item.projectTypeName}}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="12">
            <Form-item label="合同编号" >
              <Input
                type="text"
                v-model="contractTemp.contractCode"
                :style="inputWdth"
                disabled
              ></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="存储数量" >
              <Input
                type="text"
                v-model="contractTemp.storageQuantity"
                :style="inputWdth"
                disabled
              ></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="12">
            <Form-item label="到期时间" >
              <DatePicker
                type="datetime"
                v-model="contractTemp.dueTime"
                :options="maxDate"
                format="yyyy-MM-dd"
                :style="inputWdth"
                disabled
              ></DatePicker>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="金额" >
              <Input
                type="text"
                v-model="contractTemp.amount"
                :style="inputWdth"
                disabled
              ></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <Card title="供者资料">
        <Row :gutter="48" style="position:relative;">
          <Col span="8">
            <Form-item label="顾客姓名" >
              <Input
                type="text"
                v-model="contractTemp.customerName"
                :maxlength="50"
                disabled
              ></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="证件类型" >
              <Select
                v-model="contractTemp.customerIdType"
               disabled
              >
                <Option :value="1">身份证</Option>
                <Option :value="2">香港身份证</Option>
                <Option :value="3">港澳通行证</Option>
                <Option :value="4">台湾通行证</Option>
                <Option :value="5">护照</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="证件号" >
              <Input
                type="text"
                v-model="contractTemp.customerIdNumber"
                disabled
              ></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="手机号" >
              <Input type="text" v-model="contractTemp.customerPhone" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="性别">
              <RadioGroup v-model="contractTemp.customerGender">
                <Radio :label="0" disabled>未知</Radio>
                <Radio :label="1" disabled>男</Radio>
                <Radio :label="2" disabled>女</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="出生日期">
              <DatePicker
                type="date"
                v-model="contractTemp.customerBirthday"
                :options="maxDate"
style="width:100%;"
               disabled
              ></DatePicker>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="血型">
              <Input
                type="text"
                v-model="contractTemp.customerBloodType"
                disabled
              ></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="婚否">
              <Select v-model="contractTemp.customerMaritalStatus" disabled>
                <Option :value="0">未知</Option>
                <Option :value="1">已婚</Option>
                <Option :value="2">未婚</Option>
                <Option :value="3">离异</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="职业" >
              <Input
                type="text"
                v-model="contractTemp.customerProfession"
                disabled
              ></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="16">
            <Form-item label="联系地址" >
              <Input
                type="text"
                v-model="contractTemp.customerContactAddress"
               disabled
              ></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="民族" >
              <Input
                type="text"
                v-model="contractTemp.customerEthnic"
                disabled
              ></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <Card title="合同附件">
        <Row :gutter="12">
          <Col span="24">
            <ul class="upload-list" v-for="(item,index) in mediaList" :key="index">
              <li >
                <div class="upload-list-div">
                  <a target="_blank" :href="item.url">{{item.name}}</a>
                </div>
              </li>
            </ul>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button
          class="ivu-btn ivu-btn-primary ivu-btn-large"
          style="margin-left:20px"
          @click="close"
        >关闭</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { fetchList as getCustomerList } from '@/api/customer'
import {
  getProjectTypeBySampleType,
  getSampleTypeList
} from '@/api/projectType.js'
import {
  getEditData
} from '@/api/contract.js'
import { mapMutations } from 'vuex'
export default {
  name: 'viewContract',
  filters: {},
  data() {
    return {
      maxDate: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now()
        }
      },
      editCustomer: false,
      registerFormLoading: true,
      sampleTypeList: [],
      projectTypeList: [],
      mediaList: [],
      uploadList: [],
      // 合同信息表单
      oldcontractCode: '', // 编辑验证
      contractTemp: {
        id: undefined,
        projectType: '',
        sampleType: '',
        contractCode: '',
        customerId: '',
        storageQuantity: '',
        dueTime: new Date(),
        amount: '',
        contractFile: '',
        customerName: '',
        customerBirthday: '',
        customerIdType: '',
        customerIdNumber: '',
        customerPhone: '',
        customerGender: '',
        customerContactAddress: '',
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
        }
      },
      // 选择已有顾客信息
      dialoExistCustomerFormVisible: false,
      dialogExistCustomerLoading: true,
      customLoading: true,
      customerQuery: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        phone: '',
        idNumber: ''
      }
    }
  },
  mounted() {
    // 获取样本类型列表
    this.getSampleTypeList()
    // 编辑处化数据
    this.initData()
  },
  computed: {
    inputWdth: function() {
      return 'width:200px'
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    initData() {
      let contractId = this.$route.query.contractId
      if (contractId) {
        this.contractTemp.id = contractId
        getEditData(contractId)
          .then(res => {
            this.contractTemp = Object.assign({}, res.data.contract)
            this.oldcontractCode = this.contractTemp.contractCode
            this.contractTemp.customerId = res.data.customer.id
            this.contractTemp.customerName = res.data.customer.name
            this.contractTemp.customerPhone = res.data.customer.phone
            this.contractTemp.customerBirthday = res.data.customer.birthday
            this.contractTemp.customerIdType = res.data.customer.idType
            this.contractTemp.customerIdNumber = res.data.customer.idNumber
            this.contractTemp.customerGender = res.data.customer.gender
            this.contractTemp.customerEthnic = res.data.customer.ethnic
            this.contractTemp.customerMaritalStatus =
              res.data.customer.maritalStatus
            this.contractTemp.customerBloodType = res.data.customer.bloodType
            this.contractTemp.customerProfession = res.data.customer.profession
            this.contractTemp.customerContactAddress =
              res.data.customer.contactAddress
            this.contractTemp.customer = Object.assign({}, res.data.customer)

            this.mediaList = res.data.mediaList
            getProjectTypeBySampleType(res.data.contract.sampleType)
              .then(res => {
                this.projectTypeList = res.data
              })
              .catch(error => {
                this.$Message.error(error.msg)
              })
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      }
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList()
        .then(res => {
          this.sampleTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 切换样本类型时修改项目类型下拉数据
    changeSampleType(sampleType) {
      getProjectTypeBySampleType(sampleType)
        .then(res => {
          this.contractTemp.projectType = ''
          this.projectTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 获取顾客列表数据
    getCustomerList() {
      this.dialogExistCustomerLoading = true
      getCustomerList(this.customerQuery).then(res => {
        this.customerList = res.data.list
        this.total = res.data.totalRow
        this.dialogExistCustomerLoading = false
        this.customLoading = false
      })
    },
    // 赋值顾客信息
    fillCustomer(contractTemp) {
      this.contractTemp.customer.id = this.contractTemp.customerId
      this.contractTemp.customer.name = this.contractTemp.customerName
      this.contractTemp.customer.birthday = this.contractTemp.customerBirthday
      this.contractTemp.customer.idType = this.contractTemp.customerIdType
      this.contractTemp.customer.idNumber = this.contractTemp.customerIdNumber
      this.contractTemp.customer.phone = this.contractTemp.customerPhone
      this.contractTemp.customer.gender = this.contractTemp.customerGender
      this.contractTemp.customer.contactAddress = this.contractTemp.customerContactAddress
      this.contractTemp.customer.maritalStatus = this.contractTemp.customerMaritalStatus
      this.contractTemp.customer.ethnic = this.contractTemp.customerEthnic
      this.contractTemp.customer.bloodType = this.contractTemp.customerBloodType
      this.contractTemp.customer.profession = this.contractTemp.customerProfession
    },
    handleMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
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
      if (this.contractTemp.id) {
        this.closeTag({
          name: 'viewContract',
          query: {
            id: 'viewContract',
            contractId: this.contractTemp.id
          }
        })
      } else {
        this.closeTag({
          name: 'viewContract',
          query: {
            id: 'viewContract'
          }
        })
      }
    }
  }
}
</script>
<style>
.upload-list {
  display: block;
  list-style: none; /*去掉小圆点*/
}
.upload-list .upload-list-div {
  height: 28px;
  text-align: left;
  line-height: 28px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  width: auto;
  display: inline-block;
}

</style>
