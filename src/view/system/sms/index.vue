<template>
  <div>
    <Card>
      <Row class="search-con" type="flex" justify="space-between" align="middle" @keyup.enter.native="handleSearch">
        <Col>
          <Input style="width:300px;" @on-clear="handleClear" clearable placeholder="手机号/发送内容" class="search-input" v-model="listQuery.condition"/>
          <Button @click="handleSearch" class="search-btn">查询</Button>
          <Button @click="handleCancel" class="search-btn">重置</Button>
        </Col>
        <Col>
        </Col>
      </Row>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
          <Button v-show="row.smsType === 2 && row.sendStatus === 2 && row.isResend === 0" type="primary" size="small" style="margin: 5px" @click="handleReSend(row.id)">重新发送</Button>
          <Button v-show="!row.receiveDate || row.sendStatus !== 3" type="primary" size="small" style="margin: 5px" @click="handleSmsSendReceipt(row.id)">获取回执</Button>
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
            next-text="下一页"
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { getPageList, recordReSend, getSmsSendReceipt } from '@/api/sms-send'
export default {
  name: 'sms-send',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 65,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '手机号', key: 'phoneNumber', tooltip: true },
        {
          title: '短信类型',
          key: 'smsType',
          render: (h, params) => {
            const row = params.row
            let text = null
            switch (row.smsType) {
              case 1:
                text = '验证码'
                break
              case 2:
                text = '通知'
                break
            }
            return h(
              'div',
              text
            )
          }
        },
        { title: '发送内容', key: 'content', tooltip: true },
        {
          title: '发送时间',
          key: 'sendDate',
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.sendDate, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '接收时间',
          key: 'receiveDate',
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.receiveDate, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '发送状态',
          key: 'sendStatus',
          render: (h, params) => {
            const row = params.row
            let text = null
            let type = null
            switch (row.sendStatus) {
              case 1:
                text = '等待回执'
                type = 'primary'
                break
              case 2:
                text = '发送失败'
                type = 'error'
                break
              case 3:
                text = '发送成功'
                type = 'success'
                break
            }
            return h('Badge',
              {
                props: {
                  type: type,
                  text: text
                }
              })
          }
        },
        {
          title: '是否已发送',
          key: 'isSend',
          render: (h, params) => {
            const row = params.row
            let text = null
            switch (row.isSend) {
              case 0:
                text = '未发送'
                break
              case 1:
                text = '已发送'
                break
            }
            return h(
              'div',
              text
            )
          }
        },
        { title: '错误状态码', key: 'errCode', tooltip: true },
        { title: '错误信息', key: 'errMsg', tooltip: true },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        condition: null
      }
    }
  },
  components: {
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      this.tableLoading = true
      getPageList(this.listQuery)
        .then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
        .catch(error => {
          this.$Message.error(error.msg)
          this.tableLoading = false
        })
    },
    handleReSend(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要重新发送吗？',
        onOk: () => {
          const loadMsg = this.$Message.loading({
            content: '正在重新发送...',
            duration: 0
          })
          recordReSend({ id }).then(res => {
            loadMsg()
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            loadMsg()
            this.$Message.error(error.msg)
            this.getList()
          })
        }
      })
    },
    handleSmsSendReceipt(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要获取发送回执吗？',
        onOk: () => {
          const loadMsg = this.$Message.loading({
            content: '正在获取发送回执...',
            duration: 0
          })
          getSmsSendReceipt(id).then(res => {
            loadMsg()
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            loadMsg()
            this.$Message.error(error.msg)
            this.getList()
          })
        }
      })
    },
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    pageSizeChange(pagesize) {
      this.listQuery.pageSize = pagesize
      this.getList()
    },
    handleCancel() {
      this.listQuery = {
        pageNumber: 1,
        pageSize: 10,
        condition: null
      }
      this.getList()
    },
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    }
  }
}
</script>
