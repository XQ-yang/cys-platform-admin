<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="角色名称" class="search-input" v-model="listQuery.roleName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="addOrUpdateHandle()" class="search-btn">新增</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
            <Button  type="primary" size="small" style="margin: 5px" @click="addOrUpdateHandle(row.id)">编辑</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button type="error" size="small">删除</Button>
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
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate" @refreshDataList="getList"></add-or-update>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { fetchList, deleteRole } from '@/api/role'
import AddOrUpdate from './add-or-update'
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
        { title: '角色名称', key: 'roleName' },
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
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      tableLoading: false,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        roleName: ''
      },
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
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
      })
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpate.dataForm.id = id
        this.$refs.addOrUpate.init()
      })
    },
    handleDelete(id) {
      debugger
      deleteRole(id).then(res => {
        debugger
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
