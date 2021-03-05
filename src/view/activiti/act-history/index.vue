<template>
  <div>
    <Card>
      <Row class="search-con" type="flex" justify="space-between" align="middle" @keyup.enter.native="handleSearch">
        <Col>
          流程部署名称：
          <Input @on-clear="handleClear" clearable placeholder="流程部署名称" class="search-input" v-model="listQuery.processName"/>
          流程部署key：
          <Input @on-clear="handleClear" clearable placeholder="流程部署key" class="search-input" v-model="listQuery.processKey"/>
          <Button @click="handleSearch" class="search-btn">查询</Button>
          <Button @click="handleCancel" class="search-btn">重置</Button>
        </Col>
        <Col>
        </Col>
      </Row>
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" v-permission="{rule:'user:add'}" size="small" style="margin: 5px" @click="startProcessInstance(row)">启动实例</Button>
          <Dropdown @on-click="dropDownClick($event, row)" transfer>
            <Button type="warning" size="small" style="margin: 5px">
              更多
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-permission="{rule:'user:add'}" name="activeOrSuspend">{{row.suspensionState === 1 ? '挂起' : '激活'}}</DropdownItem>
              <DropdownItem v-permission="{rule:'user:add'}" name="view">查看</DropdownItem>
              <DropdownItem v-permission="{rule:'user:add'}" name="delete">删除部署</DropdownItem>
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
            next-text="下一页"
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { getActHistoryPageList, deleteProcessDefinition, activeSuspendProcessDefinition } from '@/api/activiti'
export default {
  name: 'process-instance',
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
        { title: '任务ID', key: 'id', tooltip: true },
        { title: '任务名称', key: 'name', width: 200, tooltip: true },
        { title: '流程实例名称', key: 'processInstanceName', tooltip: true },
        { title: '流程定义key', key: 'processDefinitionKey', tooltip: true },
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
        {
          title: '任务开始时间',
          key: 'startTime',
          width: 180,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.startTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '任务拾取时间',
          key: 'claimTime',
          width: 180,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.claimTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '任务结束时间',
          key: 'endTime',
          width: 180,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.endTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        }
      ],
      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        processName: null,
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
      getActHistoryPageList(this.listQuery)
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
        processName: null,
        processKey: null
      }
      this.getList()
    },
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    delete(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该部署吗？',
        onOk: () => {
          deleteProcessDefinition(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    },
    activeOrSuspend(processDefinitionId) {
      activeSuspendProcessDefinition(processDefinitionId).then(res => {
        this.$Message.success(res.msg)
        this.getList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    dropDownClick(e, row) {
      switch (e) {
        case 'activeOrSuspend':
          this.activeOrSuspend(row.id)
          break
        case 'view':
          this.view(row)
          break
        case 'delete':
          this.delete(row.deploymentId)
          break
      }
    }
  }
}
</script>
