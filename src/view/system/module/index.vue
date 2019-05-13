<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="机构名称" class="search-input" v-model="listQuery.deptName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe></Table>
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
      <!--弹出层-->
      <Modal
      v-model="dialogFormVisible"
      :title="textMap[dialogStatus]"
      :loading="loading"
      @on-ok="dialogStatus==='create'?createData():updateData()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="400"
       ok-text="提交"
      cancel-text="关闭">
        <Form ref="deptForm" :model="deptTemp" :rules="rules" :label-width="80">
          <Form-item label="名称" prop="name">
            <Input type="text" v-model="deptTemp.name" :maxlength="10"></Input>
          </Form-item>
          <Form-item label="排序值" prop="postionCode">
            <Input type="text" v-model="deptTemp.sort" :maxlength="5"></Input>
          </Form-item>
            <Form-item label="类型" prop="isDelete">
              <Select v-model="deptTemp.type" clearable placeholder="请选择">
                <Option :value="1">公司</Option>
                <Option :value="2">机构</Option>
              </Select>
            </Form-item>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { getCompanyPageList, addCompany, editCompany, deleteCompany } from '@/api/organize'
export default {
  name: 'module',
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
        { title: '机构名称', key: 'name' },
        {
          title: '类型',
          key: 'type',
          render: (h, params) => {
            const row = params.row
            let text = row.type === 1 ? '公司' : '机构'
            return h(
              'div',
              text
            )
          }
        },
        { title: '创建时间', key: 'createTime' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleUpdate(params.row)
                  }
                }
              }, '编辑'),
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  title: '您确定要删除吗'
                },
                on: {
                  'on-ok': () => {
                    this.handleDelete(params.row.id)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  }
                }, '删除')
              ])
            ])
          }
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
        deptName: ''
      },
      deptTemp: {
        id: undefined,
        parentId: '',
        name: '',
        sort: '',
        type: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0
      },
      rules: {
        name: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, type: 'number', message: '必填项，不能为空', trigger: 'change' }
        ]
      },
      isFirstEnter: true
    }
  },
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据，
  // 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {

  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
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
  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      getCompanyPageList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置表单页面赋值
    resetDeptTemp() {
      this.deptTemp = {
        id: undefined,
        parentId: '',
        name: '',
        sort: '',
        type: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0
      }
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
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetDeptTemp()
      this.$refs['deptForm'].resetFields()
    },
    createData() {
      this.$refs['deptForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addCompany(this.deptTemp).then(res => {
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
      this.deptTemp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.$refs['deptForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['deptForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editCompany(this.deptTemp).then(res => {
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
      deleteCompany(id).then(res => {
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
