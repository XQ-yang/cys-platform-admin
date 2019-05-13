<template>
  <!-- 罐配置 -->
  <div class="tank-configuration">
    <Card>
      <Row>
        <Col span="24">
          <h3>{{this.currentItem.potCode}} 号液氮罐</h3>
        </Col>
      </Row>
      <!--列表-->
      <Row :gutter="16">
        <Col span="8">
          <Table
            :data="regionList"
            :columns="regionColumns"
            :loading="regionListLoading"
            :row-class-name="rowClassName"
            border
          ></Table>
          <Form ref="potMapFileForm"  :label-width="86">
             <div class="map-file">
            <div style="margin-bottom: 12px;"><h4>液氮罐分区图</h4></div>
            <a target="_blank" :href="mediaPath" title="点击看大图" v-if="mediaPath!==''">
              <img :src="mediaPath" width="380" height="285">
            </a>
            <div>
              <Form-item
              label="更新分区图"
            >
              <Upload
                ref="upload"
                :action="actionUrl"
                :headers="headers"
                paste
                accept=".jpg,.jpeg,.png"
                :before-upload="handleBeforeUpload"
                :max-size="10240"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleUploadSuccess"
                :on-preview="handleUploadPreview"
              >
              <span style="margin-left:10px;font-size:12px;color:red;">(请上传png，jpg，jpeg格式的文件,最大10M)</span>
                <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button>
              </Upload>
              <Button type="info" style="margin-left:24px;" v-if="isUpdateMapFile" @click="updateMapFile()">更新分区图</Button>
            </Form-item>
            </div>
          </div>
           </Form>
        </Col>
        <Col span="8">
          <Table
            :data="towerList"
            :columns="towerColumns"
            :loading="regionListLoading"
            :row-class-name="rowClassName"
            border
          ></Table>
        </Col>
        <Col span="8">
          <Table :data="boxList" :columns="boxColumns" :loading="regionListLoading" border></Table>
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
        <Form ref="potForm" :model="entityTemp" :rules="rules" :label-width="160">
          <Row>
            <Col span="12">
              <Form-item label="罐编号" prop="potCode">
                <Input type="text" v-model="entityTemp.potCode" readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="分区编码" prop="regionCode">
                <Input type="text" v-model="entityTemp.regionCode" readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row v-show="entityTemp.type===1" >
            <Col span="12">
              <Form-item label="每个分区的塔数量" prop="towerNum" v-if="entityTemp.type===1">
                <Input type="text" v-model="entityTemp.towerNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row v-show="entityTemp.type>1">
            <Col span="12">
              <Form-item label="塔编码" prop="towerCode" v-if="entityTemp.type>1">
                <Input type="text" v-model="entityTemp.towerCode" readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row  v-show="entityTemp.type<3">
            <Col span="12">
              <Form-item label="每个塔的层盒数量" prop="boxNum" v-if="entityTemp.type<3">
                <Input type="text" v-model="entityTemp.boxNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row v-show="entityTemp.type===3">
            <Col span="12">
              <Form-item label="盒编码" prop="boxCode" v-if="entityTemp.type===3">
                <Input type="text" v-model="entityTemp.boxCode" :maxlength="3" number readonly></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Form-item label="盒子规模（格子数）">
               <span slot="label"><span style="color:red">*</span> 盒子规模（格子数）</span>
              <Col span="4">
                <Form-item prop="boxRowNum" inline>
                  <Input
                    type="text"
                    v-model="entityTemp.boxRowNum"
                    :maxlength="3"
                    style="width:90px;"
                    inline
                    number
                  ></Input>
                </Form-item>
              </Col>
              <Col span="1" style="text-align: center">×</Col>
              <Col span="4">
                <Form-item prop="boxColumnNum" inline>
                  <Input
                    type="text"
                    v-model="entityTemp.boxColumnNum"
                    :maxlength="3"
                    style="width:90px;"
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
import './index.less'
import {
  getPotData,
  addRegion,
  getCurrentRegionCode,
  getRegionInfo,
  updateRegion,
  deleteRegion,
  getCurrentTowerCode,
  addTower,
  getTowerInfo,
  updateTower,
  deleteTower,
  getBoxInfo,
  addBox,
  getBoxByParams,
  updateBox,
  deleteBoxByParams,
  getMapFile,
  updateMapFile
} from '@/api/storage.js'
import { getToken } from '@/libs/util'
export default {
  props: {
    // 预约id
    potId: {
      type: String,
      default: ''
    }
  },
  name: 'allocation',
  data() {
    return {
      mediaPath: '', // 液氮罐分区图
      isUpdateMapFile: false, // 是否可以更新分区图
      mediaId: '', // 分区图id
      // 样本列表显示及查询
      tableLoading: false,
      loading: true,
      isSpinShow: false,
      potQuery: {
        potId: this.potId,
        regionCode: '',
        towerCode: ''
      },
      regionColumns: [
        {
          title: '分区',
          key: 'regionCode',
          width: 254,
          renderHeader: (h, index) => {
            let harr = [h('span', '分区')]
            return h('div', {}, harr)
          },
          render: (h, params) => {
            const row = params.row
            let arr = [
              h('span', { class: { code: true }}, row.regionCode),
              h(
                'span',
                { class: { msg: true }},
                '（塔数：' +
                  row.towerNum +
                  '，格子数' +
                  row.usedLatticeNum +
                  '/' +
                  row.latticeNum +
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
                    this.potQuery.towerCode = ''
                    this.potQuery.regionCode = params.row.regionCode
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
          key: 'potCode',
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
                    getCurrentRegionCode({ potId: this.entityTemp.potId }).then(
                      res => {
                        this.entityTemp.type = 1
                        this.entityTemp.isEdit = false
                        this.handleCreate({ regionCode: res.data })
                      }
                    )
                  }
                }
              },
              '新增分区'
            )
          },
          render: (h, params, vm) => {
            let arr = []
            if (params.row.usedLatticeNum === 0) {
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

                        getRegionInfo({
                          potId: params.row.potId,
                          potCode: this.currentItem.potCode,
                          regionCode: params.row.regionCode
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
                        this.handleDeleteRegion(params.row)
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
      towerColumns: [
        {
          title: '塔编码',
          key: 'towerCode',
          width: 254,
          renderHeader: (h, index) => {
            let harr = [h('span', '塔')]
            return h('div', {}, harr)
          },
          render: (h, params) => {
            const row = params.row
            let arr = [
              h('span', { class: { code: true }}, row.towerCode),
              h(
                'span',
                { class: { msg: true }},
                '（层盒数：' +
                  row.boxNum +
                  '，格子数' +
                  row.usedLatticeNum +
                  '/' +
                  row.latticeNum +
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
                    this.potQuery.towerCode = params.row.towerCode
                    this.potQuery.regionCode = this.currentItem.regionCode
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
                    this.entityTemp.regionCode = this.currentItem.regionCode
                    getCurrentTowerCode({
                      potId: this.entityTemp.potId,
                      regionCode: this.currentItem.regionCode
                    }).then(res => {
                      this.entityTemp.type = 2
                      this.entityTemp.isEdit = false
                      this.handleCreate(res.data)
                    })
                  }
                }
              },
              '新增塔'
            )
          },
          render: (h, params, vm) => {
            let arr = []
            if (params.row.usedLatticeNum === 0) {
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

                        getTowerInfo({
                          potId: params.row.potId,
                          potCode: this.currentItem.potCode,
                          regionCode: this.currentItem.regionCode,
                          towerCode: params.row.towerCode
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
                        this.handleDeleteTower({
                          potId: params.row.potId,
                          potCode: this.currentItem.potCode,
                          regionCode: this.currentItem.regionCode,
                          towerCode: params.row.towerCode
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
      boxColumns: [
        {
          title: '层盒编码',
          key: 'boxCode',
          width: 254,
          renderHeader: (h, index) => {
            let harr = [h('span', '层盒')]
            return h('div', {}, harr)
          },
          render: (h, params) => {
            const row = params.row
            let arr = [
              h('span', { class: { code: true }}, row.boxCode),
              h(
                'span',
                { class: { msg: true }},
                '（格的行列：' +
                  row.boxRowNum +
                  'x' +
                  row.boxColumnNum +
                  '，格子数' +
                  row.usedLatticeNum +
                  '/' +
                  row.latticeNum +
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
                    this.entityTemp.regionCode = this.currentItem.regionCode
                    getBoxInfo({
                      potId: this.entityTemp.potId,
                      potCode: this.currentItem.potCode,
                      regionCode: this.currentItem.regionCode,
                      towerCode: this.currentItem.towerCode
                    }).then(res => {
                      this.entityTemp.type = 3
                      this.entityTemp.isEdit = false
                      this.handleCreate(res.data)
                    })
                  }
                }
              },
              '新增层盒'
            )
          },
          render: (h, params, vm) => {
            let arr = [
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
                      this.entityTemp.type = 3

                      getBoxByParams({
                        potId: this.entityTemp.potId,
                        potCode: this.currentItem.potCode,
                        regionCode: this.currentItem.regionCode,
                        towerCode: this.currentItem.towerCode,
                        boxCode: params.row.boxCode
                      }).then(res => {
                        this.handleUpdate(res.data)
                      })
                    }
                  }
                },
                '编辑'
              )
            ]
            if (params.row.usedLatticeNum === 0) {
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
                        this.handleDeleteBox({
                          potId: params.row.potId,
                          potCode: this.currentItem.potCode,
                          regionCode: this.currentItem.regionCode,
                          towerCode: this.currentItem.towerCode,
                          boxCode: params.row.boxCode
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
      regionList: [],
      regionListLoading: false,
      towerList: [],
      currentItem: {
        potCode: '',
        regionCode: '',
        towerCode: ''
      },
      towerListLoading: false,
      boxList: [],
      boxListLoading: false,
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      modelTitle: '',
      entityTemp: {
        isEdit: false,
        type: -1, // 操作类型1.分区，2.塔，3.盒子
        potId: '',
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: '',
        towerNum: '',
        boxNum: '',
        boxRowNum: '',
        boxColumnNum: ''
      },
      rules: {
        regionNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项，请输入正整数',
            trigger: 'blur'
          }
        ],
        towerNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项，请输入正整数',
            trigger: 'blur'
          }
        ],
        boxNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '必填项，请输入正整数',
            trigger: 'blur'
          }
        ],
        boxRowNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ],
        boxColumnNum: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ]
      },
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { Authorization: getToken() }
    }
  },
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据， 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {},
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，此钩子函数中一般会做一些ajax请求获取数据进行数据初始化,mounted在整个实例中只执行一次
  mounted() {
    this.getParams() // 获取传来的参数
    // 获取样本列表数据
    this.getList(this.potQuery)
    this.getMapFile()
  },
  methods: {
    getParams: function() {
      // 取到路由带过来的参数
      this.potQuery.potId = this.$route.query.potId
      this.currentItem.potCode = this.$route.query.potCode
      this.entityTemp.potId = this.$route.query.potId
      this.entityTemp.potCode = this.$route.query.potCode
    },
    rowClassName(row, index) {
      switch (row.category) {
        case 1:
          if (this.currentItem.regionCode === '' && index === 0) {
            return 'current'
          }
          if (row.regionCode === this.currentItem.regionCode) {
            return 'current'
          }
          break
        case 2:
          if (this.currentItem.towerCode === '' && index === 0) {
            return 'current'
          }
          if (row.towerCode === this.currentItem.towerCode) {
            return 'current'
          }
          break
      }
      return ''
    },
    getMapFile() {
      getMapFile(this.$route.query.potId)
        .then(res => {
          if (res.data) {
            this.mediaPath = res.data.mediaPath
          }
        })
        .catch(error => {
          this.catchFunc(error)
        })
    },
    // 样本信息按条件查询
    handleSearch() {
      this.potQuery.pageNumber = 1

      this.getList(this.potQuery)
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    },
    // 获取样本信息列表数据
    getList() {
      this.regionListLoading = true
      getPotData(this.potQuery).then(res => {
        if (res.data.regionData) {
          this.regionList = res.data.regionData
        }
        if (res.data.towerData) {
          this.towerList = res.data.towerData
        }
        if (res.data.boxData) {
          this.boxList = res.data.boxData
        }
        if (res.data.currentItem.regionCode) {
          this.currentItem.regionCode = res.data.currentItem.regionCode
        }
        if (res.data.currentItem.towerCode) {
          this.currentItem.towerCode = res.data.currentItem.towerCode
        }
        this.regionListLoading = false
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
        // 保留isEdit,type,poid，potCode
        regionCode: '',
        towerCode: '',
        boxCode: '',
        towerNum: '',
        boxNum: '',
        boxRowNum: '',
        boxColumnNum: ''
      })
    },
    getModelTitle() {
      let title = this.entityTemp.isEdit ? '编辑' : '新增'
      switch (this.entityTemp.type) {
        case 1:
          title += '分区'
          break
        case 2:
          title += '塔'
          break
        case 3:
          title += '层盒'
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
          this.entityTemp.regionCode = data.regionCode
          this.entityTemp.towerCode = data.towerCode
          break
        case 3:
          this.entityTemp.regionCode = data.regionCode
          this.entityTemp.towerCode = data.towerCode
          this.entityTemp.boxCode = data.boxCode
          break
      }
      this.$refs['potForm'].resetFields()
      this.entityTemp.potCode = this.currentItem.potCode
      this.entityTemp = Object.assign({}, this.entityTemp, data)
    },
    thenFun(res) {
      this.isSpinShow = false
      this.changeLoading()
      this.dialogFormVisible = false
      this.$Message.success(res.msg)
      this.getList()
    },
    catchFunc(error) {
      this.isSpinShow = false
      this.changeLoading()
      this.dialogFormVisible = true
      this.$Message.error(error.msg)
    },
    createData() {
      this.$refs['potForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.isSpinShow = true
        switch (this.entityTemp.type) {
          case 1:
            addRegion(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
          case 2:
            addTower(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
          case 3:
            addBox(this.entityTemp)
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
      this.modelTitle = this.getModelTitle() // 弹出框标题
      switch (this.entityTemp.type) {
        case 1:
          break
        case 2:
          this.entityTemp.regionCode = data.regionCode
          this.entityTemp.towerCode = data.towerCode
          break
        case 3:
          this.entityTemp.regionCode = data.regionCode
          this.entityTemp.towerCode = data.towerCode
          break
      }
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
            updateRegion(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
          case 2:
            updateTower(this.entityTemp)
              .then(res => {
                this.thenFun(res)
              })
              .catch(error => {
                this.catchFunc(error)
              })
            break
          case 3:
            updateBox(this.entityTemp)
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
    handleDeleteRegion(row) {
      deleteRegion({ potId: row.potId, regionCode: row.regionCode })
        .then(res => {
          if (this.regionList.length > 0) {
            this.potQuery.regionCode = this.regionList[0].regionCode
          }
          this.thenFun(res)
        })
        .catch(error => {
          this.catchFunc(error)
        })
    },
    handleDeleteTower(row) {
      deleteTower({
        potId: row.potId,
        regionCode: row.regionCode,
        towerCode: row.towerCode
      })
        .then(res => {
          if (this.towerList.length > 0) {
            this.potQuery.towerCode = this.towerList[0].towerCode
          }
          this.thenFun(res)
        })
        .catch(error => {
          this.catchFunc(error)
        })
    },
    handleDeleteBox(row) {
      deleteBoxByParams({
        potId: row.potId,
        regionCode: row.regionCode,
        towerCode: row.towerCode,
        boxCode: row.boxCode
      })
        .then(res => {
          this.thenFun(res)
        })
        .catch(error => {
          this.catchFunc(error)
        })
    },
    // 上传文件前检查上传文件的后缀名
    handleBeforeUpload(file) {
      const fileExt = file.name
        .split('.')
        .pop()
        .toLocaleLowerCase()
      const arr = ['jpg', 'jpeg', 'png']
      if (!arr.includes(fileExt)) {
        this.$Notice.warning({
          title: '文件类型错误',
          desc:
            '文件：' +
            file.name +
            '不是' + arr.join('，') + '文件，请选择允许的文件类型进行上传。'
        })
        return false
      }
      return true
    },
    handleMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过10M。'
      })
    },
    // 打开选择上传文件
    handleUploadPreview(file) {
      window.open(file.mediaPath || file.url)
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$Message.error(res.msg)
        return
      }
      this.$refs.upload.fileList = []
      this.mediaId = res.data.id
      this.mediaPath = res.data.mediaPath
      this.isUpdateMapFile = true
    },
    updateMapFile() {
      updateMapFile(this.$route.query.potId, this.mediaId).then(res => {
        this.isUpdateMapFile = false
        this.mediaId = ''
      })
        .catch(error => {
          this.catchFunc(error)
        })
    }
  },
  watch: {
    $route(to, from) {
      if (
        to.name === 'allocation' &&
        this.potQuery.potId !== this.$route.query.potId
      ) {
        this.getParams() // 获取传来的参数
        // 获取样本列表数据
        this.getList(this.potQuery)
      }
    }
  }
}
</script>

