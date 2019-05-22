<template>
<div>
  <Card>
    <div class="search-con search-con-top">
      <Button class="search-btn">新增</Button>
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
    <div class="modal">
      <Modal
      v-model="dialogFormVisible"
      title="新增"
      >

      </Modal>
    </div>
  </Card>

</div>
</template>
<script>
export default {
  data() {
    return {
      menuTemp: {
        id: undefined, // 菜单/按钮id
        parent_id: undefined, // 上级菜单id
        title: '', // 菜单/按钮名称
        url: '', // 链接url
        permission: '', // 权限标识
        icon: '', // 图标
        type: null, // 类型 0菜单 1按钮
        order: null, // 排序
        remark: '', // 描述
        component: '', // 组件
        path: '', // 菜单路径
        level: '', // 层级
        status: '', // 是否启用
        create_by: '', // 创建人
        modify_by: '', // 修改人
        modify_time: null, // 修改时间
        create_time: null, // 创建时间
        version: '', // 乐观锁版本号
        is_deleted: ''// 删除标记（0未删除，1已删除）
      },
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
      dialogFormVisible: false
    }
  },
  methods: {
  }
}
</script>
