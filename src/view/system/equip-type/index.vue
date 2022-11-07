<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        类型名称：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="类型名称"
          class="search-input"
          v-model="listQuery.typeName"
        />
        状态：
        <Select
          @on-clear="handleClear"
          clearable
          placeholder="状态"
          v-model="listQuery.status"
          style="width:200px"
        >
          <Option value="1">启用</Option>
          <Option value="0">禁用</Option>
        </Select>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCancel" class="search-btn">重置</Button>
        <div style="margin: 10px">
          <Button v-permission="{rule:'equip-type:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
          <Button v-permission="{rule:'equip-type:export'}" class="search-btn" @click="">导入</Button>
          <Button v-permission="{rule:'equip-type:import'}" class="search-btn" @click="exportHandle()">导出</Button>
          <Button class="search-btn" @click="downloadTemplate()">下载导入模板</Button>
          <Button
            v-permission="{rule:'equip-type:batchen'}"
            type="success"
            style="margin-right: 10px;"
            @click="batchChangeStatus(flag)">批量启用
          </Button>
          <Button v-permission="{rule:'equip-type:batchdis'}" type="error" @click="batchChangeStatus(!flag)">批量禁用
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
          <template slot-scope="{row}" slot="state">
            <i-switch
              size="large"
              true-color="#13ce66"
              false-color="#ff4949"
              v-model="row.status"
              :true-value="1"
              :false-value="0"
              :before-change="handleBeforeChange.bind(this,row)">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </template>
          <template slot-scope="{row,index}" slot="action">
            <Button
              v-permission="{rule:'equip-type:edit'}"
              type="primary"
              size="small"
              style="margin: 5px"
              @click="addOrUpdateHandle(row.id)">编辑
            </Button>
            <Button v-permission="{rule:'equip-type:del'}" type="error" size="small" @click="deleteHandle(row.id)">删除
            </Button>
          </template>
        </Table>
      </div>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
    </Card>
  </div>
</template>

<script>
import AddOrUpdate from '@/view/system/equip-type/type-add-or-update'
import {
  deleteEquipType,
  fetchList,
  modifyStatus,
  batchEditStatus,
  exportExcel,
  downloadTemplate
} from '@/api/equip-type'

export default {
  name: 'equip-type',

  data() {
    return {
      tableHeight: 480,
      tableData: [],
      selectList: [],

      tableColumn: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '序号',
          key: 'id',
          width: 80,
          fixed: 'left'
        },
        {
          title: '设备类型',
          key: 'typeName',
          width: 120
        },
        {
          title: '排序',
          key: 'sort',
          width: 60,
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          align: 'center',
          slot: 'state'
          // render: (h, params) => {
          //   return h('div', [
          //     h('i-switch', {
          //       props: {
          //         size: 'large',
          //         value: params.row.status ? true : false,
          //       },
          //       on: {
          //         'on-change': (val) => {
          //           console.log(val)
          //           console.log(params.row.status)
          //         }
          //       }
          //     }, [
          //       h('span', { slot: 'open' }, '启用'),
          //       h('span', { slot: 'close' }, '禁用')
          //     ])
          //   ])
          // }
        },
        {
          title: '创建人',
          key: 'createBy',
          width: 120,
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 200,
          align: 'center'
        },
        {
          title: '编辑人',
          key: 'modifyBy',
          width: 120,
          align: 'center'
        },
        {
          title: '编辑时间',
          key: 'modifyTime',
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          fixed: 'right',
          slot: 'action'
        }
      ],

      id: 1,
      listQuery: {
        typeName: '',
        status: null
      },
      flag: true,
      stateForm: {
        ids: [],
        status: null
      },

      addOrUpdateVisible: true,
      dataListLoading: false
    }
  },

  components: {
    AddOrUpdate
  },

  computed: {},

  created() {
    this.getList()
  },

  mounted() {
  },

  methods: {

    getList() {
      this.dataListLoading = true
      fetchList(this.listQuery).then(res => {
        this.tableData = res.data
        this.dataListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
        this.dataListLoading = false
      })
    },

    handleSearch() {
      this.getList()
    },

    handleCancel() {
      this.listQuery.typeName = ''
      this.listQuery.status = null
      this.getList()
    },

    exportHandle() {
      exportExcel(this.listQuery).then(res=> {
        this.$Message.success("导出成功")
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },

    downloadTemplate() {
      downloadTemplate().then(res => {
        this.$Message.success("下载成功")
      }).catch(error => {
        this.$Message.error(error.msg)
      })
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
            modifyStatus(row.id, state).then(res => {
              this.$Message.success(msg + '成功')
              this.getList()
            }).catch(error => {
              this.$Message.error(msg + '失败')
            })
            resolve()
          }
        })
      })
    },

    // 切换启禁用开关，用在@on-change中，不使用，效果不好
    // switchChange(row) {
    //   let state = row.status
    //   let msg = state ? '启用' : '禁用'
    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: '您确定' + msg + '该类型设备吗？',
    //     onOk: () => {
    //       modifyStatus(row.id, state).then(res => {
    //         this.$Message.success(msg + '成功')
    //         this.getList()
    //       }).catch(error => {
    //         this.$Message.error(msg + '失败')
    //       })
    //     }
    //   })
    // },

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
          deleteEquipType(id).then(res => {
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
    },

    batchChangeStatus(flag) {
      if (this.selectList.length <= 0) {
        this.$Message.warning('请选择数据')
        return
      }
      let msg = flag ? '启用' : '禁用'
      this.stateForm.ids = this.selectList.map(item => item.id)
      this.stateForm.status = flag ? 1 : 0
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要' + msg + '这些设备类型吗？',
        onOk: () => {
          batchEditStatus(this.stateForm).then(res => {
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

    // 清空查询值的时候 重新加载列表数据
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    }
  }

}
</script>

<style scoped>

</style>
