<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="账号" class="search-input" v-model="listQuery.username"/>
        <Input @on-change="handleClear" clearable placeholder="姓名" class="search-input" v-model="listQuery.realName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'userAdd'}"  @click="handleCreate" class="search-btn">新增</Button>
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
      <!--新增编辑弹出层-->
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
        <Form  ref="userForm" :model="userTemp" :rules="rules" :label-width="90" style="padding-right:20px;">
          <Row>
            <Col span="12">
              <Form-item label="账号" prop="username">
                <Input type="text" v-model="userTemp.username" :maxlength="10"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="密码" prop="password">
                <Input type="password" v-model="userTemp.password" :maxlength="16"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="公司"  prop="companyId">
                <Select v-model="userTemp.companyId" clearable placeholder="请选择" @on-change="selectCompanyChange">
                  <Option v-for="item in companyList" :key="item.id" :value="item.id" >{{item.name}}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="部门"  prop="departmentId">
                <Select v-model="userTemp.departmentId" clearable placeholder="请选择" ref="store">
                  <Option v-for="item in departmentList" :key="item.id" :value="item.id" >{{item.name}}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="岗位" prop="postionId">
                <Select v-model="userTemp.postionId" clearable placeholder="请选择">
                  <Option v-for="item in posttionList" :key="item.id" :value="item.id">{{item.postionName}}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="角色" prop="roleId">
                <Select v-model="userTemp.roleId" multiple clearable placeholder="请选择">
                  <Option v-for="item in roleList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="是否启用" prop="status">
                <Select v-model="userTemp.status" clearable placeholder="请选择">
                  <Option :value="0">启用</Option>
                  <Option :value="1">禁用</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="姓名" prop="realName">
                <Input type="text" v-model="userTemp.realName" :maxlength="10"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="性别">
                <RadioGroup v-model="userTemp.sex" >
                  <Radio :label="0">未知</Radio>
                  <Radio :label="1">男</Radio>
                  <Radio :label="2">女</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="出生日期" prop="birthday">
                <DatePicker type="date" placeholder="选择日期" :value="userTemp.birthday" @on-change="userTemp.birthday=$event" style="width:100%" ></DatePicker>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="手机号" prop="mobile">
                <Input type="text" v-model="userTemp.mobile" :maxlength="11" placeholder="请输入11位的手机号"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="微信">
                <Input type="text" v-model="userTemp.wxAccount" :maxlength="20"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="邮箱" prop="email">
                <Input type="text" v-model="userTemp.email" :maxlength="20"></Input>
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
import { fetchList, addUser, editUser, deleteUser } from '@/api/user'
import { getDepartmentdata } from '@/api/dept'
import { getCompanyList } from '@/api/organize'
import { getRoleData } from '@/api/role'
import { getPostionList } from '@/api/postion'
export default {
  name: 'user',
  filters: {
    genderFilter(gender) {
      const genderMap = ['未知', '男', '女']
      return genderMap[gender]
    }
  },
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
        { title: '账号', key: 'username', tooltip: true },
        { title: '姓名', key: 'realName', tooltip: true },
        {
          title: '性别',
          key: 'sex',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.genderFilter(row.sex)
            return h(
              'div',
              text
            )
          }
        },
        { title: '手机', key: 'mobile', tooltip: true },
        { title: '公司', key: 'companyName', tooltip: true },
        { title: '部门', key: 'departmentName', tooltip: true },
        { title: '岗位', key: 'postionName', tooltip: true },
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
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row
            const text = row.status === 0 ? '启用' : '禁用'
            const color = row.status === 0 ? 'success' : 'error'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '3px 2px 2px 3px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'userEdit' }
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
                  style: {
                    margin: '3px 2px 2px 3px'
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'userDelete' }
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
        username: '',
        realName: '',
        name: this.$store.state.user.userName
      },
      userTemp: {
        id: undefined,
        username: '',
        password: '',
        wxAccount: '',
        realName: '',
        email: '',
        mobile: '',
        avatar: '',
        sex: '',
        birthday: '',
        status: 0,
        departmentId: '',
        companyId: '',
        organizationId: '',
        roleId: '',
        postionId: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0
      },
      rules: {
        username: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '长度必须大于等于6', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        realName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        postionId: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        roleId: [
          { type: 'array', required: true, message: '必填项，不能为空' }
        ],
        sex: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        mobile: [
          { type: 'string',
            required: true,
            pattern: /^1[34578]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        email: [
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '长度必须大于等于6', trigger: 'blur' }
        ],
        status: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ]

      },
      // 公司
      companyList: [],
      // 部门
      departmentList: [],
      // 岗位
      posttionList: [],
      // 角色
      roleList: [],
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
      // 获取公司数据
      this.getCompany()
      // 获取部门数据
      // this.getDepartment()
      // 获取角色数据
      this.getRole()
      // 获取岗位
      this.getPostion()
    }
  },
  // keep-alive 钩子函数 只有启用了keep-alive缓存 才存在此钩子函数
  activated() {
    if (!this.isFirstEnter) {
    // 获取列表数据
      this.getList()
      // 获取公司数据
      this.getCompany()
      // 获取部门数据
      // this.getDepartment()
      // 获取角色数据
      this.getRole()
      // 获取岗位
      this.getPostion()
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
        // 判断是否是超级管理员
        // if (username === 'superadmin') {
        //   this.list = res.data.list
        // } else {
        //   // 如果不是超级管理员则移除 超级管理员的角色
        //   // res.data.list.splice(res.data.list.findIndex(item => item.username === 'superadmin'), 1)
        //   this.list = res.data.list
        //   this.list = this.list.filter(item => {
        //     return item.username !== 'superadmin'
        //   })
        // }
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },

    getDepartment() {
      getDepartmentdata(this.userTemp.companyId).then(res => {
        this.departmentList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getCompany() {
      getCompanyList().then(res => {
        this.companyList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getPostion() {
      getPostionList().then(res => {
        this.posttionList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getRole() {
      getRoleData().then(res => {
        this.roleList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // select选择项改变触发事件
    selectCompanyChange(val) {
      this.$refs.store.clearSingleSelect()
      if (val) {
        getDepartmentdata(val).then(res => {
          this.departmentList = res.data
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }
    },
    // 重置表单页面赋值
    resetUserTemp() {
      this.userTemp = {
        id: undefined,
        username: '',
        password: '',
        wxAccount: '',
        realName: '',
        email: '',
        mobile: '',
        avatar: '',
        sex: '',
        birthday: '',
        status: 0,
        departmentId: '',
        companyId: '',
        organizationId: '',
        roleId: '',
        postionId: '',
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
      this.resetUserTemp()
      this.dialogFormVisible = true
      this.$refs['userForm'].resetFields()
    },
    createData() {
      this.$refs['userForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addUser(this.userTemp).then(res => {
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
      this.userTemp = Object.assign({}, row)
      if (this.userTemp.roleId) {
        this.userTemp.roleId = this.userTemp.roleId.split(',')
      }
      // 根据公司id 获取部门信息
      if (this.userTemp.companyId) {
        this.getDepartment()
      }

      this.dialogStatus = 'update'
      this.$refs['userForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['userForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editUser(this.userTemp).then(res => {
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
      deleteUser(id).then(res => {
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
<style  scoped>

</style>
