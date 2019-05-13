<template>
  <Tabs :value="cellOutStorageListSate" @on-click="changeTab($event)" type="card">
    <TabPane :label="waitTransfer" name="waitTransfer" >
      <div>
        <Card>
          <!--待出库查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitTransferQuery.sampleType"  @on-change="waitOutChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
              <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitTransferQuery.projectType" @on-change="waitOutSelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
              <Option v-for="item in waitTransferProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitTransferQuery.sampleCode" @on-change="waitOutClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
            <Input v-model="waitTransferQuery.customerName" @on-change="waitOutClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
            <Input v-model="waitTransferQuery.customerPhone" @on-change="waitOutClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
            <Button @click="waitTransferSearch" class="search-btn">查询</Button>
          </div>

          <!--待出库列表-->
          <Table :data="waitTransferList" :columns="waitTransferColumns" :loading="waitTransferListLoading" border stripe></Table>

          <!--待出库分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitTransferTotal>0"
                :total="waitTransferTotal"
                :current.sync="waitTransferQuery.pageNumber"
                :page-size.sync="waitTransferQuery.pageSize"
                @on-change="getWaitTransferList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane label="移库台账" name="book">
      <div>
        <Card>
          <!--出库台账查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="bookQuery.sampleType"  @on-change="bookChangeSampleType($event)" placeholder="请选择样本类型" style="width:190px" clearable>
              <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="bookQuery.projectType" @on-change="bookSelectClear" placeholder="请选择项目类型" style="width:190px" clearable>
              <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="bookQuery.sampleCode" @on-change="bookClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
            <!-- <Input v-model="bookQuery.customerName" @on-change="bookClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
            <Input v-model="bookQuery.customerPhone" @on-change="bookClear" placeholder="手机号" class="search-input" style="width:190px" clearable   /> -->
            <Button @click="bookSearch" class="search-btn">查询</Button>
          </div>

          <!--出库台账列表-->
          <Table :data="bookList" :columns="bookColumns" :loading="bookListLoading" border stripe></Table>

          <!--出库台账分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="bookTotal>0"
                :total="bookTotal"
                :current.sync="bookQuery.pageNumber"
                :page-size.sync="bookQuery.pageSize"
                @on-change="getBookList"
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
import { getPageWaitTransferList, getPageTransferBookList } from '@/api/cellCulture.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'transfer',
  data() {
    return {
      // 显示待出库条数
      waitTransferCount: 0,
      waitTransfer: (h) => {
        return h('div', [
          h('span', '细胞移库')
          // ,
          // h('Badge', {
          //   props: {
          //     count: this.waitTransferCount
          //   }
          // })
        ])
      },
      sampleTypeList: [],
      // 待出库列表显示及查询
      waitTransferProjectTypeList: [],
      waitTransferQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      waitTransferListLoading: false,
      waitTransferList: [],
      waitTransferTotal: 0,
      waitTransferColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitTransferQuery.pageNumber - 1) * this.waitTransferQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '存储数量', key: 'storageQuantity', tooltip: true },
        // { title: '剩余数量', key: 'surplusQuantity', tooltip: true },
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
                    value: { rule: 'transferAdd' }
                  }
                ],
                on: {
                  click: () => {
                    this.reserveTransferAdd(params.row)
                  }
                }
              }, '移库')
            ])
          }
        }
      ],
      // 出库台账列表显示及查询
      bookProjectTypeList: [],
      bookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        sampleCode: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      bookListLoading: false,
      bookList: [],
      bookTotal: 0,
      bookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.bookQuery.pageNumber - 1) * this.bookQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        // { title: '顾客姓名', key: 'name', tooltip: true },
        // { title: '手机号', key: 'phone', tooltip: true },
        // { title: '存储数量', key: 'storageQuantity', tooltip: true },
        // { title: '移出位置', key: 'transferOutLocation', tooltip: true, minWidth: 220 },
        { title: '移入位置', key: 'transferInLocation', tooltip: true, minWidth: 180 },
        { title: '移库数量', key: 'transferQuantity', tooltip: true },
        { title: '移库人', key: 'transferUserName', tooltip: true },
        { title: '移库时间',
          key: 'transferTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.transferTime, 'yyyy-MM-dd hh:mm')
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
                    value: { rule: 'transferView' }
                  }
                ],
                on: {
                  click: () => {
                    this.reserveTransferView(params.row)
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
      // 获取待出库数据列表
      this.getWaitTransferList()
      // 获取出库台账数据列表
      this.getBookList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待出库数据列表
      this.getWaitTransferList()
      // 获取出库台账数据列表
      this.getBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      cellOutStorageListSate: state => state.outstorage.cellOutStorageListSate
    })
  },
  methods: {
    ...mapMutations([
      'setCellOutStorageListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的出库列表状态
      this.setCellOutStorageListSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待出库列表按条件查询
    waitTransferSearch() {
      this.waitTransferQuery.pageNumber = 1
      this.getWaitTransferList()
    },
    // 清空查询值的时候 重新加载待出库列表数据
    waitOutClear(e) {
      if (e.target.value === '') {
        this.getWaitTransferList()
      }
    },
    // 清空查询值的时候 重新加载待出库列表数据(下拉框)
    waitOutSelectClear(e) {
      if (e === undefined) {
        this.getWaitTransferList()
      }
    },
    // 获取待出库数据列表
    getWaitTransferList() {
      this.waitTransferListLoading = true
      getPageWaitTransferList(this.waitTransferQuery).then(res => {
        this.waitTransferCount = res.data.totalRow
        this.waitTransferList = res.data.list
        this.waitTransferTotal = res.data.totalRow
        this.waitTransferListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待出库列表切换样本类型时修改项目类型下拉数据
    waitOutChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getWaitTransferList()
        this.waitTransferQuery.projectType = ''
        this.waitTransferProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitTransferQuery.projectType = ''
        this.waitTransferProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞出库
    reserveTransferAdd(row) {
      const route = {
        name: 'transferAdd',
        query: {
          id: 'transferAdd',
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 待审核列表按条件查询
    waitReviewSearch() {
      this.waitReviewQuery.pageNumber = 1
      this.getWaitReviewList()
    },
    // 清空查询值的时候 重新加载待审核列表数据
    waitReviewClear(e) {
      if (e.target.value === '') {
        this.getWaitReviewList()
      }
    },
    // 清空查询值的时候 重新加载待审核列表数据(下拉框)
    waitReviewSelectClear(e) {
      if (e === undefined) {
        this.getWaitReviewList()
      }
    },
    // 出库台账列表按条件查询
    bookSearch() {
      this.bookQuery.pageNumber = 1
      this.getBookList()
    },
    // 清空查询值的时候 重新加载待出库台账列表数据
    bookClear(e) {
      if (e.target.value === '') {
        this.getBookList()
      }
    },
    // 清空查询值的时候 重新加载出库台账列表数据(下拉框)
    bookSelectClear(e) {
      if (e === undefined) {
        this.getBookList()
      }
    },
    // 获取出库台账数据列表
    getBookList() {
      this.bookListLoading = true
      getPageTransferBookList(this.bookQuery).then(res => {
        this.bookList = res.data.list
        this.bookTotal = res.data.totalRow
        this.bookListLoading = false
      })
    },
    // 出库台账列表切换样本类型时修改项目类型下拉数据
    bookChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getBookList()
        this.bookQuery.projectType = ''
        this.bookProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.bookQuery.projectType = ''
        this.bookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到出库查看
    reserveTransferView(row) {
      const route = {
        name: 'transferView',
        query: {
          id: 'transferView',
          transferId: row.id
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
