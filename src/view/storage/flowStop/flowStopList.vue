<template>
  <div>
    <Tabs :value="flowStopState" @on-click="changeTab($event)" type="card">
      <TabPane :label="applyTotalLabel" name="addPage">
        <Card>
          <div class="search-con search-con-top">
            <Input @on-change="handleClear"  clearable placeholder="样本条码" class="search-input" v-model="applyQuery.sampleCode"/>
            <Button @click="handleSearch" class="search-btn">查询</Button>
            <Button v-permission="{rule:'flowStopAdd'}" @click="handleCreate" class="search-btn">报废申请</Button>
          </div>
          <Table :data="applyList" :columns="applyColumns" :loading="tableLoading" border stripe>
            <template slot-scope="{row,index}" slot="action">
              <Button v-permission="{rule:'flowStopEdit'}"  type="primary" size="small" style="margin: 5px" @click="handleUpdate(row)">编辑</Button>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button  v-permission="{rule:'flowStopDelete'}" type="error" size="small">删除</Button>
            </Poptip>
            </template>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="applyTotal>0"
                :total="applyTotal"
                :current.sync="applyQuery.pageIndex"
                :page-size.sync="applyQuery.pageSize"
                @on-change="getApplyList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane :label="auditTotalLabel" name="auditPage">
        <Card>
          <div class="search-con search-con-top">
            <Input @on-change="handleAuditClear"  clearable placeholder="样本条码" class="search-input" v-model="auditQuery.sampleCode"/>
            <Button @click="auditSearch" class="search-btn">查询</Button>
          </div>
          <Table :data="auditList" :columns="applyColumns" :loading="tableLoading" border stripe>
            <template slot-scope="{row,index}" slot="action">
              <Button v-permission="{rule:'flowStopEdit'}"  type="primary" size="small" style="margin: 5px" @click="handleAudit(row)">审核</Button>
            </template>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="auditTotal>0"
                :total="auditTotal"
                :current.sync="auditQuery.pageIndex"
                :page-size.sync="auditQuery.pageSize"
                @on-change="getAuditList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane  :label="stockOutTotalLabel" name="stockOutPage">
        <Card>
          <div class="search-con search-con-top">
            <Input @on-change="handleStockOutClear" clearable placeholder="样本条码" class="search-input" v-model="stockOutQuery.sampleCode"/>
            <Button @click="stockOutSearch" class="search-btn">查询</Button>
          </div>
          <Table :data="stockOutList" :columns="applyColumns" :loading="tableLoading" border stripe>
            <template slot-scope="{row,index}" slot="action">
              <Button v-permission="{rule:'flowStopStockOut'}"  type="primary" size="small" style="margin: 5px" @click="handleStockOut(row)">报废出库</Button>
            </template>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="stockOutTotal>0"
                :total="stockOutTotal"
                :current.sync="stockOutQuery.pageIndex"
                :page-size.sync="stockOutQuery.pageSize"
                @on-change="getStockOutList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane label="报废台账" name="showPage">
        <Card>
          <div class="search-con search-con-top">
            <Input @on-change="handleAllClear"  clearable placeholder="样本条码" class="search-input" v-model="allQuery.sampleCode"/>
            <Button @click="allSearch" class="search-btn">查询</Button>
          </div>
          <Table :data="allList" :columns="applyColumns" :loading="tableLoading" border stripe>
            <template slot-scope="{row,index}" slot="action">
              <Button v-permission="{rule:'flowStopEdit'}"  type="primary" size="small" style="margin: 5px" @click="handleBrowse(row)">查看</Button>
            </template>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="allTotal>0"
                :total="allTotal"
                :current.sync="allQuery.pageIndex"
                :page-size.sync="allQuery.pageSize"
                @on-change="getApplyList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import { fetchList, deleteflowStop } from '@/api/flowStop'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'flowStop',
  filters: {
    statusText(param) {
      let text
      switch (param) {
        case '1':
          text = '未审核'
          break
        case '2':
          text = '已审核'
          break
        case '3':
          text = '已报废出库'
          break
      }
      return text
    }
  },
  data() {
    return {
      applyColumns: [
        {
          title: '序号',
          width: 66,
          render: (h, params) => {
            return h('span', params.index + (this.applyQuery.pageIndex - 1) * this.applyQuery.pageSize + 1)
          }
        },
        { title: '样本条码', key: 'sampleCode' },
        { title: '细胞编码', key: 'batchNo' },
        { title: '细胞规格', key: 'standard' },
        { title: '报废数量', key: 'amount' },
        { title: '申请人', key: 'proposer' },
        { title: '申请日期',
          key: 'appDate',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.appDate, 'yyyy-MM-dd')
            )
          }
        },
        // { title: '审核结果', key: 'auditRes' },
        { title: '处理结果', key: 'audit' },
        // { title: '审核意见', key: 'opinion' },
        { title: '审核人', key: 'auditor' },
        { title: '审核状态',
          key: 'auditType',
          render: (h, params) => {
            return h('div',
              this.$options.filters.statusText(params.row.auditType)
            )
          }
        },
        { title: '审核日期',
          key: 'auditingDate',
          width: 126,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.auditingDate, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      // 报废申请
      applyTotalLabel: (h) => {
        return h('div', [
          h('span', '报废申请'),
          h('Badge', {
            props: {
              count: this.applyTotal
            }
          })
        ])
      },
      applyList: [],
      applyQuery: {
        pageIndex: 1,
        pageSize: 10,
        sampleCode: '',
        auditType: '1'
      },
      applyTotal: 0,
      tableLoading: false,
      // 报废审核
      auditTotalLabel: (h) => {
        return h('div', [
          h('span', '报废审核'),
          h('Badge', {
            props: {
              count: this.auditTotal
            }
          })
        ])
      },
      loading: true,
      auditList: [],
      auditTotal: 0,
      auditQuery: {
        pageIndex: 1,
        pageSize: 10,
        sampleCode: '',
        auditType: '1'
      },
      // 报废出库
      stockOutTotalLabel: (h) => {
        return h('div', [
          h('span', '报废出库'),
          h('Badge', {
            props: {
              count: this.stockOutTotal
            }
          })
        ])
      },
      stockOutList: [],
      stockOutTotal: 0,
      stockOutQuery: {
        pageIndex: 1,
        pageSize: 10,
        sampleCode: '',
        auditType: '2'
      },
      // 台账
      allList: [],
      allTotal: 0,
      allQuery: {
        pageIndex: 1,
        pageSize: 10,
        sampleCode: '',
        auditType: ''
      },
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      this.getApplyList()
      this.getAuditList()
      this.getStockOutList()
      this.getAllFlowStopData()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      this.getApplyList()
      this.getAuditList()
      this.getStockOutList()
      this.getAllFlowStopData()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      flowStopState: state => state.flowStop.flowStopState
    })
  },
  methods: {
    ...mapMutations([
      'setFlowStopState'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的异常列表状态
      this.setFlowStopState(e)
    },
    getApplyList() {
      this.tableLoading = true
      fetchList(this.applyQuery).then(res => {
        this.applyList = res.data.list
        this.applyTotal = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getAuditList() {
      this.tableLoading = true
      fetchList(this.auditQuery).then(res => {
        this.auditList = res.data.list
        this.auditTotal = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getStockOutList() {
      this.tableLoading = true
      fetchList(this.stockOutQuery).then(res => {
        this.stockOutList = res.data.list
        this.stockOutTotal = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getAllFlowStopData() {
      this.tableLoading = true
      fetchList(this.allQuery).then(res => {
        this.allList = res.data.list
        this.allTotal = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
      this.applyQuery.pageIndex = 1
      this.getApplyList()
    },
    auditSearch() {
      this.auditQuery.pageIndex = 1
      this.getAuditList()
    },
    stockOutSearch() {
      this.stockOutQuery.pageIndex = 1
      this.getStockOutList()
    },
    allSearch() {
      this.allQuery.pageIndex = 1
      this.getAllFlowStopData()
    },
    handleCreate() {
      const route = {
        name: 'flowStopAdd'
      }
      this.$router.push(route)
    },
    handleUpdate(row) {
      const route = {
        name: 'flowStopEdit',
        query: {
          id: row.id
        }
      }
      this.$router.push(route)
    },
    handleAudit(row) {
      const route = {
        name: 'flowStopAudit',
        query: {
          id: row.id
        }
      }
      this.$router.push(route)
    },
    handleStockOut(row) {
      const route = {
        name: 'flowStopStockOut',
        query: {
          id: row.id
        }
      }
      this.$router.push(route)
    },
    handleDelete(id) {
      deleteflowStop(id).then(res => {
        this.$Message.success('删除成功')
        this.getApplyList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleBrowse(row) {
      const route = {
        name: 'flowStopBrowse',
        query: {
          id: row.id
        }
      }
      this.$router.push(route)
    },
    // 清空查询值的时候 重新加载报废申请
    handleClear(e) {
      if (e.target.value === '') {
        this.getApplyList()
      }
    },
    // 清空查询值的时候 重新加载报废申请
    handleAuditClear(e) {
      if (e.target.value === '') {
        this.getAuditList()
      }
    },
    handleStockOutClear(e) {
      if (!e.target.value) {
        this.getStockOutList()
      }
    },
    handleAllClear(e) {
      if (e.target.value === '') {
        this.getAllFlowStopData()
      }
    }
  }
}
</script>
