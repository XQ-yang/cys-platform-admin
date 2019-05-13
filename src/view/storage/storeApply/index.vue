<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Input @on-change="handleClear"  clearable placeholder="样本条码" class="search-input" v-model="listQuery.sampleCode"/>
        <Input @on-change="handleClear"  clearable placeholder="细胞编码" class="search-input" v-model="listQuery.cellCode"/>
        <Input @on-change="handleClear"  clearable placeholder="申请人" class="search-input" v-model="listQuery.customerName"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'storeapplyAdd'}" @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{row,index}" slot="action">
            <Button v-permission="{rule:'storeapplyEdit'}" type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">编辑</Button>
            <Button v-permission="{rule:'storeapplyView'}" type="primary" size="small" style="margin: 5px" @click="view(row)">查看</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'storeapplyDelete'}" type="error" size="small">删除</Button>
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
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { fetchList, deleteStoreApply } from '@/api/storeApply'
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
        { title: '样本条码', key: 'sampleCode' },
        { title: '细胞编码', key: 'cellCode' },
        { title: '顾客姓名', key: 'customerName' },
        { title: '申请人', key: 'applyUserName' },
        { title: '申请日期',
          key: 'applyDate',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.applyDate, 'yyyy-MM-dd')
            )
          }
        },
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
      dialogFormVisible: false,
      dialogStatus: '',
      tableLoading: false,
      loading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        sampleCode: '',
        customerName: '',
        cellCode: ''
      },
      storeApplyTemp: {
        id: undefined,
        applyUserName: '',
        sampleCode: '',
        customerName: '',
        applyDate: '',
        createTime: '',
        createBy: '',
        updateBy: ''
      },
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
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
      const route = {
        name: 'storeapplyAdd'
      }
      this.$router.push(route)
    },
    handleUpdate(row) {
      const route = {
        name: 'storeapplyEdit',
        query: {
          id: row.id
        }
      }
      this.$router.push(route)
    },
    view(row) {
      const route = {
        name: 'storeapplyView',
        query: {
          id: row.id
        }
      }
      this.$router.push(route)
    },
    handleDelete(id) {
      deleteStoreApply(id).then(res => {
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
