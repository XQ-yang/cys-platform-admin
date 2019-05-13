<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
       <Input @on-change="handleClear"  clearable placeholder="物料编号" class="search-input" v-model="listQuery.materialNo"/>
        <Input @on-change="handleClear"  clearable placeholder="物料名称" class="search-input" v-model="listQuery.materialName"/>
        <Input @on-change="handleClear"  clearable placeholder="批号" class="search-input" v-model="listQuery.batchNumber"/>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'productAdd'}" @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{row,index}" slot="action">
            <Button  v-permission="{rule:'editStoreStock'}" type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">编辑</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'delStoreStock'}" type="error" size="small">删除</Button>
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
import { fetchList, deleteStoreStock } from '@/api/storeStock'
export default {
  name: 'storeStock',
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
        { title: '物料编号', key: 'materialNo' },
        { title: '物料名称', key: 'materialName' },
        { title: '生产编号', key: 'productNo' },
        { title: '生产厂家', key: 'manufacturers' },
        { title: '批号', key: 'batchNumber' },
        {
          title: '生产日期',
          key: 'productTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.productTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '有效期',
          key: 'expireTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.expireTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '添加人', key: 'createBy' },
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
      textMap: {
        update: '编辑',
        create: '新增'
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        batchNumber: '',
        materialNo: '',
        materialName: ''
      }
    }
  },
  created() {

  },
  mounted() {
    this.getList()
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
    handleDelete(id) {
      deleteStoreStock(id).then(res => {
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
    },
    handleCreate() {
      const route = {
        name: 'addStoreStock',
        query: {
          id: 'addStoreStock'
        }
      }
      this.$router.push(route)
    },
    handleUpdate(row) {
      const route = {
        name: 'editStoreStock',
        query: {
          id: 'editStoreStock',
          stockId: row.id
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
