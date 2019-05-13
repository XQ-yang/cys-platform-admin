<template>
  <div>
    <Form ref="storeApplyForm" :model="storeApplyTemp" :rules="storeApplyRules" :label-width="100" style="padding-right:20px;">
      <Card title="基本信息" >
        <Row>
          <Col span="6">
            <Form-item label="样本条码" prop="sampleCode">
              <Input v-model="storeApplyTemp.sampleCode"  placeholder="输入样本条码回车或点查询" search enter-button="查询" @on-search="getCustomerBySampleCode" type="text" :maxlength="40"></Input>
            </Form-item>
          </Col>
          </Row>
          <Row>
             <Col span="6">
            <Form-item label="申请日期" prop="applyDate">
              <DatePicker type="date" placeholder="选择日期" :value="storeApplyTemp.applyDate"  @on-change="storeApplyTemp.applyDate=$event" clearable style="width:100%" ></DatePicker>
            </Form-item>
          </Col>
          <Col span="6">
            <Form-item label="细胞编码" prop="cellCode" >
              <Input v-model="storeApplyTemp.cellCode" type="text" :maxlength="20" ></Input>
            </Form-item>
          </Col>
          <Col span="6">
            <Form-item label="顾客姓名" prop="customerName">
              <Input v-model="storeApplyTemp.customerName" type="text" :maxlength="20" disabled></Input>
            </Form-item>
          </Col>
          <Col span="6">
            <Form-item label="申请人" prop="applyUserName" >
              <Input v-model="storeApplyTemp.applyUserName" type="text" :maxlength="20" disabled></Input>
            </Form-item>
          </Col>

        </Row>
      </Card>
      <Card title="物料领用信息" class="scrap-from2">
         <a href="#" slot="extra" @click.prevent="handleDetailCreate">
          <Button class="ivu-btn-success">
             <Icon type="ios-loop-strong"></Icon>
              选择物料库存
          </Button>
        </a>
        <Table ref="detailTable" :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
          <template slot-scope="props" slot="applyQuantity">
            <Form :ref="'formDynamic'+props.idx" :model="props.row" :rules="detailsRules">
              <FormItem prop="applyQuantity"  class="text-verification">
                <Input type="text" v-model="props.row.applyQuantity" :maxlength="6" ></Input>
              </FormItem>
            </Form>
          </template>
          <template slot-scope="props" slot="remark">
            <Input type="text" v-model="props.row.remark" :maxlength="100"/>
          </template>
          <template slot-scope="props" slot="quality">
            <Input type="text" v-model="props.row.quality" :maxlength="100"/>
          </template>
          <!-- <template slot-scope="props" slot="units">
            <Input type="text" v-model="props.row.units" :maxlength="6"/>
          </template> -->
          <template slot-scope="{row,index}" slot="action">
              <Poptip
                  confirm
                  transfer
                  title="您确定要删除吗?"
                  @on-ok="handleDelete(index)"
                  >
                <Button  type="error" size="small">删除</Button>
              </Poptip>
          </template>
        </Table>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click.native="submit"  >提交</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close" style="margin-left:20px" >关闭</Button>
      </div>
    </Form>
    <Modal
    v-model="dialogFormVisible"
    title="选择物料库存"
    class-name="vertical-center-modal"
    :mask-closable="false"
    :footer-hide="true"
    width="1280">
      <div class="search-con search-con-top">
         <Input type="text" v-model="productQuery.materialNo" placeholder="物料编号" :maxlength="20" class="search-input"  style="width:200px;" clearable></Input>
         <Input type="text" v-model="productQuery.materialName" placeholder="物料名称" :maxlength="20" class="search-input"  style="width:200px;" clearable></Input>
         <Input type="text" v-model="productQuery.batchNumber" placeholder="批号" :maxlength="20" class="search-input"  style="width:200px;" clearable></Input>
         <Button @click="handleSearch" class="search-btn">查询</Button>
      </div>
      <Table :data="productList" :columns="productTableColumns" @on-row-dblclick="dbclickRow" :loading="productTableLoading" style="min-height:350px;" stripe border highlight-row>
        <template slot-scope="{row,index}" slot="action">
            <Button  type="primary" size="small" style="margin: 5px" @click="dbclickRow(row, index)">确定</Button>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="productQuery.pageIndex"
            :page-size.sync="productQuery.pageSize"
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { addStoreApply, getCustomerBySampleCode } from '@/api/storeApply'
import { fetchList } from '@/api/storeStock'
import { mapMutations } from 'vuex'
export default {
  name: 'storeapplyAdd',
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
        // { title: '单位', key: 'units' },
        { title: '生产日期',
          key: 'productTime',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.productTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '有效期',
          key: 'expireTime',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.expireTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '领用量',
          key: 'applyQuantity',
          solt: 'applyQuantity',
          width: 100,
          render: (h, params) => {
            this.list[params.index] = params.row
            return h('div',
              this.$refs.detailTable.$scopedSlots.applyQuantity({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        { title: '领用单位', // 质量改为单位
          key: 'quality',
          // width: 180,
          solt: 'quality',
          render: (h, params) => {
            this.list[params.index] = params.row
            return h('div',
              this.$refs.detailTable.$scopedSlots.quality({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        { title: '备注',
          key: 'remark',
          slot: 'remark',
          render: (h, params) => {
            this.list[params.index] = params.row
            return h('div',
              this.$refs.detailTable.$scopedSlots.remark({
                row: params.row,
                idx: params.row._index
              })
            )
          }
        },
        {
          title: '操作',
          width: 80,
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      tableLoading: false,
      loading: true,
      storeApplyTemp: {
        id: undefined,
        applyUserName: this.$store.state.user.userName,
        applyUserId: this.$store.state.user.userId,
        sampleId: '',
        sampleCode: '',
        cellCode: '',
        customerName: '',
        applyDate: '',
        createTime: '',
        createBy: this.$store.state.user.userName,
        updateBy: '',
        details: []
      },
      storeApplyDetailTemp: {
        id: undefined,
        applyId: '', // 主表id
        applyQuantity: '', // 申请数量
        stockId: '', // 物料基本信息表主键
        quality: '', // 质量
        remark: ''// 备注
      },
      detailsRules: {
        applyQuantity: [
          {
            required: true,
            pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.([1-9]|\d[1-9])|0)$/,
            message: '请输入数字',
            trigger: 'change'
          }
        ]
      },
      storeApplyRules: {
        applyUserName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        sampleCode: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        cellCode: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      },
      productList: [],
      productTableColumns: [
        {
          title: '序号',
          width: 66,
          render: (h, params) => {
            return h('span', params.index + (this.productQuery.pageIndex - 1) * this.productQuery.pageSize + 1)
          }
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
        { title: '单位', key: 'units', width: 80 },
        { title: '生产编号', key: 'productNo' },
        { title: '生产厂家', key: 'manufacturers', width: 160 },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
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
  created() {

  },
  mounted() {

  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    getList() {
      this.productTableLoading = true
      fetchList(this.productQuery).then(res => {
        this.productList = res.data.list
        this.total = res.data.totalRow
        this.productTableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
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
    handleDelete(idx) {
      this.list.splice(idx, 1)
    },
    getCustomerBySampleCode() {
      getCustomerBySampleCode(this.storeApplyTemp.sampleCode).then(res => {
        this.storeApplyTemp.customerName = res.data.name
        this.storeApplyTemp.sampleId = res.data.id
      }).catch(error => {
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
        if (item.materialNo === currentRow.materialNo && item.batchNumber === currentRow.batchNumber) {
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
      this.storeApplyDetailTemp.quality = currentRow.units
      if (isExist) {
        this.$Message.error('已经存在，不能重复选择')
      } else {
        this.list.push(this.storeApplyDetailTemp)
      }
    },
    handleCreate() {

    },
    submit() {
      this.storeApplyTemp.details = this.list
      if (this.list.length === 0) {
        this.$Message.error('请选择需要领取的产品！')
        return this.changeLoading()
      }
      this.$refs['storeApplyForm'].validate(valid => {
        // if (!valid) {
        //   this.validType = false
        //   return this.changeLoading()
        // }
        if (valid) {
          for (let i = 0, len = this.list.length; i < len; i++) {
            this.$refs['formDynamic' + i].validate(valid => {
              if (valid) {
                this.validType = true
              } else {
                this.validType = false
              }
            })
            if (!this.validType) break
          }
          if (this.validType) {
            addStoreApply(this.storeApplyTemp).then(res => {
              this.changeLoading()
              this.$Message.success(res.msg)
              this.closeTag({
                name: 'storeapplyAdd'
              })
            }).catch(error => {
              this.changeLoading()
              this.$Message.error(error.msg)
            })
          }
        }
      })
    },
    // 关闭表单
    close() {
      this.closeTag({
        name: 'storeapplyAdd'
      })
    }
  }
}
</script>

