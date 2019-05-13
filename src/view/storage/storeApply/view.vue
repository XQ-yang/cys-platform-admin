<template>
  <div>
    <Form
      ref="storeApplyForm"
      :model="storeApplyTemp"
      :label-width="100"
      style="padding-right:20px;"
    >
      <Card title="基本信息">
        <Row>
          <Col span="6">
            <Form-item label="样本条码">
              <Input
                v-model="storeApplyTemp.sampleCode"
                type="text"
                disabled
              ></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <Form-item label="申请日期">
              <DatePicker
                type="date"
                disabled
                :value="storeApplyTemp.applyDate"
              ></DatePicker>
            </Form-item>
          </Col>
          <Col span="6">
            <Form-item label="细胞编码">
              <Input v-model="storeApplyTemp.cellCode" type="text" disabled></Input>
            </Form-item>
          </Col>
          <Col span="6">
            <Form-item label="顾客姓名">
              <Input v-model="storeApplyTemp.customerName" type="text" disabled></Input>
            </Form-item>
          </Col>
          <Col span="6">
            <Form-item label="申请人">
              <Input v-model="storeApplyTemp.applyUserName" type="text" disabled></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <Card title="物料领用信息" >
        <Table
          ref="detailTable"
          :data="list"
          :columns="tableColumns"
          :loading="tableLoading"
          border
          stripe
        >
        </Table>
      </Card>
      <div class="form-btn">
        <Button
          class="ivu-btn ivu-btn-primary ivu-btn-large"
          @click="close"
          style="margin-left:20px"
        >关闭</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import {
  getCustomerBySampleCode,
  getStoreApplyById
} from '@/api/storeApply'
import { mapMutations } from 'vuex'
export default {
  name: 'storeapplyView',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          type: 'index'
        },
        { title: '物料编号', key: 'materialNo' },
        { title: '物料名称', key: 'materialName' },
        { title: '批号', key: 'batchNumber' },
        {
          title: '生产日期',
          key: 'productTime',
          width: 116,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.productTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '有效期',
          key: 'expireTime',
          width: 116,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.expireTime, 'yyyy-MM-dd')
            )
          }
        },
        // { title: '单位', key: 'units', width: 80 },
        { title: '生产编号', key: 'productNo' },
        { title: '生产厂家', key: 'manufacturers' },
        {
          title: '领用量',
          key: 'applyQuantity'
        },
        {
          title: '领用单位',
          key: 'quality'
        },
        {
          title: '备注',
          key: 'remark'
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      tableLoading: false,
      loading: true,
      storeApplyTemp: {
        id: this.$route.query.id,
        applyUserName: this.$store.state.user.userName,
        applyUserId: this.$store.state.user.userId,
        sampleId: '',
        sampleCode: '',
        cellCode: '',
        customerName: '',
        applyDate: '',
        createTime: '',
        createBy: '',
        updateBy: this.$store.state.user.userName,
        details: []
      },
      storeApplyDetailTemp: {
        id: undefined,
        applyId: '', // 主表id
        applyQuantity: '', // 申请数量
        stockId: '', // 物料基本信息表主键
        quality: '', // 质量
        remark: '' // 备注
      },
      productList: [],
      productTableLoading: false,
      productQuery: {
        pageIndex: 1,
        pageSize: 10,
        materialNo: '',
        materialName: '',
        batchNumber: ''
      },
      formDynamic: {},
      validType: true
    }
  },
  created() {},
  mounted() {
    this.getStoreApplyById()
  },
  methods: {
    ...mapMutations(['closeTag']),
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    handleDetailCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getList()
    },
    getStoreApplyById() {
      getStoreApplyById(this.storeApplyTemp.id)
        .then(res => {
          this.storeApplyTemp = Object.assign(this.storeApplyTemp, res.data)
          this.storeApplyTemp.updateBy = this.$store.state.user.userName
          this.list = res.data.applyDetails
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    handleDelete(idx) {
      this.list.splice(idx, 1)
    },
    getCustomerBySampleCode() {
      getCustomerBySampleCode(this.storeApplyTemp.sampleCode)
        .then(res => {
          this.storeApplyTemp.customerName = res.data.name
          this.storeApplyTemp.sampleId = res.data.id
        })
        .catch(error => {
          this.$Message.error(error.msg)
          this.storeApplyTemp.customerName = ''
        })
    },
    handleSearch() {
      this.productQuery.pageIndex = 1
      this.getList()
    },
    dbclickRow(currentRow, index) {
      let isExist = false
      this.list.map(item => {
        if (
          item.materialNo === currentRow.materialNo &&
          item.batchNumber === currentRow.batchNumber
        ) {
          isExist = true
        }
      })
      this.storeApplyDetailTemp.stockId = currentRow.id
      this.storeApplyDetailTemp.materialNo = currentRow.materialNo
      this.storeApplyDetailTemp.materialName = currentRow.materialName
      this.storeApplyDetailTemp.expireTime = currentRow.expireTime
      this.storeApplyDetailTemp.batchNumber = currentRow.batchNumber
      this.storeApplyDetailTemp.units = currentRow.units
      this.storeApplyDetailTemp.productTime = currentRow.productTime
      this.storeApplyDetailTemp.remark = currentRow.remark
      if (isExist) {
        this.$Message.error('已经存在，不能重复选择')
      } else {
        this.list.push(this.storeApplyDetailTemp)
      }
    },
    selectSample() {},
    // 关闭表单
    close() {
      this.closeTag({
        name: 'storeapplyView',
        query: {
          id: this.$route.query.id
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (
        to.name === 'storeapplyView' &&
        this.storeApplyTemp.id !== this.$route.query.id
      ) {
        this.storeApplyTemp.id = this.$route.query.id
      }
    },
    'storeApplyTemp.id': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && oldVal !== undefined) {
          this.getStoreApplyById()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
