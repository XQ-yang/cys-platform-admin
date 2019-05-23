<template>
<div>
  <Card>
    <div class="search-con search-con-top">
      <Button class="search-btn" @click="addOrUpdateHandle">新增</Button>
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
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="order"
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
            <el-button  size="mini">编辑</el-button>
            <el-button  size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate"></add-or-update>
  </Card>
</div>
</template>
<script>
import AddOrUpdate from './meun-add-or-update'
export default {
  data() {
    return {
      tableData: [
        {
          id: 3,
          title: '系统设置',
          icon: '',
          type: '菜单',
          order: '0',
          url: '',
          permission: '',
          children: [{
            id: 31,
            title: '用户管理',
            icon: '',
            type: '菜单',
            order: '0',
            url: '',
            permission: '',
            children: [
              {
                id: 32,
                title: '新增',
                icon: '',
                type: '按钮',
                order: '0',
                url: '',
                permission: ''
              },
              {
                id: 33,
                title: '编辑',
                icon: '',
                type: '按钮',
                order: '0',
                url: '',
                permission: ''
              },
              {
                id: 34,
                title: '删除',
                icon: '',
                type: '按钮',
                order: '0',
                url: '',
                permission: ''
              }
            ]
          }]
        }
      ],
      addOrUpdateVisible: true
    }
  },
  methods: {
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // 父子组件通信
        this.$refs.addOrUpate.dataForm.id = id
        this.$refs.addOrUpate.init()
      })
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
