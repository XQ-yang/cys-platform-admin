<template>
    <div>
        <Drawer
            title="角色分配权限"
            v-model="drawerVisible"
            width="420"
            :mask-closable="false"
            :styles="styles"
        >
          <Tree :data="treeList" ></Tree>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="drawerVisible = false">取消</Button>
                <Button type="primary" @click="drawerVisible = false">提交</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
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
      treeList: []
    }
  },
  methods: {
    init() {
      this.drawerVisible = true
    }
  }
}
</script>
<style>
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
