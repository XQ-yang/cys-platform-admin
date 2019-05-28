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
        <Form ref="menuModal" :model="dataForm" :rules="rules" :label-width="100">
          <Form-item label="类型" prop="type" >
            <RadioGroup v-model="dataForm.type">
              <Radio :label="0">菜单</Radio>
              <Radio :label="1">按钮</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="名称" prop="title">
            <Input v-model="dataForm.title" type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="上级菜单" prop="parentName">
            <Poptip trigger='click' v-model="popVisible" placement="bottom-start"  width="300">
              <Input type="text" v-model="dataForm.parentName" :readonly='true'  :maxlength="8"></Input>
              <div slot="content">
                <Tree
                :data='selectData'
                :multiple='false'
                @on-select-change='handleTreeSelectChange'
                ></Tree>
              </div>
            </Poptip>
          </Form-item>
          <Form-item label="路由地址" prop="url">
            <Input v-model="dataForm.url" type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="排序" prop="order">
            <Input v-model="dataForm.order" type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="授权标识" prop="permission">
             <Input v-model="dataForm.permission" type="text"  :maxlength="8"></Input>
          </Form-item>
          <Form-item label="图标" prop="icon">
             <Input v-model="dataForm.icon" type="text"  :maxlength="8"></Input>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
const PARENT_NAME_DEFAULT = '一级菜单'
export default {
  name: '',
  data() {
    return {
      popVisible: false,
      treeSelected: '',
      visible: false,
      loading: true,
      dataForm: {
        id: undefined, // 菜单/按钮id
        parent_id: '0', // 上级菜单id
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
        is_deleted: '', // 删除标记（0未删除，1已删除）
        parentName: ''
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
      selectData: [
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
            permission: ''
          }]
        }
      ],
      rules: {
        type: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        title: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      }
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
      this.parentName = PARENT_NAME_DEFAULT
    },
    menuListTreeSetDefaultHandle() {
      this.dataForm.parent_id = '0'
      this.dataForm.parentName = PARENT_NAME_DEFAULT
    },
    // 绑定父级菜单选中值
    handleTreeSelectChange(selectArray, item) {
      this.dataForm.parent_id = item.id
      this.dataForm.parentName = item.title
      this.popVisible = false
    }
  }
}

</script>
<style>
</style>
