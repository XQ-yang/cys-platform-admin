<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="物料编号" class="search-input" v-model="listQuery.materialNo"/>
        <Input @on-change="handleClear"  clearable placeholder="物料名称" class="search-input" v-model="listQuery.materialName"/>
        <Input @on-change="handleClear"  clearable placeholder="生产编号" class="search-input" v-model="listQuery.productNo"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'productAdd'}" @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{row,index}" slot="action">
            <Button  v-permission="{rule:'productEdit'}" type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">编辑</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'productDelete'}" type="error" size="small">删除</Button>
            </Poptip>
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
      <Modal
      v-model="dialogFormVisible"
      :title="textMap[dialogStatus]"
      :loading="loading"
      @on-ok="dialogStatus==='create'?createData():updateData()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="700"
      ok-text="提交"
      cancel-text="关闭">
        <Form ref="storeProductForm" :model="storeProductTemp" :rules="rules"  :label-width="90" style="padding-right:20px;">
          <Row>
            <Col span="12">
              <Form-item label="物料编号" prop="materialNo">
                <Input type="text" v-model="storeProductTemp.materialNo" :maxlength="20" :disabled="isUsed" ></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="物料名称" prop="materialName">
                <Input type="text" v-model="storeProductTemp.materialName" :maxlength="20" :disabled="isUsed"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="生产编号" prop="productNo">
                <Input type="text" v-model="storeProductTemp.productNo" :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="生产厂家" prop="manufacturers">
                <Input type="text" v-model="storeProductTemp.manufacturers" :maxlength="20"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="单位" prop="units">
                <Input type="text" v-model="storeProductTemp.units" :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="规格" prop="specifications">
                <Input type="text" v-model="storeProductTemp.specifications" :maxlength="20"></Input>
              </Form-item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { fetchList, addStoreProduct, deleteStoreProduct, editStoreProduct, existMaterialNo, isUsedStock } from '@/api/storeProduct'
export default {
  name: 'product',
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
      oldMaterialNo: '', // 编辑验证编号
      oldBatchNo: '', // 编辑验证批号用
      isUsed: false,
      rules: {
        materialNo: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.oldMaterialNo) {
                callback()
                return
              }
              existMaterialNo(value).then(res => {
                if (res.data) {
                  callback(new Error('物料编号已存在'))
                } else {
                  callback()
                }
              })
            },
            trigger: 'blur'
          }
        ],
        materialName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        manufacturers: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  mounted() {
    this.getList()
  },
  methods: {
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
      this.isUsed = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.oldMaterialNo = ''
      this.oldBatchNo = ''
      this.$refs['storeProductForm'].resetFields()
      this.storeProductTemp.id = undefined
    },
    createData() {
      this.$refs['storeProductForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.storeProductTemp.createBy = this.$store.state.user.userName
        addStoreProduct(this.storeProductTemp).then(res => {
          this.changeLoading()
          this.dialogFormVisible = false
          this.$Message.success(res.msg)
          this.getList()
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    handleUpdate(row) {
      isUsedStock(row.id).then(res => {
        this.isUsed = res.data
        // 用assign 进行浅拷贝
        this.storeProductTemp = Object.assign({}, row)
        this.oldMaterialNo = this.storeProductTemp.materialNo
        this.dialogStatus = 'update'
        this.$refs['storeProductForm'].resetFields()
        this.dialogFormVisible = true
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    updateData() {
      this.$refs['storeProductForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.storeProductTemp.updateBy = this.$store.state.user.userName
        editStoreProduct(this.storeProductTemp).then(res => {
          this.changeLoading()
          this.dialogFormVisible = false
          this.$Message.success(res.msg)
          this.getList()
        }).catch(error => {
          this.changeLoading()
          this.dialogFormVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    handleDelete(id) {
      deleteStoreProduct(id).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    }
  }
}
</script>
