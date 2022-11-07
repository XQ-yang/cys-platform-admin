<template>
  <div>
    <Modal
      v-model="visible"
      :title="returnModalTitle"
      :loading="loading"
      @on-ok="dataFormSubmitHandle()"
      @on-cancel="clearForm()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="1100"
    >
      <Card style="margin-top: 20px">
        <template #title>
          <h4>基本信息</h4>
        </template>
        <Form ref="equipEditForm" :model="dataForm" :rules="rules" style="padding-right:20px;" :label-width="100">
          <Row>
            <Col span="8">
              <Form-item label="设备编号" prop="equId">
                <Input type="text" v-model="dataForm.equId" @on-change="equIdExist($event)"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="设备名称" prop="equName">
                <Input type="text" v-model="dataForm.equName"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="设备类型" prop="equTypeId">
                <Select v-model="dataForm.equTypeId" clearable filterable>
                  <Option v-for="item in equTypeList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <Form-item label="使用组织" prop="orgId">
                <Poptip trigger="click" v-model="popOrgVisible" placement="bottom-start">
                  <Input
                    type="text"
                    @on-clear="handleClear"
                    placeholder="使用组织"
                    clearable
                    v-model="orgName"
                    :readonly="true"></Input>
                  <div slot="content">
                    <Tree :data="orgData" :multiple="false" @on-select-change="selectOrg"></Tree>
                  </div>
                </Poptip>&nbsp;&nbsp;
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="使用部门" prop="deptId">
                <Poptip trigger="click" v-model="popDeptVisible" placement="bottom-start">
                  <Input
                    type="text"
                    @on-clear="handleClear"
                    placeholder="使用部门"
                    clearable
                    v-model="deptName"
                    :readonly="true"></Input>
                  <div slot="content">
                    <Tree :data="deptData" :multiple="false" @on-select-change="selectDept"></Tree>
                  </div>
                </Poptip>&nbsp;&nbsp;
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="使用人" prop="userId">
                <Select
                  clearable
                  placeholder="使用人"
                  v-model="dataForm.userId"
                  style="width:150px"
                >
                  <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realName }}</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <Form-item label="SN码" prop="snNo">
                <Input type="text" v-model="dataForm.snNo" :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="保修政策" prop="warrantyPolicy">
                <Input type="text" v-model="dataForm.warrantyPolicy" :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="财务状态" prop="financeStatus">
                <Select
                  clearable
                  placeholder="财务状态"
                  v-model="dataForm.financeStatus"
                >
                  <Option v-for="item in financeStatusList" :value="item.value" :key="item.value">{{
                      item.state
                    }}
                  </Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <Form-item label="采购日期" prop="purchaseDate">
                <DatePicker type="date" v-model="dataForm.purchaseDate" format="yyyy-MM-dd" placeholder="采购日期"/>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采购金额(元)" prop="purchaseAmount">
                <InputNumber
                  style="width: 150px"
                  :max="1000000"
                  v-model="dataForm.purchaseAmount"
                  :formatter="value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"></InputNumber>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="采购地点" prop="purchaseLocation">
                <Input type="text" v-model="dataForm.purchaseLocation"></Input>
              </Form-item>
            </Col>
          </Row>
          <Form-item label="配置信息" prop="configInfo">
            <Input
              type="textarea"
              v-model="dataForm.configInfo"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="输入设备的配置信息..."></Input>
          </Form-item>
        </Form>
      </Card>
      <Card>
        <template #title>
          <h4>设备图片</h4>
        </template>
        <!-- 图片上传-->
        <div>
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="5120"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <div slot="tip" class="tip-style">注意: 最大5M, 必须为jpg, jpeg, png格式</div>
        </div>
        <el-image
          style="width: 100px; height: 100px"
          :src="'https://file.iviewui.com/images/'+ imgName"
          :preview-src-list="defaultList.url">
        </el-image>
      </Card>

    </Modal>
  </div>
</template>

<script>
  import { typeSelectList } from '@/api/equip-type'
  import { fetchList as getOrgList, getDeptsByOrgId as getDeptList } from '@/api/organization'
  import { getUserList } from '@/api/dept'
  import { addOrUpdateEquipment, existEquId, getEquipDetail } from '@/api/equipment'

  export default {
    data() {
      const validateEquId = (rule, value, callback) => {
        if (value === this.existEquId) {
          callback(new Error('设备编号已存在'))
        } else {
          callback()
        }
      }

      return {
        modalTitle: '',
        visible: false,
        loading: true,
        financeStatusList: [
          {
            value: 0,
            state: '未入账'
          },
          {
            value: 1,
            state: '已入账'
          }
        ],
        dataForm: {
          id: null, // 主键
          equId: null, // 设备编码
          equName: null, // 设备名称
          equTypeId: null, // 设备类型
          orgId: null,
          deptId: null,
          userId: null,
          financeStatus: 0,
          snNo: null,
          warrantyPolicy: null,
          registerDate: new Date(),
          purchaseDate: null,
          purchaseAmount: null,
          purchaseLocation: null,
          configInfo: null
        },
        orgName: null,
        deptName: null,
        existEquId: null,
        popOrgVisible: false,
        popDeptVisible: false,
        //  类型列表
        equTypeList: [],
        // 组织列表
        orgList: [],
        // 部门列表
        deptList: [],
        // 使用人列表
        userList: [],
        rules: {
          equId: [
            { required: true, message: '必填项，不能为空', trigger: 'blur' },
            { validator: validateEquId, trigger: 'blur' }
          ],
          equName: [
            { required: true, message: '必填项，不能为空', trigger: 'blur' }
          ],
          equTypeId: [
            { required: true, message: '必填项，不能为空', trigger: 'blur', type: 'number' }
          ],
          orgId: [
            { required: true, message: '必填项，不能为空', trigger: 'change', type: 'number' }
          ],
          warrantyPolicy: [
            { required: true, message: '必填项，不能为空', trigger: 'blur' }
          ]
        },
        defaultList: [
          {
            'name': 'image-demo-1.jpg',
            'url': 'https://file.iviewui.com/images/image-demo-1.jpg'
          },
          {
            'name': 'image-demo-2.jpg',
            'url': 'https://file.iviewui.com/images/image-demo-2.jpg'
          }
        ],
        imgName: '',
        imgVisible: false,
        uploadList: [],
        // 附件上传的url地址
        uploadHost: '',
        // 附件上传携带参数
        uploadData: {},
        // 上传后返回的存储文件名
        fileName: '',
        // 上传后返回的文件存储地址
        filePath: ''
      }
    },

    mounted() {
      this.uploadList = this.$refs.upload.fileList
    },

    computed: {
      returnModalTitle() {
        if (!this.dataForm.id) {
          return '新增'
        } else {
          return '编辑'
        }
      },

      // 用于下拉框的数据源
      orgData() {
        return this.expandOrgTree(this.orgList)
      },

      deptData() {
        return this.expandDeptTree(this.deptList)
      }
    },

    created() {
      typeSelectList().then(res => {
        this.equTypeList = res.data
      }),

        getOrgList().then(res => {
          this.orgList = res.data
        })
    },
    methods: {
      init() {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['equipEditForm'].resetFields()
          if (this.dataForm.id) {
            this.typeVisible = true
            this.getInfo()
          } else {
            this.typeVisible = false
          }
        })
      },

      changeLoading() {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },

      getInfo() {
        getEquipDetail(this.dataForm.id).then(res => {
          this.dataForm = res.data
          this.orgName = res.data.orgName
          this.deptName = res.data.deptName
          // 获取下拉列表
          if (this.dataForm.orgId) {
            getDeptList(this.dataForm.orgId)
              .then(res => {
                this.deptList = res.data
              })
              .catch(error => {
                this.$Message.error(error.msg)
              })

            if (this.dataForm.deptId) {
              // 获取当前部门的员工
              getUserList(this.dataForm.deptId).then(res => {
                this.userList = res.data
              }).catch(error => {
                this.$Message.error(error.msg)
              })
            }
          }
        })
      },

      // 响应下拉框change事件
      selectOrg(selectArray, item) {
        this.dataForm.orgId = item.id
        this.orgName = item.title
        this.popOrgVisible = false
        this.resetDept()

        // 获取当前组织的部门
        getDeptList(item.id)
          .then(res => {
            this.deptList = res.data
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      },

      selectDept(selectArray, item) {
        this.dataForm.deptId = item.id
        this.deptName = item.title
        this.popDeptVisible = false
        this.resetUser()

        // 获取当前部门的员工
        getUserList(item.id).then(res => {
          this.userList = res.data
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      },

      // list数据转成tree形的数据结构
      expandOrgTree(treeData) {
        return treeData.map(item => {
          item.title = item.orgName
          if (item.children && item.children.length) {
            item.children = this.expandOrgTree(item.children)
          }
          return item
        })
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

      // 重置下拉选框的选中项
      resetDept() {
        this.deptList = []
      },

      resetUser() {
        this.userList = []
      },

      equIdExist(event) {
        let id = event.target.value
        existEquId(id).then(res => {
          this.existEquId = res.data.equId
        })
      },

      // 清空查询值的时候 重新加载列表数据
      handleClear() {
        this.$nextTick(() => {
          this.deptList = []
          this.userList = []
          this.dataForm.userId = null
        })
      },

      dataFormSubmitHandle() {
        this.$refs['equipEditForm'].validate(valid => {
          if (!valid) {
            return this.changeLoading()
          }
          // 新增或编辑
          addOrUpdateEquipment(this.dataForm).then(res => {
            this.changeLoading()
            this.visible = false
            this.clearForm()
            // 触发刷新列表事件
            this.$emit('refreshDataList')
            this.$Message.success(res.msg)
          }).catch(error => {
            this.changeLoading()
            this.visible = true
            this.clearForm()
            this.$Message.error(error.msg)
          })
        })
      },

      clearForm() {
        this.orgName = null
        this.deptName = null
        this.deptList = []
        this.userList = []
      },

      /*
      * 图片上传函数
      *  */
      handleView(name) {
        this.imgName = name
        this.visible = true
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess(res, file) {
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
        file.name = '7eb99afb9d5f317c912f08b5212fd69a'
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        })
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          })
        }
        return check
      },
    }
  }
</script>

<style scoped>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .tip-style {
    color: red;
    font-size: 12px;
  }
</style>
