<!-- create by lester -->
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        部门名称：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="部门名称"
          class="search-input"
          v-model="listQuery.deptName"
        />
        所属机构：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="机构名称"
          class="search-input"
          v-model="listQuery.orgName"
        />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCancel" class="search-btn">重置</Button>
        <Button v-permission="{rule:'dept:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
      </div>
      <div class="table-dom">
        <Table row-key="id" :columns="tableColumn" :data="tableData" :loading="dataListLoading" border stripe>
          <template slot-scope="{row,index}" slot="action">
              <Button v-permission="{rule:'dept:edit'}"  type="primary" size="small" style="margin: 5px" @click="addOrUpdateHandle(row.id)">编辑</Button>
              <Button v-permission="{rule:'dept:del'}"  type="error" size="small" @click="deleteHandle(row.id)" >删除</Button>
          </template>
        </Table>
      </div>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate" @refreshDataList="getList"></add-or-update>
    </Card>
  </div>
</template>

<script>
import AddOrUpdate from './dept-add-or-update'
import { fetchList, deleteDept } from '@/api/dept'

export default {
  name: 'dept',

  data() {
    return {
      tableData: [],

      tableColumn: [
        {
          title: '名称',
          key: 'deptName',
          minWidth: 100,
          tree: true
        },
        {
          title: '机构名称',
          key: 'orgName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '排序',
          key: 'sort',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 260,
          fixed: 'right',
          slot: 'action'
        }
      ],

      listQuery: {
        deptName: '',
        orgName: ''
      },

      addOrUpdateVisible: true,
      dataListLoading: false
    }
  },

  components: {
    AddOrUpdate
  },

  computed: {
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

    handleSearch() {
      this.getList()
    },

    handleCancel() {
      this.listQuery.deptName = ''
      this.listQuery.orgName = ''
      this.getList()
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
          deleteDept(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
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

<style lang="less" scoped>
</style>
