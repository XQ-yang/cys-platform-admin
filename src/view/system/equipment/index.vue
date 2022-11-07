<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        设备编号：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="设备编号"
          class="search-input"
          v-model="listQuery.equId"
        />
        设备名称：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="设备名称"
          class="search-input"
          v-model="listQuery.equName"
          length="100"
        />
        设备类型：
        <Select
          @on-clear="handleClear"
          clearable
          placeholder="设备类型"
          v-model="listQuery.equTypeId"
          style="width:150px"
          filterable
        >
          <Option v-for="item in equTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
        </Select>
        使用状态：
        <Select
          @on-clear="handleClear"
          clearable
          placeholder="使用状态"
          v-model="listQuery.useStatus"
          style="width:150px"
        >
          <Option value="0">未启用</Option>
          <Option value="1">使用中</Option>
          <Option value="2">空闲</Option>
          <Option value="3">维修</Option>
          <Option value="4">报废</Option>
        </Select>
        <br/>
        财务状态：
        <Select
          @on-clear="handleClear"
          clearable
          placeholder="财务状态"
          v-model="listQuery.financeStatus"
          style="width:120px"
        >
          <Option value="0">未入账</Option>
          <Option value="1">已入账</Option>
        </Select>
        使用组织：
        <Poptip trigger="click" v-model="popOrgVisible" placement="bottom-start">
          <Input
            type="text"
            @on-clear="handleClear"
            clearable
            v-model="orgName"
            :readonly="true"
            :maxlength="20"></Input>
          <div slot="content">
            <Tree :data="orgData" :multiple="false" @on-select-change="selectOrg"></Tree>
          </div>
        </Poptip>&nbsp;&nbsp;
        <!--<Select-->
        <!--  @on-clear="handleClear"-->
        <!--  clearable-->
        <!--  placeholder="使用组织"-->
        <!--  v-model="listQuery.orgId"-->
        <!--  style="width:220px"-->
        <!--&gt;-->
        <!--  <Option v-for="item in orgList" :value="item.id" :key="item.id">{{ item.orgName }}</Option>-->
        <!--</Select>-->
        使用部门：
        <Poptip trigger="click" v-model="popDeptVisible" placement="bottom-start">
          <Input
            type="text"
            @on-clear="handleClear"
            clearable
            v-model="deptName"
            :readonly="true"
            :maxlength="20"></Input>
          <div slot="content">
            <Tree :data="deptData" :multiple="false" @on-select-change="selectDept"></Tree>
          </div>
        </Poptip>&nbsp;&nbsp;
        <!--<Select-->
        <!--  @on-clear="handleClear"-->
        <!--  clearable-->
        <!--  placeholder="使用部门"-->
        <!--  v-model="listQuery.deptId"-->
        <!--  style="width:150px"-->
        <!--&gt;-->
        <!--  <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.deptName }}</Option>-->
        <!--</Select>-->
        使用人：
        <Select
          @on-clear="handleClear"
          clearable
          placeholder="使用人"
          v-model="listQuery.userId"
          style="width:150px"
        >
          <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realName }}</Option>
        </Select>

        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCancel" class="search-btn">重置</Button>
        <div style="margin: 10px">
          <Button v-permission="{rule:'equip-type:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
          <Button v-permission="{rule:'equip-type:add'}" class="search-btn">导出</Button>
          <Button v-permission="{rule:'equip-type:add'}" class="search-btn">导出档案卡</Button>
          <Button v-permission="{rule:'equip-type:add'}" class="search-btn">导入</Button>
          <Button v-permission="{rule:'equip-type:add'}" class="search-btn">下载导入模板</Button>
          <Button
            v-permission="{rule:'equipment:enable'}"
            type="success"
            style="margin-right: 10px;"
            @click="batchChangeStatus(flag)">批量启用
          </Button>
          <Button
            v-permission="{rule:'equipment:disable'}"
            type="error"
            style="margin-right: 10px;"
            @click="batchChangeStatus(!flag)">批量停用
          </Button>
          <Button v-permission="{rule:'equipment:batchFin'}" class="search-btn" @click="batchModifyFinanceStatus">批量入账
          </Button>
        </div>
      </div>
      <div class="table-dom">
        <Table
          ref="table"
          row-key="id"
          :columns="tableColumn"
          :data="tableData"
          :loading="dataListLoading"
          :max-height="tableHeight"
          @on-selection-change=handleSelectionChange
          border
          stripe>
          <template slot-scope="{row}" slot="useStatus">
            <Badge v-if="row.useStatus === 0" status="default" text="未启用"/>
            <Badge v-if="row.useStatus === 1" status="processing" text="使用中"/>
            <Badge v-if="row.useStatus === 2" status="success" text="空闲"/>
            <Badge v-if="row.useStatus === 3" status="warning" text="维修"/>
            <Badge v-if="row.useStatus === 4" status="error" text="报废"/>
          </template>
          <template slot-scope="{row}" slot="financeStatus">
            <Badge v-if="row.financeStatus === 0" status="error" text="未入账"/>
            <Badge v-if="row.financeStatus === 1" status="success" text="已入账"/>
          </template>
          <template slot-scope="{row,index}" slot="action">
            <Button
              v-permission="{rule:'equip-type:edit'}"
              type="primary"
              size="small"
              style="margin: 5px"
              @click="addOrUpdateHandle(row.id)">编辑
            </Button>
            <Dropdown trigger="click" @on-click="dropDownClick($event,row)" transfer>
              <Button type="warning" size="small" style="margin: 5px">
                更多
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem v-permission="{rule:'equipment:detail'}" name="detail">设备档案卡</DropdownItem>
                <DropdownItem v-if="row.financeStatus === 0" v-permission="{rule:'equipment:batchFin'}" name="finance">
                  入账
                </DropdownItem>
                <DropdownItem v-if="row.useStatus === 2 && row.realName == null" v-permission="{rule:'equipment:receive'}" name="recipients">
                  领用
                </DropdownItem>
                <DropdownItem v-if="row.useStatus === 1" v-permission="{rule:'equipment:restore'}" name="restore">归还
                </DropdownItem>
                <DropdownItem
                  v-if="row.useStatus !== 4 && row.useStatus !== 3"
                  v-permission="{rule:'equipment:repair'}"
                  name="repair">维修
                </DropdownItem>
                <DropdownItem
                  v-if="row.useStatus === 0 || row.useStatus === 3"
                  v-permission="{rule:'equipment:enable'}"
                  name="enable">启用
                </DropdownItem>
                <DropdownItem
                  v-if="row.useStatus === 2 || row.useStatus === 3"
                  v-permission="{rule:'equipment:disable'}"
                  name="disable">停用
                </DropdownItem>
                <DropdownItem v-if="row.useStatus !== 4" v-permission="{rule:'equipment:scrap'}" name="scrap">报废
                </DropdownItem>
                <DropdownItem v-permission="{rule:'equipment:del'}" name="delete">删除</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </template>
        </Table>
        <Page
          style="margin-top: 15px"
          :current="pageNum"
          :total="total"
          :page-size="pageSize"
          :page-size-opts="[10,20,30,40]"
          size="small"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-elevator
          show-sizer
          show-total
        />
      </div>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
      <recipients v-if="recipientsVisible" ref="Recipients" @refreshDataList="getList"></recipients>
      <repair v-if="repairVisible" ref="Repair" @refreshDataList="getList"></repair>
      <equi-detail v-if="detailVisible" ref="detail"></equi-detail>
    </Card>
  </div>
</template>

<script>
import AddOrUpdate from '@/view/system/equipment/equi-add-or-update'
import Recipients from '@/view/system/equipment/recipients'
import Repair from '@/view/system/equipment/repair'
import EquiDetail from '@/view/system/equipment/equi-detail'
import {
  delEquipment,
  fetchList,
  updateFinanceStatusBatch,
  updateUseStatus,
  updateUseStatusBatch, updateUseStatusForRepairOrRecipients
} from '@/api/equipment'
import {
  fetchList as getOrgList,
  getDeptsByOrgId as getDeptList
} from '@/api/organization'
import { typeSelectList } from '@/api/equip-type'
import { getUserList } from '@/api/dept'

export default {
  name: 'equipment',

  data() {
    return {
      tableHeight: 360,
      tableData: [],
      selectList: [],

      tableColumn: [
        {
          type: 'selection',
          minWidth: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '序号',
          key: 'id',
          minWidth: 80,
          fixed: 'left'
        },
        {
          title: '设备编号',
          key: 'equId',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.detailVisible = true
                  this.$nextTick(() => {
                    this.$refs.detail.id = params.row.id
                    this.$refs.detail.equId = params.row.equId
                    this.$refs.detail.init()
                  })
                }
              }

            }, params.row.equId)
          }
        },
        {
          title: '设备名称',
          key: 'equName',
          minWidth: 220,
          align: 'center'
        },
        {
          title: '设备分类',
          key: 'typeName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '使用组织',
          key: 'orgName',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '使用部门',
          key: 'deptName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '使用人',
          key: 'realName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '使用状态',
          key: 'useStatus',
          minWidth: 120,
          align: 'center',
          slot: 'useStatus'
        },
        {
          title: '财务状态',
          key: 'financeStatus',
          minWidth: 120,
          align: 'center',
          slot: 'financeStatus'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth: 200,
          fixed: 'right',
          slot: 'action'
        }
      ],
      // 搜索表单
      listQuery: {
        equId: null,
        equName: null,
        equTypeId: null,
        useStatus: null,
        financeStatus: null,
        orgId: null,
        deptId: null,
        userId: null
      },
      orgName: null,
      deptName: null,
      popOrgVisible: false,
      popDeptVisible: false,
      //  类型列表
      equTypeList: [],
      // 组织列表
      orgList: [],
      // 部门列表
      deptList: [],
      // 使用人列表
      userList: [],
      // 数据总条数
      total: 0,
      pageNum: 1,
      pageSize: 10,
      flag: true,
      stateForm: {
        ids: [],
        status: null
      },

      id: null,
      dataForm: {},
      UsageRecord: {
        id: null,
        equId: '', // 设备型号
        equName: null, // 设备名称
        typeName: null, // 设备类型
        orgId: null,
        userId: null,
        orgName: null,
        deptName: null,
        deptId: null,
        userName: null,
        content: '设备归还',
        recordTime: new Date(),
      },

      addOrUpdateVisible: false,
      dataListLoading: false,
      recipientsVisible: false,
      repairVisible: false,
      detailVisible: false
    }
  },

  components: {
    AddOrUpdate,
    Recipients,
    Repair,
    EquiDetail
  },

  computed: {
    // 用于下拉框的数据源
    orgData() {
      return this.expandOrgTree(this.orgList)
    },

    deptData() {
      return this.expandDeptTree(this.deptList)
    }
  },

  created() {
    this.getList()
  },

  mounted() {
    typeSelectList().then(res => {
      this.equTypeList = res.data
    })

    getOrgList().then(res => {
      this.orgList = res.data
    })
  },

  methods: {

    changePage(val) {
      this.pageNum = val
      this.getList()
    },

    changeSize(val) {
      this.pageSize = val
      this.getList()
    },

    getList() {
      this.dataListLoading = true
      fetchList(this.listQuery, this.pageNum, this.pageSize).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.dataListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
        this.dataListLoading = false
      })
    },

    // 响应下拉框change事件
    selectOrg(selectArray, item) {
      this.listQuery.orgId = item.id
      this.orgName = item.title
      this.popOrgVisible = false
      this.resetDept()

      // 获取当前组织的部门
      getDeptList(item.id)
        .then(res => {
          this.deptList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },

    selectDept(selectArray, item) {
      this.listQuery.deptId = item.id
      this.deptName = item.title
      this.popDeptVisible = false
      this.resetUser()

      // 获取当前部门的员工
      getUserList(item.id).then(res => {
        this.userList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },

    // list数据转成tree形的数据结构
    expandOrgTree(treeData) {
      return treeData.map(item => {
        item.title = item.orgName
        if (item.children && item.children.length) {
          item.children = this.expandOrgTree(item.children)
        }
        return item
      })
    },

    expandDeptTree(treeData) {
      return treeData.map(item => {
        item.title = item.deptName
        if (item.children && item.children.length) {
          item.children = this.expandDeptTree(item.children)
        }
        return item
      })
    },

    // 重置下拉选框的选中项
    resetDept() {
      this.deptList = []
    },

    resetUser() {
      this.userList = []
    },

    handleSearch() {
      this.getList()
    },

    handleCancel() {
      this.listQuery.equId = null
      this.listQuery.equName = null
      this.listQuery.equTypeId = null
      this.listQuery.orgId = null
      this.orgName = null
      this.deptName = null
      this.listQuery.deptId = null
      this.listQuery.userId = null
      this.listQuery.useStatus = null
      this.listQuery.financeStatus = null
      this.deptList = []
      this.userList = []
      this.getList()
    },

    handleBeforeChange(row) {
      return new Promise((resolve) => {
        let state = row.status ? 0 : 1
        console.log(state)
        let msg = state ? '启用' : '禁用'
        this.$Modal.confirm({
          title: '提示',
          content: '您确定' + msg + '该类型设备吗？',
          onOk: () => {
            // 后台请求
            resolve()
          }
        })
      })
    },

    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },

    deleteHandle(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该数据吗？',
        onOk: () => {
          delEquipment(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    },

    handleSelectionChange(val) {
      this.selectList = val
      console.log(val)
    },

    batchChangeStatus(flag) {
      if (this.selectList.length <= 0) {
        this.$Message.warning('请选择设备')
        return
      }
      // 判断状态是否是启用或停用才能操作
      for (let i = 0; i < this.selectList.length; i++) {
        let status = this.selectList[i].useStatus
        if (status === 1 && status === 4) {
          this.$Message.warning('序号为' + this.selectList[i].id + '的设备使用状态不允许操作')
          return
        }
      }
      let msg = flag ? '启用' : '停用'
      this.stateForm.ids = this.selectList.map(item => item.id)
      this.stateForm.status = flag ? 2 : 0
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要' + msg + '这些设备吗？',
        onOk: () => {
          updateUseStatusBatch(this.stateForm).then(res => {
            this.$Message.success(msg + '成功')
            this.selectList = []
            this.getList()
          }).catch(error => {
            this.selectList = []
            this.$Message.error(error.msg)
          })
        }
      })
    },

    batchModifyFinanceStatus() {
      if (this.selectList.length <= 0) {
        this.$Message.warning('请选择设备')
        return
      }
      this.stateForm.ids = this.selectList.map(item => item.id)
      this.stateForm.status = 1
      this.$Modal.confirm({
        title: '提示',
        content: '您确定对这些设备进行入账操作吗？',
        onOk: () => {
          updateFinanceStatusBatch(this.stateForm).then(res => {
            this.$Message.success(res.msg)
            this.selectList = []
            this.getList()
          }).catch(error => {
            this.selectList = []
            this.$Message.error(error.msg)
          })
        }
      })
    },

    // 清空查询值的时候 重新加载列表数据
    handleClear() {
      this.listQuery.orgId = null
      this.listQuery.deptId = null
      this.listQuery.userId = null
      this.deptList = []
      this.userList = []
      this.$nextTick(() => {
        this.getList()
      })
    },

    // 更多操作，还要定义方法
    dropDownClick(e, row) {
      switch (e) {
        case 'detail': // 设备档案卡
          this.detailVisible = true
          this.$nextTick(() => {
            this.$refs.detail.id = row.id
            this.$refs.detail.equId = row.equId
            this.$refs.detail.init()
          })
          break
        case 'finance': // 入账
          let financeForm = {
            ids: [row.id],
            status: 1
          }
          updateFinanceStatusBatch(financeForm).then(res => {
            this.$Message.success(res.msg)
            this.selectList = []
            this.getList()
          }).catch(error => {
            this.selectList = []
            this.$Message.error(error.msg)
          })
          break
        case 'recipients': // 领用
          this.recipientsVisible = true
          this.$nextTick(() => {
            this.$refs.Recipients.id = row.id
            this.$refs.Recipients.init()
          })
          break
        case 'restore': // 归还
          this.id = row.id
          this.UsageRecord.equId = row.equId
          this.UsageRecord.orgName = row.orgName
          this.UsageRecord.deptName = row.deptName
          this.UsageRecord.userName = row.realName

          console.log(this.UsageRecord)

          // 后台接口，创建使用记录并更新使用状态
          this.dataForm['usageRecord'] = this.UsageRecord
          updateUseStatusForRepairOrRecipients(this.dataForm, this.id, 2).then(res => {
            this.$Message.success(res.msg)
            this.getList()
            this.dataForm = {}
          }).catch(error => {
            this.$Message.error(error.msg)
            this.loading = false
            this.dataForm = {}
          })
          break
        case 'repair': // 维修
          this.repairVisible = true
          this.$nextTick(() => {
            this.$refs.Repair.id = row.id
            this.$refs.Repair.RepairRecord.equId = row.equId
            this.$refs.Repair.init()
          })
          break
        case 'disable': // 停用
          updateUseStatus(row.id, 0).then(res => {
            this.$Message.success('停用成功')
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
          break
        case 'scrap': // 报废
          this.$Modal.confirm({
            title: '提示',
            content: '该操作不可逆，您确定对该设备进行报废操作吗？',
            onOk: () => {
              updateUseStatus(row.id, 4).then(res => {
                this.$Message.success(res.msg)
                this.getList()
              }).catch(error => {
                this.$Message.error(error.msg)
              })
            }
          })
          break
        case 'enable': // 启用
          updateUseStatus(row.id, 2).then(res => {
            this.$Message.success('启用成功')
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
          break
        case 'delete': // 删除
          this.deleteHandle(row.id)
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
