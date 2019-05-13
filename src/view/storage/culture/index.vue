<template>
  <Tabs :value="cellCultureListSate" @on-click="changeTab($event)" type="card">
    <TabPane :label="waitCellCulture" name="waitCellCulture">
      <div>
        <Card>
          <!--待培养细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitCollectQuery.sampleType"  @on-change="waitColletchangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitCollectQuery.projectType" placeholder="请选择项目类型" style="width:190px" clearable>
              <Option v-for="item in waitProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitCollectQuery.sampleCode" @on-change="waitCollectClear" placeholder="样本条码" class="search-input" style="width:190px" clearable />
            <Input v-model="waitCollectQuery.originSampleCode" @on-change="waitCollectClear" placeholder="来源样本条码" class="search-input" style="width:190px" clearable />
            <Input v-model="waitCollectQuery.reciver" @on-change="waitCollectClear" placeholder="样本接收人" class="search-input" style="width:190px" clearable   />
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
                @on-change="getPageCellCultureList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane label="细胞培养台账" name="cellCultureBook">
      <div>
        <Card>
          <!--细胞培养台账查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="collectBookQuery.sampleType"  @on-change="collectBookchangeSampleType($event)" placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="collectBookQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="collectBookQuery.sampleCode" @on-change="collectBookClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="collectBookQuery.reciver" @on-change="collectBookClear" placeholder="样本接收人" class="search-input" clearable   />
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
                @on-change="getPageCellCultureDeskList"
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
import { getPageCellCultureList, getPageCellCultureDeskList } from '@/api/cellCulture.js'
import { getSampleTypeList, getProjectTypeBySampleType } from '@/api/projectType.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'culture',
  data() {
    return {
      waitCount: 0,
      // 显示待培养细胞条数
      waitCellCulture: (h) => {
        return h('div', [
          h('span', '细胞待培养'),
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
        originSampleCode: '',
        reciver: ''
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
        { title: '来源样本条码', key: 'originSampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '样本接收人', key: 'reciver', tooltip: true },
        { title: '样本接收时间',
          key: 'reciveTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.reciveTime ? this.$formatDate(params.row.reciveTime, 'yyyy-MM-dd hh:mm') : ''
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
                    value: { rule: 'cultureAdd' }
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
              }, '培养完成')
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
        reciver: ''
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
        { title: '样本接收人', key: 'sampleReciver', tooltip: true },
        { title: '样本接收时间',
          key: 'sampleReciveTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.sampleReciveTime ? this.$formatDate(params.row.sampleReciveTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        // 细胞培养日期
        { title: '培养日期',
          key: 'cultureTime',
          tooltip: true,
          width: 160,
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
                    value: { rule: 'cultureView' }
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
      this.getPageCellCultureList()
      // 获取培养细胞台账数据列表
      this.getPageCellCultureDeskList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待培养细胞数据列表
      this.getPageCellCultureList()
      // 获取培养细胞台账数据列表
      this.getPageCellCultureDeskList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      cellCultureListSate: state => state.storage.cellCultureListSate
    })
  },
  methods: {
    ...mapActions([
      'setCellCultureListSate'
    ]),
    // 切换tab时保存选中的tab状态
    changeTab(e) {
      const cellCultureListSate = e
      this.setCellCultureListSate({ cellCultureListSate })
    },
    // 查询细胞待培养列表
    waitCollectSearch() {
      this.waitCollectQuery.pageNumber = 1
      this.getPageCellCultureList()
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitCollectClear(e) {
      if (!e.target.value) {
        this.getPageCellCultureList()
      }
    },
    // 获取待培养细胞数据列表
    getPageCellCultureList() {
      this.waitCollectListLoading = true
      getPageCellCultureList(this.waitCollectQuery).then(res => {
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
    // 跳转到填写细胞信息页
    reserveCultureAdd(row) {
      const route = {
        name: 'cultureAdd',
        query: {
          id: 'cultureAdd',
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到细胞信息查看页
    reserveCultureView(row) {
      const route = {
        name: 'cultureView',
        query: {
          id: 'cultureView',
          sampleId: row.sampleId
        }
      }
      this.$router.push(route)
    },
    // 培养细胞台账列表按条件查询
    collectBookSearch() {
      this.collectBookQuery.pageNumber = 1
      this.getPageCellCultureDeskList()
    },
    // 清空查询值的时候 重新加载培养细胞台账列表数据
    collectBookClear(e) {
      if (!e.target.value) {
        this.getPageCellCultureDeskList()
      }
    },
    // 获取培养细胞台账数据列表
    getPageCellCultureDeskList() {
      this.collectBookListLoading = true
      getPageCellCultureDeskList(this.collectBookQuery).then(res => {
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
