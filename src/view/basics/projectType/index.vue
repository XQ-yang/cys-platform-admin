<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Select  v-model="listQuery.sampleType" @on-change="handleSelectClear" placeholder="请选择样本类型" style="width:200px" clearable>
            <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
        </Select>
           <Input v-model="listQuery.projectTypeName"  @on-change="handleClear"  placeholder="项目类型名" class="search-input" clearable  />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button v-permission="{rule:'addProjectType'}"  @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <!--列表-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe></Table>
      <!--分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getProjectTypeList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
      <!--弹出层-->
      <Modal
      v-model="dialogFormVisible"
      :title="textMap[dialogStatus]"
      :loading="formLoading"
      @on-ok="dialogStatus==='create'?createData():updateData()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="800"
      ok-text="提交"
      cancel-text="关闭">
        <Form ref="projectTypeForm" :model="projectTypeTemp" :rules="rules" :label-width="100" style="padding-right:20px;">
          <Row :gutter="48">
            <Col span="12">
              <Form-item label="样本类型" prop="sampleType">
                   <Select  v-model="projectTypeTemp.sampleType" placeholder="请选择" v-bind:disabled="isUsed" clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="项目类型名" prop="projectTypeName">
                <Input  type="text" v-model="projectTypeTemp.projectTypeName" v-bind:disabled="isUsed" :maxlength="255"></Input>
              </Form-item>
              </Form-item>
            </Col>
          </Row>
        <Row :gutter="48">
            <Col span="12">
              <Form-item label="所属公司" prop="companyId">
                <Select v-model="projectTypeTemp.companyId" placeholder="请选择" clearable >
                  <Option v-for="item in companyList" :key="item.id" :value="item.id" >{{item.name}}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="组织来源" prop="tissueOrigin">
                  <Input  type="text" v-model="projectTypeTemp.tissueOrigin" :maxlength="255"></Input>
              </Form-item>
            </Col>
          </Row>
         <Row :gutter="48">
            <Col span="12">
              <Form-item label="存储数量" prop="storageQuantity">
                <Input  type="text" v-model="projectTypeTemp.storageQuantity" :maxlength="255"></Input>
              </Form-item>
            </Col>
             <Col span="12">
              <Form-item label="存储年限" prop="storeYear">
                 <Input type="text" v-model="projectTypeTemp.storeYear" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="12">
              <Form-item label="是否启用" prop="isDelete">
                <Select v-model="projectTypeTemp.isDelete" clearable placeholder="请选择">
                  <Option :value="0">启用</Option>
                  <Option :value="1">禁用</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import './index.less'
import { getSampleTypeList, getProjectTypeList, addProjectType, editProjectType, getprojectTypeById, isUsedProjectType } from '@/api/projectType.js'
import { getCompanyList } from '@/api/organize'
export default {
  name: 'projectType',
  data() {
    const validateNumber = (rule, value, callback) => {
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (value && !reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      isUsed: false,
      tableLoading: false,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectTypeName: ''
      },
      list: [],
      total: 0,
      tableColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize
          }
        },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', width: 250, key: 'projectTypeName', tooltip: true },
        { title: '组织来源', key: 'tissueOrigin', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        { title: '存储年限', key: 'storeYear', tooltip: true },
        { title: '所属公司', key: 'companyName', tooltip: true },
        {
          title: '状态',
          key: 'isDelete',
          render: (h, params) => {
            const row = params.row
            const text = row.isDelete === 0 ? '启用' : '禁用'
            const color = row.isDelete === 0 ? 'success' : 'error'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'editProjectType' }
                  }
                ],
                on: {
                  click: () => {
                    this.handleUpdate(params.row)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      edit: false,
      formLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      sampleTypeList: [],
      companyList: [],
      projectTypeTemp: {
        id: undefined,
        sampleType: '',
        companyId: '',
        projectTypeName: '',
        storageQuantity: '',
        cellQuantity: '',
        storeYear: '',
        isDelete: 0
      },
      rules: {
        sampleType: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        projectTypeName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        storeYear: [
          {
            validator: validateNumber
          }
        ]
      },
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 分页获取项目类型列表
      this.getProjectTypeList()
      // 获取样本类型数据列表
      this.getSampleTypeList()
      // 获取公司数据列表
      this.getCompany()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 分页获取项目类型列表
      this.getProjectTypeList()
      // 获取样本类型数据列表
      this.getSampleTypeList()
      // 获取公司数据列表
      this.getCompany()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  methods: {
    // 分页获取项目类型列表
    getProjectTypeList() {
      this.tableLoading = true
      getProjectTypeList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 项目类型列表按条件查询
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getProjectTypeList()
    },
    // 清空查询值的时候 重新加载列表数据(下拉框)
    handleSelectClear(e) {
      if (e === undefined) {
        this.getProjectTypeList()
      }
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getProjectTypeList()
      }
    },
    // 从后台获取样本类型数据
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取公司下拉数据
    getCompany() {
      getCompanyList().then(res => {
        this.companyList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 打开新增项目类型弹出框
    handleCreate() {
      this.dialogStatus = 'create'
      this.edit = false
      this.dialogFormVisible = true
      this.resetProjectTemp()
      this.$refs['projectTypeForm'].resetFields()
    },
    // 新增项目类型信息
    createData() {
      this.$refs['projectTypeForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addProjectType(this.projectTypeTemp).then(res => {
          this.dialogFormVisible = false
          this.getProjectTypeList()
          this.changeLoading()
          this.$Message.success(res.msg)
        }).catch(error => {
          this.dialogFormVisible = true
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    // 根据项目类型id加载项目类型信息
    getprojectTypeById(id) {
      isUsedProjectType(id).then(res => {
        this.isUsed = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
      getprojectTypeById(id).then(res => {
        this.projectTypeTemp = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 打开修改项目类型弹出框
    handleUpdate(row) {
      this.getprojectTypeById(row.id)
      this.dialogStatus = 'update'
      this.edit = true
      this.dialogFormVisible = true
      this.$refs['projectTypeForm'].resetFields()
    },
    // 修改项目类型信息
    updateData() {
      this.$refs['projectTypeForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        editProjectType(this.projectTypeTemp).then(res => {
          this.dialogFormVisible = false
          this.getProjectTypeList()
          this.changeLoading()
          this.$Message.success(res.msg)
        }).catch(error => {
          this.dialogFormVisible = true
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    // 重置表单页面赋值
    resetProjectTemp() {
      this.projectTypeTemp = {
        id: undefined,
        sampleType: '',
        companyId: '',
        projectTypeName: '',
        tissueOrigin: '',
        tissueQuantity: '',
        cellQuantity: '',
        storeYear: ''
      }
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.formLoading = false
      this.$nextTick(() => {
        this.formLoading = true
      })
    }
  }
}
</script>
