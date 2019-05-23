<template>
  <div>
      <Modal
      v-model="visible"
      title="新增"
      :loading="loading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="960"
      >
        <Form ref="menuModal" :label-width="100">
          <Form-item label="类型" prop="type" >
            <RadioGroup>
              <Radio :label="0">菜单</Radio>
              <Radio :label="1">按钮</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="名称" prop="title">
            <Input type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="上级菜单" >
            <tree-select  :data="tableData"></tree-select>
          </Form-item>
          <Form-item label="路由地址" prop="url">
            <Input type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="排序" prop="order">
            <Input type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="授权标识" prop="permission">
             <Input type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="图标" prop="icon">
             <Input type="text"  :maxlength="8"></Input>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
export default {
  name: '',
  data() {
    return {
      visible: false,
      loading: true,
      dataForm: {
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
      ]
    }
  },

  components: {
    TreeSelect
  },

  mounted() {},
  computed: {},
  methods: {
    init() {
      this.visible = true
    }
  }
}

</script>
<style>
</style>
