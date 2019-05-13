<template>
<div>
    <Tabs :value="outReviewListSate" @on-click="changeTab($event)" type="card">
        <TabPane :label="outReview" name="outReview" >
            <div>
              <Card>
                <!--出库审核查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outReviewQuery.sampleType"  @on-change="outReviewChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
                      <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outReviewQuery.projectType" @on-change="outReviewSelectClear" placeholder="请选择项目类型" style="width:190px"  clearable>
                      <Option v-for="item in outReviewProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outReviewQuery.sampleCode" @on-change="outReviewClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outReviewQuery.customerName" @on-change="outReviewClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outReviewQuery.customerPhone" @on-change="outReviewClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outReviewSearch" class="search-btn">查询</Button>
                </div>

                <!--出库审核列表-->
                <Table :data="outReviewList" :columns="outReviewColumns" :loading="outReviewListLoading" border stripe></Table>

                <!--出库审核分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outReviewTotal>0"
                      :total="outReviewTotal"
                      :current.sync="outReviewQuery.pageNumber"
                      :page-size.sync="outReviewQuery.pageSize"
                      @on-change="getOutReviewList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
        <TabPane label="出库审核台账" name="outReviewBook">
          <div>
              <Card>
                <!--出库审核台账查询条件及操作按钮-->
                <div class="search-con search-con-top">
                  <Select  v-model="outReviewBookQuery.sampleType"  @on-change="outReviewBookChangeSampleType($event)" placeholder="请选择样本类型" style="width:190px" clearable>
                         <Option v-for="item in sampleTypeList" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
                  </Select>
                  <Select v-model="outReviewBookQuery.projectType" @on-change="outReviewBookSelectClear" placeholder="请选择项目类型" style="width:190px" clearable>
                          <Option v-for="item in outReviewBookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
                  </Select>
                  <Input v-model="outReviewBookQuery.sampleCode" @on-change="outReviewBookClear" placeholder="样本条码" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outReviewBookQuery.customerName" @on-change="outReviewBookClear" placeholder="顾客姓名" class="search-input" style="width:190px" clearable  />
                  <Input v-model="outReviewBookQuery.customerPhone" @on-change="outReviewBookClear" placeholder="手机号" class="search-input" style="width:190px" clearable   />
                  <Button @click="outReviewBookSearch" class="search-btn">查询</Button>
                   <Button  v-permission="{rule:'outPrint'}"  @click="print" class="ivu-btn ivu-btn-primary search-btn">打印</Button>
                </div>

                <!--出库审核台账列表-->
                <Table :data="outReviewBookList" :columns="outReviewBookColumns" :loading="outReviewBookListLoading"  highlight-row @on-current-change="onCurrentChange" border stripe></Table>

                <!--出库审核台账分页-->
                <div style="margin: 10px;overflow: hidden">
                  <div style="float: right;">
                    <Page
                      v-show="outReviewBookTotal>0"
                      :total="outReviewBookTotal"
                      :current.sync="outReviewBookQuery.pageNumber"
                      :page-size.sync="outReviewBookQuery.pageSize"
                      @on-change="getOutReviewBookList"
                      show-total
                      prev-text="上一页"
                      next-text="下一页"></Page>
                  </div>
                </div>
              </Card>
            </div>
        </TabPane>
    </Tabs>
    <!-- 打印预览页面 -->
<div v-show="false" id="printId">
  <div style="width:100%; margin:auto;padding-top:5%;font-size:12px;">
   <div style="margin-bottom:1%;">
          <h3 style="text-align:center;font-size:18px;">细胞出库审核记录</h3>
    </div>
    <table style="border-collapse:collapse; border-spacing: 0px; text-align:center; width:98%;font-size:14px;margin:auto;" >
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">顾客姓名</td>
        <td style="border:1px black solid;width:23%;">{{printObj.customer.name}}</td>
        <td style="border:1px black solid;width:13%;">手机号</td>
        <td style="border:1px black solid;width:20%;">{{printObj.customer.phone}}</td>
        <td style="border:1px black solid;width:13%;">采集医院</td>
        <td style="border:1px black solid;width:20%;">{{printObj.sample.collectHospita}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:3%;">样本条码</td>
        <td style="border:1px black solid;width:23%;">{{printObj.sample.sampleCode}}</td>
        <td style="border:1px black solid;width:13%;">样本类型</td>
        <td style="border:1px black solid;width:20%;">{{printObj.sample.sampleType}}</td>
        <td style="border:1px black solid;width:13%;">项目类型</td>
        <td style="border:1px black solid;width:20%;">{{printObj.sample.projectTypeName}}</td>
      </tr>
       <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">使用人姓名</td>
        <td style="border:1px black solid;width:23%;">{{printObj.outstorage.userName}}</td>
        <td style="border:1px black solid;width:13%;">性别</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.userGender}}</td>
        <td style="border:1px black solid;width:13%;">年龄</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.userAge}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">证件类型</td>
        <td style="border:1px black solid;width:23%;">{{printObj.outstorage.userIdType}}</td>
        <td style="border:1px black solid;width:13%;">证件号</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.userIdNumber}}</td>
        <td style="border:1px black solid;width:13%;">手机号</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.userTelephone}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">出库数量</td>
        <td style="border:1px black solid;width:23%;">{{printObj.outstorage.outQuantity}}</td>
        <td style="border:1px black solid;width:13%;">住院号</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.userAdmissionNumber}}</td>
        <td style="border:1px black solid;width:13%;">转入培养</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.isTransferCulture}}</td>
      </tr>
       <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">运输方式</td>
        <td style="border:1px black solid;width:23%;">{{printObj.outstorage.transportMode}}</td>
        <td style="border:1px black solid;width:13%;">取件人姓名</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.pickerName}}</td>
        <td style="border:1px black solid;width:13%;">手机号</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.pickerPhone}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">客户来源渠道</td>
        <td style="border:1px black solid;width:23%;">{{printObj.outstorage.customerSourceChannelId}}</td>
        <td style="border:1px black solid;width:13%;">出库申请时间</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.outStoreApplyTime}}</td>
        <td style="border:1px black solid;width:13%;">出库申请人</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.outStoreApplyUserName}}</td>
      </tr>
       <tr v-show="outCell" ><td style="border:1px black solid;width:10%;" colspan="6">细胞出库位置</td></tr>
       <tr v-show="outCell"  style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">序号</td>
        <td style="border:1px black solid;width:23%;">存储位置</td>
        <td style="border:1px black solid;width:13%;">细胞编码</td>
        <td style="border:1px black solid;width:20%;">细胞总量</td>
        <td style="border:1px black solid;width:13%;">细胞活率</td>
        <td style="border:1px black solid;width:20%;">培养日期</td>
      </tr>
      <tr v-show="outCell"  v-for="(cellLocation, index) in printObj.cellLocationList" :key="cellLocation.id">
        <td style="border:1px black solid;width:13%;">{{index+1}}</td>
        <td style="border:1px black solid;width:23%;">{{cellLocation.potCode}}罐-{{cellLocation.regionCode}}区-{{cellLocation.towerCode}}塔-{{cellLocation.boxCode}}盒-{{cellLocation.latticeNum}}号管</td>
        <td style="border:1px black solid;width:13%;">{{cellLocation.produceNumber}}</td>
        <td style="border:1px black solid;width:20%;">{{cellLocation.cellTotal}}</td>
        <td style="border:1px black solid;width:13%;">{{cellLocation.cellViability}}</td>
        <td style="border:1px black solid;width:10%;">{{cellLocation.cultureTime}}</td>
      </tr>
      <tr v-show="outSerum"><td style="border:1px black solid;width:10%;" colspan="6">血清出库位置</td></tr>
      <tr v-show="outSerum" style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">序号</td>
        <td style="border:1px black solid;width:23%;">存储位置</td>
        <td style="border:1px black solid;width:13%;">细胞编码</td>
        <td style="border:1px black solid;width:20%;">细胞总量</td>
        <td style="border:1px black solid;width:13%;">细胞活率</td>
        <td style="border:1px black solid;width:20%;">培养日期</td>
      </tr>
      <tr v-show="outSerum" v-for="(serumLocation,index) in printObj.serumLocationList" :key="serumLocation.id">
        <td style="border:1px black solid;width:13%;">{{index+1}}</td>
        <td style="border:1px black solid;width:23%;">{{serumLocation.fridgeCode}}冰箱-{{serumLocation.layerCode}}层-{{serumLocation.rackCode}}架-{{serumLocation.cuvetteNum}}号管</td>
        <td style="border:1px black solid;width:13%;">{{serumLocation.produceNumber}}</td>
        <td style="border:1px black solid;width:20%;">{{serumLocation.cellTotal}}</td>
        <td style="border:1px black solid;width:13%;">{{serumLocation.cellViability}}</td>
        <td style="border:1px black solid;width:10%;">{{serumLocation.cultureTime}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">出库时间</td>
        <td style="border:1px black solid;width:23%;">{{printObj.outstorage.outStoreTime}}</td>
        <td style="border:1px black solid;width:13%;">出库人</td>
        <td style="border:1px black solid;width:20%;">{{printObj.outstorage.outStoreUserName}}</td>
        <td style="border:1px black solid;width:13%;"></td>
        <td style="border:1px black solid;width:20%;"></td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">标识清晰完整</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isLogoClearComplete}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isLogoUnclearUncompleteReason}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">无可见异物</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isInvisibleForeign}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isVisibleForeignReason}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">外观清洁无污染</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isAppearanceCleanNopollution}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isAppearanceUncleanPollutionReason}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">瓶口完好密封</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isBottleWellSealed}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isBottleBadUnsealedReason}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">无细胞沉淀</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isCellNoprecipitation}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isCellPrecipitationReason}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">质检报告齐全</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isQualityComplete}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isQualityUncompleteReason}}</td>
      </tr>
      <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">同意出库</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.isApprove}}</td>
        <td style="border:1px black solid;width:13%;" colspan="4">{{printObj.review.isUnApproveReason}}</td>
      </tr>
       <tr style="height:50px; width:100%;">
        <td style="border:1px black solid;width:13%;">其他</td>
        <td style="border:1px black solid;width:23%;">{{printObj.review.other}}</td>
        <td style="border:1px black solid;width:13%;">审核时间</td>
        <td style="border:1px black solid;width:20%;">{{printObj.review.reviewTime}}</td>
        <td style="border:1px black solid;width:13%;">审核人</td>
        <td style="border:1px black solid;width:20%;">{{printObj.review.reviewerName}}</td>
      </tr>
    </table>
  </div>
</div>
</div>
</template>

<script>
import '@/assets/css/common.less'
import { mapState, mapMutations } from 'vuex'
import { getLodop } from '@/libs/LodopFuncs'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getUserList } from '@/api/user'
import { getAllDistributor } from '@/api/distributor'
import { getOutReviewList, getOutReviewBookList, getOutReviewViewInfo } from '@/api/outReview.js'
export default {
  name: 'outReview',
  filters: {
    transportModeFilter(transportMode) {
      const genderMap = ['', '自提', '异地运输']
      return genderMap[transportMode]
    },
    genderFilter(gender) {
      const genderMap = ['未知', '男', '女']
      return genderMap[gender]
    },
    idTypeFilter(idType) {
      const idTypeMap = ['', '身份证', '香港身份证', '港澳通行证', '台湾通行证', '护照']
      return idTypeMap[idType]
    },
    yesOrNoFilter(yesOrNo) {
      const yesOrNoMap = ['', '是', '否']
      return yesOrNoMap[yesOrNo]
    }
  },
  data() {
    return {
      // 显示待出库审核条数
      outReviewCount: 0,
      outReview: (h) => {
        return h('div', [
          h('span', '出库待审核'),
          h('Badge', {
            props: {
              count: this.outReviewCount
            }
          })
        ])
      },
      sampleTypeList: [],
      // 出库审核列表显示及查询
      outReviewProjectTypeList: [],
      outReviewQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outReviewListLoading: false,
      outReviewList: [],
      outReviewTotal: 0,
      outReviewColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outReviewQuery.pageNumber - 1) * this.outReviewQuery.pageSize
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
                    value: { rule: 'outReviewOfStock' }
                  }
                ],
                on: {
                  click: () => {
                    this.outReviewOfStock(params.row)
                  }
                }
              }, '出库审核')
            ])
          }
        }
      ],
      // 出库审核台账列表显示及查询
      outReviewBookProjectTypeList: [],
      outReviewBookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        sampleCode: '',
        projectType: '',
        customerName: '',
        customerPhone: ''
      },
      outReviewBookListLoading: false,
      outReviewBookList: [],
      outReviewBookTotal: 0,
      outReviewBookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.outReviewBookQuery.pageNumber - 1) * this.outReviewBookQuery.pageSize
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
                    value: { rule: 'outReviewOfStockView' }
                  }
                ],
                on: {
                  click: () => {
                    this.outReviewOfStockView(params.row)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      // 打印加载
      printLoading: false,
      reviewId: '',
      printObj: {
        sample: {},
        customer: {},
        outstorage: {},
        review: {},
        cellLocationList: [],
        serumLocationList: []
      },
      projectTypeList: [],
      userList: [],
      customerSourceChannelList: [],
      outSerum: false,
      outCell: false,
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取出库审核数据列表
      this.getOutReviewList()
      // 获取出库审核台账数据列表
      this.getOutReviewBookList()
      // 系统用户
      this.getUserList()
      // 获取所有渠道
      this.getAllDistributor()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取出库审核数据列表
      this.getOutReviewList()
      // 获取出库审核台账数据列表
      this.getOutReviewBookList()
      // 系统用户
      this.getUserList()
      // 获取所有渠道
      this.getAllDistributor()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      outReviewListSate: state => state.outReview.outReviewListSate
    })
  },
  methods: {
    ...mapMutations([
      'setOutReviewListSate'
    ]),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的出库审核列表状态
      this.setOutReviewListSate(e)
    },
    // 选中打印
    onCurrentChange(currentRow, oldCurrentRow) {
      this.reviewId = currentRow.id
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 系统用户
    getUserList() {
      getUserList().then(res => {
        this.userList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取所有渠道
    getAllDistributor() {
      getAllDistributor().then(res => {
        this.customerSourceChannelList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 出库审核列表按条件查询
    outReviewSearch() {
      this.outReviewQuery.pageNumber = 1
      this.getOutReviewList()
    },
    // 清空查询值的时候 重新加载出库审核列表数据
    outReviewClear(e) {
      if (e.target.value === '') {
        this.getOutReviewList()
      }
    },
    // 清空查询值的时候 重新加载出库审核列表数据(下拉框)
    outReviewSelectClear(e) {
      if (e === undefined) {
        this.getOutReviewList()
      }
    },
    // 获取出库审核数据列表
    getOutReviewList() {
      this.outReviewListLoading = true
      getOutReviewList(this.outReviewQuery).then(res => {
        this.outReviewCount = res.data.totalRow
        this.outReviewList = res.data.list
        this.outReviewTotal = res.data.totalRow
        this.outReviewListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 出库审核列表切换样本类型时修改项目类型下拉数据
    outReviewChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutReviewList()
        this.outReviewQuery.projectType = ''
        this.outReviewProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outReviewQuery.projectType = ''
        this.outReviewProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞出库审核
    outReviewOfStock(row) {
      const route = {
        name: 'outReviewOfStock',
        query: {
          id: 'outReviewOfStock',
          cellOutStoreId: row.id
        }
      }
      this.$router.push(route)
    },
    // 出库审核台账列表按条件查询
    outReviewBookSearch() {
      this.outReviewBookQuery.pageNumber = 1
      this.getOutReviewBookList()
    },
    // 清空查询值的时候 重新加载出库审核台账列表数据
    outReviewBookClear(e) {
      if (e.target.value === '') {
        this.getOutReviewBookList()
      }
    },
    // 清空查询值的时候 重新加载出库审核台账列表数据(下拉框)
    outReviewBookSelectClear(e) {
      if (e === undefined) {
        this.getOutReviewBookList()
      }
    },
    // 获取出库审核台账列表数据
    getOutReviewBookList() {
      this.outReviewBookListLoading = true
      getOutReviewBookList(this.outReviewBookQuery).then(res => {
        this.outReviewBookList = res.data.list
        this.outReviewBookTotal = res.data.totalRow
        this.outReviewBookListLoading = false
      })
    },
    // 出库审核台账列表切换样本类型时修改项目类型下拉数据
    outReviewBookChangeSampleType(sampleType) {
      if (sampleType === undefined) {
        this.getOutReviewBookList()
        this.outReviewBookQuery.projectType = ''
        this.outReviewBookProjectTypeList = ''
        return false
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.outReviewBookQuery.projectType = ''
        this.outReviewBookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到出库审核查看
    outReviewOfStockView(row) {
      const route = {
        name: 'outReviewOfStockView',
        query: {
          id: 'outReviewOfStockView',
          reviewId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到打印页
    print() {
      if (!this.reviewId) {
        this.$Message.error('请先选中一条细胞出库审核信息！')
        return
      }
      this.getPrintView(this.reviewId)
    },
    // 加载细胞出库审核信息
    getPrintView(reviewId) {
      // 加载进度
      this.printLoading = true
      getOutReviewViewInfo(reviewId).then(res => {
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          // 填充项目类型列表数据
          this.projectTypeList = res.data
        }).then(() => {
          this.printObj = res.data

          // 出库细胞
          if (res.data.cellLocationList && res.data.cellLocationList.length > 0) {
            this.outCell = true
          }
          // 出库血清
          if (res.data.serumLocationList && res.data.serumLocationList.length > 0) {
            this.outSerum = true
          }
          // 获取项目类型名称
          let tempPro = this.projectTypeList.filter(project => project.id === this.printObj.sample.projectType).map(project => project.projectTypeName)
          this.printObj.sample.projectTypeName = tempPro && tempPro.length > 0 ? tempPro[0] : ''

          // 获取样本类型名称
          let tempSample = this.sampleTypeList.filter(sample => sample.id === this.printObj.sample.sampleTypeId).map(sample => sample.sampleTypeName)
          this.printObj.sample.sampleType = tempSample && tempSample.length > 0 ? tempSample[0] : ''

          // 使用人性别
          this.printObj.outstorage.userGender = this.$options.filters.genderFilter(this.printObj.outstorage.userGender)

          // 证件类型
          this.printObj.outstorage.userIdType = this.$options.filters.idTypeFilter(this.printObj.outstorage.userIdType)

          // 是否转入培养
          this.printObj.outstorage.isTransferCulture = this.$options.filters.yesOrNoFilter(this.printObj.outstorage.isTransferCulture)

          // 运输方式
          this.printObj.outstorage.transportMode = this.$options.filters.transportModeFilter(this.printObj.outstorage.transportMode)

          // 审核信息
          this.printObj.review.isLogoClearComplete = this.$options.filters.yesOrNoFilter(this.printObj.review.isLogoClearComplete)
          this.printObj.review.isInvisibleForeign = this.$options.filters.yesOrNoFilter(this.printObj.review.isInvisibleForeign)
          this.printObj.review.isAppearanceCleanNopollution = this.$options.filters.yesOrNoFilter(this.printObj.review.isAppearanceCleanNopollution)
          this.printObj.review.isBottleWellSealed = this.$options.filters.yesOrNoFilter(this.printObj.review.isBottleWellSealed)
          this.printObj.review.isCellNoprecipitation = this.$options.filters.yesOrNoFilter(this.printObj.review.isCellNoprecipitation)
          this.printObj.review.isQualityComplete = this.$options.filters.yesOrNoFilter(this.printObj.review.isQualityComplete)
          this.printObj.review.isApprove = this.$options.filters.yesOrNoFilter(this.printObj.review.isApprove)

          // 出库申请人
          let outStoreApplyUser = this.userList.filter(user => user.id === this.printObj.outstorage.outStoreApplyUserId).map(user => user.realName)
          this.printObj.outstorage.outStoreApplyUserName = outStoreApplyUser && outStoreApplyUser.length > 0 ? outStoreApplyUser[0] : ''

          // 出库人
          let outStoreUser = this.userList.filter(user => user.id === this.printObj.outstorage.outStoreUserId).map(user => user.realName)
          this.printObj.outstorage.outStoreUserName = outStoreUser && outStoreUser.length > 0 ? outStoreUser[0] : ''

          // 审核人
          let reviewer = this.userList.filter(user => user.id === this.printObj.review.reviewerId).map(user => user.realName)
          this.printObj.review.reviewerName = reviewer && reviewer.length > 0 ? reviewer[0] : ''

          // 客户来源渠道
          let customerSourceChannel = this.customerSourceChannelList.filter(customerSourceChannel => customerSourceChannel.id === this.printObj.outstorage.customerSourceChannelId).map(customerSourceChannel => customerSourceChannel.name)
          this.printObj.outstorage.customerSourceChannelId = customerSourceChannel && customerSourceChannel.length > 0 ? customerSourceChannel[0] : ''

          // 出库申请时间
          this.printObj.outstorage.outStoreApplyTime = this.$formatDate(this.printObj.outstorage.outStoreApplyTime, 'yyyy-MM-dd hh:mm')

          // 出库时间
          this.printObj.outstorage.outStoreTime = this.$formatDate(this.printObj.outstorage.outStoreTime, 'yyyy-MM-dd hh:mm')

          // 审核时间
          this.printObj.review.reviewTime = this.$formatDate(this.printObj.review.reviewTime, 'yyyy-MM-dd hh:mm')

          this.printView()
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    printView() {
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      this.$nextTick(() => {
        LODOP.ADD_PRINT_HTM('0%', '1%', '100%', '100%',
          document.getElementById('printId').innerHTML)
        LODOP.PREVIEW()
        // 关闭加载进度
        this.printLoading = false
      })
    }
  }
}
</script>
