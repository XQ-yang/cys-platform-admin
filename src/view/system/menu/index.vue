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
          prop="orderIndex"
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
            <el-button  size="mini" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
            <el-button  size="mini" @click="deleteHandle(scope.row.id)" >删除</el-button>
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
  data() {
    return {
      tableData: [],
      addOrUpdateVisible: true,
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
        content: '此操作为永久删除，是否继续？',
        onOk: () => {
          deleteMunu(id).then(res => {
            this.$Message.success('删除成功')
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
<style lang="less">
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>
