<template>
  <Tabs :value="cellCultureListSate" @on-click="changeTab($event)" type="card">
    <TabPane :label="waitCellCulture" name="waitCellCulture">
      <div>
        <Card>
          <!--待培养细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitCollectQuery.sampleType"  @on-change="waitColletchangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitCollectQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitCollectQuery.sampleCode" @on-change="waitCollectClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitCollectQuery.receiver" @on-change="waitCollectClear" placeholder="细胞接收人" class="search-input" clearable   />
            <Button @click="waitCollectSearch" class="search-btn">查询</Button>
          </div>
          <!--待培养细胞列表-->
          <Table :data="waitCollectList" :columns="waitCollectColumns" :loading="waitCollectListLoading" border stripe></Table>
          <!--待培养细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitColletTotal>0"
                :total="waitColletTotal"
                :current.sync="waitCollectQuery.pageNumber"
                :page-size.sync="waitCollectQuery.pageSize"
                @on-change="getPageQualityCheckList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane label="细胞质检台账" name="cellCultureBook">
      <div>
        <Card>
          <!--细胞培养台账查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="collectBookQuery.sampleType"  @on-change="collectBookchangeSampleType($event)" placeholder="请选择样本类型" style="width:190px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="collectBookQuery.projectType" placeholder="请选择项目类型" style="width:190px"  clearable>
              <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="collectBookQuery.sampleCode" @on-change="collectBookClear" placeholder="样本条码" class="search-input"  style="width:190px" clearable />
            <Input v-model="collectBookQuery.receiver" @on-change="collectBookClear" placeholder="细胞接收人" class="search-input" style="width:190px" clearable   />
            <Input v-model="collectBookQuery.qualityCheckUserName" @on-change="collectBookClear" placeholder="细胞质检人" class="search-input" style="width:190px" clearable   />
            <Button @click="collectBookSearch" class="search-btn">查询</Button>
          </div>
          <!--细胞培养台账列表-->
          <Table :data="collectBookList" :columns="collectBookColumns" :loading="collectBookListLoading" border stripe></Table>
          <!--细胞培养台账分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="collectBookTotal>0"
                :total="collectBookTotal"
                :current.sync="collectBookQuery.pageNumber"
                :page-size.sync="collectBookQuery.pageSize"
                @on-change="getPageQualityCheckDeskList"
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
import { getPageQualityCheckList, getPageQualityCheckDeskList } from '@/api/cellCulture.js'
import { getSampleTypeList, getProjectTypeBySampleType } from '@/api/projectType.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'qualityCheck',
  data() {
    return {
      waitCount: 0,
      // 显示待培养细胞条数
      waitCellCulture: (h) => {
        return h('div', [
          h('span', '细胞待质检'),
          h('Badge', {
            props: {
              count: this.waitCount
            }
          })
        ])
      },
      sampleTypes: [],
      // 待培养细胞列表显示及查询
      waitProjectTypeList: [],
      waitCollectQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        receiver: ''
      },
      waitCollectListLoading: false,
      waitCollectList: [],
      waitColletTotal: 0,
      waitCollectColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitCollectQuery.pageNumber - 1) * this.waitCollectQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '存储数量',
          key: 'cellQuantity',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.sampleType === 3 ? params.row.serumQuantity : params.row.cellQuantity
            )
          }
        },
        { title: '细胞接收人', key: 'receiveUserName', tooltip: true },
        { title: '细胞接收时间',
          key: 'receiveTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.receiveTime ? this.$formatDate(params.row.receiveTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        { title: '细胞培养日期',
          key: 'cultureTime',
          width: 160,
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.cultureTime ? this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm') : ''
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
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'qualityCheckAdd' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveCultureAdd(params.row)
                  }
                }
              }, '质检')
            ])
          }
        }
      ],
      // 细胞培养台账列表显示及查询
      bookProjectTypeList: [],
      collectBookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        receiver: '',
        qualityCheckUserName: ''
      },
      collectBookListLoading: false,
      collectBookList: [],
      collectBookTotal: 0,
      collectBookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.collectBookQuery.pageNumber - 1) * this.collectBookQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true, width: 94 },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '存储数量',
          key: 'cellQuantity',
          tooltip: true,
          width: 94,
          render: (h, params) => {
            return h('div',
              params.row.sampleType === 3 ? params.row.serumQuantity : params.row.cellQuantity
            )
          }
        },
        // { title: '细胞接收人', key: 'receiveUserName', tooltip: true },
        // { title: '细胞接收时间',
        //   key: 'receiveTime',
        //   tooltip: true,
        //   width: 160,
        //   render: (h, params) => {
        //     return h('div',
        //       params.row.receiveTime ? this.$formatDate(params.row.receiveTime, 'yyyy-MM-dd hh:mm') : ''
        //     )
        //   }
        // },
        // { title: '细胞培养日期',
        //   key: 'cultureTime',
        //   tooltip: true,
        //   width: 160,
        //   render: (h, params) => {
        //     return h('div',
        //       params.row.cultureTime ? this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm') : ''
        //     )
        //   }
        // },
        { title: '细胞质检人', key: 'qualityCheckUserName', tooltip: true },
        { title: '质检报告日期',
          key: 'qualityCheckTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.qualityCheckTime ? this.$formatDate(params.row.qualityCheckTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        { title: '质检结果',
          key: 'qualityCheckRes',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.qualityCheckRes ? '符合规定' : '不符合规定'
            )
          }
        },
        { title: '质检结果备注', key: 'qualityCheckRemark', tooltip: true },
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
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'qualityCheckView' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveCultureView(params.row)
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
      // 获取待培养细胞数据列表
      this.getPageQualityCheckList()
      // 获取培养细胞台账数据列表
      this.getPageQualityCheckDeskList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待培养细胞数据列表
      this.getPageQualityCheckList()
      // 获取培养细胞台账数据列表
      this.getPageQualityCheckDeskList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      cellCultureListSate: state => state.storage.cellQualityCheckSate
    })
  },
  methods: {
    ...mapActions([
      'setCellQualityCheckSate'
    ]),
    // 切换tab时保存选中的tab状态
    changeTab(e) {
      const cellQualityCheckSate = e
      this.setCellQualityCheckSate({ cellQualityCheckSate })
    },
    // 查询细胞待培养列表
    waitCollectSearch() {
      this.waitCollectQuery.pageNumber = 1
      this.getPageQualityCheckList()
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitCollectClear(e) {
      if (e.target.value === '') {
        this.getPageQualityCheckList()
      }
    },
    // 获取待培养细胞数据列表
    getPageQualityCheckList() {
      this.waitCollectListLoading = true
      getPageQualityCheckList(this.waitCollectQuery).then(res => {
        // 待培养细胞的样本总条数
        this.waitCount = res.data.totalRow
        this.waitCollectList = res.data.list
        this.waitColletTotal = res.data.totalRow
        this.waitCollectListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待培养细胞列表切换样本类型时修改项目类型下拉数据
    waitColletchangeSampleType(sampleType) {
      this.waitProjectTypeList = []
      this.waitCollectQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypes = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到填写质检信息页
    reserveCultureAdd(row) {
      const route = {
        name: 'qualityCheckAdd',
        query: {
          id: 'qualityCheckAdd',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到质检信息查看页
    reserveCultureView(row) {
      const route = {
        name: 'qualityCheckView',
        query: {
          id: 'qualityCheckView',
          qualityCheckId: row.id
        }
      }
      this.$router.push(route)
    },
    // 培养细胞台账列表按条件查询
    collectBookSearch() {
      this.collectBookQuery.pageNumber = 1
      this.getPageQualityCheckDeskList()
    },
    // 清空查询值的时候 重新加载培养细胞台账列表数据
    collectBookClear(e) {
      if (e.target.value === '') {
        this.getPageQualityCheckDeskList()
      }
    },
    // 获取培养细胞台账数据列表
    getPageQualityCheckDeskList() {
      this.collectBookListLoading = true
      getPageQualityCheckDeskList(this.collectBookQuery).then(res => {
        this.collectBookList = res.data.list
        this.collectBookTotal = res.data.totalRow
        this.collectBookListLoading = false
      })
    },
    // 培养细胞台账列表切换样本类型时修改项目类型下拉数据
    collectBookchangeSampleType(sampleType) {
      this.bookProjectTypeList = []
      this.collectBookQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.bookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    }
  }
}
</script>
