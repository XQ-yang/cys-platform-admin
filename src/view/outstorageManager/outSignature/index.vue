<template>
    <Tabs :value="outSignatureListSate" @on-click="changeTab($event)" type="card">
        <TabPane :label="outSignature" name="outSignature" >
            <div>
              <Card>
                <!--出库签字确认查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outSignatureQuery.sampleType"  @on-change="outSignatureChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outSignatureQuery.projectType" @on-change="outSignatureSelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
                      <Option v-for="item in outSignatureProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outSignatureQuery.sampleCode" @on-change="outSignatureClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outSignatureQuery.customerName" @on-change="outSignatureClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outSignatureQuery.customerPhone" @on-change="outSignatureClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outSignatureSearch" class="search-btn">查询</Button>
                </div>

                <!--出库签字确认列表-->
                <Table :data="outSignatureList" :columns="outSignatureColumns" :loading="outSignatureListLoading" border stripe></Table>

                <!--出库签字确认分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outSignatureTotal>0"
                      :total="outSignatureTotal"
                      :current.sync="outSignatureQuery.pageNumber"
                      :page-size.sync="outSignatureQuery.pageSize"
                      @on-change="getOutSignatureList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane label="签字确认台账" name="outSignatureBook">
          <div>
              <Card>
                <!--出库签字确认台账查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outSignatureBookQuery.sampleType"  @on-change="outSignatureBookChangeSampleType($event)" placeholder="请选择样本类型" style="width:190px" clearable>
                         <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outSignatureBookQuery.projectType" @on-change="outSignatureBookSelectClear" placeholder="请选择项目类型" style="width:190px" clearable>
                          <Option v-for="item in outSignatureBookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outSignatureBookQuery.sampleCode" @on-change="outSignatureBookClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outSignatureBookQuery.customerName" @on-change="outSignatureBookClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outSignatureBookQuery.customerPhone" @on-change="outSignatureBookClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outSignatureBookSearch" class="search-btn">查询</Button>
                </div>

                <!--出库签字确认台账列表-->
                <Table :data="outSignatureBookList" :columns="outSignatureBookColumns" :loading="outSignatureBookListLoading" border stripe></Table>

                <!--出库签字确认台账分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outSignatureBookTotal>0"
                      :total="outSignatureBookTotal"
                      :current.sync="outSignatureBookQuery.pageNumber"
                      :page-size.sync="outSignatureBookQuery.pageSize"
                      @on-change="getOutSignatureBookList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
    </Tabs>
</template>

<script>
import '@/assets/css/common.less'
import { mapState, mapMutations } from 'vuex'
import { getOutSignatureList, getOutSignatureBookList } from '@/api/outSignature.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
export default {
  name: 'outSignature',
  filters: {
    transportModeFilter(transportMode) {
      const genderMap = ['', '自提', '异地运输']
      return genderMap[transportMode]
    }
  },
  data() {
    return {
      // 显示待出库签字确认条数
      outSignatureCount: 0,
      outSignature: (h) => {
        return h('div', [
          h('span', '待签字确认'),
          h('Badge', {
            props: {
              count: this.outSignatureCount
            }
          })
        ])
      },
      sampleTypeList: [],
      // 出库签字确认列表显示及查询
      outSignatureProjectTypeList: [],
      outSignatureQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outSignatureListLoading: false,
      outSignatureList: [],
      outSignatureTotal: 0,
      outSignatureColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outSignatureQuery.pageNumber - 1) * this.outSignatureQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        { title: '出库数量', key: 'outQuantity', tooltip: true },
        { title: '运输方式',
          key: 'transportMode',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.transportModeFilter(row.transportMode)
            return h(
              'div',
              text
            )
          } },
        { title: '审核人', key: 'reviewer', tooltip: true },
        { title: '审核时间',
          key: 'reviewTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.reviewTime, 'yyyy-MM-dd hh:mm')
            )
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
                    value: { rule: 'outSignatureOfStock' }
                  }
                ],
                on: {
                  click: () => {
                    this.outSignatureOfStock(params.row)
                  }
                }
              }, '签字确认')
            ])
          }
        }
      ],
      // 出库签字确认台账列表显示及查询
      outSignatureBookProjectTypeList: [],
      outSignatureBookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        sampleCode: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outSignatureBookListLoading: false,
      outSignatureBookList: [],
      outSignatureBookTotal: 0,
      outSignatureBookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outSignatureBookQuery.pageNumber - 1) * this.outSignatureBookQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        { title: '出库数量', key: 'outQuantity', tooltip: true },
        { title: '运输方式',
          key: 'transportMode',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            let text = this.$options.filters.transportModeFilter(row.transportMode)
            return h(
              'div',
              text
            )
          } },
        { title: '上传人', key: 'uploader', tooltip: true },
        { title: '上传时间',
          key: 'uploaderTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.uploaderTime, 'yyyy-MM-dd hh:mm')
            )
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
                    value: { rule: 'outSignatureOfStockView' }
                  }
                ],
                on: {
                  click: () => {
                    this.outSignatureOfStockView(params.row)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取出库签字确认数据列表
      this.getOutSignatureList()
      // 获取出库签字确认台账数据列表
      this.getOutSignatureBookList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取出库签字确认数据列表
      this.getOutSignatureList()
      // 获取出库签字确认台账数据列表
      this.getOutSignatureBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      outSignatureListSate: state => state.outSignature.outSignatureListSate
    })
  },
  methods: {
    ...mapMutations([
      'setOutSignatureListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的签字确认列表状态
      this.setOutSignatureListSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 出库签字确认列表按条件查询
    outSignatureSearch() {
      this.outSignatureQuery.pageNumber = 1
      this.getOutSignatureList()
    },
    // 清空查询值的时候 重新加载出库签字确认列表数据
    outSignatureClear(e) {
      if (e.target.value === '') {
        this.getOutSignatureList()
      }
    },
    // 清空查询值的时候 重新加载出库签字确认列表数据(下拉框)
    outSignatureSelectClear(e) {
      if (e === undefined) {
        this.getOutSignatureList()
      }
    },
    // 获取出库签字确认数据列表
    getOutSignatureList() {
      this.outSignatureListLoading = true
      getOutSignatureList(this.outSignatureQuery).then(res => {
        this.outSignatureCount = res.data.totalRow
        this.outSignatureList = res.data.list
        this.outSignatureTotal = res.data.totalRow
        this.outSignatureListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 出库签字确认列表切换样本类型时修改项目类型下拉数据
    outSignatureChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutSignatureList()
        this.outSignatureQuery.projectType = ''
        this.outSignatureProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outSignatureQuery.projectType = ''
        this.outSignatureProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞出库签字确认
    outSignatureOfStock(row) {
      const route = {
        name: 'outSignatureOfStock',
        query: {
          id: 'outSignatureOfStock',
          reviewId: row.id
        }
      }
      this.$router.push(route)
    },
    // 出库签字确认台账列表按条件查询
    outSignatureBookSearch() {
      this.outSignatureBookQuery.pageNumber = 1
      this.getOutSignatureBookList()
    },
    // 清空查询值的时候 重新加载出库签字确认台账列表数据
    outSignatureBookClear(e) {
      if (e.target.value === '') {
        this.getOutSignatureBookList()
      }
    },
    // 清空查询值的时候 重新加载出库签字确认台账列表数据(下拉框)
    outSignatureBookSelectClear(e) {
      if (e === undefined) {
        this.getOutSignatureBookList()
      }
    },
    // 获取出库签字确认台账列表数据
    getOutSignatureBookList() {
      this.outSignatureBookListLoading = true
      getOutSignatureBookList(this.outSignatureBookQuery).then(res => {
        this.outSignatureBookList = res.data.list
        this.outSignatureBookTotal = res.data.totalRow
        this.outSignatureBookListLoading = false
      })
    },
    // 出库签字确认台账列表切换样本类型时修改项目类型下拉数据
    outSignatureBookChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutSignatureBookList()
        this.outSignatureBookQuery.projectType = ''
        this.outSignatureBookProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outSignatureBookQuery.projectType = ''
        this.outSignatureBookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到出库签字确认查看
    outSignatureOfStockView(row) {
      const route = {
        name: 'outSignatureOfStockView',
        query: {
          id: 'outSignatureOfStockView',
          signatureId: row.id
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
