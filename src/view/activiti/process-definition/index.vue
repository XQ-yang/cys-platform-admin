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
          <Button v-permission="{rule:'role:add'}" @click="uploadDrawingProcess()" class="search-btn">上传流程文件</Button>
          <Tooltip>
            <Button v-permission="{rule:'role:add'}" @click="onlineDrawingProcess()" class="search-btn">在线绘制流程</Button>
            <div slot="content">
              <p>表单属性id必须满足如下格式：</p>
              <p>{</p>
                <p>// 控件id(控件编号)</p>
                <p>"controlId": "approve",</p>
                <p>// 控件名称</p>
                <p>"controlName": "是否批准",</p>
                <p>// 控件类型(input, date-picker, radio, checkbox, switch, select, city-select)</p>
                <p>"controlType": "radio",</p>
                <p>// 数据类型(string, number, date, array)</p>
                <p>"dataType": "number",</p>
                <p>// 可选值[{"label": "名称", "value": "值"},{"label1": "名称1", "value1": "值1"}]</p>
                <p>"optionalVal": "[{ \"label\": \"批准\", \"value\": \"1\"}, { \"label\": \"驳回\", \"value\": \"0\"}]",</p>
                <p>// 是否必填(0: 否, 1: 是)</p>
                <p>"isRequired": true,</p>
                <p>// 输入提示语</p>
                <p>"placeHolder": "请选择是否同意",</p>
                <p>// 默认值</p>
                <p>"defaultVal": null,</p>
                <p>// 是否作为下一流程参数(0: 否, 1: 是)</p>
                <p>"isParam": true,</p>
                <p>// 校验约束</p>
                <p>"validateConstraint": null</p>
              <p>}</p>
            </div>
          </Tooltip>
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
    <add-process-instance ref="addProcessInstance"></add-process-instance>
    <upload-process-definition ref="uploadProcessDefinition" @refreshList="getList"></upload-process-definition>
  </div>
</template>
<script>
import { getToken } from '@/libs/util'
import addProcessInstance from './add-process-instance'
import uploadProcessDefinition from './upload-process-definition'
import { getProcessDefinitionPageList, deleteProcessDefinition, activeSuspendProcessDefinition } from '@/api/activiti'
export default {
  name: 'process-definition',
  components: {
    addProcessInstance,
    uploadProcessDefinition
  },
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
        { title: '部署ID', key: 'deploymentId', width: 320, tooltip: true },
        { title: '流程定义ID', key: 'id', tooltip: true },
        { title: '流程定义名称', key: 'name', width: 200, tooltip: true },
        { title: '流程定义key', key: 'key', tooltip: true },
        { title: '部署版本', key: 'version', width: 100, tooltip: true },
        { title: '流程文件名称', key: 'resourceName', tooltip: true },
        {
          title: '部署时间',
          key: 'deployTime',
          width: 180,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.deployTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '部署状态',
          width: 100,
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
      getProcessDefinitionPageList(this.listQuery)
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
    startProcessInstance(row) {
      this.$refs.addProcessInstance.showModal(row)
    },
    uploadDrawingProcess(row) {
      this.$refs.uploadProcessDefinition.showModal(row)
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
    activeOrSuspend(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要' + (row.suspensionState === 1 ? '挂起' : '激活') + '该部署吗？',
        onOk: () => {
          activeSuspendProcessDefinition(row.id, row.suspensionState === 1 ? 2 : 1).then(res => {
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
        case 'activeOrSuspend':
          this.activeOrSuspend(row)
          break
        case 'view':
          this.viewDrawingProcess(row)
          break
        case 'delete':
          this.delete(row.deploymentId)
          break
      }
    },
    onlineDrawingProcess() {
      localStorage.setItem('VUE_APP_BASE_API', process.env.VUE_APP_BASE_API_URL)
      localStorage.setItem('VUE_APP_ACCESS_TOKEN', getToken())
      let url = '/bpmnjs/index.html?type=addBpmn'
      window.open(url)
    },
    viewDrawingProcess(row) {
      localStorage.setItem('VUE_APP_BASE_API', process.env.VUE_APP_BASE_API_URL)
      localStorage.setItem('VUE_APP_ACCESS_TOKEN', getToken())
      let url = '/bpmnjs/index.html?type=lookBpmn&deploymentFileUUID=' + row.deploymentId + '&deploymentName=' + encodeURI(row.resourceName)
      window.open(url)
    }
  }
}
</script>
