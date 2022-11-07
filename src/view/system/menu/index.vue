<template>
<div>
  <Card>
    <div class="search-con search-con-top">
      <Button v-permission="{rule:'menu:add'}" class="search-btn" @click="addOrUpdateHandle()">新增</Button>
    </div>
    <div class="table-dom">
        <Table row-key="id" :columns="tableColumn" :loading="dataListLoading" :data="tableData" :max-height="tableHeight" border stripe>
          <template slot-scope="{row}" slot="icon">
            <Icon :type="row.icon" />
          </template>
          <template slot-scope="{row}" slot="type">
            <tag color="success" v-if="row.type===0">菜单</tag>
            <tag color="default" v-else>按钮</tag>
          </template>
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
import AddOrUpdate from './meun-add-or-update'
import { fetchList, deleteMunu } from '@/api/menu'
export default {
  name: 'menus',
  data() {
    return {
      tableHeight: 500,
      tableData: [],
      tableColumn: [
        {
          title: '名称',
          key: 'title',
          minWidth: 180,
          tree: true
        },
        {
          title: '图标',
          minWidth: 70,
          slot: 'icon',
          align: 'center'
        },
        {
          title: '类型',
          minWidth: 100,
          slot: 'type',
          align: 'center'
        },
        {
          title: '排序',
          key: 'sort',
          minWidth: 70,
          align: 'center'
        },
        {
          title: '路由',
          key: 'url',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '授权标识',
          key: 'permission',
          minWidth: 150,
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
