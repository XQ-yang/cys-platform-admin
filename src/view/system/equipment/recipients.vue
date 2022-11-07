<template>
  <div>
    <Modal
      v-model="visible"
      title="设备领用"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="500"
    >
      <Form ref="recipientForm" :model="UsageRecord" :rules="rules" style="padding-right:20px;" :label-width="100">
        <Form-item label="使用组织" prop="orgName">
          <Input type="text" v-model="UsageRecord.orgName" :readonly="true" style="width: 250px"></Input>
        </Form-item>
        <Form-item label="使用部门" prop="deptName">
          <Poptip trigger="click" v-model="popDeptVisible" placement="bottom-start">
            <Input
              type="text"
              @on-clear="handleClear"
              @on-focus="getDeptList"
              placeholder="使用部门"
              clearable
              v-model="UsageRecord.deptName"
              :readonly="true"></Input>
            <div slot="content">
              <Tree :data="deptData" :multiple="false" @on-select-change="selectDept"></Tree>
            </div>
          </Poptip>&nbsp;&nbsp;
        </Form-item>
        <Form-item label="使用人" prop="userName">
          <Select
            clearable
            placeholder="使用人"
            v-model="UsageRecord.userName"
            style="width:150px"
          >
            <Option v-for="item in userList" @click.native="setUserId(item)" :value="item.realName" :key="item.id">{{ item.realName }}</Option>
          </Select>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getUserList } from '@/api/dept'
import { getDeptsByOrgId as getDeptList } from '@/api/organization'
import { getEquipDetail, updateUseStatusForRepairOrRecipients } from '@/api/equipment'

export default {
  data() {
    return {
      popDeptVisible: false,
      visible: false,
      loading: true,
      id: null,
      dataForm: {},
      UsageRecord: {
        id: null,
        equId: '', // 设备型号
        equName: null, // 设备名称
        typeName: null, // 设备类型
        orgId: null,
        userId: null,
        orgName: null,
        deptName: null,
        deptId: null,
        userName: null,
        content: '设备领用',
        recordTime: new Date(),
      },
      deptList: [],
      userList: [],
      rules: {
        deptName: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    deptData() {
      return this.expandDeptTree(this.deptList)
    }
  },

  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['recipientForm'].resetFields()
        this.getInfo()
      })
    },

    getInfo() {
      getEquipDetail(this.id).then(res => {
        this.UsageRecord.orgId = res.data.orgId
        this.UsageRecord.equId = res.data.equId
        this.UsageRecord.equName = res.data.equName
        this.UsageRecord.deptId = res.data.deptId
        this.UsageRecord.typeName = res.data.typeName
        this.UsageRecord.orgName = res.data.orgName
        this.UsageRecord.deptName = res.data.deptName
        this.getUserList()
      })
    },

    getDeptList() {
      // 获取当前组织的部门
      getDeptList(this.UsageRecord.orgId)
        .then(res => {
          this.deptList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },

    getUserList() {
      if (this.UsageRecord.deptId != null) {
        // 获取当前部门的员工
        getUserList(this.UsageRecord.deptId).then(res => {
          this.userList = res.data
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }
    },

    expandDeptTree(treeData) {
      return treeData.map(item => {
        item.title = item.deptName
        if (item.children && item.children.length) {
          item.children = this.expandDeptTree(item.children)
        }
        return item
      })
    },

    // 清空查询值的时候 重新加载列表数据
    handleClear() {
      this.$nextTick(() => {
        this.userList = []
      })
    },

    selectDept(selectArray, item) {
      this.UsageRecord.deptId = item.id
      this.UsageRecord.deptName = item.title
      this.popDeptVisible = false
      this.resetUser()

      // 获取当前部门的员工
      getUserList(item.id).then(res => {
        this.userList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },

    resetUser() {
      this.userList = []
    },

    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    setUserId(item) {
      this.UsageRecord.userId = item.id
    },

    dataFormSubmitHandle() {
      this.$refs['recipientForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 后台接口，创建使用记录并更新使用状态
        this.dataForm['usageRecord'] = this.UsageRecord
        updateUseStatusForRepairOrRecipients(this.dataForm, this.id, 1).then(res => {
          this.changeLoading()
          this.visible = false
          // 触发刷新列表事件
          this.$emit('refreshDataList')
          this.$Message.success(res.msg)
          this.dataForm = {}
        }).catch(error => {
          this.$Message.error(error.msg)
          this.loading = false
          this.dataForm = {}
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
