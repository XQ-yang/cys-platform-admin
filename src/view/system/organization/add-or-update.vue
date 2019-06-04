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
        <Form ref="orgForm" :model="dataForm" :rules="rules" :label-width="100">
          <Form-item label="机构名称" prop="orgName">
            <Input v-model="dataForm.orgName" type="text"  :maxlength="20"></Input>
          </Form-item>
          <Form-item label="上级机构" prop="parentName">
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
          <Form-item  label="联系人" prop="contacts">
            <Input v-model="dataForm.contacts" type="text"  :maxlength="20"></Input>
          </Form-item>
          <Form-item label="联系方式" prop="tel">
            <Input v-model="dataForm.tel" type="text"  :maxlength="11"></Input>
          </Form-item>
          <Form-item label="联系地址" prop="address">
             <Input v-model="dataForm.address" type="text"  :maxlength="20"></Input>
          </Form-item>
          <Form-item label="排序" prop="sort">
             <Input v-model="dataForm.sort" type="number"  :maxlength="20"></Input>
          </Form-item>
        </Form>
      </Modal>
  </div>
</template>

<script>
import { addOrUpdateOrg, fetchList, getOrgInfo } from '@/api/organization'
const PARENT_NAME_DEFAULT = '一级机构'
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
        id: '',
        parentId: '0', // 上级机构id
        orgName: '', // 机构名称
        contacts: '', // 联系人
        tel: '', // 联系电话
        address: '', // 联系地址
        parentName: '', // 父菜单名称
        sort: ''// 排序
      },
      selectData: [],
      rules: {
        orgName: [
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
        this.$refs['orgForm'].resetFields()
        this.dataForm.parentName = PARENT_NAME_DEFAULT
        this.getOrgList().then(() => {
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
    orgListTreeSetDefaultHandle() {
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
    getOrgList() {
      return fetchList().then(res => {
        this.selectData = this.expandOrgTree(res.data)
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
    getInfo() {
      getOrgInfo(this.dataForm.id).then(res => {
        debugger
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.parentId === '0') {
          this.orgListTreeSetDefaultHandle()
        }
      })
    },
    dataFormSubmitHandle() {
      this.$refs['orgForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addOrUpdateOrg(this.dataForm).then(res => {
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
