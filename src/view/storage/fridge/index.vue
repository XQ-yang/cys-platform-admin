<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input v-model="fridgeQuery.fridgeCode" placeholder="冰箱编码" class="search-input"  @on-change="handleClear" clearable/>
        <Select
          v-model="fridgeQuery.fridgeState"
          placeholder="请选择冰箱状态"
          style="width:140px"
           @on-change="handleClear"
          clearable
        >
          <Option :value="1">未使用</Option>
          <Option :value="2">未存满</Option>
          <Option :value="3">已存满</Option>
        </Select>

        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCreate" class="search-btn">新增</Button>
      </div>

      <!--列表-->
      <Table :data="fridgeList" :columns="fridgeColumns" :loading="fridgeListLoading" border stripe></Table>

      <!--分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="fridgeQuery.pageNumber"
            :page-size.sync="fridgeQuery.pageSize"
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
        width="700"
         ok-text="提交"
        cancel-text="关闭">

        <Form ref="fridgeForm" :model="fridgeTemp" :rules="rules" :label-width="160">
          <Row>
            <Col span="12">
              <Form-item label="冰箱号" prop="fridgeCode">
                <Input type="text" v-model="fridgeTemp.fridgeCode" :readonly="true" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="层数" prop="layerNum">
                <Input type="text" v-model="fridgeTemp.layerNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="每层架数" prop="rackNum">
                <Input type="text" v-model="fridgeTemp.rackNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>

          <Row>
            <Form-item label="试管架行列数">
               <span slot="label"><span style="color:red">*</span> 试管架行列数</span>
              <Col span="4">
                <Form-item prop="rackRowNum" inline>
                  <Input
                    type="text"
                    v-model="fridgeTemp.rackRowNum"
                    :maxlength="3"
                    style="width:90px;"
                    inline
                    number
                  ></Input>
                </Form-item>
              </Col>
              <Col span="1" style="text-align: center">×</Col>
              <Col span="4">
                <Form-item prop="rackColumnNum" inline>
                  <Input
                    type="text"
                    v-model="fridgeTemp.rackColumnNum"
                     :maxlength="3"
                    style="width:90px;"
                    inline
                    number
                  ></Input>
                </Form-item>
              </Col>
            </Form-item>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="备注" prop="remark">
                <Input type="text" v-model="fridgeTemp.remark"></Input>
              </Form-item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import {
  getFridgePage,
  addFridge,
  deleteFridge,
  getCurrentFridgeCode
} from '@/api/fridge.js'
export default {
  name: 'fridge',
  filters: {
    fridgeStateFilter(gender) {
      const fridgeStateMap = ['未使用', '已使用', '已存满']
      return fridgeStateMap[gender - 1]
    }
  },
  data() {
    return {
      // 样本列表显示及查询
      tableLoading: false,
      loading: true,
      fridgeQuery: {
        pageNumber: 1,
        pageSize: 10,
        fridgeCode: '',
        fridgeState: ''
      },
      fridgeColumns: [
        { type: 'index', title: '序号', width: 70 },
        { title: '冰箱编号', key: 'fridgeCode' },
        {
          title: '冰箱状态',
          key: 'fridgeState',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.fridgeStateFilter(row.fridgeState)
            return h('div', text)
          }
        },
        {
          title: '层数',
          key: 'layerNum'
        },
        {
          title: '总支架数',
          key: 'rackNum'
        },
        {
          title: '总试管数',
          key: 'cuvetteNum'
        },
        {
          title: '创建时间',
          key: 'createTime',
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '备注', key: 'remark' },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            let arr = [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '3px 2px 2px 3px'
                  },
                  on: {
                    click: () => {
                      this.handleAllocation(params.row)
                    }
                  }
                },
                '配置'
              )
            ]

            if (params.row.usedCuvetteNum === 0) {
              arr.push(
                h(
                  'Poptip',
                  {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '您确定要删除吗'
                    },
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
                        },
                        style: {
                          margin: '3px 2px 2px 3px'
                        }
                      },
                      '删除'
                    )
                  ]
                )
              )
            }
            return h('div', arr)
          }
        }
      ],
      fridgeList: [],
      fridgeListLoading: false,
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      fridgeTemp: {
        id: undefined,
        fridgeCode: '',
        layerNum: '',
        rackNum: '',
        rackRowNum: '',
        rackColumnNum: '',
        remark: ''
      },
      rules: {
        fridgeCode: [
          { type: 'integer', message: '请输入整数', trigger: 'blur' }
        ],
        layerNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项，请输入正整数',
            trigger: 'blur'
          }
        ],
        rackNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项，请输入正整数',
            trigger: 'blur'
          }
        ],

        rackRowNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ],
        rackColumnNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ]
      },
      isFirstEnter: true
    }
  },
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据， 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {},
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，此钩子函数中一般会做一些ajax请求获取数据进行数据初始化,mounted在整个实例中只执行一次
  mounted() {
    if (this.isFirstEnter) {
    // 获取样本列表数据
      this.getList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
    // 获取样本列表数据
      this.getList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  methods: {
    // 样本信息按条件查询
    handleSearch() {
      this.fridgeQuery.pageNumber = 1
      this.getList(this.fridgeQuery)
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (!this.fridgeQuery.fridgeCode && !this.fridgeQuery.fridgeState) {
        this.getList()
      }
    },
    // 获取样本信息列表数据
    getList() {
      this.fridgeListLoading = true
      getFridgePage(this.fridgeQuery)
        .then(res => {
          this.fridgeList = res.data.list
          this.total = res.data.total
          this.fridgeListLoading = false
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    resetfridgeTemp() {
      this.fridgeTemp = {
        id: undefined,
        fridgeCode: '',
        layerNum: '',
        rackNum: '',
        rackRowNum: '',
        rackColumnNum: '',
        remark: ''
      }
    },
    handleCreate() {
      getCurrentFridgeCode()
        .then(res => {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.resetfridgeTemp()
          this.fridgeTemp.fridgeCode = res.data.fridgeCode
          this.$refs['fridgeForm'].resetFields()
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    createData() {
      this.$refs['fridgeForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addFridge(this.fridgeTemp)
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
    handleDelete(id) {
      deleteFridge({ id: id }).then(res => {
        this.changeLoading()
        this.dialogFormVisible = false
        this.$Message.success(res.msg)
        this.getList()
      })
    },
    handleAllocation(row) {
      const route = {
        name: 'fridgeAllocation',
        query: {
          id: 'fridgeAllocation',
          fridgeId: row.id,
          fridgeCode: row.fridgeCode
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
