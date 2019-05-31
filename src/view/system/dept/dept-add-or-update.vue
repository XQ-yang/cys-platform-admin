<template>
  <div>
      <Modal
      v-model="visible"
      :title="returnModalTitle"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="960"
      >
        <Form ref="deptForm" :model="dataForm" :rules="rules" :label-width="100">
          <Form-item label="名称" prop="title">
            <Input v-model="dataForm.deptName" type="text"  :maxlength="20"></Input>
          </Form-item>
          <Form-item label="上级部门" prop="parentName">
            <Poptip trigger='click' v-model="popVisible" placement="bottom-start" >
              <Input type="text" v-model="dataForm.parentName" :readonly='true' :maxlength="20"></Input>
              <div slot="content">
                <Tree
                :data='selectData'
                :multiple='false'
                @on-select-change='handleTreeSelectChange'
                ></Tree>
              </div>
            </Poptip>
          </Form-item>
          <Form-item label="排序" prop="orderIndex">
            <Input v-model="dataForm.orderIndex" type="number"  :maxlength="6"></Input>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import { addOrUpdateDept, fetchList, getDeptInfo } from '@/api/dept'
const PARENT_NAME_DEFAULT = '一级部门'
export default {
  data() {
    return {
      modalTitle: '',
      popVisible: false,
      typeVisible: false,
      treeSelected: '',
      visible: false,
      loading: true,
      dataForm: {
        id: '', // 菜单/按钮id
        parentId: '0', // 上级菜单id
        deptName: '', // 菜单/按钮名称
        parentName: ''// 父菜单名称
      },
      selectData: [],
      rules: {
        type: [
          { type: 'number', required: true, message: '请选择', trigger: 'change' }
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
  computed: {
    returnModalTitle() {
      if (!this.dataForm.id) {
        return '新增'
      } else {
        return '编辑'
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['menuForm'].resetFields()
        this.dataForm.parentName = PARENT_NAME_DEFAULT
        this.getMenuList().then(() => {
          if (this.dataForm.id) {
            this.typeVisible = true
            this.getInfo()
          } else {
            this.typeVisible = false
          }
        })
      })
    },
    // 初始化菜单下拉框的值
    menuListTreeSetDefaultHandle() {
      this.dataForm.parentId = '0'
      this.dataForm.parentName = PARENT_NAME_DEFAULT
    },
    // 绑定父级菜单选中值
    handleTreeSelectChange(selectArray, item) {
      this.dataForm.parentId = item.id
      this.dataForm.parentName = item.title
      this.popVisible = false
    },
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getMenuList() {
      return fetchList().then(res => {
        this.selectData = res.data
      })
    },
    getInfo() {
      getDeptInfo(this.dataForm.id).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.parentId === '0') {
          this.menuListTreeSetDefaultHandle()
        }
      })
    },
    dataFormSubmitHandle() {
      this.$refs['menuForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdateDept(this.dataForm).then(res => {
          debugger
          this.changeLoading()
          this.visible = false
          // 触发刷新列表事件
          this.$emit('refreshDataList')
          this.$Message.success('新增成功')
        }).catch(error => {
          this.changeLoading()
          this.visible = true
          this.$Message.error(error.msg)
        })
      })
    }
  }
}

</script>
<style>
</style>
