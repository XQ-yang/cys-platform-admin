
<template>
  <div>
    <Form ref="storeStockForm" :model="storeStockTemp" :rules="rules"  :label-width="120" style="padding-right:20px;">
      <Card title="物料基础资料" class="scrap-from2">
         <a href="#" slot="extra" @click.prevent="choiceStoreStock">
          <Button class="ivu-btn-success">
             <Icon type="ios-loop-strong"></Icon>
              选择基础资料
          </Button>
        </a>
          <Row >
            <Col span="12">
              <Form-item label="物料编号">
                <Input type="text" v-model="storeProductTemp.materialNo" disabled class="formInput" ></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="物料名称" >
                <Input type="text" v-model="storeProductTemp.materialName"  disabled class="formInput"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="生产编号" >
                <Input type="text" v-model="storeProductTemp.productNo"  disabled class="formInput"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="生产厂家" >
                <Input type="text" v-model="storeProductTemp.manufacturers"  disabled class="formInput"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="单位" prop="units">
                <Input type="text" v-model="storeProductTemp.units"  disabled class="formInput"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="规格" >
                <Input type="text" v-model="storeProductTemp.specifications"  disabled class="formInput"></Input>
              </Form-item>
            </Col>
          </Row>
          </Card>
          <Card title="物料库存">
          <Row>
            <Col span="12">
              <Form-item label="批号" prop="batchNumber">
                <Input type="text" v-model="storeStockTemp.batchNumber"  class="formInput"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="生产日期" prop="productTime">
              <DatePicker
                type="date"
                v-model="storeStockTemp.productTime"
                placeholder="请选择"
                 class="formInput"
              ></DatePicker>
            </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="有效期">
              <DatePicker
                type="date"
                v-model="storeStockTemp.expireTime"
                placeholder="请选择"
                 class="formInput"
              ></DatePicker>
            </Form-item>
            </Col>
          </Row>
          </Card>
          <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
        <Button
          class="ivu-btn ivu-btn-primary ivu-btn-large"
          style="margin-left:20px"
          @click="close"
        >关闭</Button>
      </div>
        </Form>
    <Form
      ref="contractRegisterForm"
      :model="storeProductTemp"
      :rules="rules"
      :loading="registerFormLoading"
      :label-width="100"
    >
    </Form>
    <!--弹出层（选择tableLoading）-->
    <Modal
      v-model="dialogFormVisible"
      title="选择物料基础资料"
      :loading="tableLoading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :footer-hide="true"
      width="1100"
    >
      <!--顾客信息查询条件-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="物料编号" class="search-input" v-model="listQuery.materialNo"/>
        <Input @on-change="handleClear"  clearable placeholder="物料名称" class="search-input" v-model="listQuery.materialName"/>
        <Input @on-change="handleClear"  clearable placeholder="生产编号" class="search-input" v-model="listQuery.productNo"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
      </div>
      <!--列表-->
      <Table :data="list" :columns="tableColumns" @on-row-dblclick="dbclickRow" :loading="tableLoading" border stripe style="min-height: 320px;">
        <template slot-scope="{row,index}" slot="action">
            <Button  type="primary" size="small" style="margin: 5px" @click="dbclickRow(row, index)">确定</Button>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageIndex"
            :page-size.sync="listQuery.pageSize"
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
import '@/assets/css/common.less'
import { fetchList } from '@/api/storeProduct'
import { addStoreStock, existBatchNumber } from '@/api/storeStock'
import { mapMutations } from 'vuex'
export default {
  name: 'addStoreStock',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '物料编号', key: 'materialNo' },
        { title: '物料名称', key: 'materialName' },
        { title: '生产编号', key: 'productNo' },
        { title: '生产厂家', key: 'manufacturers' },
        { title: '单位', key: 'units' },
        { title: '规格', key: 'specifications' },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      tableLoading: false,
      loading: true,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        materialNo: '',
        materialName: '',
        productNo: ''
      },
      storeProductTemp: {
        id: undefined,
        materialNo: '',
        materialName: '',
        productNo: '',
        units: '',
        manufacturers: '',
        specifications: '',
        createBy: '',
        updateBy: ''
      },
      storeStockTemp: {
        id: undefined,
        productId: '',
        batchNumber: '',
        productTime: '',
        expireTime: '',
        quantity: 0,
        createBy: '',
        updateBy: ''
      },
      registerFormLoading: true,
      rules: {
        batchNumber: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              existBatchNumber(value).then(res => {
                if (res.data) {
                  callback(new Error('批号已存在'))
                } else {
                  callback()
                }
              })
            },
            trigger: 'blur'
          }
        ],
        productTime: [
          { type: 'date', required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapMutations(['closeTag']),
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    handleCreate() {
      this.storeStockTemp = {
        id: undefined,
        materialNo: '',
        materialName: '',
        productNo: '',
        units: '',
        manufacturers: '',
        specifications: '',
        createBy: '',
        updateBy: ''
      }
      this.storeProductTemp = {
        id: undefined,
        materialNo: '',
        materialName: '',
        productNo: '',
        units: '',
        manufacturers: '',
        specifications: '',
        createBy: '',
        updateBy: ''
      }
      this.$refs['storeStockForm'].resetFields()
      this.storeStockTemp.id = undefined
      this.storeProductTemp.id = undefined
    },
    submit() {
      this.$refs['storeStockForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.storeStockTemp.createBy = this.$store.state.user.userName
        addStoreStock(this.storeStockTemp).then(res => {
          this.changeLoading()
          this.dialogFormVisible = false
          this.$Message.success(res.msg)

          this.handleCreate()
        }).catch(error => {
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    choiceStoreStock() {
      this.dialogFormVisible = true
      this.getList()
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    },
    dbclickRow(currentRow, index) {
      this.storeProductTemp = Object.assign({}, currentRow)
      this.storeStockTemp.productId = this.storeProductTemp.id
      this.dialogFormVisible = false
    },
    // 关闭表单
    close() {
      this.closeTag({
        name: 'addStoreStock',
        query: {
          id: 'addStoreStock'
        }
      })
    }
  }
}
</script>
<style>
.formInput{width: 320px;}
</style>
