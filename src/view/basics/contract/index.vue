<template>
  <div>
    <Card>
      <!--合同查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Select
          v-model="contractQuery.sampleType"
          @on-change="contractChangeSampleType($event)"
          placeholder="请选择样本类型"
          style="width:200px"
          clearable
        >
          <Option
            v-for="item in sampleTypeList"
            :key="item.sampleTypeId"
            :value="item.sampleTypeId"
          >{{item.sampleTypeName}}</Option>
        </Select>
        <Select
          v-model="contractQuery.projectType"
          @on-change="contractSelectClear"
          placeholder="请选择项目类型"
          style="width:200px"
          clearable
        >
          <Option
            v-for="item in contractProjectTypeList"
            :key="item.id"
            :value="item.id"
          >{{item.projectTypeName}}</Option>
        </Select>
        <Input
          v-model="contractQuery.contractCode"
          @on-change="contractClear"
          placeholder="合同编号"
          class="search-input"
          clearable
        />
        <Input
          v-model="contractQuery.customerName"
          @on-change="contractClear"
          placeholder="顾客姓名"
          class="search-input"
          clearable
        />
        <Input
          v-model="contractQuery.customerPhone"
          @on-change="contractClear"
          placeholder="手机号"
          class="search-input"
          clearable
        />
        <Button @click="contractSearch" class="search-btn">查询</Button>
        <Button @click="handleCreate" class="search-btn" v-permission="{rule:'addContract'}">新增</Button>
      </div>

      <!--合同列表-->
      <Table
        :data="contractList"
        :columns="contractColumns"
        :loading="contractListLoading"
        border
        stripe
      ></Table>
      <!--合同分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="contractTotal>0"
            :total="contractTotal"
            :current.sync="contractQuery.pageNumber"
            :page-size.sync="contractQuery.pageSize"
            @on-change="getContractList"
            show-total
            prev-text="上一页"
            next-text="下一页"
          ></Page>
        </div>
      </div>
    </Card>
    <!--弹出层查看-->
    <Modal
      v-model="dialogFormVisible"
      title="查看合同"
      :loading="loading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="700"
      cancel-text="关闭"
    >
      <Card title="合同信息">
        <Row :gutter="12">
          <Col span="4" class="col-title">
            <label>样本类型</label>
          </Col>
          <Col span="8">{{contractTemp.sampleType}}</Col>
          <Col span="4" class="col-title">
            <label>项目类型</label>
          </Col>
          <Col span="8" class="col-right">{{contractTemp.projectType}}</Col>
        </Row>
        <Row :gutter="12">
          <Col span="4" class="col-title">
            <label>合同编号</label>
          </Col>
          <Col span="8">{{contractTemp.contractCode}}</Col>
          <Col span="4" class="col-title">
            <label>存储数量</label>
          </Col>
          <Col span="8">{{contractTemp.storageQuantity}}</Col>
        </Row>
        <Row :gutter="12">
          <Col span="4" class="col-title">
            <label>到期时间</label>
          </Col>
          <Col span="8">{{contractTemp.dueTime}}</Col>
          <Col span="4" class="col-title">
            <label>金额</label>
          </Col>
          <Col span="8">{{contractTemp.amount}}</Col>
        </Row>
      </Card>
      <Card title="供者资料">
        <Row :gutter="12"  type="flex">
          <Col span="4" class="col-title">
            <label>顾客姓名</label>
          </Col>
          <Col span="8">{{contractTemp.customer.name}}</Col>
          <Col span="4" class="col-title">
            <label>证件类型</label>
          </Col>
          <Col span="8">{{contractTemp.customer.idType}}</Col>
        </Row>
        <Row :gutter="12" type="flex">
          <Col span="4" class="col-title">
            <label>证件号</label>
          </Col>
          <Col span="8">{{contractTemp.customer.idNumber}}</Col>
          <Col span="4" class="col-title">
            <label>手机号</label>
          </Col>
          <Col span="8">{{contractTemp.customer.phone}}</Col>
        </Row>
        <Row :gutter="12" type="flex">
          <Col span="4" class="col-title">
            <label>性别</label>
          </Col>
          <Col span="8">{{contractTemp.customer.gender}}</Col>
          <Col span="4" class="col-title">
            <label>出生日期</label>
          </Col>
          <Col span="8">{{contractTemp.customer.birthday}}</Col>
        </Row>
        <Row :gutter="12"  type="flex">
          <Col span="4" class="col-title">
            <label>血型</label>
          </Col>
          <Col span="8">{{contractTemp.customer.bloodType}}</Col>
          <Col span="4" class="col-title">
            <label>婚否</label>
          </Col>
          <Col span="8">{{contractTemp.customer.maritalStatus}}</Col>
        </Row>
        <Row :gutter="12" type="flex">
          <Col span="4" class="col-title">
            <label>职业</label>
          </Col>
          <Col span="8">{{contractTemp.customer.profession}}</Col>
          <Col span="4" class="col-title">
            <label>民族</label>
          </Col>
          <Col span="8">{{contractTemp.customer.ethnic}}</Col>
        </Row>
        <Row :gutter="12" type="flex">
          <Col span="4" class="col-title">
            <label>联系地址</label>
          </Col>
          <Col span="16">{{contractTemp.customer.contactAddress}}</Col>
        </Row>
      </Card>
      <Card title="合同附件">
          <Row type="flex" :gutter="12" class="row">
                    <Col span="24">
                     <div v-for="m in mediaList" :key="m.id" class="file-box">
                        <a target="_blank" :href="m.mediaPath" >{{m.originalMediaName}} </a>
                      </div>
                    </Col>
                  </Row>
        </Card>
    </Modal>
  </div>
</template>

<script>
import '@/assets/css/common.less'
import { getContractList, deleteByContractId } from '@/api/contract.js'
import {
  getProjectTypeBySampleType,
  getSampleTypeList
} from '@/api/projectType.js'
export default {
  name: 'contract',
  filters: {
    sampleTypeFilter(sampleType) {
      const sampleTypeMap = ['自存', '捐献', '制备']
      return sampleTypeMap[sampleType - 1]
    }
  },
  data() {
    return {
      // 显示合同条数
      count: 0,
      // 样本类型数据
      sampleTypeList: [],
      // 合同列表显示及查询
      contractProjectTypeList: [],
      contractQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        customerName: '',
        contractCode: '',
        customerPhone: ''
      },
      contractListLoading: false,
      contractList: [],
      contractTotal: 0,
      contractColumns: [
        { type: 'index', title: '序号', width: 70, tooltip: true },
        {
          title: '样本类型',
          key: 'sampleTyp',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.sampleTypeFilter(row.sampleType)
            return h('div', text)
          }
        },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '合同编号', key: 'contractCode', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        {
          title: '到期时间',
          key: 'dueTime',
          width: 130,
          render: (h, params) => {
            return h('div', this.$formatDate(params.row.dueTime, 'yyyy-MM-dd'))
          }
        },
        { title: '金额', key: 'amount', tooltip: true },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 190,
          render: (h, params, vm) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'editContract' }
                    }
                  ],
                  on: {
                    click: () => {
                      this.update(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'viewContract' }
                    }
                  ],
                  on: {
                    click: () => {
                      this.view(params.row)
                    }
                  }
                },
                '查看'
              ),
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  title: '您确定要删除吗'
                },
                on: {
                  'on-ok': () => {
                    this.delete(params.row)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {

                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'delContract' }
                    }
                  ]
                }, '删除')
              ])
            ])
          }
        }
      ],
      // 合同信息表单
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
      dialogFormVisible: false,
      loading: false,
      mediaList: [],
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取合同数据列表
      this.getContractList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取合同数据列表
      this.getContractList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {

  },
  methods: {
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
    // 合同列表按条件查询
    contractSearch() {
      this.contractQuery.pageNumber = 1
      this.getContractList()
    },
    // 清空查询值的时候 重新加载合同列表数据
    contractClear(e) {
      if (e.target.value === '') {
        this.getContractList()
      }
    },
    // 清空查询值的时候 重新加载合同列表数据(下拉框)
    contractSelectClear(e) {
      if (e === undefined) {
        this.getContractList()
      }
    },
    // 获取合同数据列表
    getContractList() {
      this.waiListLoading = true
      getContractList(this.contractQuery)
        .then(res => {
          this.count = res.data.totalRow
          this.contractList = res.data.list
          this.contractTotal = res.data.totalRow
          this.contractListLoading = false
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 合同列表切换样本类型时修改项目类型下拉数据（清空原来的项目类型）
    contractChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getContractList()
        this.contractQuery.projectType = ''
        this.contractProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType)
        .then(res => {
          this.contractQuery.projectType = ''
          this.contractProjectTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 跳转到新增合同
    handleCreate() {
      const route = {
        name: 'addContract',
        query: {
          id: 'addContract'
        }
      }
      this.$router.push(route)
    },
    // 跳转到已预约样本信息登记
    view(row) {
      const route = {
        name: 'viewContract',
        query: {
          id: 'viewContract',
          contractId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到样本信息登记修改
    update(row) {
      const route = {
        name: 'editContract',
        query: {
          id: 'editContract',
          contractId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到样本信息登记修改
    delete(row) {
      deleteByContractId(row.id).then(res => {
        this.$Message.success(res.msg)
        this.getContractList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getIdType(idType) {
      const idTypeMap = [
        '',
        '身份证',
        '香港身份证',
        '港澳通行证',
        '台湾通行证',
        '护照'
      ]
      return idTypeMap[idType]
    },
    getMaritalStatus(maritalStatus) {
      const maritalStatusMap = ['未知', '已婚', '未婚', '离异']
      return maritalStatusMap[maritalStatus]
    }
  }
}
</script>
<style scoped>
.col-title {
  text-align: right;
  font-weight: bold;
  border-right: 1px solid #ddd;
}
.col-right {
  text-align: left;
}
.file-box {
  display: inline;
margin: 2px 2px 2px 12px;
}
</style>

