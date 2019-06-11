<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input
          @on-change="handleClear"
          clearable
          placeholder="用户名"
          class="search-input"
          v-model="listQuery.username"
        />
        <Input
          @on-change="handleClear"
          clearable
          placeholder="姓名"
          class="search-input"
          v-model="listQuery.realName"
        />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="addOrUpdateHandle()" class="search-btn">新增</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin: 5px"
            @click="addOrUpdateHandle(row.id)"
          >编辑</Button>
          <Poptip confirm transfer title="您确定要删除吗?" @on-ok="handleDelete(row.id)">
            <Button type="error" style="margin: 5px" size="small">删除</Button>
          </Poptip>
          <Poptip confirm transfer title="您确定要重置该用户的密码吗?" @on-ok="onResetPwd(row.id)" v-if="row.username!='admin'">
            <Button type="error"  style="margin: 5px" size="small">重置密码</Button>
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
            next-text="下一页"
          ></Page>
        </div>
      </div>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { fetchList, deleteUser, resetPassword } from '@/api/user'
import AddOrUpdate from './add-or-update'
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
            return h(
              'span',
              params.index +
                (this.listQuery.pageNumber - 1) * this.listQuery.pageSize +
                1
            )
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
            return h('div', text)
          }
        },
        { title: '手机', key: 'mobile', tooltip: true },
        { title: '组织', key: 'orgName', tooltip: true },
        { title: '部门', key: 'deptName', tooltip: true },
        { title: '岗位', key: 'positionName', tooltip: true },
        { title: '角色', key: 'roleName', tooltip: true },
        {
          title: '创建时间',
          key: 'createTime',
          tooltip: true,
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
          render: (h, params) => {
            const row = params.row
            const text = row.status === 0 ? '启用' : '禁用'
            const color = row.status === 0 ? 'success' : 'error'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 250,
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
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据，
  // 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {
    this.getList()
  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {},
  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery)
        .then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
        .catch(error => {
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
      this.getList()
    },
    handleDelete(id) {
      deleteUser(id)
        .then(res => {
          this.$Message.success(res.msg)
          this.getList()
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    onResetPwd(id) {
      resetPassword({ userId: id })
        .then(res => {
          this.$Message.success(res.msg)
          this.getList()
        })
        .catch(error => {
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
