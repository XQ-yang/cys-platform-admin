<template>
    <Tabs :value="receivetListSate" @on-click="changeTab($event)"  type="card">
        <TabPane :label="wait" name="wait">
            <div>
              <Card>
                <!--待验收查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="waitQuery.sampleType"  @on-change="waiChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="waitQuery.projectType" @on-change="waitSelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
                      <Option v-for="item in waitProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="waitQuery.sampleCode" @on-change="waitClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="waitQuery.customerName" @on-change="waitClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="waitQuery.customerPhone" @on-change="waitClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="waitSearch" class="search-btn">查询</Button>
                </div>

                <!--待验收列表-->
                <Table :data="waitList" :columns="waitColumns" :loading="waitListLoading" border stripe></Table>

                <!--待验收分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="waitTotal>0"
                      :total="waitTotal"
                      :current.sync="waitQuery.pageNumber"
                      :page-size.sync="waitQuery.pageSize"
                      @on-change="getWaitList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane label="验收台账" name="book">
          <div>
              <Card>
                <!--验收台账查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="bookQuery.sampleType"  @on-change="bookChangeSampleType($event)" placeholder="请选择样本类型" style="width:190px"  clearable>
                         <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="bookQuery.projectType" @on-change="bookSelectClear" placeholder="请选择项目类型" style="width:190px"   clearable>
                          <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="bookQuery.sampleCode" @on-change="bookClear" placeholder="样本条码" class="search-input" style="width:190px"  clearable  />
                  <Input v-model="bookQuery.customerName" @on-change="bookClear" placeholder="顾客姓名" class="search-input" style="width:190px"  clearable  />
                  <Input v-model="bookQuery.customerPhone" @on-change="bookClear" placeholder="手机号" class="search-input" style="width:190px"   clearable   />
                  <Button @click="bookSearch" class="search-btn">查询</Button>
                </div>

                <!--验收台账列表-->
                <Table :data="bookList" :columns="bookColumns" :loading="bookListLoading" border stripe></Table>

                <!--验收台账分页-->
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
import { getWaitList, getBookList } from '@/api/receive.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'receiveManager',
  data() {
    return {
      // 显示待验收条数
      count: 0,
      wait: (h) => {
        return h('div', [
          h('span', '待验收'),
          h('Badge', {
            props: {
              count: this.count
            }
          })
        ])
      },
      sampleTypeList: [],
      // 待验收列表显示及查询
      waitProjectTypeList: [],
      waitQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      waitListLoading: false,
      waitList: [],
      waitTotal: 0,
      waitColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitQuery.pageNumber - 1) * this.waitQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '起运时间',
          key: 'startTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.startTime, 'yyyy-MM-dd hh:mm')
            )
          }
        },
        // { title: '承运人', key: 'carrier', tooltip: true },
        { title: '运输员', key: 'transporter', tooltip: true },
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
                    value: { rule: 'sampleReceive' }
                  }
                ],
                on: {
                  click: () => {
                    this.sampleReceive(params.row)
                  }
                }
              }, '样本验收')
            ])
          }
        }
      ],
      // 验收台账列表显示及查询
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
        { title: '样本条码', key: 'sampleCode', width: 180, tooltip: true, fixed: 'left' },
        { title: '样本类型', key: 'sampleTypeName', width: 100, tooltip: true },
        { title: '项目类型', key: 'projectTypeName', width: 180, tooltip: true },
        { title: '顾客姓名', key: 'name', width: 120, tooltip: true },
        { title: '手机号', key: 'phone', width: 130, tooltip: true },
        { title: '起运时间',
          key: 'startTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.startTime, 'yyyy-MM-dd hh:mm')
            )
          }
        },
        { title: '抵达时间',
          key: 'reciveTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.reciveTime, 'yyyy-MM-dd hh:mm')
            )
          } },
        // { title: '承运人', key: 'carrier', width: 150, tooltip: true },
        { title: '运输员', key: 'transporter', width: 150, tooltip: true },
        { title: '细胞库接收人', key: 'reciver', width: 150, tooltip: true },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          fixed: 'right',
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
                    value: { rule: 'receiveView' }
                  }
                ],
                on: {
                  click: () => {
                    this.receiveView(params.row)
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
      // 获取待验收数据列表
      this.getWaitList()
      // 获取验收台账数据列表
      this.getBookList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待验收数据列表
      this.getWaitList()
      // 获取验收台账数据列表
      this.getBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      receivetListSate: state => state.sample.receivetListSate
    })
  },
  methods: {
    ...mapMutations([
      'setReceiveListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的验收列表状态
      this.setReceiveListSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待验收列表按条件查询
    waitSearch() {
      this.waitQuery.pageNumber = 1
      this.getWaitList()
    },
    // 清空查询值的时候 重新加载待验收列表数据
    waitClear(e) {
      if (e.target.value === '') {
        this.getWaitList()
      }
    },
    // 清空查询值的时候 重新加载待验收列表数据(下拉框)
    waitSelectClear(e) {
      if (e === undefined) {
        this.getWaitList()
      }
    },
    // 获取待验收数据列表
    getWaitList() {
      this.waitListLoading = true
      getWaitList(this.waitQuery).then(res => {
        this.count = res.data.totalRow
        this.waitList = res.data.list
        this.waitTotal = res.data.totalRow
        this.waitListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待验收列表切换样本类型时修改项目类型下拉数据
    waiChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getWaitList()
        this.waitQuery.projectType = ''
        this.waitProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitQuery.projectType = ''
        this.waitProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到样本验收交接
    sampleReceive(row) {
      const route = {
        name: 'sampleReceive',
        query: {
          id: 'sampleReceive',
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到验收查看
    receiveView(row) {
      const route = {
        name: 'receiveView',
        query: {
          id: 'receiveView',
          receiveId: row.id
        }
      }
      this.$router.push(route)
    },
    // 验收台账列表按条件查询
    bookSearch() {
      this.bookQuery.pageNumber = 1
      this.getBookList()
    },
    // 清空查询值的时候 重新加载待验收台账列表数据
    bookClear(e) {
      if (e.target.value === '') {
        this.getBookList()
      }
    },
    // 清空查询值的时候 重新加载验收台账列表数据(下拉框)
    bookSelectClear(e) {
      if (e === undefined) {
        this.getBookList()
      }
    },
    // 获取验收台账数据列表
    getBookList() {
      this.bookListLoading = true
      getBookList(this.bookQuery).then(res => {
        this.bookList = res.data.list
        this.bookTotal = res.data.totalRow
        this.bookListLoading = false
      })
    },
    // 验收台账列表切换样本类型时修改项目类型下拉数据
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
    }
  }
}
</script>
