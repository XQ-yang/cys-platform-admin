<template>
    <Tabs :value="sampleDeskSate" @on-click="changeTab($event)"  type="card">
        <TabPane :label="waitCollect" name="waitCollect">
            <div>
              <Card>
                <!--待采集查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="waitCollectQuery.sampleType"  @on-change="waitCollectChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px"  clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="waitCollectQuery.projectType" @on-change="waitCollectSelectClear" placeholder="请选择项目类型" style="width:190px"   clearable>
                      <Option v-for="item in waitCollectProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="waitCollectQuery.customerName" @on-change="waitCollectClear" placeholder="顾客姓名" class="search-input" style="width:190px"  clearable  />
                  <Input v-model="waitCollectQuery.customerPhone" @on-change="waitCollectClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="waitCollectSearch" class="search-btn">查询</Button>
                  <Button @click="unReserveRegisterCreate" class="ivu-btn ivu-btn-primary search-btn">样品绑定</Button>
                </div>

                <!--待采集列表-->
                <Table :data="waitCollectList" :columns="waitCollectColumns" :loading="waitCollectListLoading" border stripe></Table>

                <!--待采集分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="waitCollectTotal>0"
                      :total="waitCollectTotal"
                      :current.sync="waitCollectQuery.pageNumber"
                      :page-size.sync="waitCollectQuery.pageSize"
                      @on-change="getWaitCollectList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane :label="waitTransport" name="waitTransport">
            <div>
              <Card>
                <!--待运输查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="waitTransportQuery.sampleType"  @on-change="waitTransportChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px"  clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="waitTransportQuery.projectType" @on-change="waitTransportSelectClear" placeholder="请选择项目类型" style="width:190px"   clearable>
                      <Option v-for="item in waitTransportProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="waitTransportQuery.sampleCode" @on-change="waitTransportClear" placeholder="样本条码"class="search-input" style="width:190px" clearable  />
                  <Input v-model="waitTransportQuery.customerName" @on-change="waitTransportClear" placeholder="顾客姓名"class="search-input" style="width:190px" clearable  />
                  <Input v-model="waitTransportQuery.customerPhone" @on-change="waitTransportClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="waitTransportSearch" class="search-btn">查询</Button>
                </div>

                <!--待运输列表-->
                <Table :data="waitTransportList" :columns="waitTransportColumns" :loading="waitTransportListLoading" border stripe></Table>

                <!--待运输分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="waitTransportTotal>0"
                      :total="waitTransportTotal"
                      :current.sync="waitTransportQuery.pageNumber"
                      :page-size.sync="waitTransportQuery.pageSize"
                      @on-change="getWaitTransportList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane :label="waitReceive" name="waitReceive">
            <div>
              <Card>
                <!--待验收查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="receiveQuery.sampleType"  @on-change="waitReceiveChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px"  clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="receiveQuery.projectType" @on-change="receiveSelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
                      <Option v-for="item in receiveProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="receiveQuery.sampleCode" @on-change="receiveClear" placeholder="样本条码"class="search-input" style="width:190px"  clearable  />
                  <Input v-model="receiveQuery.customerName" @on-change="receiveClear" placeholder="顾客姓名"class="search-input" style="width:190px"  clearable  />
                  <Input v-model="receiveQuery.customerPhone" @on-change="receiveClear" placeholder="手机号" class="search-input" style="width:190px"  clearable   />
                  <Button @click="receiveSearch" class="search-btn">查询</Button>
                </div>

                <!--待验收列表-->
                <Table :data="receiveList" :columns="receiveColumns" :loading="receiveListLoading" border stripe></Table>

                <!--待验收分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="receiveTotal>0"
                      :total="receiveTotal"
                      :current.sync="receiveQuery.pageNumber"
                      :page-size.sync="receiveQuery.pageSize"
                      @on-change="getWaitReceiveList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane :label="exceptionInfo" name="exceptionInfo">
            <div>
              <Card>
                <!--异常信息查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="exceptionQuery.sampleType"  @on-change="exceptionChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px"  clearable>
                           <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="exceptionQuery.projectType" @on-change="exceptionSelectClear" placeholder="请选择项目类型" style="width:190px"   clearable>
                          <Option v-for="item in exceptionProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="exceptionQuery.sampleCode" @on-change="exceptionClear" placeholder="样本条码"class="search-input" style="width:190px"  clearable  />
                  <Input v-model="exceptionQuery.customerName" @on-change="exceptionClear" placeholder="顾客姓名"class="search-input" style="width:190px"  clearable  />
                  <Button @click="exceptionSearch" class="search-btn">查询</Button>
                </div>

                <!--异常信息列表-->
                <Table :data="exceptionList" :columns="exceptionColumns" :loading="exceptionListLoading" border stripe></Table>

                <!--异常信息分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="exceptionTotal>0"
                      :total="exceptionTotal"
                      :current.sync="exceptionQuery.pageNumber"
                      :page-size.sync="exceptionQuery.pageSize"
                      @on-change="getExceptionList"
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
import { getWaitList as getWaitCollectList, getExceptionList, closeException } from '@/api/collect.js'
import { getWaitList as getWaitTransportList } from '@/api/transport.js'
import { getWaitList as getWaitReceiveList } from '@/api/receive.js'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'desk',
  data() {
    return {
      // 显示待采集条数
      collectCount: 0,
      waitCollect: (h) => {
        return h('div', [
          h('span', '待采集'),
          h('Badge', {
            props: {
              count: this.collectCount
            }
          })
        ])
      },
      // 显示待运输条数
      transportCount: 0,
      waitTransport: (h) => {
        return h('div', [
          h('span', '待运输'),
          h('Badge', {
            props: {
              count: this.transportCount
            }
          })
        ])
      },
      // 显示待验收条数
      receiveCount: 0,
      waitReceive: (h) => {
        return h('div', [
          h('span', '待验收'),
          h('Badge', {
            props: {
              count: this.receiveCount
            }
          })
        ])
      },
      // 显示异常信息条数
      exceptionCount: 0,
      exceptionInfo: (h) => {
        return h('div', [
          h('span', '异常信息'),
          h('Badge', {
            props: {
              count: this.exceptionCount
            }
          })
        ])
      },
      // 样本类型数据
      sampleTypeList: [],
      // 待采集列表显示及查询
      waitCollectProjectTypeList: [],
      waitCollectQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      waitCollectListLoading: false,
      waitCollectList: [],
      waitCollectTotal: 0,
      waitCollectColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitCollectQuery.pageNumber - 1) * this.waitCollectQuery.pageSize
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
      // 待运输列表显示及查询
      waitTransportProjectTypeList: [],
      waitTransportQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      waitTransportListLoading: false,
      waitTransportList: [],
      waitTransportTotal: 0,
      waitTransportColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitTransportQuery.pageNumber - 1) * this.waitTransportQuery.pageSize
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
                    value: { rule: 'transportHandover' }
                  }
                ],
                on: {
                  click: () => {
                    this.transportHandover(params.row)
                  }
                }
              }, '运输交接')
            ])
          }
        }
      ],
      // 待验收列表显示及查询
      receiveProjectTypeList: [],
      receiveQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      receiveListLoading: false,
      receiveList: [],
      receiveTotal: 0,
      receiveColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.receiveQuery.pageNumber - 1) * this.receiveQuery.pageSize
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
      // 异常信息列表显示及查询
      exceptionProjectTypeList: [],
      exceptionQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: ''
      },
      exceptionListLoading: false,
      exceptionList: [],
      exceptionTotal: 0,
      exceptionColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.exceptionQuery.pageNumber - 1) * this.exceptionQuery.pageSize
          }
        },
        { title: '流程状态',
          key: 'operateType',
          tooltip: true,
          render: (h, params) => {
            const row = params.row
            var text = ''
            if (row.operateType === 1) {
              text = '运输交接'
            } else if (row.operateType === 2) {
              text = '样本验收'
            }
            return h(
              'div',
              text
            )
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '操作人', key: 'operater', tooltip: true },
        { title: '理由', key: 'unqualityReason', tooltip: true },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  title: '您确定要关闭吗'
                },
                on: {
                  'on-ok': () => {
                    this.closeException(params.row)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: { rule: 'closeException' }
                    }
                  ],
                  style: {
                    margin: '3px 2px 2px 3px'
                  }
                }, '关闭')
              ])
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
      this.getWaitCollectList()
      // 获取待运输数据列表
      this.getWaitTransportList()
      // 获取待验收数据列表
      this.getWaitReceiveList()
      // 获取异常信息数据列表
      this.getExceptionList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待采集数据列表
      this.getWaitCollectList()
      // 获取待运输数据列表
      this.getWaitTransportList()
      // 获取待验收数据列表
      this.getWaitReceiveList()
      // 获取异常信息数据列表
      this.getExceptionList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      sampleDeskSate: state => state.sample.sampleDeskSate
    })
  },
  methods: {
    ...mapMutations([
      'setSampleDeskSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的异常列表状态
      this.setSampleDeskSate(e)
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
    waitCollectSearch() {
      this.waitCollectQuery.pageNumber = 1
      this.getWaitCollectList()
    },
    // 清空查询值的时候 重新加载待采集列表数据
    waitCollectClear(e) {
      if (e.target.value === '') {
        this.getWaitCollectList()
      }
    },
    // 清空查询值的时候 重新加载待采集列表数据(下拉框)
    waitCollectSelectClear(e) {
      if (e === undefined) {
        this.getWaitCollectList()
      }
    },
    // 获取待采集数据列表
    getWaitCollectList() {
      this.waiListLoading = true
      getWaitCollectList(this.waitCollectQuery).then(res => {
        this.collectCount = res.data.totalRow
        this.waitCollectList = res.data.list
        this.waitCollectTotal = res.data.totalRow
        this.waitCollectListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待采集列表切换样本类型时修改项目类型下拉数据（清空原来的项目类型）
    waitCollectChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getWaitCollectList()
        this.waitCollectQuery.projectType = ''
        this.waitCollectProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitCollectQuery.projectType = ''
        this.waitCollectProjectTypeList = res.data
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
    // 待运输列表按条件查询
    waitTransportSearch() {
      this.waitTransportQuery.pageNumber = 1
      this.getWaitTransportList()
    },
    // 清空查询值的时候 重新加载待运输列表数据
    waitTransportClear(e) {
      if (e.target.value === '') {
        this.getWaitTransportList()
      }
    },
    // 清空查询值的时候 重新加载待运输列表数据(下拉框)
    waitTransportSelectClear(e) {
      if (e === undefined) {
        this.getWaitTransportList()
      }
    },
    // 获取待运输数据列表
    getWaitTransportList() {
      this.waitTransportListLoading = true
      getWaitTransportList(this.waitTransportQuery).then(res => {
        this.transportCount = res.data.totalRow
        this.waitTransportList = res.data.list
        this.waitTransportTotal = res.data.totalRow
        this.waitTransportListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待运输列表切换样本类型时修改项目类型下拉数据
    waitTransportChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getWaitTransportList()
        this.waitTransportQuery.projectType = ''
        this.waitTransportProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitTransportQuery.projectType = ''
        this.waitTransportProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到样本运输交接
    transportHandover(row) {
      const route = {
        name: 'transportHandover',
        query: {
          id: 'transportHandover',
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 待验收列表按条件查询
    receiveSearch() {
      this.receiveQuery.pageNumber = 1
      this.getWaitReceiveList()
    },
    // 清空查询值的时候 重新加载待验收列表数据
    receiveClear(e) {
      if (e.target.value === '') {
        this.getWaitReceiveList()
      }
    },
    // 清空查询值的时候 重新加载待验收列表数据(下拉框)
    receiveSelectClear(e) {
      if (e === undefined) {
        this.getWaitReceiveList()
      }
    },
    // 获取待验收数据列表
    getWaitReceiveList() {
      this.receiveListLoading = true
      getWaitReceiveList(this.receiveQuery).then(res => {
        this.receiveCount = res.data.totalRow
        this.receiveList = res.data.list
        this.receiveTotal = res.data.totalRow
        this.receiveListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待验收列表切换样本类型时修改项目类型下拉数据
    waitReceiveChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getWaitReceiveList()
        this.receiveQuery.projectType = ''
        this.receiveProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.receiveQuery.projectType = ''
        this.receiveProjectTypeList = res.data
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
    // 异常信息列表按条件查询
    exceptionSearch() {
      this.exceptionQuery.pageNumber = 1
      this.getExceptionList()
    },
    // 清空查询值的时候 重新加载异常列表数据
    exceptionClear(e) {
      if (e.target.value === '') {
        this.getExceptionList()
      }
    },
    // 清空查询值的时候 重新加载异常列表数据(下拉框)
    exceptionSelectClear(e) {
      if (e === undefined) {
        this.getExceptionList()
      }
    },
    // 获取异常数据列表
    getExceptionList() {
      this.exceptionListLoading = true
      getExceptionList(this.exceptionQuery).then(res => {
        this.exceptionCount = res.data.totalRow
        this.exceptionList = res.data.list
        this.exceptionTotal = res.data.totalRow
        this.exceptionListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 异常列表切换样本类型时修改项目类型下拉数据
    exceptionChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getExceptionList()
        this.exceptionQuery.projectType = ''
        this.exceptionProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.exceptionQuery.projectType = ''
        this.exceptionProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 关闭异常
    closeException(row) {
      closeException(row.id, row.operateType).then(res => {
        this.$Message.success('关闭成功')
        this.getExceptionList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    }
  }
}
</script>
