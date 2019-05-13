<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="渠道商名称" class="search-input" v-model="listQuery.name"/>
        <Input @on-change="handleClear"  clearable placeholder="渠道商编号" class="search-input" v-model="listQuery.code"/>
        <Input @on-change="handleClear"  clearable placeholder="联系人" class="search-input" v-model="listQuery.contact"/>
        <Input @on-change="handleClear"  clearable placeholder="手机号" class="search-input" v-model="listQuery.phone"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'distributorAdd'}" @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
            <Button v-permission="{rule:'distributorEdit'}"  type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">编辑</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'distributorDelete'}"  type="error" size="small">删除</Button>
            </Poptip>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
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
      width="760"
      ok-text="提交"
      cancel-text="关闭"
      >
      <Form ref="distributorForm" :model="distributorTemp" :rules="rules" :label-width="120" style="padding-right:20px;">
        <Row>
          <Col span="12">
            <Form-item label="渠道商名称" prop="name">
              <Input type="text" v-model="distributorTemp.name" :maxlength="40"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="渠道商编号" prop="code" >
              <Input type="text" v-model="distributorTemp.code" :maxlength="40"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="联系人" prop="contact" >
              <Input type="text" v-model="distributorTemp.contact" :maxlength="40"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="手机号" prop="phone">
              <Input type="text" v-model="distributorTemp.phone" :maxlength="11"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="地址" prop="address">
              <Input type="text" v-model="distributorTemp.address" :maxlength="40"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="开户行" prop="bank">
              <Input type="text" v-model="distributorTemp.bank" :maxlength="40"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="开户行账号" prop="bankAccount">
              <Input type="text" v-model="distributorTemp.bankAccount" :maxlength="40"></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="税号" prop="taxId">
              <Input type="text" v-model="distributorTemp.taxId" :maxlength="40"></Input>
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
import { fetchList, addDistributor, editDistributor, deleteDistributor } from '@/api/distributor'
export default {
  name: 'distributor',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '渠道商名称', key: 'name' },
        { title: '渠道商编号', key: 'code' },
        { title: '联系人', key: 'contact' },
        { title: '手机号', key: 'phone' },
        { title: '地址', key: 'address' },
        { title: '开户行名称', key: 'bank' },
        { title: '开户行账号', key: 'bankAccount' },
        { title: '税号', key: 'taxId' },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        code: '',
        contact: '',
        phone: ''
      },
      distributorTemp: {
        id: undefined,
        name: '',
        code: '',
        contact: '',
        phone: '',
        address: '',
        bank: '',
        bankAccount: '',
        taxId: '',
        createTime: new Date(),
        updateTime: new Date()
      },
      rules: {
        name: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        phone: [
          { type: 'string',
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        address: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      },
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取列表数据
      this.getList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取列表数据
      this.getList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
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
    resetPostionTemp() {
      this.distributorTemp = {
        id: undefined,
        name: '',
        code: '',
        contact: '',
        phone: '',
        address: '',
        bank: '',
        bankAccount: '',
        taxId: '',
        createTime: new Date(),
        updateTime: new Date(),
        createBy: '',
        updateBy: ''
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetPostionTemp()
      this.$refs['distributorForm'].resetFields()
    },
    createData() {
      this.$refs['distributorForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addDistributor(this.distributorTemp).then(res => {
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
      // 用assign 进行浅拷贝
      this.distributorTemp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.$refs['distributorForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['distributorForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editDistributor(this.distributorTemp).then(res => {
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
      deleteDistributor(id).then(res => {
        this.$Message.success('删除成功')
        this.getList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
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
