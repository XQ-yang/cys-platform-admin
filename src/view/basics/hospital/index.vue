<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="医院名称" class="search-input" v-model="listQuery.name"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCreate" class="search-btn" v-permission="{rule:'addHospital'}">新增</Button>
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
        <Form ref="hospitalForm" :model="hospitalTemp" :rules="rules" :label-width="100" style="padding-right:20px;">
          <Form-item label="医院名称" prop="hospitalName">
            <Input type="text" v-model="hospitalTemp.hospitalName" :maxlength="30" ></Input>
          </Form-item>
          <Form-item label="医院地址" prop="hospitalAddress">
            <Input type="text" v-model="hospitalTemp.hospitalAddress" :maxlength="40"></Input>
          </Form-item>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { getPageList, addHospital, editHospital, deleteHospital, existName } from '@/api/hospital'

export default {
  name: 'hospital',
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
        { title: '医院名称', key: 'hospitalName' },
        { title: '医院地址', key: 'hospitalAddress' },
        { title: '创建时间',
          key: 'createTime',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
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
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'editHospital' }
                  }
                ],
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
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'deleteHospital' }
                  }
                ],
                on: {
                  'on-ok': () => {
                    this.handleDelete(params.row.id, params.row.hospitalName)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
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
      // 角色弹出层控制属性
      roleDialogFormVisible: false,
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
        name: ''
      },
      hospitalTemp: {
        id: undefined,
        hospitalName: '',
        hospitalAddress: '',
        oldName: ''
      },
      rules: {
        hospitalName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === this.hospitalTemp.oldName) {
                callback()
              }
              existName({ name: value })
                .then(res => {
                  if (res.data) {
                    callback(new Error('医院已存在'))
                  } else {
                    callback()
                  }
                })
                .catch(error => {
                  this.$Message.error(error.msg)
                })
            },
            trigger: 'blur'
          }
        ]
      },
      isFirstEnter: true
    }
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
      getPageList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置表单页面赋值
    resetHospitalTemp() {
      this.hospitalTemp = {
        id: undefined,
        hospitalName: '',
        hospitalAddress: '',
        oldName: ''
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
      this.resetHospitalTemp()
      this.$refs['hospitalForm'].resetFields()
    },
    createData() {
      this.$refs['hospitalForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addHospital(this.hospitalTemp).then(res => {
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
      this.hospitalTemp = Object.assign({}, row)
      this.hospitalTemp.oldName = this.hospitalTemp.hospitalName
      this.dialogStatus = 'update'
      this.$refs['hospitalForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['hospitalForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editHospital(this.hospitalTemp).then(res => {
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
    handleDelete(id, name) {
      deleteHospital({ id: id, name: name }).then(res => {
        this.$Message.success(res.msg)
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
