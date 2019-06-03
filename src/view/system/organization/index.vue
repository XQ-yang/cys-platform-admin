<template>
<div>
  <Card>
    <div class="search-con search-con-top">
      <Input @on-change="handleClear"  clearable placeholder="机构名称" class="search-input" v-model="listQuery.orgName"/>
      <Input @on-change="handleClear"  clearable placeholder="联系人" class="search-input" v-model="listQuery.contacts"/>
      <Button @click="handleSearch" class="search-btn">查询</Button>
      <Button class="search-btn" @click="addOrUpdateHandle()">新增</Button>
    </div>
    <div class="table-dom">
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
        <el-table-column
          header-align="center"
          prop="orgName"
          label="机构名称"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="contacts"
          label="联系人">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="tel"
          label="联系电话">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="address"
          label="联系地址">
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
import '@/assets/css/common.less'
import AddOrUpdate from './add-or-update'
import { fetchList, deleteOrg } from '@/api/organization'
export default {
  name: 'organization',
  data() {
    return {
      tableData: [],
      addOrUpdateVisible: false,
      dataListLoading: false,
      listQuery: {
        orgName: '',
        contacts: ''
      }
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
      fetchList(this.listQuery).then(res => {
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
        debugger
        this.$refs.addOrUpate.dataForm.id = id
        this.$refs.addOrUpate.init()
      })
    },
    deleteHandle(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '此操作为永久删除，是否继续？',
        onOk: () => {
          deleteOrg(id).then(res => {
            this.$Message.success('删除成功')
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
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
<style lang="less">
</style>
