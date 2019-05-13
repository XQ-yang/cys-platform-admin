<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="角色名称" class="search-input" v-model="listQuery.roleName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'addRole'}" @click="handleCreate" class="search-btn">新增</Button>
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
        <Form ref="roleForm" :model="roleTemp" :rules="rules" :label-width="100" style="padding-right:20px;">
          <Form-item label="角色名称" prop="name">
            <Input type="text" v-model="roleTemp.name" :maxlength="10"></Input>
          </Form-item>
        </Form>
      </Modal>
      <Modal
      v-model="roleDialogFormVisible"
      :title="roleDialogTitle"
      :loading="loading"
      @on-ok="setRole"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :scrollable="true"
      width="400"
      ok-text="提交"
      cancel-text="关闭">
          <div style="height:400px;overflow-y:auto">
            <Tree :data="treeList"  show-checkbox ref="roleTree" ></Tree>
          </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { fetchList, editRole, addRole, deleteRole, rolePermTree, updateRolePerm } from '@/api/role'
import { expandTree } from '@/libs/util'
export default {
  name: 'role',
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
        { title: '角色名称', key: 'name' },
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
                    value: { rule: 'editRole' }
                  }
                ],
                on: {
                  click: () => {
                    this.handleUpdate(params.row)
                  }
                }
              }, '编辑'),
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
                    value: { rule: 'setRole' }
                  }
                ],
                on: {
                  click: () => {
                    this.handleSetRole(params.row)
                  }
                }
              }, '分配权限'),
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
                    type: 'error',
                    size: 'small'
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'deleteRole' }
                    }
                  ]
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
        roleName: '',
        name: this.$store.state.user.userName
      },
      roleTemp: {
        id: undefined,
        name: '',
        code: '',
        description: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0
      },
      rules: {
        name: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      },
      treeList: [],
      // 定义设置权限提交的对象
      permTemp: {
        roleId: '',
        permIds: []
      },
      roleDialogTitle: '',
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
      fetchList(this.listQuery).then(res => {
        // const username = this.$store.state.user.userName
        this.list = res.data.list
        // // 判断是否是超级管理员
        // if (username === 'superadmin') {
        //   this.list = res.data.list
        // } else {
        //   // 如果不是超级管理员则移除 超级管理员的角色
        //   // res.data.list.splice(res.data.list.findIndex(item => item.name === '超级管理员'), 1)
        //   this.list = res.data.list
        //   this.list = this.list.filter(item => {
        //     return item.name !== '超级管理员'
        //   })
        // }

        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 重置表单页面赋值
    resetRoleTemp() {
      this.roleTemp = {
        id: undefined,
        name: '',
        code: '',
        description: '',
        createTime: new Date(),
        updateTime: new Date(),
        status: 0
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
      this.resetRoleTemp()
      this.$refs['roleForm'].resetFields()
    },
    createData() {
      this.$refs['roleForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addRole(this.roleTemp).then(res => {
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
      this.roleTemp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.$refs['roleForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['roleForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editRole(this.roleTemp).then(res => {
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
      deleteRole(id).then(res => {
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
    },
    handleSetRole(row) {
      this.$Spin.show()
      this.permTemp.roleId = row.id
      this.roleDialogTitle = '角色权限设置：' + row.name
      this.roleDialogFormVisible = true
      this.treeList = []
      rolePermTree(this.permTemp.roleId).then(res => {
        this.treeList = expandTree(res.data)
        this.$Spin.hide()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    setRole() {
      this.permTemp.permIds = []
      const data = this.$refs.roleTree.getCheckedAndIndeterminateNodes()
      data.map(item => {
        this.permTemp.permIds.push(item.id)
      })
      updateRolePerm(this.permTemp).then(res => {
        this.changeLoading()
        this.roleDialogFormVisible = false
        this.$Message.success(res.msg)
      }).catch(error => {
        this.changeLoading()
        this.roleDialogFormVisible = true
        this.$Message.error(error.msg)
      })
    }

  }
}
</script>
