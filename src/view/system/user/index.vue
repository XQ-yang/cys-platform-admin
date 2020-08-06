<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        用户名：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="用户名"
          class="search-input"
          v-model="listQuery.username"
        />姓名：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="姓名"
          class="search-input"
          v-model="listQuery.realName"
        />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'user:add'}" @click="addOrUpdateHandle()" class="search-btn">新增</Button>
        <Button @click="exportData" class="search-btn">导出Excel</Button>
        <Button @click="exportWordDemo" class="search-btn">导出word例子</Button>
        <Button @click="exportPdfDemo" class="search-btn">导出pdf例子</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            v-permission="{rule:'user:edit'}"
            type="primary"
            size="small"
            style="margin: 5px"
            @click="addOrUpdateHandle(row.id)"
          >编辑</Button>
          <Dropdown @on-click="dropDownClick($event,row)" transfer>
            <Button type="warning" size="small" style="margin: 5px">
              更多
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-permission="{rule:'user:resetPass'}" name="resetPwd">重置密码</DropdownItem>
              <DropdownItem v-permission="{rule:'user:del'}" name="delete">删除</DropdownItem>
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
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"
          ></Page>
        </div>
      </div>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
    </Card>
  </div>
</template>

<script>
import {
  fetchList,
  deleteUser,
  resetPassword,
  exportData,
  exportWord,
  exportPdf
} from '@/api/user'
import AddOrUpdate from './add-or-update'
import { saveAs } from 'file-saver'

export default {
  name: 'user',

  data() {
    return {
      list: [],

      tableColumns: [
        {
          title: '序号',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h(
              'span',
              params.index +
                (this.listQuery.pageNumber - 1) * this.listQuery.pageSize +
                1
            )
          }
        },
        {
          title: '用户名',
          key: 'username',
          align: 'center',
          minWidth: 150
        },
        {
          title: '姓名',
          key: 'realName',
          align: 'center',
          minWidth: 150
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.genderFilter(row.sex)
            return h('div', text)
          }
        },
        {
          title: '手机号码',
          key: 'mobile',
          align: 'center',
          minWidth: 130
        },
        {
          title: '组织',
          key: 'orgName',
          align: 'center',
          minWidth: 150
        },
        {
          title: '部门',
          key: 'deptName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '角色',
          key: 'roleName',
          align: 'center',
          minWidth: 150
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            const row = params.row
            const text = row.status === 1 ? '启用' : '禁用'
            const color = row.status === 1 ? 'green' : 'red'
            return h('Badge',
              {
                props: {
                  color: color,
                  text: text
                }
              })
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 200,
          fixed: 'right',
          slot: 'action'
        }
      ],

      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        username: '',
        realName: ''
      },

      addOrUpdateVisible: false,
      dataListLoading: false
    }
  },

  components: {
    AddOrUpdate
  },

  filters: {
    genderFilter(gender) {
      const genderMap = ['未知', '男', '女']
      return genderMap[gender]
    }
  },

  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据，
  // 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {
    this.getList()
  },

  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
  },

  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery)
        .then((res) => {
          this.list = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        }).catch((error) => {
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

    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },

    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    exportData() {
      exportData(this.listQuery)
        .then((res) => {
          var filename = decodeURIComponent(res.headers['filename'])
          saveAs(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel;charset=UTF-8'
            }),
            filename
          )
        })
        .catch((error) => {
          this.$Message.error(error.msg)
        })
    },

    exportWordDemo() {
      exportWord(this.listQuery)
        .then((res) => {
          var filename = decodeURIComponent(res.headers['filename'])
          saveAs(
            new Blob([res.data], {
              type: 'application/vnd.ms-word;charset=UTF-8'
            }),
            filename
          )
        })
        .catch((error) => {
          this.$Message.error(error.msg)
        })
    },

    exportPdfDemo() {
      exportPdf(this.listQuery)
        .then((res) => {
          var filename = decodeURIComponent(res.headers['filename'])
          saveAs(
            new Blob([res.data], {
              type: 'application/x-download;charset=UTF-8'
            }),
            filename
          )
        })
        .catch((error) => {
          this.$Message.error(error.msg)
        })
    },

    handleDelete(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该数据吗？',
        onOk: () => {
          deleteUser(id)
            .then((res) => {
              this.$Message.success(res.msg)
              this.getList()
            })
            .catch((error) => {
              this.$Message.error(error.msg)
            })
        }
      })
    },

    onResetPwd(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要重置该用户的密码吗?',
        onOk: () => {
          resetPassword(id)
            .then((res) => {
              this.$Message.success(res.msg)
              this.getList()
            })
            .catch((error) => {
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
        case 'resetPwd':
          this.onResetPwd(row.id)
          break
        case 'setDataRole':
          alert('setDataRole')
          break
        case 'delete':
          this.handleDelete(row.id)
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
