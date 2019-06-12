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
             <Dropdown @on-click="dropDownClick($event)" transfer >
              <Button style="margin: 8px">
                树操作
                <Icon type="ios-arrow-up"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="expandAll">合并所有</DropdownItem>
                <DropdownItem name="mergeAll">展开所有</DropdownItem>
                <!-- <DropdownItem name="checkAll">全部勾选</DropdownItem>
                <DropdownItem name="uncheckAll">取消全选</DropdownItem> -->
              </DropdownMenu>
            </Dropdown>
            <Button style="margin-right: 8px" @click="drawerVisible = false">取消</Button>
            <Button type="primary" @click="setRole">提交</Button>
          </div>
        </Drawer>
    </div>
</template>
<script>
import { setRoles, getRoleMenuById } from '@/api/role'
import { expandTree, setExpandState } from '@/libs/util'
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
      roleMenuTemp: {
        roleId: '',
        menuIds: []
      },
      roleMenuList: []
    }
  },
  methods: {
    init() {
      this.drawerVisible = true
      this.$nextTick(() => {
        this.title = `角色权限设置:${this.roleName}`
        this.getRoleMenuByRoleId(this.roleMenuTemp.roleId)
      })
    },
    getRoleMenuByRoleId(id) {
      getRoleMenuById(id).then(res => {
        this.treeList = expandTree(res.data)
      })
    },
    setRole() {
      this.roleMenuTemp.menuIds = []
      const data = this.$refs.roleTree.getCheckedAndIndeterminateNodes()
      data.map(item => {
        this.roleMenuTemp.menuIds.push(item.id)
      })
      setRoles(this.roleMenuTemp).then(res => {
        this.$emit('refreshDataList')
        this.$Message.success(res.msg)
        this.drawerVisible = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    dropDownClick(name) {
      switch (name) {
        case 'expandAll':// 合并所有
          this.treeList = setExpandState(this.treeList, false)
          break
        case 'mergeAll':// 展开所有
          this.treeList = setExpandState(this.treeList, true)
          break
        // case 'checkAll':// 全部勾选
        //   this.treeList = setCheckState(this.treeList, true)
        //   break
        // case 'uncheckAll':// 取消全选
        //   this.treeList = setCheckState(this.treeList, false)
        //   break
      }
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
