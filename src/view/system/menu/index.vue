<template>
<div>
  <Card>
    <div class="search-con search-con-top">
      <Button v-permission="{rule:'menu:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
    </div>
    <div class="table-dom">
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
        <el-table-column
          header-align="center"
          prop="title"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="icon"
          label="图标"
          width="180">
          <template slot-scope="scope">
            <Icon :type="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="type"
          label="类型">
          <template slot-scope="scope">
            <tag color="success" v-if="scope.row.type===0">菜单</tag>
            <tag color="default" v-else>按钮</tag>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="url"
          label="路由">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="permission"
          label="授权标识">
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <Button v-permission="{rule:'menu:edit'}" type="primary" size="small" style="margin: 5px" @click="addOrUpdateHandle(scope.row.id)">编辑</Button>
            <Button v-permission="{rule:'menu:del'}" type="error" size="small" style="margin: 5px" @click="deleteHandle(scope.row.id)" >删除</Button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate" @refreshDataList="getList"></add-or-update>
  </Card>
</div>
</template>
<script>
import AddOrUpdate from './meun-add-or-update'
import { fetchList, deleteMunu } from '@/api/menu'
export default {
  name: 'menus',
  data() {
    return {
      tableData: [],
      addOrUpdateVisible: false,
      dataListLoading: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.dataListLoading = true
      fetchList().then(res => {
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
          deleteMunu(id).then(res => {
            this.$Message.success(res.msg)
            this.getList()
          }).catch(error => {
            this.$Message.error(error.msg)
          })
        }
      })
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
<style >
</style>
