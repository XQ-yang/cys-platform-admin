<template>
  <div class="cellTraceability">
    <Row :gutter="16" style=" display:table; width:100%;">
      <Col span="13" style=" display:table-cell;">
        <!-- left -->
        <Card title="客户基本信息">
          <table  class="form-table" cellspacing="0">
                <tr>
                  <td class="td-left border-top-none border-left-none"  style="width:20%;">姓名</td>
                  <td style="width:30%;" class="border-top-none">{{sampleTemp.customerName}}</td>
                  <td class="td-left border-top-none" style="width:20%;">姓别</td>
                  <td class="border-top-none border-right-none">{{this.gender}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none" >年龄</td>
                  <td>{{sampleTemp.age === 0 ? '' : sampleTemp.age}}</td>
                  <td class="td-left" >婚否</td>
                  <td class="border-right-none">{{this.marriage}}</td>
                </tr>
               <tr>
                  <td class="td-left border-left-none" >民族</td>
                  <td>{{sampleTemp.customerEthnic}}</td>
                  <td class="td-left" >血型</td>
                  <td class="border-right-none">{{sampleTemp.customerBloodType}}</td>
                </tr>
                <tr>
                  <td class="td-left border-left-none" >职业</td>
                  <td>{{sampleTemp.customerProfession}}</td>
                  <td class="td-left" >手机号</td>
                  <td class="border-right-none">{{sampleTemp.customerPhone}}</td>
                </tr>
                  <tr>
                  <td class="td-left border-left-none" >证件类型</td>
                  <td>{{idType}}</td>
                  <td class="td-left" >证件号</td>
                  <td class="border-right-none">{{sampleTemp.customerIdNumber}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none" >地址</td>
                  <td class="border-right-none" colspan="3">{{sampleTemp.customerContactAddress}}</td>
                </tr>
              </table>
        </Card>
        <Card title="样本信息">
            <table  class="form-table" cellspacing="0">
                <tr>
                  <td class="td-left border-top-none border-left-none"  style="width:20%;">样本条码</td>
                  <td style="width:30%;" class="border-top-none">{{sampleTemp.sampleCode}}</td>
                  <td class="td-left border-top-none" style="width:20%;">样本类型</td>
                  <td class="border-top-none border-right-none">{{sampleTypeText}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none" >项目类型</td>
                  <td>{{this.projectTypeText}}</td>
                  <td class="td-left" >数量</td>
                  <td class="border-right-none">{{sampleTemp.collectQuantity}} 管</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none" >来源样本条码</td>
                  <td class="border-right-none" colspan="3">{{sampleTemp.originSampleCode}}</td>
                </tr>
              </table>

        </Card>

        <Card title="存储信息" style="width:100%; overflow:hidden;" class="storedInformation">
          <!--细胞位置信息及细胞信息-->
          <Table
            style="width:100%; overflow:hidden;display:table"
            ref="selection"
            :data="mergeLocation2(locationList)"
            :columns="cellLocationColumns"
            :loading="cellLocationListLoading"
            border
            stripe
             v-if="locationList.length>0"
          ></Table>
          <Table
            style="width:100%; overflow:hidden;display:table"
            ref="selection"
            :data="mergeSerumLocation2(serumLocationList)"
            :columns="serumLocationColumns"
            :loading="serumLocationListLoading"
            border
            stripe
            v-if="serumLocationList.length>0"
          ></Table>
        </Card>
      </Col>
      <Col span="11" style=" display:table-cell; height:100%;">
        <!-- right -->
        <Card style=" background:#fff;  height:100%;">
          <Tabs :value="retrospectSate" @on-click="changeTab($event)" class="card-tab">
            <TabPane label="采集运输接收" name="one">
              <table  class="form-table" cellspacing="0">
                <tr>
                  <td class="td-left border-top-none border-left-none"  style="width:20%;">采集医院</td>
                  <td style="width:30%;" class="border-top-none">{{sampleTemp.collectHospita}}</td>
                  <td class="td-left border-top-none" style="width:20%;">采集地点</td>
                  <td class="border-top-none border-right-none">{{sampleTemp.collectSite}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">采集时间</td>
                  <td>{{sampleTemp.collectTime}}</td>
                  <td class="td-left">采集人</td>
                  <td  class="border-right-none">{{sampleTemp.collector}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">起运时间</td>
                  <td>{{transportEntity.startTime}}</td>
                  <td class="td-left">起运时温度</td>
                  <td  class="border-right-none">{{transportEntity.startTemperature}}  ℃</td>
                </tr>
                  <td class="td-left border-left-none">运输人</td>
                  <td colspan="3" class="border-right-none">{{transportEntity.transporter}}</td>
                </tr>
                  <tr>
                   <td class="td-left border-left-none">冷藏</td>
                  <td>{{receiveTemp.isColdStorage===1?'是':receiveTemp.isColdStorage===2?'否':''}}</td>
                  <td class="td-left">冷藏箱</td>
                  <td class="border-right-none">{{receiveTemp.cooler}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">冷链运输</td>
                  <td  class="border-right-none">{{receiveTemp.isColdTransporte===1?'是':receiveTemp.isColdTransporte===2?'否':''}}</td>
                   <td class="td-left">温度记录仪</td>
                  <td  class="border-right-none">{{receiveTemp.temperatureRecorder}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">接收时间</td>
                  <td>{{receiveTemp.reciveTime}}</td>
                  <td class="td-left">接收时温度</td>
                  <td  class="border-right-none">{{receiveTemp.reciveTemperature}}  ℃</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">接收人</td>
                  <td colspan="3"  class="border-right-none">{{receiveTemp.reciver}}</td>
                </tr>
              </table>
            </TabPane>
            <TabPane label="培养信息" name="two">
              <div class="card-table">
                <div v-if="cellCultureList.length==0" class="no-data">
                  暂无数据
                </div>
                <Card
                  v-for="(item, index ) in cellCultureList"
                  :key="index"
                >
                <table  class="form-table" cellspacing="0">
                  <tr><td colspan="4" class="title" >{{batch +item.produceNumber}}</td></tr>
                <tr>
                  <td class="td-left border-top-none border-left-none"  style="width:20%;">细胞总量</td>
                  <td style="width:30%;" class="border-top-none">{{item.cellTotal}}</td>
                  <td class="td-left border-top-none" style="width:20%;">培养日期</td>
                  <td class="border-top-none border-right-none">{{item.cultureTime}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">细胞活率</td>
                  <td>{{item.cellViability}}%</td>
                  <td class="td-left border-left-none">存储数量</td>
                  <td>{{getCellQuantity(item)}} 管</td>
                </tr>
                 <tr>
                  <td class="td-left">规格</td>
                  <td  class="border-right-none">{{item.specification}} <span>{{specificationUnitText(item.specificationUnit)}}</span></td>
                  <td class="td-left border-left-none">接收人</td>
                  <td  class="border-right-none">{{item.receiveUserName}}</td>
                </tr>
                  <tr>
                  <td class="td-left border-left-none">接收时间</td>
                  <td colspan="3" class="border-right-none">{{item.receiveTime}}</td>
                </tr>
                <tr>
                  <td class="border-right-none"  colspan="4">
                    <!-- <Tag
                        v-for="m in item.applyDetails"
                        :key="m.id"
                        type="dot"
                        color="success"
                      >
                      {{ ' 物料编号：'+m.materialNo+'， 物料名称：'+ m.materialName +'， 批号：'+ m.batchNumber +'， 数量：'+ m.applyQuantity }}</Tag> -->
                      <Table :data="item.applyDetails" :columns="productTableColumns"  stripe border highlight-row v-if="item.applyDetails.length>0" >
                      </Table>
                      </td>
                </tr>
                </tr>
              </table>

                </Card>
                </div>
            </TabPane>
            <TabPane label="质检信息" name="three">
            <div class="card-table">
                <div v-if="!isCheck" class="no-data">
                  暂无数据
                </div>
                <Card
                  v-if="isCheck"
                  v-for="(item, index) in cellCheckList"
                  :key="index"
                >
                 <table  class="form-table" cellspacing="0">
                   <tr><td colspan="4" class="title" >{{batch +item.produceNumber}}</td></tr>
                <tr>
                  <td class="td-left border-top-none border-left-none"  style="width:20%;">细胞总量</td>
                  <td style="width:30%;" class="border-top-none">{{item.cellTotal}}</td>
                  <td class="td-left border-top-none" style="width:20%;">培养日期</td>
                  <td class="border-top-none border-right-none">{{item.cultureTime}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">细胞活率</td>
                  <td>{{item.cellViability}}%</td>
                  <td class="td-left">规格</td>
                  <td  class="border-right-none">{{item.specification}} <span>{{specificationUnitText(item.specificationUnit)}}</span></td>
                </tr>
                 <tr>
                  <td class="td-left">存储数量</td>
                  <td  class="border-right-none">{{getCellQuantity(item)}} 管</td>
                  <td class="td-left border-left-none">接收人</td>
                  <td>{{item.receiveUserName}}</td>
                </tr>
                <tr>
                  <td class="td-left">接收时间</td>
                  <td  class="border-right-none">{{item.receiveTime}}</td>
                  <td class="td-left border-left-none">冻存是否完成</td>
                  <td>{{item.isCryopreservation}}</td>
                </tr>
                 <tr>
                  <td class="td-left">是否阳性样本</td>
                  <td  class="border-right-none">{{item.isPositiveSample}}</td>
                  <td class="td-left border-left-none">质量检测结果</td>
                  <td>{{item.qualityCheckRes}}</td>
                </tr>
                 <tr>
                  <td class="td-left">质检结果备注</td>
                  <td colspan="3" class="border-right-none">{{item.qualityCheckRemark}}</td>
                </tr>
                  <tr>
                  <td class="td-left border-left-none">报告编号</td>
                  <td>{{item.reportNumber}}</td>
                  <td class="td-left">质检报告</td>
                  <td  class="border-right-none">
                    <div v-for="m in item.reportFils" :key="m.id">
                        <a target="_blank" :href="m.mediaPath">{{m.originalMediaName}}</a>
                      </div>
                  </td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">质检人</td>
                  <td>{{item.qualityCheckUserName}}</td>
                  <td class="td-left">质检报告时间</td>
                  <td  class="border-right-none">{{item.qualityCheckTime}}</td>
                </tr>
              </table>
                </Card>
            </div>
            </TabPane>
            <TabPane label="入库信息" name="four">
              <div class="card-table">
                <div v-if="!isStore" class="no-data">
                  暂无数据
                </div>
                <Card
                  v-if="isStore"
                  v-for="(item, index ) in cellStoreList"
                  :key="index"
                >
               <table  class="form-table" cellspacing="0">
                 <tr><td colspan="4" class="title" >{{batch +item.produceNumber}}</td></tr>
                <tr>
                  <td class="td-left border-top-none border-left-none"  style="width:20%;">细胞总量</td>
                  <td style="width:30%;" class="border-top-none">{{item.cellTotal}}</td>
                  <td class="td-left border-top-none" style="width:20%;">培养日期</td>
                  <td class="border-top-none border-right-none">{{item.cultureTime}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">细胞活率</td>
                  <td>{{item.cellViability}}%</td>
                  <td class="td-left">规格</td>
                  <td  class="border-right-none">{{item.specification}}  <span>{{specificationUnitText(item.specificationUnit)}}</span></td>
                </tr>
                 <tr>
                  <td class="td-left">存储数量</td>
                  <td  class="border-right-none">{{getCellQuantity(item)}} 管</td>
                  <td class="td-left border-left-none">接收人</td>
                  <td>{{item.receiveUserName}}</td>
                </tr>
                <tr>
                  <td class="td-left">接收时间</td>
                  <td  class="border-right-none">{{item.receiveTime}}</td>
                  <td class="td-left border-left-none">存储时间</td>
                  <td>{{item.storeTime}}</td>
                </tr>
                <tr>
                  <td class="td-left">存储年限</td>
                  <td colspan="3" class="border-right-none">{{item.storeYear}}</td>
                </tr>
                <tr>
                  <td class="td-left border-left-none">存储位置</td>
                  <td class="border-right-none"  colspan="3">  <Tag
                        v-for="m in item.locationList_1"
                        :key="m.id"
                        type="dot"
                        color="success"
                      >{{m.potCode +' 罐-'+ m.regionCode +' 区 - '+ m.towerCode +' 塔 - '+ m.boxCode +' 盒 - 第 ' + m.latticeNum +' 号管'}}</Tag></td>
                </tr>
                   <tr>
                  <td class="td-left border-left-none">血清存储位置</td>
                  <td class="border-right-none"  colspan="3">
                     <Tag
                        v-for="m in item.locationList_2"
                        :key="m.id"
                        type="dot"
                        color="success"
                      >{{m.potCode +' 罐 - '+ m.regionCode +' 区 - '+ m.towerCode +' 塔 - '+ m.boxCode +' 盒 - 第 '+ m.latticeNum +' 号管'}}</Tag>
                      <Tag
                        v-for="m in item.serumLocationList"
                        :key="m.id"
                        type="dot"
                        color="success"
                      >{{m.fridgeCode +' 冰箱 - '+ m.layerCode +' 层 - '+ m.rackCode +' 试管架 - 第 '+ m.cuvetteNum +' 号管'}}</Tag></td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">检测样品存储位置</td>
                  <td class="border-right-none"  colspan="3">
                     <Tag
                        v-for="m in item.locationList_3"
                        :key="m.id"
                        type="dot"
                        color="success"
                      >{{m.potCode +' 罐 - '+ m.regionCode +' 区 - '+ m.towerCode +' 塔 - '+ m.boxCode +' 盒 - 第 '+ m.latticeNum +' 号管'}}</Tag></td>
                </tr>
                <tr>
                  <td class="td-left border-left-none">入库放行记录</td>
                  <td class="border-right-none"  colspan="3">
                     <div v-for="m in item.recordFils" :key="m.id" class="file-box">
                        <a target="_blank" :href="m.mediaPath">{{m.originalMediaName}}</a>
                      </div></td>
                </tr>
                <tr>
                  <td class="td-left border-left-none">其他报告附件</td>
                  <td class="border-right-none"  colspan="3">
                      <div v-for="m in item.otherFils" :key="m.id" class="file-box">
                        <a target="_blank" :href="m.mediaPath">{{m.originalMediaName}}</a>
                      </div></td>
                </tr>
                <tr>
                  <td class="td-left border-left-none">存储凭证</td>
                  <td class="border-right-none"  colspan="3">
                       <div v-for="m in item.cardFils" :key="m.id" class="file-box">
                        <a target="_blank" :href="m.mediaPath">{{m.originalMediaName}}</a>
                      </div></td>
                </tr>
              </table>
                </Card>
              </div>
            </TabPane>
            <TabPane label="出库信息" name="five">
              <div class="card-table">
                <div v-if="!isOutstorage" class="no-data">
                  暂无数据
                </div>
                <Card
                  v-if="isOutstorage"
                  v-for="(item, index) in outStorageList"
                  :key="index"
                >
                <table  class="form-table" cellspacing="0">
                <tr><td colspan="4" class="title" ><span v-html="item.title"></span></td></tr>
                <tr>
                  <td style="width:20%;" class="td-left border-left-none">使用人手机</td>
                  <td style="width:30%;">{{item.userTelephone}}</td>
                  <td  style="width:20%;" class="td-left">出库数量</td>
                  <td  class="border-right-none">{{item.outQuantity}}</td>
                </tr>
                <tr>
                  <td class="td-left border-top-none border-left-none">出库位置</td><!-- serumOutList -->
                  <td class="border-top-none" colspan="3"><Tag
                        v-for="(m, index) in item.outLocationList"
                        :key="index"
                        track-by="$index"
                        type="dot"
                        color="success"
                      >{{m.potCode +' 罐-'+ m.regionCode +' 区-'+ m.towerCode +' 塔-'+ m.boxCode +' 盒-'+ m.latticeNum +' 号管'}}</Tag>
                      <Tag
                        v-for="(m, index) in item.serumOutList"
                        :key="index"
                        track-by="$index"
                        type="dot"
                        color="success"
                      >{{m.fridgeCode +' 冰箱-'+ m.layerCode +' 层-'+ m.rackCode +' 架-'+ m.cuvetteNum +' 试管'}}</Tag>
                      </td>
                </tr>
                 <!-- <tr>
                  <td style="width:20%;" class="td-left border-left-none">使用人姓名</td>
                  <td style="width:30%;">{{item.userName}}</td>
                  <td  style="width:20%;" class="td-left">性别</td>
                  <td  class="border-right-none">{{gender2(item.userGender)}}</td>
                </tr> -->
                 <tr>
                  <td style="width:20%;" class="td-left border-left-none">审核时间</td>
                  <td style="width:30%;">{{item.reviewTime}}</td>
                  <td  style="width:20%;" class="td-left">审核人</td>
                  <td  class="border-right-none">{{item.reviewer}}</td>
                </tr>
                 <tr>
                  <td class="td-left border-left-none">签字文件</td>
                  <td  colspan="3">  <div v-for="m in item.signatureFiles" :key="m.id">
                        <a target="_blank" :href="m.mediaPath">{{m.originalMediaName}}</a>
                      </div></td>
                </tr>
                  <tr>
                  <td class="td-left border-left-none">上传时间</td>
                  <td class="border-right-none">{{item.uploaderTime}}</td>
                  <td class="td-left border-left-none">上传人</td>
                  <td class="border-right-none">{{item.uploader}}</td>

                </tr>

              </table>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>

    <div class="form-btn">
      <Button
        class="ivu-btn ivu-btn-primary ivu-btn-large"
        style="margin-left:20px"
        @click="close"
      >关闭</Button>
    </div>
  </div>
</template>

<script>
import '@/assets/css/common.less'
import './index.less'
import { getUserList as getCarrierList } from '@/api/user'
import {
  getProjectTypeBySampleType,
  getSampleTypeList
} from '@/api/projectType.js'
import { getSampleViewBySampleId } from '@/api/retrospect.js'
import { num2e } from '@/libs/tools.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'retrospectView',
  data() {
    return {
      registerFormLoading: true,
      sampleId: '',
      sampleTypeList: [],
      projectTypeList: [],
      carrierList: [],
      cellLocationList: [], // 细胞存储数据
      locationList: [], // 细胞存储数据去除暂存、已经出库的数据
      serumLocationList: [], // 冰箱血清存储数据
      cellCultureList: [], // 培养列表数据
      cellCheckList: [], // 质检列表数据
      cellStoreList: [], // 入库列表数据
      outStorageList: [],
      batch: '细胞编码 ',
      isCheck: false, // 是否有质检信息
      isStore: false, // 是否有入库信息
      isOutstorage: false, // 是否有出库信息
      // 样本信息表单
      sampleTemp: {
        // 供者资料
        customerId: '',
        customerName: '',
        customerBirthday: '',
        customerIdType: '',
        customerIdNumber: '',
        customerPhone: '',
        customerGender: '',
        customerContactAddress: '',
        customerMaritalStatus: '',
        customerEthnic: '',
        customerBloodType: '',
        customerProfession: '',
        customer: {
          id: '',
          name: '',
          phone: '',
          birthday: '',
          idType: '',
          idNumber: '',
          gender: '',
          maritalStatus: '',
          ethnic: '',
          bloodType: '',
          profession: '',
          contactAddress: ''
        },
        // 样本基础信息
        id: undefined,
        sampleCode: '',
        sampleType: '',
        projectType: '',
        originSampleId: '',
        originSampleCode: '',
        age: '',
        // 采集信息
        healthSurvey: '',
        informateConsent: '',
        storageTechnologyContract: '',
        collectHospita: '',
        collectTime: '',
        collectSite: '',
        collectorId: '',
        collector: '',
        collectQuantity: '',
        collectQuantityUnit: '',
        carrierId: '',
        carrier: ''
      },
      // 运输信息
      transportEntity: {
        id: undefined,
        sampleId: '',
        sampleCode: '',
        isPackageGood: '',
        isPackagePoorReason: '',
        isSampleCodeConsistent: '',
        isSampleCodeInconsistentReason: '',
        isColdStorage: '',
        isHotStorageReason: '',
        isColdTransporte: '',
        isHotTransporteReason: '',
        cooler: '',
        temperatureRecorder: '',
        startTemperature: '',
        startTime: '',
        transporter: '',
        transporterId: '',
        receiveOpinion: '',
        unqualityReason: ''
      },
      receiveTemp: {
        sampleId: '',
        sampleCode: '',
        sampleOrigin: '',
        isPackageGood: '',
        isPackagePoorReason: '',
        isSampleCodeConsistent: '',
        isSampleCodeInconsistentReason: '',
        isColdStorage: '',
        isHotStorageReason: '',
        isColdTransporte: '',
        isHotTransporteReason: '',
        cooler: '',
        temperatureRecorder: '',
        reciveTemperature: '',
        reciveTime: '',
        reciver: '',
        reciverId: '',
        remark: '',
        receiveOpinion: '',
        unqualityReason: '',
        transporter: ''
      },
      // 细胞信息及位置信息
      cellLocationListLoading: false,
      cellLocationColumns: [
        { title: '细胞编码', key: 'produceNumber', tooltip: true, width: 180 },
        {
          title: '细胞存储位置',
          key: 'potCode',

          tooltip: true,
          render: (h, params) => {
            var location =
              params.row.potCode +
              ' 罐-' +
              params.row.regionCode +
              ' 区-' +
              params.row.towerCode +
              ' 塔-' +
              params.row.boxCode +
              ' 盒-' +
              params.row.latticeNum +
              ' 号管'
            return h('div', location)
          }
        },
        {
          title: '细胞总量',
          key: 'cellTotal',
          tooltip: true,
          width: 126,
          render: (h, params) => {
            return h('div', num2e(params.row.cellTotal))
          }
        },
        {
          title: '细胞活率',
          key: 'cellViability',
          tooltip: true,
          width: 116,
          render: (h, params) => {
            return h('div', params.row.cellViability + '%')
          }
        },
        {
          title: '培养日期',
          key: 'cultureTime',
          width: 160,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      // 血清信息及位置信息
      serumLocationListLoading: false,
      serumLocationColumns: [
        { title: '细胞编码', key: 'produceNumber', tooltip: true, width: 180 },
        {
          title: '血清存储位置',
          key: 'fridge_code',

          tooltip: true,
          render: (h, params) => {
            var location =
              params.row.fridgeCode +
              ' 冰箱-' +
              params.row.layerCode +
              ' 层-' +
              params.row.rackCode +
              ' 架-' +
              params.row.cuvetteNum +
              ' 号试管'
            return h('div', location)
          }
        },
        {
          title: '细胞总量',
          key: 'cellTotal',
          tooltip: true,
          width: 126,
          render: (h, params) => {
            return h('div', num2e(params.row.cellTotal))
          }
        },
        {
          title: '细胞活率',
          key: 'cellViability',
          tooltip: true,
          width: 116,
          render: (h, params) => {
            return h('div', params.row.cellViability + '%')
          }
        },
        {
          title: '培养日期',
          key: 'cultureTime',
          width: 160,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      productTableColumns: [
        { title: '物料编号', key: 'materialNo' },
        { title: '物料名称', key: 'materialName' },
        { title: '批号', key: 'batchNumber' },
        { title: '数量', key: 'applyQuantity' },
        { title: '单位', key: 'quality' }
      ]
    }
  },
  mounted() {
    // 获取样本类型列表
    this.getSampleTypeList()
    // 获取用户信息
    this.getCarrierList()
    this.getSampleViewById()
    this.setRetrospectSate('one')
  },
  computed: {
    ...mapState({
      retrospectSate: state => state.retrospect.retrospectSate
    }),

    gender: function() {
      const genders = ['未知', '男', '女']
      let g = ''
      let n = this.sampleTemp.customerGender
      if (n !== '') {
        g = genders[n]
      }
      return g
    },
    gender2() {
      return function(g) {
        const genders = ['未知', '男', '女']
        if (g) {
          return genders[g]
        } else {
          return ''
        }
      }
    },
    marriage: function() {
      const marry = ['未知', '已婚', '未婚', '离异']
      let m = ''
      let n = this.sampleTemp.customerMaritalStatus
      if (n !== '') {
        m = marry[n]
      }
      return m
    },
    idType: function() {
      const idTypes = [
        '',
        '身份证',
        '香港身份证',
        '港澳通行证',
        '台湾通行证',
        '护照'
      ]
      let m = ''
      let n = this.sampleTemp.customerIdType
      if (n !== '') {
        m = idTypes[n]
      }
      return m
    },
    sampleTypeText: function() {
      let txt = ''

      for (let index = 0; index < this.sampleTypeList.length; index++) {
        const item = this.sampleTypeList[index]
        if (item.sampleTypeId === this.sampleTemp.sampleType) {
          txt = item.sampleTypeName
        }
      }
      return txt
    },
    projectTypeText: function() {
      let txt = ''
      for (let index = 0; index < this.projectTypeList.length; index++) {
        const item = this.projectTypeList[index]
        if (item.id === this.sampleTemp.projectType) {
          txt = item.projectTypeName
        }
      }
      return txt
    },
    specificationUnitText() {
      return function(unit) {
        const units = ['/1ml/管', 'ml/袋']
        return units[unit - 1]
      }
    }
  },
  methods: {
    ...mapMutations(['closeTag', 'setRetrospectSate']),
    // 切换tab标签
    changeTab(e) {
      // 保存选中的采集列表状态
      this.setRetrospectSate(e)
    },
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList()
        .then(res => {
          this.sampleTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 填充项目类型下拉框
    fillProjectType(sampleType) {
      getProjectTypeBySampleType(sampleType)
        .then(res => {
          this.projectTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 获取承运人
    getCarrierList() {
      getCarrierList()
        .then(res => {
          this.carrierList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 顾客对象赋值给临时对象
    fillCustomerTemp(customer) {
      this.sampleTemp.customerName = customer.name
      this.sampleTemp.age = this.getAge(customer.birthday)
      this.sampleTemp.customerIdType = customer.idType
      this.sampleTemp.customerIdNumber = customer.idNumber
      this.sampleTemp.customerPhone = customer.phone
      this.sampleTemp.customerGender = customer.gender
      this.sampleTemp.customerContactAddress = customer.contactAddress
      this.sampleTemp.customerMaritalStatus = customer.maritalStatus
      this.sampleTemp.customerEthnic = customer.ethnic
      this.sampleTemp.customerBloodType = customer.bloodType
      this.sampleTemp.customerProfession = customer.profession
    },
    rsetTransportEntity() {
      this.transportEntity = {
        id: undefined,
        sampleId: '',
        sampleCode: '',
        isPackageGood: '',
        isPackagePoorReason: '',
        isSampleCodeConsistent: '',
        isSampleCodeInconsistentReason: '',
        isColdStorage: '',
        isHotStorageReason: '',
        isColdTransporte: '',
        isHotTransporteReason: '',
        cooler: '',
        temperatureRecorder: '',
        startTemperature: '',
        startTime: '',
        transporter: '',
        transporterId: '',
        receiveOpinion: '',
        unqualityReason: ''
      }
    },
    getCellQuantity(item) {
      if (item) {
        return (item.cellQuantity ? item.cellQuantity : 0) + (item.serumQuantity ? item.serumQuantity : 0)
      } else {
        return ''
      }
    },
    restReceiveTemp() {
      this.receiveTemp = {
        sampleId: '',
        sampleCode: '',
        sampleOrigin: '',
        isPackageGood: '',
        isPackagePoorReason: '',
        isSampleCodeConsistent: '',
        isSampleCodeInconsistentReason: '',
        isColdStorage: '',
        isHotStorageReason: '',
        isColdTransporte: '',
        isHotTransporteReason: '',
        cooler: '',
        temperatureRecorder: '',
        reciveTemperature: '',
        reciveTime: '',
        reciver: '',
        reciverId: '',
        remark: '',
        receiveOpinion: '',
        unqualityReason: '',
        transporter: ''
      }
    },
    // 关闭页面
    close() {
      this.closeTag({
        name: 'retrospectView',
        query: {
          sampleId: this.$route.query.sampleId
        }
      })
    },
    getAge(birthday) {
      var birthdays = new Date(birthday.replace(/-/g, '/'))
      var d = new Date()
      var age =
        d.getFullYear() -
        birthdays.getFullYear() -
        (d.getMonth() < birthdays.getMonth() ||
        (d.getMonth() === birthdays.getMonth() &&
          d.getDate() < birthdays.getDate())
          ? 1
          : 0)
      return age
    },
    reset() {
      this.cellLocationList = [] // 细胞存储数据
      this.locationList = [] // 细胞存储数据去除暂存、已经出库的数据
      this.serumLocationList = [] // 冰箱血清存储数据
      this.cellCultureList = [] // 培养列表数据
      this.cellCheckList = []// 质检列表数据
      this.cellStoreList = [] // 入库列表数据
      this.outStorageList = []
      this.isCheck = false // 是否有质检信息
      this.isStore = false // 是否有入库信息
      this.isOutstorage = false // 是否有出库信息
      this.rsetTransportEntity()
      this.restReceiveTemp()
    },
    getSampleViewById() {
      this.reset()
      if (this.$route.query.sampleId) {
        getSampleViewBySampleId(this.$route.query.sampleId)
          .then(res => {
            // 存储信息
            if (res.data) {
              // 填充项目类型下拉框
              this.fillProjectType(res.data.sampleCollect.sampleType)
              // 样本类型
              res.data.sampleCollect.collectTime = this.$formatDate(
                res.data.sampleCollect.collectTime,
                'yyyy-MM-dd hh:mm'
              )
              this.sampleTemp = res.data.sampleCollect
              // 加载顾客信息
              this.sampleTemp.customer = res.data.customer
              this.fillCustomerTemp(res.data.customer)
              /* 运输信息 */
              if (res.data.sampleTransport) {
                res.data.sampleTransport.startTime = this.$formatDate(
                  res.data.sampleTransport.startTime,
                  'yyyy-MM-dd hh:mm'
                )
                this.transportEntity = res.data.sampleTransport
              }
              /* 接收信息*/
              if (res.data.sampleReciver) {
                res.data.sampleReciver.reciveTime = this.$formatDate(
                  res.data.sampleReciver.reciveTime,
                  'yyyy-MM-dd hh:mm'
                )
                this.receiveTemp = res.data.sampleReciver
              }
              /* 获取样本对应的细胞信息及存储信息、左侧细胞存储数据*/
              if (res.data.cellLocationList) {
                this.cellLocationList = res.data.cellLocationList
                this.cellLocationListLoading = false
                this.locationList = res.data.cellLocationList.filter(
                  m =>
                    m.cellType === 1 &&
                            m.storeType === 2 && m.storeStatus === 1
                )
              }
              /* tab培养信息*/
              if (res.data.cellCultureList) {
                res.data.cellCultureList.forEach((item, index) => {
                  item.cellTotal = num2e(item.cellTotal)
                  item.cultureTime = this.$formatDate(
                    item.cultureTime,
                    'yyyy-MM-dd hh:mm'
                  )
                  item.receiveTime = this.$formatDate(
                    item.receiveTime,
                    'yyyy-MM-dd hh:mm'
                  )
                })
                this.cellCultureList = res.data.cellCultureList
                // 加载质检信息
                // this.getQualityCheckById()
              }
              /**/
              // 质检信息
              if (res.data.checkList) {
                if (res.data.checkList.length > 0) {
                  this.isCheck = true
                  // 质检信息添加到培养信息列表中
                  this.cellCheckList = []
                  this.cellCultureList.forEach((o, i) => {
                    let id = o.id
                    res.data.checkList.forEach((item, index) => {
                      let cellCultureId = item.cellCultureId
                      if (id === cellCultureId) {
                        o.isPositiveSample =
                          item.isPositiveSample === 1
                            ? '是'
                            : item.isPositiveSample === 0
                              ? '否'
                              : ''
                        o.qualityCheckRes =
                          item.qualityCheckRes === 1
                            ? '符合规定'
                            : item.qualityCheckRes === 0
                              ? '不符合规定'
                              : ''
                        o.qualityCheckRemark = item.qualityCheckRemark
                        o.reportNumber = item.reportNumber
                        o.reportNumber = item.reportNumber
                        o.qualityCheckUserName = item.qualityCheckUserName
                        o.qualityCheckTime = this.$formatDate(
                          item.qualityCheckTime,
                          'yyyy-MM-dd hh:mm'
                        )
                        o.isCryopreservation = item.isCryopreservation === 1 ? '是' : '否'
                        this.cellCheckList.push(o)
                      }
                    })
                  })
                  // this.getCellStoreById()
                }
              }
              /* 入库信息 */
              if (res.data.storeList) {
                if (res.data.storeList.length > 0) {
                  this.isStore = true
                  let storeList = []
                  // 存储信息添加到培养信息列表中
                  this.cellCultureList.forEach((o, i) => {
                    let id = o.id

                    res.data.storeList.forEach((item, index) => {
                      let cellCultureId = item.cellCultureId
                      if (id === cellCultureId) {
                        // 存储数据
                        o.storeTime = this.$formatDate(
                          item.storeTime,
                          'yyyy-MM-dd'
                        )
                        o.storeYear = item.storeYear
                      }
                      // 位置数据存、cell_type储细胞类型(1. 细胞, 2. 血清, 3. 样本细胞)
                      o.locationList_1 = this.mergeLocation(
                        this.cellLocationList.filter(
                          m =>
                            m.cellType === 1 &&
                            m.storeType === 2 &&
                            m.produceNumber === o.produceNumber &&
                            m.storeStatus === 1
                        )
                      )
                      o.locationList_2 = this.mergeLocation(
                        this.cellLocationList.filter(
                          m =>
                            m.cellType === 2 &&
                            m.storeType === 2 &&
                            m.produceNumber === o.produceNumber
                        )
                      )
                      o.locationList_3 = this.mergeLocation(
                        this.cellLocationList.filter(
                          m =>
                            m.cellType === 3 &&
                            m.storeType === 2 &&
                            m.produceNumber === o.produceNumber
                        )
                      )
                      // 冰箱血清
                      let serumList = []
                      if (res.data.serumLocationList) {
                        serumList = res.data.serumLocationList.filter(
                          m =>
                            m.cellCultureId === id &&
                            m.produceNumber === o.produceNumber
                        )
                      }
                      o.serumLocationList = this.mergeSerumLocation(serumList)
                      if (
                        o.locationList_1.length > 0 ||
                        o.locationList_2.length > 0 ||
                        o.locationList_3.length > 0 ||
                        serumList.length > 0
                      ) {
                        let b = storeList.find(m => m.produceNumber === o.produceNumber)
                        if (!b) {
                          storeList.push(o)
                        }
                      }
                    })
                  })
                  this.cellStoreList = storeList
                }
              }
              // 冰箱血清存储
              if (res.data.serumLocationList) {
                this.serumLocationList = res.data.serumLocationList
              }

              /* 出库信息 */
              if (res.data.outList) {
                if (res.data.outList.length > 0) {
                  this.isOutstorage = true
                  // 血清出库信息
                  let serumOutList = res.data.outserumLocationList

                  res.data.outList.forEach((item, index) => {
                    // 细胞出库
                    item.title =
                      '出库申请时间：' +
                      this.$formatDate(item.outStoreApplyTime, 'yyyy-MM-dd hh:mm') +
                      '  &#8195; 出库申请人：' +
                      item.outStoreApplyUserName +
                      '  &#8195;使用人姓名：' +
                      item.userName
                    if (res.data.outLocationList) {
                      item.outLocationList = res.data.outLocationList.filter(
                        m => item.cellLocationIds.includes(m.id)
                      )
                      if (serumOutList) {
                        let sList = serumOutList.filter(
                          m => item.serumLocationIds.includes(m.id)
                        )
                        item.serumOutList = sList
                      }
                    }
                    item.reviewTime = this.$formatDate(item.reviewTime, 'yyyy-MM-dd hh:mm')
                    item.uploaderTime = this.$formatDate(item.uploaderTime, 'yyyy-MM-dd hh:mm')
                  })

                  this.outStorageList = res.data.outList
                }
              }
            }
          })
          .catch(error => {
            this.$Message.error(error.msg)
          })
      }
    },
    mergeLocation(locationList) {
      // 合并存储位置
      if (!locationList) return []
      let len = locationList.length
      if (len <= 1) {
        return locationList
      }
      let item = {}
      Object.assign(item, locationList[0])
      item.latticeNum =
        item.latticeNum + '-' + locationList[len - 1].latticeNum
      return [item]
    },
    mergeLocation2(locationList) {
      if (!locationList) return []
      // 生成批号
      const set = new Set()
      locationList.forEach(element => {
        set.add(element.produceNumber)
      })
      // 按细胞编码合并存储位置
      let locations = []
      set.forEach(s => {
        let list = locationList.filter(m => m.produceNumber === s)
        let len = list.length
        if (len === 1) {
          locations.push(list[0])
        }
        let item = {}
        Object.assign(item, list[0])
        item.latticeNum =
        item.latticeNum + '-' + list[len - 1].latticeNum
        locations.push(item)
      })
      return locations
    },
    mergeSerumLocation(serumList) { // 血清合并位置
      // 合并存储位置
      if (!serumList) return []
      let len = serumList.length
      if (len <= 1) {
        return serumList
      }
      let item = {}
      Object.assign(item, serumList[0])
      item.cuvetteNum =
        item.cuvetteNum + '-' + serumList[len - 1].cuvetteNum
      return [item]
    },
    mergeSerumLocation2(serumList) {
      if (!serumList) return []
      // 生成批号
      const set = new Set()
      serumList.forEach(element => {
        set.add(element.produceNumber)
      })
      // 按细胞编码合并存储位置
      let locations = []
      set.forEach(s => {
        let list = serumList.filter(m => m.produceNumber === s)
        let len = list.length
        if (len === 1) {
          locations.push(list[0])
        }
        let item = {}
        Object.assign(item, list[0])
        item.cuvetteNum =
        item.cuvetteNum + '-' + list[len - 1].cuvetteNum
        locations.push(item)
      })
      return locations
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'retrospectView' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取用户信息
      this.getCarrierList()
      this.getSampleViewById()
      this.setRetrospectSate('one')
    }
  }
}
</script>

