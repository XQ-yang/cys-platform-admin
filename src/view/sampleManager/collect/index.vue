<template>
    <Tabs :value="collectListSate" @on-click="changeTab($event)" type="card">
        <TabPane :label="wait" name="wait">
            <div>
              <Card>
                <!--待采集查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="waitQuery.sampleType"  @on-change="waitChangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
                           <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="waitQuery.projectType" @on-change="waitSelectClear" placeholder="请选择项目类型" style="width:200px"  clearable>
                          <Option v-for="item in waitProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="waitQuery.customerName" @on-change="waitClear" placeholder="顾客姓名" class="search-input" clearable  />
                  <Input v-model="waitQuery.customerPhone" @on-change="waitClear" placeholder="手机号" class="search-input" clearable   />
                  <Button @click="waitSearch" class="search-btn">查询</Button>
                  <Button  v-permission="{rule:'unReserveCreate'}"  @click="unReserveRegisterCreate" class="ivu-btn ivu-btn-primary search-btn">样品绑定</Button>
                </div>

                <!--待采集列表-->
                <Table :data="waitList" :columns="waitColumns" :loading="waitListLoading" border stripe></Table>

                <!--待采集分页-->
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
        <TabPane label="采集台账" name="book">
          <div>
              <Card>
                <!--采集台账查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="bookQuery.sampleType"  @on-change="bookChangeSampleType($event)" placeholder="请选择样本类型" style="width:200px" clearable>
                         <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="bookQuery.projectType" @on-change="bookSelectClear" placeholder="请选择项目类型" style="width:200px"  clearable>
                          <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="bookQuery.customerName" @on-change="bookClear" placeholder="顾客姓名"class="search-input" clearable  />
                  <Input v-model="bookQuery.customerPhone" @on-change="bookClear" placeholder="手机号" class="search-input" clearable   />
                  <Input v-model="bookQuery.sampleCode" @on-change="bookClear" placeholder="样本条码"class="search-input" clearable  />
                  <Button @click="bookSearch" class="search-btn">查询</Button>
                </div>

                <!--采集台账列表-->
                <Table :data="bookList" :columns="bookColumns" :loading="bookListLoading" border stripe></Table>

                <!--采集台账分页-->
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
import { getWaitList, getBookList } from '@/api/collect.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'collect',
  data() {
    return {
      // 显示待采集条数
      count: 0,
      wait: (h) => {
        return h('div', [
          h('span', '待采集'),
          h('Badge', {
            props: {
              count: this.count
            }
          })
        ])
      },
      // 样本类型数据
      sampleTypeList: [],
      // 待采集列表显示及查询
      waitProjectTypeList: [],
      waitQuery: {
        pageNumber: 1,
        pageSize: 10,
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
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'customerName', tooltip: true },
        { title: '手机号', key: 'customerPhone', tooltip: true },
        { title: '采集医院', key: 'collectHospita', tooltip: true },
        { title: '计划取样时间',
          key: 'planCollectTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.planCollectTime, 'yyyy-MM-dd hh:mm')
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
                    value: { rule: 'reserveCreate' }
                  }
                ],
                on: {
                  click: () => {
                    this.reserveRegisterCreate(params.row)
                  }
                }
              }, '绑定')
            ])
          }
        }
      ],
      // 采集台账列表显示及查询
      bookProjectTypeList: [],
      bookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
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
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '采集医院', key: 'collectHospita', tooltip: true },
        { title: '采集时间',
          key: 'collectTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.collectTime, 'yyyy-MM-dd hh:mm')
            )
          }
        },
        { title: '采集人', key: 'collector', tooltip: true },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 130,
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
                    value: { rule: 'sampleView' }
                  }
                ],
                on: {
                  click: () => {
                    this.sampleView(params.row)
                  }
                }
              }, '查看'),
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
                    value: { rule: 'sampleUpdate' }
                  }
                ],
                on: {
                  click: () => {
                    this.update(params.row)
                  }
                }
              }, '编辑')
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
      // 获取待采集数据列表
      this.getWaitList()
      // 获取采集台账数据列表
      this.getBookList()
    }
  },
  activated() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待采集数据列表
      this.getWaitList()
      // 获取采集台账数据列表
      this.getBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      collectListSate: state => state.sample.collectListSate
    })
  },
  methods: {
    ...mapMutations([
      'setCollectListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的采集列表状态
      this.setCollectListSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待采集列表按条件查询
    waitSearch() {
      this.waitQuery.pageNumber = 1
      this.getWaitList()
    },
    // 清空查询值的时候 重新加载待采集列表数据
    waitClear(e) {
      if (e.target.value === '') {
        this.getWaitList()
      }
    },
    // 清空查询值的时候 重新加载待采集列表数据(下拉框)
    waitSelectClear(e) {
      if (e === undefined) {
        this.getWaitList()
      }
    },
    // 获取待采集数据列表
    getWaitList() {
      this.waiListLoading = true
      getWaitList(this.waitQuery).then(res => {
        this.count = res.data.totalRow
        this.waitList = res.data.list
        this.waitTotal = res.data.totalRow
        this.waitListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待采集列表切换样本类型时修改项目类型下拉数据（清空原来的项目类型）
    waitChangeSampleType(sampleType) {
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
    // 跳转到未预约样本信息登记
    unReserveRegisterCreate() {
      const route = {
        name: 'unReserveCreate',
        query: {
          id: 'unReserveCreate'
        }
      }
      this.$router.push(route)
    },
    // 跳转到已预约样本信息登记
    reserveRegisterCreate(row) {
      const route = {
        name: 'reserveCreate',
        query: {
          id: 'reserveCreate',
          appointmentId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到样本信息登记修改
    update(row) {
      const route = {
        name: 'sampleUpdate',
        query: {
          id: 'sampleUpdate',
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到样本信息登记查看
    sampleView(row) {
      const route = {
        name: 'sampleView',
        query: {
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 采集台账列表按条件查询
    bookSearch() {
      this.bookQuery.pageNumber = 1
      this.getBookList()
    },
    // 清空查询值的时候 重新加载待采集台账列表数据
    bookClear(e) {
      if (e.target.value === '') {
        this.getBookList()
      }
    },
    // 清空查询值的时候 重新加载采集台账列表数据(下拉框)
    bookSelectClear(e) {
      if (e === undefined) {
        this.getBookList()
      }
    },
    // 获取采集台账数据列表
    getBookList() {
      this.bookListLoading = true
      getBookList(this.bookQuery).then(res => {
        this.bookList = res.data.list
        this.bookTotal = res.data.totalRow
        this.bookListLoading = false
      })
    },
    // 采集台账列表切换样本类型时修改项目类型下拉数据（清空原来的项目类型）
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
