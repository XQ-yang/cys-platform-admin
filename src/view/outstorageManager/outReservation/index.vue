<template>
  <div>
    <Tabs type="card"  @on-click="changeTab($event)">
      <TabPane :label="countLeble" name="countLeble">
        <Card>
          <div class="search-con search-con-top">
            <Input @on-change="handleClear"  clearable placeholder="顾客姓名" class="search-input" v-model="listQuery.customerName"/>
            <Input @on-change="handleClear"  clearable placeholder="联系电话" class="search-input" v-model="listQuery.phone"/>
            <Button @click="handleSearch" class="search-btn">查询</Button>
          </div>
          <Table :data="list" :columns="columns" :loading="tableLoading" border stripe>
            <template slot-scope="{row,index}" slot="action">
            <Poptip
                confirm
                transfer
                title="您确定已处理吗?"
                @on-ok="handelEdit(row)"
                >
               <Button  v-permission="{rule:'reservationOk'}" type="primary" size="small" style="margin: 5px" >确认完成</Button>
            </Poptip>
            <Poptip
                confirm
                transfer
                title="您确定要删除吗?"
                @on-ok="handleDelete(row.id)"
                >
               <Button v-permission="{rule:'reservationDelete'}" type="error" size="small">删除</Button>
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
      </TabPane>
      <TabPane label="台账" name="desk">
        <Card>
          <div class="search-con search-con-top">
            <Input @on-change="handleLedgerClear"  clearable placeholder="顾客姓名" class="search-input" v-model="ledgerQuery.customerName"/>
            <Input @on-change="handleLedgerClear"  clearable placeholder="联系电话" class="search-input" v-model="ledgerQuery.phone"/>
            <Button @click="handleLedgerSearch" class="search-btn">查询</Button>
          </div>
          <Table :data="ledgerList" :columns="ledgerColumns" :loading="tableLoading" border stripe>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="ledgerTotal>0"
                :total="ledgerTotal"
                :current.sync="ledgerQuery.pageIndex"
                :page-size.sync="ledgerQuery.pageSize"
                @on-change="getLedgerList"
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
import { fetchList, deleteReservation, edit } from '@/api/reservation'
export default {
  name: 'outReservation',
  data() {
    return {
      // 显示待处理记录总数
      countLeble: (h) => {
        return h('div', [
          h('span', '预约待处理'),
          h('Badge', {
            props: {
              count: this.total
            }
          })
        ])
      },
      list: [],
      columns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '合同编号', key: 'contractNo', tooltip: true },
        { title: '姓名', key: 'customerName', tooltip: true },
        { title: '身份证号', key: 'cardNo', tooltip: true },
        { title: '申请数量', key: 'amount', tooltip: true },
        { title: '电话', key: 'phone', tooltip: true },
        { title: '申请原因', key: 'reason', tooltip: true },
        { title: '申请日期',
          key: 'appDate',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.appDate, 'yyyy-MM-dd')
            )
          }
        },
        { title: '状态',
          key: 'status',
          render: (h, params) => {
            return h('div', params.row.status === 1 ? '待处理' : '已处理')
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 180
        }
      ],
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        customerName: '',
        phone: '',
        status: '1'
      },
      total: 0,
      tableLoading: false,
      loading: true,
      // 台账查询条件
      ledgerQuery: {
        pageIndex: 1,
        pageSize: 10,
        customerName: '',
        phone: '',
        status: ''
      },
      ledgerList: [],
      ledgerColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageIndex - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '合同编号', key: 'contractNo' },
        { title: '姓名', key: 'customerName' },
        { title: '身份证号', key: 'cardNo', tooltip: true },
        { title: '申请数量', key: 'amount' },
        { title: '电话', key: 'phone', tooltip: true },
        { title: '申请原因', key: 'reason', tooltip: true },
        { title: '申请日期',
          key: 'appDate',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.appDate, 'yyyy-MM-dd')
            )
          }
        },
        { title: '状态',
          key: 'status',
          render: (h, params) => {
            return h('div', params.row.status === 1 ? '待处理' : '已处理')
          }
        },
        { title: '处理日期',
          key: 'updateTime',
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.updateTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '处理人', key: 'operatorName', tooltip: true }

      ],
      ledgerTotal: 0,
      editTemp: {
        id: undefined,
        status: '',
        operator: '',
        operatorName: ''
      },
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      this.getList()
      this.getLedgerList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      this.getList()
      this.getLedgerList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  methods: {
    changeTab(e) {
      switch (e) {
        case 'countLeble':
          this.getList()
          break
        case 'desk':
          this.getLedgerList()
          break
      }
    },
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
    getLedgerList() {
      this.tableLoading = true
      fetchList(this.ledgerQuery).then(res => {
        this.ledgerList = res.data.list
        this.ledgerTotal = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    handleLedgerSearch() {
      this.ledgerQuery.pageIndex = 1
      this.getLedgerList()
    },
    handelEdit(row) {
      this.editTemp.id = row.id
      this.editTemp.status = 2
      this.editTemp.operator = this.$store.state.user.userId
      this.editTemp.operatorName = this.$store.state.user.userName
      edit(this.editTemp).then(res => {
        this.$Message.success(res.msg)
        this.getList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleDelete(id) {
      deleteReservation(id).then(res => {
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
    // 清空查询值的时候 重新加载列表数据
    handleLedgerClear(e) {
      if (e.target.value === '') {
        this.getLedgerList()
      }
    }
  }

}
</script>
