<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Select
          v-model="potQuery.potType"
          placeholder="请选择存储罐类型"
          style="width:160px"
          @on-change="handleClear"
          clearable
        >
          <Option :value="1">干细胞存储罐</Option>
          <Option :value="2">免疫细胞存储罐</Option>
          <Option :value="3">暂存罐</Option>
          <Option :value="4">公共罐</Option>
        </Select>
        <Select v-model="potQuery.potState" placeholder="请选择存储罐状态" style="width:160px" @on-change="handleClear" clearable>
          <Option :value="1">未使用</Option>
          <Option :value="2">未存满</Option>
          <Option :value="3">已存满</Option>
        </Select>
        <Select v-model="potQuery.sampleType" placeholder="请选择样本存储类型" style="width:160px" @on-change="handleClear" clearable>
          <Option :value="1">阴性</Option>
          <Option :value="2">阳性</Option>
        </Select>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="handleCreate" class="search-btn">新增</Button>
      </div>
      <!--列表-->
      <Table :data="potList" :columns="potColumns" :loading="potListLoading" border stripe></Table>
      <!--分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="potQuery.pageNumber"
            :page-size.sync="potQuery.pageSize"
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

        <Form ref="potForm" :model="potTemp" :rules="rules" :label-width="160">
          <Row>
            <Col span="12">
              <Form-item label="罐编号" prop="potCode">
                <Input type="text" v-model="potTemp.potCode" :readonly="true" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="罐类型" prop="potType">
                <Select v-model="potTemp.potType" clearable placeholder="请选择">
                  <Option :value="1">干细胞存储罐</Option>
                  <Option :value="2">免疫细胞存储罐</Option>
                  <Option :value="3">暂存罐</Option>
                  <Option :value="4">公共罐</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="样本类型" prop="sampleType">
                <RadioGroup v-model="potTemp.sampleType">
                  <Radio :label="1">阴性</Radio>
                  <Radio :label="2">阳性</Radio>
                </RadioGroup>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="罐分区数量" prop="regionNum">
                <Input type="text" v-model="potTemp.regionNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="每个分区的塔数量" prop="towerNum">
                <Input type="text" v-model="potTemp.towerNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <Form-item label="每个塔的层盒数量" prop="boxNum">
                <Input type="text" v-model="potTemp.boxNum" :maxlength="3" number></Input>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Form-item label="" >
              <span slot="label"><span style="color:red">*</span> 盒子规模（格子数）</span>
              <Col span="4">
                <Form-item prop="boxRowNum" inline >
                  <Input
                    type="text"
                    v-model="potTemp.boxRowNum"
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
                    v-model="potTemp.boxColumnNum"
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
                <Input type="text" v-model="potTemp.remark" :maxlength="40"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="12">
          <Col span="24">
            <Form-item
              label="上传分区图"
              :label-width="160"
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
                <Button icon="ios-cloud-upload-outline"  style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button>
                <span style="margin-left:10px;font-size:12px;color:red;">(请上传png，jpg，jpeg格式的文件,最大10M)</span>
              </Upload>
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
  getPotInfo,
  addPot,
  hasPotCode,
  getCurrentPotCode,
  deleteByPotId
} from '@/api/storage.js'
import { getToken } from '@/libs/util'
export default {
  name: 'pot',
  filters: {
    potTypeFilter(gender) {
      const potTypeMap = ['干细胞存储罐', '免疫细胞存储罐', '暂存罐', '公共罐']
      return potTypeMap[gender - 1]
    },
    potStateFilter(gender) {
      const potStateMap = ['未使用', '已使用', '已存满']
      return potStateMap[gender - 1]
    }
  },
  data() {
    return {
      // 样本列表显示及查询
      tableLoading: false,
      loading: true,
      potQuery: {
        pageNumber: 1,
        pageSize: 10,
        potType: '',
        potState: '',
        sampleType: ''
      },
      potColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.potQuery.pageNumber - 1) * this.potQuery.pageSize
          }
        },
        { title: '罐编号', key: 'potCode' },
        {
          title: '罐类型',
          key: 'potType',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.potTypeFilter(row.potType)
            return h('div', text)
          }
        },
        {
          title: '罐状态',
          key: 'potState',
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.potStateFilter(row.potState)
            return h('div', text)
          }
        },
        {
          title: '样本存储类型',
          key: 'sampleType',
          render: (h, params) => {
            const row = params.row
            let ampleTypeText = ''
            if (row.sampleType === 1) {
              ampleTypeText = '阴性'
            } else if (row.sampleType === 2) {
              ampleTypeText = '阳性'
            }
            return h('div', ampleTypeText)
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 120,
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
                    marginRight: '5px'
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
            if (params.row.usedLatticeNum === 0) {
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
      potList: [],
      potListLoading: false,
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      potTemp: {
        id: undefined,
        potCode: '',
        potType: '',
        sampleType: '',
        regionNum: '',
        towerNum: '',
        boxNum: '',
        boxRowNum: '',
        boxColumnNum: '',
        usedRegionNum: 0,
        usedTowerNum: 0,
        usedBoxNum: 0,
        usedLatticeNum: 0,
        remark: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0,
        potMapFile: ''
      },
      rules: {
        potCode: [
          { type: 'integer', message: '请输入整数', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              hasPotCode({ potCode: value })
                .then(res => {
                  if (res.data) {
                    callback(new Error('罐编码已存在'))
                  } else {
                    callback()
                  }
                })
                .catch(error => {
                  this.$Message.error(error.msg)
                })
            },
            trigger: 'blur'
          }
        ],
        potType: [
          {
            type: 'integer',
            required: true,
            message: '必填项，不能为空',
            trigger: 'blur'
          }
        ],
        sampleType: [
          {
            type: 'integer',
            required: true,
            message: '必填项，不能为空',
            trigger: 'change'
          }
        ],
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
      isFirstEnter: true,
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { Authorization: getToken() }
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
      this.potQuery.pageNumber = 1
      this.getList(this.potQuery)
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e === undefined || e === '') {
        if (
          !this.potQuery.sampleType &&
          !this.potQuery.potState &&
          !this.potQuery.potType
        ) { this.getList() }
      }
    },
    // 获取样本信息列表数据
    getList() {
      this.potListLoading = true
      getPotInfo(this.potQuery)
        .then(res => {
          this.potList = res.data.list
          this.total = res.data.totalRow
          this.potListLoading = false
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
    resetpotTemp() {
      this.$refs.upload.fileList = []
      this.potTemp = {
        id: undefined,
        potCode: '',
        potType: '',
        sampleType: '',
        regionNum: '',
        towerNum: '',
        boxNum: '',
        boxRowNum: '',
        boxColumnNum: '',
        usedRegionNum: 0,
        usedTowerNum: 0,
        usedBoxNum: 0,
        usedLatticeNum: 0,
        remark: '',
        createTime: new Date(),
        updateTime: new Date(),
        isDelete: 0,
        potMapFile: ''
      }
    },
    // 上传文件前检查上传文件的后缀名
    handleBeforeUpload(file) {
      const fileExt = file.name
        .split('.')
        .pop()
        .toLocaleLowerCase()
      const arr = ['png', 'jpg', 'jpeg']
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
      window.open(file.response.data.mediaPath || file.url)
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$Message.error(res.msg)
        // 移除api端发生错误时的文件
        if (fileList && fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            let curFile = fileList[i]
            if (file.uid === curFile.uid) {
              fileList.splice(i, 1)
              return
            }
          }
        }
        return
      }
      this.$refs.upload.fileList = []
      this.$refs.upload.fileList.push(file)
      this.potTemp.potMapFile = res.data.id
    },
    handleCreate() {
      getCurrentPotCode()
        .then(res => {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.resetpotTemp()
          this.potTemp.potCode = res.data
          this.$refs['potForm'].resetFields()
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    createData() {
      this.$refs['potForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addPot(this.potTemp)
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
      deleteByPotId({ potId: id }).then(res => {
        this.changeLoading()
        this.dialogFormVisible = false
        this.$Message.success(res.msg)
        this.getList()
      })
    },
    handleAllocation(row) {
      const route = {
        name: 'allocation',
        query: {
          id: 'allocation',
          potId: row.id,
          potCode: row.potCode
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
