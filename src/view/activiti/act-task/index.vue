<template>
  <div>
    <Card>
      <Row class="search-con" type="flex" justify="space-between" align="middle" @keyup.enter.native="handleSearch">
        <Col>
          流程名称：
          <Input @on-clear="handleClear" clearable placeholder="流程名称" class="search-input" v-model="listQuery.taskName"/>
          流程定义key：
          <Input @on-clear="handleClear" clearable placeholder="流程定义key" class="search-input" v-model="listQuery.processKey"/>
          <Button @click="handleSearch" class="search-btn">查询</Button>
          <Button @click="handleCancel" class="search-btn">重置</Button>
        </Col>
        <Col>
        </Col>
      </Row>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" v-permission="{rule:'user:add'}" size="small" style="margin: 5px" @click="completeTask(row)">办理</Button>
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
    <data-form ref="dataForm"></data-form>
  </div>
</template>
<script>
import DataForm from './data-form'
import { getActTaskPageList, checkFormData, completeTask } from '@/api/activiti'
export default {
  name: 'process-instance',
  components: {
    DataForm
  },
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          fixed: 'left',
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '任务ID', key: 'id', width: 130, fixed: 'left', tooltip: true },
        { title: '任务名称', key: 'name', width: 130, tooltip: true },
        { title: '流程实例名称', key: 'processInstanceName', width: 160, tooltip: true },
        { title: '流程定义key', key: 'processDefinitionKey', width: 130, tooltip: true },
        { title: '任务业务Key', key: 'businessKey', width: 130, tooltip: true },
        {
          title: '任务创建时间',
          key: 'createTime',
          width: 180,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        { title: '任务状态', key: 'status', width: 130, tooltip: true },
        {
          title: '任务挂起状态',
          width: 130,
          key: 'suspensionState',
          render: (h, params) => {
            const row = params.row
            let text = null
            let type = null
            switch (row.suspensionState) {
              case 1:
                text = '激活'
                type = 'primary'
                break
              case 2:
                text = '挂起'
                type = 'error'
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
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 210,
          fixed: 'right'
        }
      ],
      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        taskName: null,
        processKey: null
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      this.tableLoading = true
      getActTaskPageList(this.listQuery)
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
        taskName: null,
        processKey: null
      }
      this.getList()
    },
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    completeTask(row) {
      checkFormData(row.id).then(res => {
        if (res && res.data) {
          // 传入taskId的值, 然后弹出层显示出来
          let taskId = row.id
          this.$refs.dataForm.showModal(taskId, row.processInstanceId)
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: '确认要办理该任务吗？',
            onOk: () => {
              completeTask(row.id).then(res => {
                this.$Message.success(res.msg)
                this.getList()
              }).catch(error => {
                this.$Message.error(error.msg)
              })
            }
          })
        }
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    }
  }
}
</script>
