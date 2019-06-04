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
          <Form-item label="名称" prop="deptName">
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
          <Form-item label="所属机构" prop="orgName">
            <Poptip trigger='click' v-model="orgVisible" placement="bottom-start" >
              <Input type="text" v-model="dataForm.orgName" :readonly='true' :maxlength="20"></Input>
              <div slot="content">
                <Tree
                :data='selectOrgData'
                :multiple='false'
                @on-select-change='handleOrgTreeSelectChange'
                ></Tree>
              </div>
            </Poptip>
          </Form-item>
          <Form-item label="排序" prop="sort">
            <Input v-model="dataForm.sort" type="number"  :maxlength="6"></Input>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import { addOrUpdateDept, fetchList, getDeptInfo } from '@/api/dept'
import { fetchList as getOrgList } from '@/api/organization'
const PARENT_NAME_DEFAULT = '一级部门'
export default {
  data() {
    return {
      modalTitle: '',
      popVisible: false,
      orgVisible: false,
      visible: false,
      loading: true,
      dataForm: {
        id: '', // 住建
        parentId: '0', // 上级菜单id
        deptName: '', // 菜单/按钮名称
        sort: '', // 排序
        parentName: '', // 父菜单名称
        orgId: '0',
        orgName: ''
      },
      selectData: [],
      selectOrgData: [],
      rules: {
        deptName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        orgName: [
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
        this.$refs['deptForm'].resetFields()
        this.dataForm.parentName = PARENT_NAME_DEFAULT
        this.getDeptList().then(() => {
          if (this.dataForm.id) {
            this.typeVisible = true
            this.getInfo()
          } else {
            this.typeVisible = false
          }
        })
        this.getOrgList()
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
    handleOrgTreeSelectChange(selectArray, item) {
      this.dataForm.orgId = item.id
      this.dataForm.orgName = item.title
      this.orgVisible = false
    },
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getDeptList() {
      return fetchList().then(res => {
        this.selectData = this.expandDeptTree(res.data)
      })
    },
    getOrgList() {
      getOrgList().then(res => {
        this.selectOrgData = this.expandOrgTree(res.data)
      })
    },
    // 把数据转换为tree组件的对应格式
    expandOrgTree(treeData) {
      return treeData.map(item => {
        item.title = item.orgName
        if (item.children && item.children.length) {
          item.children = this.expandOrgTree(item.children)
        }
        return item
      })
    },
    // 把数据转换为tree组件的对应格式
    expandDeptTree(treeData) {
      return treeData.map(item => {
        item.title = item.deptName
        if (item.children && item.children.length) {
          item.children = this.expandDeptTree(item.children)
        }
        return item
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
      this.$refs['deptForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdateDept(this.dataForm).then(res => {
          this.changeLoading()
          this.visible = false
          // 触发刷新列表事件
          this.$emit('refreshDataList')
          this.$Message.success(res.msg)
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
