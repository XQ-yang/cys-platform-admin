<template>
    <div>
        <Drawer
            :title="title"
            v-model="drawerVisible"
            width="420"
            :mask-closable="true"
            :styles="styles"
        >
          <Tree :data="treeList" show-checkbox ref="roleTree"></Tree>
          <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="drawerVisible = false">取消</Button>
            <Button type="primary" @click="setRole">提交</Button>
          </div>
        </Drawer>
    </div>
</template>
<script>
import { fetchList as getDeptTreeList } from '@/api/dept'
import { setDeptRoles, getRoleDeptById } from '@/api/role'
import { expandDeptList, expandDeptTree } from '@/libs/util'
export default {
  data() {
    return {
      drawerVisible: false, // 抽屉组件显示隐藏
      title: '', // 标题
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      treeList: [],
      roleId: '', // 角色id
      roleName: '', // 角色名称
      roleDeptTemp: {
        roleId: '',
        deptIds: []
      },
      roleDeptList: []
    }
  },
  methods: {
    init() {
      this.drawerVisible = true
      this.$nextTick(() => {
        this.title = `数据权限设置:${this.roleName}`
        this.getTreeList().then(() => {
          this.getDeptRoleById(this.roleDeptTemp.roleId)
        })
      })
    },
    getTreeList() {
      return getDeptTreeList().then(res => {
        this.treeList = expandDeptTree(res.data)
      })
    },
    getDeptRoleById(id) {
      getRoleDeptById(id).then(res => {
        debugger
        this.roleDeptList = res.data
        let testData = expandDeptList(this.treeList, this.roleDeptList)
        this.treeList = testData
      })
    },
    setRole() {
      this.roleMenuTemp.menuIds = []
      const data = this.$refs.roleTree.getCheckedAndIndeterminateNodes()
      data.map(item => {
        this.roleDeptTemp.deptIds.push(item.id)
      })
      setDeptRoles(this.roleDeptTemp).then(res => {
        this.$emit('refreshDataList')
        this.$Message.success(res.msg)
        this.drawerVisible = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    }
  }
}
</script>
<style scoped>
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>
