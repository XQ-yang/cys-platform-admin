<template>
  <div>
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
              <Button v-permission="{rule:'tempStorePrint'}" @click="tempStorePrint" class="ivu-btn ivu-btn-primary search-btn">打印</Button>
            </div>
            <!--待培养细胞列表-->
            <Table highlight-row @on-current-change="onCurrentChange" :data="waitCollectList" :columns="waitCollectColumns" :loading="waitCollectListLoading" border stripe></Table>
            <!--待培养细胞分页-->
            <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page
                  v-show="waitColletTotal>0"
                  :total="waitColletTotal"
                  :current.sync="waitCollectQuery.pageNumber"
                  :page-size.sync="waitCollectQuery.pageSize"
                  @on-change="getPageTempStoreList"
                  show-total
                  prev-text="上一页"
                  next-text="下一页"></Page>
              </div>
            </div>
            <Spin size="large" fix v-if="tempStorePrintLoading"></Spin>
          </Card>
        </div>
      </TabPane>
      <TabPane label="细胞暂存台账" name="cellCultureBook">
        <div>
          <Card>
            <!--细胞培养台账查询条件及操作按钮-->
            <div class="search-con search-con-top">
              <Select  v-model="collectBookQuery.sampleType"  @on-change="collectBookchangeSampleType($event)" placeholder="请选择样本类型" style="width:190px"clearable>
                <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
              </Select>
              <Select v-model="collectBookQuery.projectType" placeholder="请选择项目类型" style="width:190px" clearable>
                <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
              </Select>
              <Input v-model="collectBookQuery.sampleCode" @on-change="collectBookClear" placeholder="样本条码" class="search-input" style="width:190px" clearable />
              <Input v-model="collectBookQuery.receiver" @on-change="collectBookClear" placeholder="细胞接收人" class="search-input" style="width:190px" clearable   />
              <Input v-model="collectBookQuery.storeUserName" @on-change="collectBookClear" placeholder="细胞暂存人" class="search-input" style="width:190px" clearable   />
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
                  @on-change="getPageTempStoreDeskList"
                  show-total
                  prev-text="上一页"
                  next-text="下一页"></Page>
              </div>
            </div>
          </Card>
        </div>
      </TabPane>
    </Tabs>
    <div v-show="false" id="tempStorePrintId">
      <div style="width:100%; margin:auto;padding-top:5%;font-size:12px;">
        <div style="margin-bottom:1%;">
          <h3 style="text-align:center;font-size:18px;">细胞暂存记录</h3>
        </div>
        <div style="margin:auto;width:98%;">
          <div style="float:right;margin-right:2%;">记录编码: REC-JS-01000</div>
          <div style="clear:both;"></div>
          <div style="text-align:left;margin-top:5px;">暂存日期:</div><br/>
        </div>
        <table style="border-collapse:collapse; border-spacing: 0px; text-align:center; width:98%;font-size:14px;margin:auto;" >
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">样本条码</td>
            <td style="border:1px black solid;width:30%;">{{printObj.sample.sampleCode}}</td>
            <td style="border:1px black solid;width:20%;">项目类型</td>
            <td style="border:1px black solid;width:30%;">{{printObj.sample.projectTypeName}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">细胞总量</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.cellTotal}}</td>
            <td style="border:1px black solid;width:20%;">细胞活率</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.cellViability}}%</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">细胞编码</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.produceNumber}}</td>
            <td style="border:1px black solid;width:20%;">规格</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.specification + printObj.cellCulture.specificationUnitName}}</td>
          </tr>
          <tr v-show="printObj.sample.sampleType === 1 || printObj.sample.sampleType === 2" style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">冻存液批号</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.freezeFluid}}</td>
            <td style="border:1px black solid;width:20%;">存储数量</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.cellQuantity}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">接收人</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.receiveUserName}}</td>
            <td style="border:1px black solid;width:20%;">接收时间</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.receiveTime}}</td>
          </tr>
          <tr style="height:60px; width:100%;">
            <td style="border:1px black solid;width:20%;">暂存位置</td>
            <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">存储<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:40px;border-bottom:1px black solid;" />号</td>
          </tr>
          <tr v-show="false" style="height:60px; width:100%;">
            <td style="border:1px black solid;width:20%;">血清暂存位置</td>
            <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">-80℃冰箱<input type="checkbox" />  <input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冰箱第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />层、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />试管架、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号<br/>
            液氮罐<input type="checkbox" />  <input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">备注</td>
            <td style="border:1px black solid;width:30%; text-align: left;" colspan="3"></td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">暂存人</td>
            <td style="border:1px black solid;width:30%;">{{tempStoreUserName}}</td>
            <td style="border:1px black solid;width:20%;">暂存时间</td>
            <td style="border:1px black solid;width:30%;"></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/common.less'
import { getPageTempStoreList, getPageTempStoreDeskList, getTempStoreAddView } from '@/api/cellCulture.js'
import { getSampleTypeList, getProjectTypeBySampleType, getAllProjectType } from '@/api/projectType.js'
import { mapState, mapActions } from 'vuex'
import { num2e } from '@/libs/tools.js'
import { getUserInfo } from '@/api/user'
import { getLodop } from '@/libs/LodopFuncs'
export default {
  name: 'tempStore',
  data() {
    return {
      waitCount: 0,
      // 显示待培养细胞条数
      waitCellCulture: (h) => {
        return h('div', [
          h('span', '细胞待暂存'),
          h('Badge', {
            props: {
              count: this.waitCount
            }
          })
        ])
      },
      // 当前选中的待暂存细胞cellCultureId
      selectCellCultureId: '',
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
                    value: { rule: 'tempStoreAdd' }
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
              }, '暂存')
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
        storeUserName: ''
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
        { title: '存储数量', key: 'cellQuantity', tooltip: true, width: 94 },
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
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.cultureTime ? this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        { title: '暂存日期',
          key: 'storeTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.storeTime ? this.$formatDate(params.row.storeTime, 'yyyy-MM-dd hh:mm') : ''
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
                    value: { rule: 'tempStoreView' }
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
      // 打印单信息实体
      printObj: {
        sample: {},
        cellCulture: {},
        qualityCheck: {}
      },
      // 暂存用户名
      tempStoreUserName: '',
      // 所有的项目类型
      projectTypes: [],
      // 暂存打印加载
      tempStorePrintLoading: false,
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待培养细胞数据列表
      this.getPageTempStoreList()
      // 获取培养细胞台账数据列表
      this.getPageTempStoreDeskList()
      // 获取暂存用户名
      this.getTempStoreUserName()
      // 获取所有的项目类型
      this.getAllProjectType()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待培养细胞数据列表
      this.getPageTempStoreList()
      // 获取培养细胞台账数据列表
      this.getPageTempStoreDeskList()
      // 获取暂存用户名
      this.getTempStoreUserName()
      // 获取所有的项目类型
      this.getAllProjectType()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      cellCultureListSate: state => state.storage.cellTempStoreSate
    })
  },
  methods: {
    ...mapActions([
      'setCellTempStoreSate'
    ]),
    onCurrentChange(currentRow, oldCurrentRow) {
      this.selectCellCultureId = currentRow.id
    },
    // 切换tab时保存选中的tab状态
    changeTab(e) {
      const cellTempStoreSate = e
      this.setCellTempStoreSate({ cellTempStoreSate })
    },
    // 查询细胞待培养列表
    waitCollectSearch() {
      this.waitCollectQuery.pageNumber = 1
      this.getPageTempStoreList()
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitCollectClear(e) {
      if (e.target.value === '') {
        this.getPageTempStoreList()
      }
    },
    // 获取待培养细胞数据列表
    getPageTempStoreList() {
      this.waitCollectListLoading = true
      getPageTempStoreList(this.waitCollectQuery).then(res => {
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
    // 跳转到细胞暂存打印页
    tempStorePrint() {
      if (!this.selectCellCultureId) {
        this.$Message.error('请先选中一条待暂存细胞信息')
        return
      }
      this.getPrintView(this.selectCellCultureId)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getPrintView(cellCultureId) {
      this.tempStorePrintLoading = true
      getTempStoreAddView(cellCultureId).then(res => {
        this.printObj = res.data
        // 获取项目类型名称
        let tempPro = this.projectTypes.filter(project => project.id === this.printObj.sample.projectType).map(project => project.projectTypeName)
        this.printObj.sample.projectTypeName = tempPro && tempPro.length > 0 ? tempPro[0] : ''

        this.printObj.cellCulture.receiveTime = this.$formatDate(this.printObj.cellCulture.receiveTime, 'yyyy-MM-dd hh:mm')
        this.printObj.cellCulture.specificationUnitName = this.printObj.cellCulture.specificationUnit === 1 ? '/1ml/管' : 'ml/袋'
        this.printObj.cellCulture.cellTotal = num2e(this.printObj.cellCulture.cellTotal)
        this.printView()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    printView() {
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      this.$nextTick(() => {
        LODOP.ADD_PRINT_HTM('0%', '1%', '100%', '100%',
          document.getElementById('tempStorePrintId').innerHTML)
        LODOP.PREVIEW()
        this.tempStorePrintLoading = false
      })
    },
    // 获取暂存（当前登录用户）
    getTempStoreUserName() {
      getUserInfo().then(res => {
        this.tempStoreUserName = res.data.realName
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取所有的项目类型
    getAllProjectType() {
      getAllProjectType().then(res => {
        this.projectTypes = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到填写细胞信息页
    reserveCultureAdd(row) {
      const route = {
        name: 'tempStoreAdd',
        query: {
          id: 'tempStoreAdd',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到细胞信息查看页
    reserveCultureView(row) {
      const route = {
        name: 'tempStoreView',
        query: {
          id: 'tempStoreView',
          tempStoreId: row.id
        }
      }
      this.$router.push(route)
    },
    // 培养细胞台账列表按条件查询
    collectBookSearch() {
      this.collectBookQuery.pageNumber = 1
      this.getPageTempStoreDeskList()
    },
    // 清空查询值的时候 重新加载培养细胞台账列表数据
    collectBookClear(e) {
      if (e.target.value === '') {
        this.getPageTempStoreDeskList()
      }
    },
    // 获取培养细胞台账数据列表
    getPageTempStoreDeskList() {
      this.collectBookListLoading = true
      getPageTempStoreDeskList(this.collectBookQuery).then(res => {
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
