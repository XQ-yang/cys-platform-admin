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
          <Form-item label="部门" prop="deptName">
            <Poptip trigger='click' v-model="popVisible" placement="bottom-start" >
              <Input type="text" v-model="dataForm.deptName" :readonly='true' :maxlength="20"></Input>
              <div slot="content">
                <Tree
                :data='selectData'
                :multiple='false'
                @on-select-change='handleTreeSelectChange'
                ></Tree>
              </div>
            </Poptip>
          </Form-item>
          <Form-item label="岗位名称" prop="name">
            <Input v-model="dataForm.name" type="text"  :maxlength="20"></Input>
          </Form-item>
          <Form-item label="岗位编码" prop="code">
            <Input v-model="dataForm.code" type="text"  :maxlength="20"></Input>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import { fetchList } from '@/api/dept'
import { addOrUpdatePosition, getPosition } from '@/api/postion'
export default {
  data() {
    return {
      modalTitle: '',
      popVisible: false, // Poptip 显示隐藏
      typeVisible: false,
      treeSelected: '',
      visible: false,
      loading: true,
      dataForm: {
        id: '', // 菜单/按钮id
        code: '', // 岗位编码
        name: '', // 岗位名称
        deptId: '', // 部门id
        deptName: ''// 部门编号
      },
      selectData: [],
      rules: {
        code: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        deptName: [
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
        this.getDeptList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 绑定父级菜单选中值
    handleTreeSelectChange(selectArray, item) {
      this.dataForm.deptId = item.id
      this.dataForm.deptName = item.title
      this.popVisible = false
    },
    getDeptList() {
      return fetchList().then(res => {
        this.selectData = this.expandDeptTree(res.data)
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
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getInfo() {
      getPosition(this.dataForm.id).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      })
    },
    dataFormSubmitHandle() {
      this.$refs['deptForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdatePosition(this.dataForm).then(res => {
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
