<template>
<div>
  <Card>
    <div class="search-con search-con-top">
      机构名称：<Input @on-clear="handleClear"  clearable placeholder="机构名称" class="search-input" v-model="listQuery.orgName"/>
      联系人：<Input @on-clear="handleClear"  clearable placeholder="联系人" class="search-input" v-model="listQuery.contacts"/>
      <Button @click="handleSearch" class="search-btn">查询</Button>
      <Button @click="handleCancel" class="search-btn">重置</Button>
      <Button v-permission="{rule:'org:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
    </div>
    <div class="table-dom">
      <Table row-key="id" :columns="tableColumn" :loading="dataListLoading" :data="tableData" border stripe>
        <template slot-scope="{row,index}" slot="action">
          <Button
            v-permission="{rule:'org:edit'}"
            type="primary"
            size="small"
            style="margin: 5px"
            @click="addOrUpdateHandle(row.id)"
          >编辑</Button>
          <Button v-permission="{rule:'org:del'}" type="error" size="small" @click="deleteHandle(row.id)" >删除</Button>
        </template>
      </Table>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate" @refreshDataList="getList"></add-or-update>
  </Card>
</div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import { fetchList, deleteOrg } from '@/api/organization'

export default {
  name: 'org',

  data() {
    return {
      tableData: [],

      tableColumn: [
        {
          title: '机构名称',
          key: 'orgName',
          minWidth: 200,
          tree: true
        },
        {
          title: '联系人',
          key: 'contacts',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'tel',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '联系地址',
          key: 'address',
          minWidth: 200,
          align: 'center',
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 260,
          slot: 'action',
          fixed: 'right'
        }
      ],

      addOrUpdateVisible: false,
      dataListLoading: false,

      listQuery: {
        orgName: '',
        contacts: ''
      }
    }
  },

  components: {
    AddOrUpdate
  },

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

    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpate.dataForm.id = id
        this.$refs.addOrUpate.init()
      })
    },

    deleteHandle(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该数据吗？',
        onOk: () => {
          deleteOrg(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    },

    handleSearch() {
      this.getList()
    },

    handleCancel() {
      this.listQuery.orgName = ''
      this.listQuery.contacts = ''
      this.getList()
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

<style lang="less" scoped>
</style>
