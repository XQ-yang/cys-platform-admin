<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Select
          v-model="listQuery.sampleType"
          @on-change="changeSampleTypeQuery($event)"
          placeholder="请选择样本类型"
          style="width:200px"
          clearable
        >
          <Option
            v-for="item in sampleTypeList"
            :key="item.sampleTypeId"
            :value="item.sampleTypeId"
          >{{item.sampleTypeName}}</Option>
        </Select>
        <Select
          v-model="listQuery.projectType"
          @on-change="handleClear"
          placeholder="请选择项目类型"
          style="width:200px"
          clearable
        >
          <Option
            v-for="item in projectTypeQueryList"
            :key="item.id"
            :value="item.id"
          >{{item.projectTypeName}}</Option>
        </Select>
        <Input
          @on-change="handleClear"
          clearable
          placeholder="顾客姓名"
          class="search-input"
          v-model="listQuery.customerName"
        />
        <Input
          @on-change="handleClear"
          clearable
          placeholder="顾客电话"
          class="search-input"
          v-model="listQuery.customerPhone"
        />
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCreate" class="search-btn" v-permission="{rule:'addAppointment'}">新增</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"
          ></Page>
        </div>
      </div>
      <!--弹出层-->
      <Modal
        v-model="dialogFormVisible"
        :title="textMap[dialogStatus]"
        :loading="loading"
        @on-ok="dialogStatus==='create'?createData():updateData()"
        class-name="vertical-center-modal"
        :mask-closable="false"
        width="640"
        ok-text="提交"
        cancel-text="关闭"
      >
        <Form
          ref="appointmentForm"
          :model="appointmentTemp"
          :rules="rules"
          :label-width="120"
          style="padding-right:20px;"
        >
          <Form-item label="样本类型" prop="sampleType">
            <RadioGroup v-model="appointmentTemp.sampleType" @on-change="changeSampleType($event)">
              <Radio
                v-for="item in sampleTypeList"
                :label="item.sampleTypeId"
                :key="item.sampleTypeId"
              >
                <span>{{item.sampleTypeName}}</span>
              </Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="项目类型" prop="projectType">
            <Select v-model="appointmentTemp.projectType" placeholder="请选择" class="drop" clearable>
              <Option
                v-for="item in projectTypeList"
                :key="item.id"
                :value="item.id"
              >{{item.projectTypeName}}</Option>
            </Select>
          </Form-item>
          <Form-item label="采集医院" prop="collectHospita">
            <Select
              v-model="appointmentTemp.collectHospita"
              class="drop"
              placeholder="请选择"
              clearable
            >
              <Option
                v-for="item in hospitalList"
                :key="item.id"
                :value="item.id"
              >{{item.hospitalName}}</Option>
            </Select>
          </Form-item>
          <Form-item label="顾客姓名" prop="customerName">
            <Input type="text" v-model="appointmentTemp.customerName" :maxlength="6" class="drop"></Input>
          </Form-item>
          <Form-item label="手机号" prop="customerPhone">
            <Input type="text" v-model="appointmentTemp.customerPhone" :maxlength="24" class="drop"></Input>
          </Form-item>
          <Form-item label="取样时间" prop="planCollectTime">
            <DatePicker
              type="datetime"
              v-model="appointmentTemp.planCollectTime"
              format="yyyy-MM-dd hh:mm"
              placeholder="请选择"
              class="drop"
            ></DatePicker>
          </Form-item>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import {
  getAppointmentList,
  saveAppointment,
  deleteByAppointmentById
} from '@/api/appointment.js'
import {
  getProjectTypeBySampleType,
  getSampleTypeList
} from '@/api/projectType.js'
import { getAllHospital } from '@/api/hospital.js'
export default {
  name: 'appointment',
  data() {
    return {
      list: [],
      // 样本类型数据
      sampleTypeList: [],
      projectTypeList: [],
      projectTypeQueryList: [],
      hospitalList: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h(
              'span',
              params.index +
                (this.listQuery.pageNumber - 1) * this.listQuery.pageSize +
                1
            )
          }
        },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'customerName', tooltip: true },
        { title: '手机号', key: 'customerPhone', tooltip: true },
        { title: '采集医院', key: 'hospitalName', tooltip: true },
        {
          title: '计划取样时间',
          key: 'planCollectTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.planCollectTime, 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h(
                'Button',
                {
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
                      value: { rule: 'editAppointment' }
                    }
                  ],
                  on: {
                    click: () => {
                      this.handleUpdate(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '您确定要删除吗'
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'delAppointment' }
                    }
                  ],
                  on: {
                    'on-ok': () => {
                      this.handleDelete(params.row.id)
                    }
                  }
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    },
                    '删除'
                  )
                ]
              )
            ])
          }
        }
      ],
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: '',
        createdby: ''
      },
      appointmentTemp: {
        id: undefined,
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: '',
        collectHospita: '',
        planCollectTime: new Date(),
        createdby: '',
        source: 1
      },
      rules: {
        sampleType: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        projectType: [
          {
            type: 'string',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        collectHospita: [
          {
            type: 'string',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        customerName: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        customerPhone: [
          {
            type: 'string',
            required: true,
            pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/,
            message: '必填项,手机号格式不正确',
            trigger: 'blur'
          }
        ],
        planCollectTime: [
          {
            type: 'date',
            required: true,
            message: '必填项，不能为空',
            trigger: 'change'
          }
        ]
      },
      isFirstEnter: true
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user
    }
  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
    if (this.isFirstEnter) {
      // 样本类型获取
      this.getSampleTypeList()
      // 医院数据获取
      this.getAllHospital()
      // 获取列表数据
      this.getList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 样本类型获取
      this.getSampleTypeList()
      // 医院数据获取
      this.getAllHospital()
      // 获取列表数据
      this.getList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  // 组件方法
  methods: {
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList()
        .then(res => {
          this.sampleTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 获取所有采集医院
    getAllHospital() {
      getAllHospital()
        .then(res => {
          this.hospitalList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 切换样本类型时修改项目类型下拉数据（清空原来的项目类型）
    changeSampleType(sampleType) {
      let projectType = this.appointmentTemp.projectType
      if (sampleType === undefined) {
        // this.appointmentTemp.sampleType = ''
        this.appointmentTemp.projectType = ''
        return false
      }
      getProjectTypeBySampleType(sampleType)
        .then(res => {
          this.projectTypeList = res.data
          this.appointmentTemp.projectType = projectType
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    changeSampleTypeQuery(sampleType) {
      if (sampleType === undefined) {
        this.getList()
        this.listQuery.projectType = ''
        this.listQuery.ProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType)
        .then(res => {
          this.listQuery.projectType = ''
          this.projectTypeQueryList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    getList() {
      this.tableLoading = true
      this.listQuery.createdby = this.userInfo.userName
      getAppointmentList(this.listQuery)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.totalRow
          this.tableLoading = false
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 重置表单页面赋值
    resetAppointmentTemp() {
      this.appointmentTemp = {
        id: undefined,
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: '',
        collectHospita: '',
        planCollectTime: '',
        createdby: this.userInfo.userName,
        source: 1
      }
      this.projectTypeList = []
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetAppointmentTemp()
      this.$refs['appointmentForm'].resetFields()
    },
    createData() {
      this.$refs['appointmentForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        saveAppointment(this.appointmentTemp)
          .then(res => {
            this.changeLoading()
            this.dialogFormVisible = false
            this.$Message.success(res.msg)
            this.getList()
          })
          .catch(error => {
            this.changeLoading()
            this.dialogFormVisible = true
            this.$Message.error(error.msg)
          })
      })
    },
    handleUpdate(row) {
      // 用assign 进行浅拷贝

      this.dialogStatus = 'update'
      this.$refs['appointmentForm'].resetFields()
      this.appointmentTemp = Object.assign({}, row)
      this.appointmentTemp.planCollectTime = new Date(this.appointmentTemp.planCollectTime)
      this.dialogFormVisible = true
      this.changeSampleType(this.appointmentTemp.sampleType)
    },
    updateData() {
      this.$refs['appointmentForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        saveAppointment(this.appointmentTemp)
          .then(res => {
            this.changeLoading()
            this.dialogFormVisible = false
            this.$Message.success(res.msg)
            this.getList()
          })
          .catch(error => {
            this.changeLoading()
            this.dialogFormVisible = true
            this.$Message.error(error.msg)
          })
      })
    },
    handleDelete(id, name) {
      deleteByAppointmentById({ id: id, name: name })
        .then(res => {
          this.$Message.success(res.msg)
          this.getList()
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (!e || e.target.value === '') {
        this.getList()
      }
    }
  }
}
</script>
<style scoped>
.drop {
  width: 240px;
}
</style>

