<template>
  <!-- 罐配置 -->
  <div class="tank-configuration">
    <Card>
      <Row>
        <Col span="24">
          <h3>{{this.currentItem.fridgeCode}} 号冰箱</h3>
        </Col>
      </Row>
      <!--列表-->
      <Row :gutter="16">
        <Col span="12">
          <Table
            :data="layerList"
            :columns="layerColumns"
            :loading="layerListLoading"
            :row-class-name="rowClassName"
            border
          ></Table>
        </Col>
        <Col span="12">
          <Table :data="racList" :columns="rackColumns" :loading="layerListLoading" border></Table>
        </Col>
      </Row>
      <!--弹出层-->
      <Modal
        v-model="dialogFormVisible"
        :title="modelTitle"
        :loading="loading"
        @on-ok="dialogStatus==='create'?createData():updateData()"
        class-name="vertical-center-modal"
        :mask-closable="false"
        width="700"
        ok-text="提交"
        cancel-text="关闭"
      >
        <Form ref="potForm" :model="entityTemp" :rules="rules" :label-width="180">
          <Row>
            <Col span="12">
              <Form-item label="冰箱编号" prop="fridgeCode">
                <Input type="text" v-model="entityTemp.fridgeCode" readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="层编码" prop="layerCode">
                <Input type="text" v-model="entityTemp.layerCode" readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row v-if="entityTemp.type===1">
            <Col span="12">
              <Form-item label="每个层的架子数量" prop="rackNum"  >
                <Input type="text" v-model="entityTemp.rackNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row v-if="entityTemp.type>1">
            <Col span="12">
              <Form-item label="架子编码">
                <Input type="text" v-model="entityTemp.rackCode" :maxlength="3" readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Form-item label="架子子规模（试管数）">
              <span slot="label"><span style="color:red">*</span> 架子子规模（试管数）</span>
              <Col span="5">
                <Form-item prop="rackRowNum" :maxlength="3" inline>
                  <Input
                    type="text"
                    v-model="entityTemp.rackRowNum"
                    style="width:100px;"
                    inline
                    number
                  ></Input>
                </Form-item>
              </Col>
              <Col span="1" style="text-align: center"> × </Col>
              <Col span="5">
                <Form-item prop="rackColumnNum" inline>
                  <Input
                    type="text"
                    v-model="entityTemp.rackColumnNum"
                    :maxlength="3"
                    style="width:100px;"
                    inline
                    number
                  ></Input>
                </Form-item>
              </Col>
            </Form-item>
          </Row>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import '../pot/index.less'
import {
  getFridgeData,
  addLayer,
  getCurrentLayerCode,
  getLayerInfo,
  updateLayer,
  deleteLayerByCode,
  getCurrentRackCode,
  addRack,
  getRackInfo,
  updateRack,
  deleteRackByCode
} from '@/api/fridge.js'

export default {
  name: 'fridgeAllocation',
  props: {
    // 预约id
    fridgeCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 样本列表显示及查询
      tableLoading: false,
      loading: true,
      fridgeQuery: {
        fridgeCode: this.fridgeCode,
        layerCode: '',
        rackCode: ''
      },
      layerColumns: [
        {
          title: '层',
          key: 'layerCode',
          width: 455,
          renderHeader: (h, index) => {
            let harr = [h('span', '层')]
            return h('div', {}, harr)
          },
          render: (h, params) => {
            const row = params.row
            let arr = [
              h('span', { class: { code: true }}, row.layerCode),
              h(
                'span',
                { class: { msg: true }},
                '（架子数：' +
                  row.rackNum +
                  ',试管数' +
                  row.usedCuvetteNum +
                  '/' +
                  row.cuvetteNum +
                  '）'
              )
            ]
            return h(
              'div',
              {
                class: { link: true },
                attrs: {
                  title: '点击选择'
                },
                on: {
                  click: () => {
                    this.fridgeQuery.rackCode = ''
                    this.fridgeQuery.layerCode = params.row.layerCode
                    this.getList()
                  }
                }
              },
              arr
            )
          }
        },
        {
          title: '操作',
          key: 'fridgeCode',
          align: 'right',
          width: 130,
          renderHeader: (h, index) => {
            return h(
              'Button',
              {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    getCurrentLayerCode({
                      fridgeCode: this.entityTemp.fridgeCode
                    }).then(res => {
                      this.entityTemp.type = 1
                      this.entityTemp.isEdit = false
                      this.handleCreate({ layerCode: res.data.layerCode })
                    })
                  }
                }
              },
              '新增层'
            )
          },
          render: (h, params, vm) => {
            let arr = []
            if (params.row.usedCuvetteNum === 0) {
              arr.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.entityTemp.isEdit = true
                        this.entityTemp.type = 1

                        getLayerInfo({
                          fridgeCode: params.row.fridgeCode,
                          layerCode: params.row.layerCode
                        }).then(res => {
                          this.handleUpdate(res.data)
                        })
                      }
                    }
                  },
                  '编辑'
                )
              )
              arr.push(
                h(
                  'Poptip',
                  {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '您确定要废弃吗'
                    },
                    on: {
                      'on-ok': () => {
                        this.handleDeleteLayer(params.row)
                      }
                    }
                  },
                  [
                    h(
                      'Button',
                      {
                        props: {
                          type: 'info',
                          size: 'small'
                        }
                      },
                      '废弃'
                    )
                  ]
                )
              )
            }
            return h('div', arr)
          }
        }
      ],
      rackColumns: [
        {
          title: '架子编码',
          key: 'rackCode',
          width: 455,
          renderHeader: (h, index) => {
            let harr = [h('span', '架')]
            return h('div', {}, harr)
          },
          render: (h, params) => {
            const row = params.row
            let arr = [
              h('span', { class: { code: true }}, row.rackCode),
              h(
                'span',
                { class: { msg: true }},
                '（试管行列：' +
                  row.rackRowNum +
                  'x' +
                  row.rackColumnNum +
                  ',试管数' +
                  row.usedCuvetteNum +
                  '/' +
                  row.cuvetteNum +
                  '）'
              )
            ]
            return h('div', arr)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 130,
          align: 'center',
          renderHeader: (h, index) => {
            return h(
              'Button',
              {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.entityTemp.layerCode = this.currentItem.layerCode
                    getCurrentRackCode({
                      fridgeCode: this.entityTemp.fridgeCode,
                      layerCode: this.currentItem.layerCode
                    }).then(res => {
                      this.entityTemp.type = 2
                      this.entityTemp.isEdit = false
                      this.handleCreate(res.data)
                    })
                  }
                }
              },
              '新增架子'
            )
          },
          render: (h, params, vm) => {
            let arr = []
            if (params.row.usedCuvetteNum === 0) {
              arr.push(
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.entityTemp.isEdit = true
                        this.entityTemp.type = 2

                        getRackInfo({
                          fridgeCode: params.row.fridgeCode,
                          layerCode: this.currentItem.layerCode,
                          rackCode: params.row.rackCode
                        }).then(res => {
                          this.handleUpdate(res.data)
                        })
                      }
                    }
                  },
                  '编辑'
                )
              )
              arr.push(
                h(
                  'Poptip',
                  {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '您确定要废弃吗'
                    },
                    on: {
                      'on-ok': () => {
                        this.handleDeleteRack({
                          fridgeCode: this.currentItem.fridgeCode,
                          layerCode: this.currentItem.layerCode,
                          rackCode: params.row.rackCode,
                          fridgeId: this.currentItem.fridgeId
                        })
                      }
                    }
                  },
                  [
                    h(
                      'Button',
                      {
                        props: {
                          type: 'info',
                          size: 'small'
                        }
                      },
                      '废弃'
                    )
                  ]
                )
              )
            }
            return h('div', arr)
          }
        }
      ],

      layerList: [],
      layerListLoading: false,
      racList: [],
      currentItem: {
        fridgeCode: '',
        fridgeId: '',
        layerCode: '',
        rackCode: ''
      },
      racListLoading: false,
      boxList: [],
      boxListLoading: false,
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      modelTitle: '',

      entityTemp: {
        isEdit: false,
        type: -1, // 操作类型1.层，2.架
        id: '',
        fridgeCode: '',
        layerCode: '',
        rackCode: '',
        layerNum: '',
        rackNum: '',
        rackRowNum: '',
        rackColumnNum: ''
      },
      rules: {
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
      }
    }
  },
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据， 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {},
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，此钩子函数中一般会做一些ajax请求获取数据进行数据初始化,mounted在整个实例中只执行一次
  mounted() {
    this.getParams() // 获取传来的参数
    // 获取冰箱列表数据
    this.getList(this.fridgeQuery)
  },
  methods: {
    getParams: function() {
      // 取到路由带过来的参数
      this.fridgeQuery.fridgeCode = this.$route.query.fridgeCode
      this.currentItem.fridgeCode = this.$route.query.fridgeCode
      this.entityTemp.fridgeCode = this.$route.query.fridgeCode
      this.entityTemp.fridgeId = this.$route.query.fridgeId
      this.currentItem.fridgeId = this.$route.query.fridgeId
    },
    rowClassName(row, index) {
      if (this.currentItem.layerCode === '' && index === 0) {
        return 'current'
      }
      if (row.layerCode === this.currentItem.layerCode) {
        return 'current'
      }
      return ''
    },
    // 样本信息按条件查询
    handleSearch() {
      this.fridgeQuery.pageNumber = 1
      this.getList(this.fridgeQuery)
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    },
    // 获取样本信息列表数据
    getList() {
      this.layerListLoading = true

      getFridgeData(this.fridgeQuery).then(res => {
        if (res.data.layerData) {
          this.layerList = res.data.layerData
        }
        if (res.data.rackData) {
          this.racList = res.data.rackData
        }
        if (res.data.currentItem.fridgeCode) {
          this.currentItem.fridgeCode = res.data.currentItem.fridgeCode
        }
        if (res.data.currentItem.layerCode) {
          this.currentItem.layerCode = res.data.currentItem.layerCode
        }
        this.layerListLoading = false
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    resetentityTemp() {
      this.entityTemp = Object.assign(this.entityTemp, {
        // 保留isEdit,type,id，fridgeCode
        layerCode: '',
        rackCode: '',
        layerNum: '',
        rackNum: '',
        rackRowNum: '',
        rackColumnNum: ''
      })
    },
    getModelTitle() {
      let title = this.entityTemp.isEdit ? '编辑' : '新增'
      switch (this.entityTemp.type) {
        case 1:
          title += '层'
          break
        case 2:
          title += '架子'
          break
      }
      return title
    },
    handleCreate(data) {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetentityTemp()

      this.modelTitle = this.getModelTitle() // 弹出框标题
      switch (this.entityTemp.type) {
        case 1:
          break
        case 2:
          this.entityTemp.layerCode = data.layerCode
          this.entityTemp.rackCode = data.rackCode
          break
      }
      this.entityTemp = Object.assign({}, this.entityTemp, data)
      this.$refs['potForm'].resetFields()
    },
    thenFun(res) {
      this.changeLoading()
      this.dialogFormVisible = false
      this.$Message.success(res.msg)
      this.getList()
    },
    catchFunc(error) {
      this.changeLoading()
      this.dialogFormVisible = true
      this.$Message.error(error.msg)
    },
    createData() {
      this.$refs['potForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        switch (this.entityTemp.type) {
          case 1:
            addLayer(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
          case 2:
            addRack(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
        }
      })
    },
    handleUpdate(data) {
      switch (this.entityTemp.type) {
        case 1:
          break
        case 2:
          this.entityTemp.layerCode = data.layerCode
          this.entityTemp.rackCode = data.rackCode
          break
      }
      this.modelTitle = this.getModelTitle() // 弹出框标题
      // 用assign 进行浅拷贝
      this.entityTemp = Object.assign({}, this.entityTemp, data)
      this.dialogStatus = 'update'
      this.$refs['potForm'].resetFields()
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['potForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        switch (this.entityTemp.type) {
          case 1:
            updateLayer(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
          case 2:
            updateRack(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
        }
      })
    },
    handleDeleteLayer(row) {
      deleteLayerByCode({
        fridgeCode: row.fridgeCode,
        layerCode: row.layerCode,
        fridgeId: this.currentItem.fridgeId
      })
        .then(res => {
          if (this.layerList.length) {
            this.fridgeQuery.layerCode = this.layerList[0].layerCode
          }
          this.thenFun(res)
        })
        .catch(error => {
          this.catchFunc(error)
        })
    },
    handleDeleteRack(row) {
      deleteRackByCode(row)
        .then(res => {
          this.thenFun(res)
        })
        .catch(error => {
          this.catchFunc(error)
        })
    }
  },
  watch: {
    $route(to, from) {
      if (
        to.name === 'fridgeAllocation' &&
        this.fridgeQuery.fridgeCode !== this.$route.query.fridgeCode
      ) {
        this.getParams() // 获取传来的参数
        this.getList(this.fridgeQuery)
      }
    }
  }
}
</script>
