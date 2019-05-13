<template>
    <Tabs :value="outStockListSate" @on-click="changeTab($event)" type="card">
        <TabPane :label="outStock" name="outStock" >
            <div>
              <Card>
                <!--库存出库查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outStockQuery.sampleType"  @on-change="outStockChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outStockQuery.projectType" @on-change="outStockSelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
                      <Option v-for="item in outStockProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outStockQuery.sampleCode" @on-change="outStockClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outStockQuery.customerName" @on-change="outStockClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outStockQuery.customerPhone" @on-change="outStockClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outStockSearch" class="search-btn">查询</Button>
                </div>

                <!--库存出库列表-->
                <Table :data="outStockList" :columns="outStockColumns" :loading="outStockListLoading" border stripe></Table>

                <!--出库出库分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outStockTotal>0"
                      :total="outStockTotal"
                      :current.sync="outStockQuery.pageNumber"
                      :page-size.sync="outStockQuery.pageSize"
                      @on-change="getOutStockList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane label="库存出库台账" name="outStockBook">
          <div>
              <Card>
                <!--库存出库台账查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outStockBookQuery.sampleType"  @on-change="outStockBookChangeSampleType($event)" placeholder="请选择样本类型" style="width:190px" clearable>
                         <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outStockBookQuery.projectType" @on-change="outStockBookSelectClear" placeholder="请选择项目类型" style="width:190px" clearable>
                          <Option v-for="item in outStockBookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outStockBookQuery.sampleCode" @on-change="outStockBookClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outStockBookQuery.customerName" @on-change="outStockBookClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outStockBookQuery.customerPhone" @on-change="outStockBookClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outStockBookSearch" class="search-btn">查询</Button>
                </div>

                <!--库存出库台账列表-->
                <Table :data="outStockBookList" :columns="outStockBookColumns" :loading="outStockBookListLoading" border stripe></Table>

                <!--库存出库台账分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outStockBookTotal>0"
                      :total="outStockBookTotal"
                      :current.sync="outStockBookQuery.pageNumber"
                      :page-size.sync="outStockBookQuery.pageSize"
                      @on-change="getOutStockBookList"
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
import { getOutStockList, getOutStockBookList } from '@/api/outStock.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
export default {
  name: 'outStock',
  filters: {
    transportModeFilter(transportMode) {
      const genderMap = ['', '自提', '异地运输']
      return genderMap[transportMode]
    }
  },
  data() {
    return {
      // 显示可库存出库条数
      outStockCount: 0,
      outStock: (h) => {
        return h('div', [
          h('span', '库存待出库'),
          h('Badge', {
            props: {
              count: this.outStockCount
            }
          })
        ])
      },
      sampleTypeList: [],
      // 库存出库列表显示及查询
      outStockProjectTypeList: [],
      outStockQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outStockListLoading: false,
      outStockList: [],
      outStockTotal: 0,
      outStockColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outStockQuery.pageNumber - 1) * this.outStockQuery.pageSize
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
        { title: '申请人', key: 'outStoreApplyUserName', tooltip: true },
        { title: '申请时间',
          key: 'outStoreApplyTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.outStoreApplyTime, 'yyyy-MM-dd hh:mm')
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
                    value: { rule: 'outStoreOfStock' }
                  }
                ],
                on: {
                  click: () => {
                    this.outStoreOfStock(params.row)
                  }
                }
              }, '库存出库')
            ])
          }
        }
      ],
      // 库存出库台账列表显示及查询
      outStockBookProjectTypeList: [],
      outStockBookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        sampleCode: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outStockBookListLoading: false,
      outStockBookList: [],
      outStockBookTotal: 0,
      outStockBookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outStockBookQuery.pageNumber - 1) * this.outStockBookQuery.pageSize
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
        { title: '出库人', key: 'outStoreUserName', tooltip: true },
        { title: '出库时间',
          key: 'outStoreTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.outStoreTime, 'yyyy-MM-dd hh:mm')
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
                    value: { rule: 'outStoreOfStockView' }
                  }
                ],
                on: {
                  click: () => {
                    this.outStoreOfStockView(params.row)
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
      // 获取库存出库数据列表
      this.getOutStockList()
      // 获取库存出库台账数据列表
      this.getOutStockBookList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取库存出库数据列表
      this.getOutStockList()
      // 获取库存出库台账数据列表
      this.getOutStockBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      outStockListSate: state => state.outStock.outStockListSate
    })
  },
  methods: {
    ...mapMutations([
      'setOutStockListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的库存出库列表状态
      this.setOutStockListSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 库存出库列表按条件查询
    outStockSearch() {
      this.outStockQuery.pageNumber = 1
      this.getOutStockList()
    },
    // 清空查询值的时候 重新加载库存出库列表数据
    outStockClear(e) {
      if (e.target.value === '') {
        this.getOutStockList()
      }
    },
    // 清空查询值的时候 重新加载库存出库列表数据(下拉框)
    outStockSelectClear(e) {
      if (e === undefined) {
        this.getOutStockList()
      }
    },
    // 获取库存出库数据列表
    getOutStockList() {
      this.outStockListLoading = true
      getOutStockList(this.outStockQuery).then(res => {
        this.outStockCount = res.data.totalRow
        this.outStockList = res.data.list
        this.outStockTotal = res.data.totalRow
        this.outStockListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 库存出库列表切换样本类型时修改项目类型下拉数据
    outStockChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutStockList()
        this.outStockQuery.projectType = ''
        this.outStockProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outStockQuery.projectType = ''
        this.outStockProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞库存出库
    outStoreOfStock(row) {
      const route = {
        name: 'outStoreOfStock',
        query: {
          id: 'outStoreOfStock',
          cellOutStoreId: row.id
        }
      }
      this.$router.push(route)
    },
    // 库存出库台账列表按条件查询
    outStockBookSearch() {
      this.outStockBookQuery.pageNumber = 1
      this.getOutStockBookList()
    },
    // 清空查询值的时候 重新加载库存出库台账列表数据
    outStockBookClear(e) {
      if (e.target.value === '') {
        this.getOutStockBookList()
      }
    },
    // 清空查询值的时候 重新加载库存出库台账列表数据(下拉框)
    outStockBookSelectClear(e) {
      if (e === undefined) {
        this.getOutStockBookList()
      }
    },
    // 获取库存出库台账列表数据
    getOutStockBookList() {
      this.outStockBookListLoading = true
      getOutStockBookList(this.outStockBookQuery).then(res => {
        this.outStockBookList = res.data.list
        this.outStockBookTotal = res.data.totalRow
        this.outStockBookListLoading = false
      })
    },
    // 库存出库台账列表切换样本类型时修改项目类型下拉数据
    outStockBookChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutStockBookList()
        this.outStockBookQuery.projectType = ''
        this.outStockBookProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outStockBookQuery.projectType = ''
        this.outStockBookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到库存出库查看
    outStoreOfStockView(row) {
      const route = {
        name: 'outStoreOfStockView',
        query: {
          id: 'outStoreOfStockView',
          cellOutStoreId: row.id
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
