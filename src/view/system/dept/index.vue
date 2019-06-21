<!-- create by lester -->
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        部门名称：
        <Input
          @on-change="handleClear"
          clearable
          placeholder="部门名称"
          class="search-input"
          v-model="listQuery.deptName"
        />
        所属机构：
        <Input
          @on-change="handleClear"
          clearable
          placeholder="机构名称"
          class="search-input"
          v-model="listQuery.orgName"
        />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'dept:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
      </div>
      <div class="table-dom">
        <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
          <el-table-column
            header-align="center"
            prop="deptName"
            label="名称"
            >
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="orgName"
            label="机构名称"
            >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="sort"
            label="排序">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            header-align="center"
            align="center">
            <template slot-scope="scope">
              <Button v-permission="{rule:'dept:edit'}"  type="primary" size="small" style="margin: 5px" @click="addOrUpdateHandle(scope.row.id)">编辑</Button>
              <Button v-permission="{rule:'dept:del'}"  type="error" size="small" @click="deleteHandle(scope.row.id)" >删除</Button>
            </template>
          </el-table-column>
        </el-table>
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
  created() {
    this.getList()
  },
  mounted() {},
  computed: {},

  methods: {
    getList() {
      this.dataListLoading = true
      fetchList(this.listQuery).then(res => {
        this.tableData = res.data
        this.dataListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
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
    handleClear(e) {
      this.getList()
    }
  }
}

</script>
<style scoped>
</style>
