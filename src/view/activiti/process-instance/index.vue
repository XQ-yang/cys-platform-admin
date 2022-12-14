<template>
  <div>
    <Card>
      <Row class="search-con" type="flex" justify="space-between" align="middle" @keyup.enter.native="handleSearch">
        <Col>
          流程实例名称：
          <Input @on-clear="handleClear" clearable placeholder="流程实例名称" class="search-input" v-model="listQuery.instanceName"/>
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
          <Button type="primary" v-permission="{rule:'user:add'}" size="small" style="margin: 5px" @click="activeOrSuspend(row)">{{row.suspensionState === 1 ? '挂起' : '激活'}}</Button>
          <Dropdown @on-click="dropDownClick($event, row)" transfer>
            <Button type="warning" size="small" style="margin: 5px">
              更多
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-permission="{rule:'user:add'}" name="view">历史</DropdownItem>
              <DropdownItem v-permission="{rule:'user:add'}" name="delete">删除实例</DropdownItem>
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
import { getToken } from '@/libs/util'
import { getProcessInstancePageList, deleteProcessInstance, activeSuspendProcessInstance } from '@/api/activiti'
export default {
  name: 'process-instance',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          fixed: 'left',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '流程实例ID', key: 'id', width: 320, fixed: 'left', tooltip: true },
        { title: '流程实例名称', key: 'name', width: 130, tooltip: true },
        { title: '流程定义ID', key: 'processDefinitionId', width: 130, tooltip: true },
        { title: '流程定义key', key: 'processDefinitionKey', width: 130, tooltip: true },
        { title: '部署版本', key: 'processDefinitionVersion', width: 100, tooltip: true },
        { title: '流程文件名称', key: 'resourceName', width: 200, tooltip: true },
        {
          title: '实例开始时间',
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
        { title: '实例状态', key: 'status', width: 100, tooltip: true },
        {
          title: '实例挂起状态',
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
        instanceName: null,
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
      getProcessInstancePageList(this.listQuery)
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
        instanceName: null,
        processKey: null
      }
      this.getList()
    },
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    },
    delete(id, reason) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该流程实例吗？',
        onOk: () => {
          deleteProcessInstance(id, reason).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    },
    activeOrSuspend(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要' + (row.suspensionState === 1 ? '挂起' : '激活') + '该流程实例吗？',
        onOk: () => {
          activeSuspendProcessInstance(row.id, row.suspensionState === 1 ? 2 : 1).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    },
    dropDownClick(e, row) {
      switch (e) {
        case 'view':
          this.viewDrawingProcess(row)
          break
        case 'delete':
          this.delete(row.id, '想删就删, 任性')
          break
      }
    },
    viewDrawingProcess(row) {
      localStorage.setItem('VUE_APP_BASE_API', process.env.VUE_APP_BASE_API_URL)
      localStorage.setItem('VUE_APP_ACCESS_TOKEN', getToken())
      // '/bpmnjs/index.html?type=lookBpmn&deploymentFileUUID=' + row.deploymentId + '&deploymentName=' + encodeURI(row.resourceName)
      let url = '/bpmnjs/index.html?type=lookBpmn&instanceId=' + row.id + '&deploymentFileUUID=' + row.deploymentId + '&deploymentName=' + encodeURI(row.resourceName)
      window.open(url)
    }
  }
}
</script>
