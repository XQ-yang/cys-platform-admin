<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        角色名称：
        <Input @on-clear="handleClear" clearable placeholder="角色名称" class="search-input" v-model="listQuery.roleName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCancel" class="search-btn">重置</Button>
        <Button v-permission="{rule:'role:add'}" @click="addOrUpdateHandle()" class="search-btn">新增</Button>
      </div>
      <!--列表 分页-->
      <Table
      border
      stripe
      :data="list"
      :columns="tableColumns"
      :loading="tableLoading"
      :max-height="tableHeight"
      ref="table">
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin: 5px" @click="addOrUpdateHandle(row.id)">编辑</Button>
            <Dropdown @on-click="dropDownClick($event,row)" transfer>
              <Button type="warning" size="small" style="margin: 5px">
                更多
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem v-permission="{rule:'role:permission'}" name="setRole">角色权限</DropdownItem>
                <!-- <DropdownItem v-permission="{rule:'role:data'}" name="setDataRole">数据权限</DropdownItem> -->
                <DropdownItem v-permission="{rule:'role:del'}" name="delete">删除</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-page-size-change="pageSizeChange"
            @on-change="getList"
            show-total
            show-sizer
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate" @refreshDataList="getList"></add-or-update>
      <set-role v-if="setRoleVisible" ref="setRole"></set-role>
      <set-data-role v-if="setDataRoleVisible" ref="setDataRole"></set-data-role>
    </Card>
  </div>
</template>

<script>
import { fetchList, deleteRole } from '@/api/role'
import AddOrUpdate from './add-or-update'
import SetRole from './set-role'
import SetDataRole from './set-data-role'

export default {
  name: 'role',

  data() {
    return {
      list: [],

      // 列表高度
      tableHeight: 450,

      tableColumns: [
        {
          title: '序号',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1)
          }
        },
        {
          title: '角色名称',
          key: 'roleName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '数据权限',
          key: 'dataType',
          align: 'left',
          minWidth: 100,
          render: (h, params) => {
            // 1. 仅本人数据; 2. 所在部门数据; 3. 所在部门及下属部门数据; 4. 所在公司数据; 5. 所在公司及下属公司数据
            let dataTypeStr = ''
            switch (params.row.dataType) {
              case 1:
                dataTypeStr = '仅本人数据'
                break
              case 2:
                dataTypeStr = '所在部门数据'
                break
              case 3:
                dataTypeStr = '所在部门及下属部门数据'
                break
              case 4:
                dataTypeStr = '所在公司数据'
                break
              case 5:
                dataTypeStr = '所在公司及下属公司数据'
                break
            }
            return h('div', dataTypeStr)
          }
        },
        { title: '创建时间',
          key: 'createTime',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 180,
          fixed: 'right'
        }
      ],

      total: 0,
      tableLoading: false,

      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        roleName: ''
      },

      addOrUpdateVisible: false,
      setRoleVisible: false,
      setDataRoleVisible: false
    }
  },

  components: {
    AddOrUpdate,
    SetRole,
    SetDataRole
  },

  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据，
  // 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {
    // 获取列表数据
    this.getList()
  },

  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 180
  },

  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
        this.tableLoading = false
      })
    },

    pageSizeChange(pagesize) {
      this.listQuery.pageSize = pagesize
      this.getList()
    },

    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleCancel() {
      this.listQuery.pageNumber = 1
      this.listQuery.roleName = ''
      this.getList()
    },

    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpate.dataForm.id = id
        this.$refs.addOrUpate.init()
      })
    },

    setRole(row) {
      this.setRoleVisible = true
      this.$nextTick(() => {
        this.$refs.setRole.roleMenuTemp.roleId = row.id
        this.$refs.setRole.roleName = row.roleName
        this.$refs.setRole.init()
      })
    },

    setDataRole(row) {
      this.setDataRoleVisible = true
      this.$nextTick(() => {
        this.$refs.setDataRole.roleDeptTemp.roleId = row.id
        this.$refs.setDataRole.roleName = row.roleName
        this.$refs.setDataRole.init()
      })
    },

    handleDelete(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该数据吗？',
        onOk: () => {
          deleteRole(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    },

    // 清空查询值的时候 重新加载列表数据
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    },

    dropDownClick(e, row) {
      switch (e) {
        case 'setRole':
          this.setRole(row)
          break
        case 'setDataRole':
          this.setDataRole(row)
          break
        case 'delete':
          this.handleDelete(row.id)
          break
      }
    }
  }
}
</script>

<style>
.ivu-dropdown-item{
  z-index: 8888
}
</style>
