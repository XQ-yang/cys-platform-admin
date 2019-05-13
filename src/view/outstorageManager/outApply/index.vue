<template>
    <Tabs :value="outApplyListSate" @on-click="changeTab($event)" type="card">
        <TabPane :label="outApply" name="outApply" >
            <div>
              <Card>
                <!--出库申请查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outApplyQuery.sampleType"  @on-change="outApplyChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outApplyQuery.projectType" @on-change="outApplySelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
                      <Option v-for="item in outApplyProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outApplyQuery.sampleCode" @on-change="outApplyClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outApplyQuery.customerName" @on-change="outApplyClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outApplyQuery.customerPhone" @on-change="outApplyClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outApplySearch" class="search-btn">查询</Button>
                </div>

                <!--出库申请列表-->
                <Table :data="outApplyList" :columns="outApplyColumns" :loading="outApplyListLoading" border stripe></Table>

                <!--出库申请分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outApplyTotal>0"
                      :total="outApplyTotal"
                      :current.sync="outApplyQuery.pageNumber"
                      :page-size.sync="outApplyQuery.pageSize"
                      @on-change="getOutApplyList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane label="出库台账" name="outApplyBook">
          <div>
              <Card>
                <!--出库申请台账查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outApplyBookQuery.sampleType"  @on-change="outApplyBookChangeSampleType($event)" placeholder="请选择样本类型" style="width:190px" clearable>
                         <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outApplyBookQuery.projectType" @on-change="outApplyBookSelectClear" placeholder="请选择项目类型" style="width:190px" clearable>
                          <Option v-for="item in outApplyBookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outApplyBookQuery.sampleCode" @on-change="outApplyBookClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outApplyBookQuery.customerName" @on-change="outApplyBookClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outApplyBookQuery.customerPhone" @on-change="outApplyBookClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outApplyBookSearch" class="search-btn">查询</Button>
                </div>

                <!--出库申请台账列表-->
                <Table :data="outApplyBookList" :columns="outApplyBookColumns" :loading="outApplyBookListLoading" border stripe></Table>

                <!--出库申请台账分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outApplyBookTotal>0"
                      :total="outApplyBookTotal"
                      :current.sync="outApplyBookQuery.pageNumber"
                      :page-size.sync="outApplyBookQuery.pageSize"
                      @on-change="getOutApplyBookList"
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
import { getOutApplyList, getOutApplyBookList } from '@/api/outApply.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
export default {
  name: 'outApply',
  filters: {
    transportModeFilter(transportMode) {
      const genderMap = ['', '自提', '异地运输']
      return genderMap[transportMode]
    }
  },
  data() {
    return {
      // 显示可出库申请条数
      outApplyCount: 0,
      outApply: (h) => {
        return h('div', [
          h('span', '出库申请')
          // ,
          // h('Badge', {
          //   props: {
          //     count: this.outApplyCount
          //   }
          // })
        ])
      },
      sampleTypeList: [],
      // 出库申请列表显示及查询
      outApplyProjectTypeList: [],
      outApplyQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outApplyListLoading: false,
      outApplyList: [],
      outApplyTotal: 0,
      outApplyColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outApplyQuery.pageNumber - 1) * this.outApplyQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        { title: '剩余数量', key: 'surplusQuantity', tooltip: true },
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
                    value: { rule: 'outStoreApply' }
                  }
                ],
                on: {
                  click: () => {
                    this.outStoreApply(params.row)
                  }
                }
              }, '出库申请')
            ])
          }
        }
      ],
      // 出库申请台账列表显示及查询
      outApplyBookProjectTypeList: [],
      outApplyBookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        sampleCode: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outApplyBookListLoading: false,
      outApplyBookList: [],
      outApplyBookTotal: 0,
      outApplyBookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outApplyBookQuery.pageNumber - 1) * this.outApplyBookQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        { title: '出库数量', key: 'outQuantity', tooltip: true },
        // { title: '运输方式',
        //   key: 'transportMode',
        //   tooltip: true,
        //   render: (h, params) => {
        //     const row = params.row
        //     let text = this.$options.filters.transportModeFilter(row.transportMode)
        //     return h(
        //       'div',
        //       text
        //     )
        //   } },
        { title: '申请人', key: 'outStoreApplyUserName', tooltip: true },
        { title: '申请时间',
          key: 'outStoreApplyTime',
          width: 160,
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
          width: 128,
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '3px 2px 2px 3px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'outStoreApplyUpdate' }
                  }
                ],
                on: {
                  click: () => {
                    this.outStoreApplyUpdate(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  margin: '3px 2px 2px 3px'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'outStoreApplyView' }
                  }
                ],
                on: {
                  click: () => {
                    this.outStoreApplyView(params.row)
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
      // 获取出库申请数据列表
      this.getOutApplyList()
      // 获取出库申请台账数据列表
      this.getOutApplyBookList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取出库申请数据列表
      this.getOutApplyList()
      // 获取出库申请台账数据列表
      this.getOutApplyBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      outApplyListSate: state => state.outApply.outApplyListSate
    })
  },
  methods: {
    ...mapMutations([
      'setOutApplyListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的出库列表状态
      this.setOutApplyListSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 出库申请列表按条件查询
    outApplySearch() {
      this.outApplyQuery.pageNumber = 1
      this.getOutApplyList()
    },
    // 清空查询值的时候 重新加载出库申请列表数据
    outApplyClear(e) {
      if (e.target.value === '') {
        this.getOutApplyList()
      }
    },
    // 清空查询值的时候 重新加载出库申请列表数据(下拉框)
    outApplySelectClear(e) {
      if (e === undefined) {
        this.getOutApplyList()
      }
    },
    // 获取出库申请数据列表
    getOutApplyList() {
      this.outApplyListLoading = true
      getOutApplyList(this.outApplyQuery).then(res => {
        this.outApplyCount = res.data.totalRow
        this.outApplyList = res.data.list
        this.outApplyTotal = res.data.totalRow
        this.outApplyListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 出库申请列表切换样本类型时修改项目类型下拉数据
    outApplyChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutApplyList()
        this.outApplyQuery.projectType = ''
        this.outApplyProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outApplyQuery.projectType = ''
        this.outApplyProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞出库申请
    outStoreApply(row) {
      const route = {
        name: 'outStoreApply',
        query: {
          id: 'outStoreApply',
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 出库申请台账列表按条件查询
    outApplyBookSearch() {
      this.outApplyBookQuery.pageNumber = 1
      this.getOutApplyBookList()
    },
    // 清空查询值的时候 重新加载出库申请台账列表数据
    outApplyBookClear(e) {
      if (e.target.value === '') {
        this.getOutApplyBookList()
      }
    },
    // 清空查询值的时候 重新加载出库申请台账列表数据(下拉框)
    outApplyBookSelectClear(e) {
      if (e === undefined) {
        this.getOutApplyBookList()
      }
    },
    // 获取出库申请台账列表数据
    getOutApplyBookList() {
      this.outApplyBookListLoading = true
      getOutApplyBookList(this.outApplyBookQuery).then(res => {
        this.outApplyBookList = res.data.list
        this.outApplyBookTotal = res.data.totalRow
        this.outApplyBookListLoading = false
      })
    },
    // 出库申请台账列表切换样本类型时修改项目类型下拉数据
    outApplyBookChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutApplyBookList()
        this.outApplyBookQuery.projectType = ''
        this.outApplyBookProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outApplyBookQuery.projectType = ''
        this.outApplyBookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到出库申请查看
    outStoreApplyView(row) {
      const route = {
        name: 'outStoreApplyView',
        query: {
          id: 'outStoreApplyView',
          cellOutStoreId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到出库申请修改
    outStoreApplyUpdate(row) {
      const route = {
        name: 'outStoreApplyUpdate',
        query: {
          id: 'outStoreApplyUpdate',
          cellOutStoreId: row.id
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
