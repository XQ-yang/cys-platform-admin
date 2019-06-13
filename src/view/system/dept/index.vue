<!-- create by lester -->
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Button class="search-btn" @click="addOrUpdateHandle()">新增</Button>
      </div>
      <div class="table-dom">
        <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
          <el-table-column
            header-align="center"
            prop="orgName"
            label="机构名称"
            >
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="deptName"
            label="名称"
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
            header-align="center"
            align="center">
            <template slot-scope="scope">
              <Button  type="primary" size="small" style="margin: 5px" @click="addOrUpdateHandle(scope.row.id)">编辑</Button>
              <Button  type="error" size="small" @click="deleteHandle(scope.row.id)" >删除</Button>
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
      fetchList().then(res => {
        debugger
        this.tableData = res.data
        this.dataListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
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
          deleteDept(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    }
  }
}

</script>
<style>
</style>
