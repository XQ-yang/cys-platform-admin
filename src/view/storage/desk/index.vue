<template>
<div>
  <Tabs :value="storageDeskSate" @on-click="changeTab($event)" type="card">
    <TabPane :label="waitCulture" name="waitCulture">
      <div>
        <Card>
          <!--待培养细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitCultureQuery.sampleType"  @on-change="waitCultureChangeSampleType($event)"  placeholder="请选择样本类型" style="width:190px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitCultureQuery.projectType" placeholder="请选择项目类型"  style="width:190px" clearable>
              <Option v-for="item in waitCultureProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitCultureQuery.sampleCode" @on-change="waitCultureClear" placeholder="样本条码" class="search-input" style="width:190px" clearable />
            <Input v-model="waitCultureQuery.originSampleCode" @on-change="waitCultureClear" placeholder="来源样本条码" class="search-input"  style="width:190px" clearable />
            <Input v-model="waitCultureQuery.reciver" @on-change="waitCultureClear" placeholder="样本接收人" class="search-input" style="width:190px" clearable   />
            <Button @click="waitCultureSearch" class="search-btn">查询</Button>
          </div>
          <!--待培养细胞列表-->
          <Table :data="waitCultureList" :columns="waitCultureColumns" :loading="waitCultureListLoading" border stripe></Table>
          <!--待培养细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitCultureTotal>0"
                :total="waitCultureTotal"
                :current.sync="waitCultureQuery.pageNumber"
                :page-size.sync="waitCultureQuery.pageSize"
                @on-change="getPageCellCultureList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane :label="waitTempStore" name="waitTempStore">
      <div>
        <Card>
          <!--待培养细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitTempStoreQuery.sampleType"  @on-change="waitTempStoreChangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitTempStoreQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitTempStoreProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitTempStoreQuery.sampleCode" @on-change="waitTempStoreClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitTempStoreQuery.receiver" @on-change="waitTempStoreClear" placeholder="细胞接收人" class="search-input" clearable   />
            <Button @click="waitTempStoreSearch" class="search-btn">查询</Button>
            <Button v-permission="{rule:'tempStorePrint'}" @click="tempStorePrint" class="ivu-btn ivu-btn-primary search-btn">打印</Button>
          </div>
          <!--待培养细胞列表-->
          <Table highlight-row @on-current-change="onTempStoreCurrentChange" :data="waitTempStoreList" :columns="waitTempStoreColumns" :loading="waitTempStoreListLoading" border stripe></Table>
          <!--待培养细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitTempStoreTotal>0"
                :total="waitTempStoreTotal"
                :current.sync="waitTempStoreQuery.pageNumber"
                :page-size.sync="waitTempStoreQuery.pageSize"
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
    <TabPane :label="waitQualityCheck" name="waitQualityCheck">
      <div>
        <Card>
          <!--待质检细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitQualityQuery.sampleType"  @on-change="waitQualityChangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitQualityQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitQualityProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitQualityQuery.sampleCode" @on-change="waitQualityClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitQualityQuery.receiver" @on-change="waitQualityClear" placeholder="细胞接收人" class="search-input" clearable   />
            <Button @click="waitQualitySearch" class="search-btn">查询</Button>
          </div>
          <!--待质检细胞列表-->
          <Table :data="waitQualityList" :columns="waitQualityColumns" :loading="waitQualityListLoading" border stripe></Table>
          <!--待质检细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitQualityTotal>0"
                :total="waitQualityTotal"
                :current.sync="waitQualityQuery.pageNumber"
                :page-size.sync="waitQualityQuery.pageSize"
                @on-change="getPageQualityCheckList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane :label="waitStore" name="waitStore">
      <div>
        <Card>
          <!--待入库细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitStoreQuery.sampleType"  @on-change="waitStoreChangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitStoreQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitStoreProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitStoreQuery.sampleCode" @on-change="waitStoreClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitStoreQuery.qualityCheckUserName" @on-change="waitStoreClear" placeholder="细胞质检人" class="search-input" clearable   />
            <Button @click="waitStoreSearch" class="search-btn">查询</Button>
            <Button v-permission="{rule:'storePrint'}" @click="storePrint" class="ivu-btn ivu-btn-primary search-btn">打印</Button>
          </div>
          <!--待入库细胞列表-->
          <Table highlight-row @on-current-change="onStoreCurrentChange" :data="waitStoreList" :columns="waitStoreColumns" :loading="waitStoreListLoading" border stripe></Table>
          <!--待入库细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitStoreTotal>0"
                :total="waitStoreTotal"
                :current.sync="waitStoreQuery.pageNumber"
                :page-size.sync="waitStoreQuery.pageSize"
                @on-change="getPageWaitStoreList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
          <Spin size="large" fix v-if="storePrintLoading"></Spin>
        </Card>
      </div>
    </TabPane>
    <TabPane :label="waitRecheck" name="waitRecheck">
      <div>
        <Card>
          <!--待复核细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitRecheckQuery.sampleType"  @on-change="waitRecheckChangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitRecheckQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitRecheckProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitRecheckQuery.sampleCode" @on-change="waitRecheckClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitRecheckQuery.qaUserName" @on-change="waitRecheckClear" placeholder="QA" class="search-input" clearable   />
            <Button @click="waitRecheckSearch" class="search-btn">查询</Button>
          </div>
          <!--待复核细胞列表-->
          <Table :data="waitRecheckList" :columns="waitRecheckColumns" :loading="waitRecheckListLoading" border stripe></Table>
          <!--待复核细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitRecheckTotal>0"
                :total="waitRecheckTotal"
                :current.sync="waitRecheckQuery.pageNumber"
                :page-size.sync="waitRecheckQuery.pageSize"
                @on-change="getPageWaitRecheckList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane :label="qualityException" name="qualityException">
      <div>
        <Card>
          <!--细胞培养台账查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="qualityExceptionQuery.sampleType"  @on-change="qualityExceptionChangeSampleType($event)" placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="qualityExceptionQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in qualityExceptionProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="qualityExceptionQuery.sampleCode" @on-change="qualityExceptionClear" placeholder="样本条码" class="search-input" clearable />
            <!-- <Input v-model="qualityExceptionQuery.receiver" @on-change="qualityExceptionClear" placeholder="细胞接收人" class="search-input" clearable   /> -->
            <Input v-model="qualityExceptionQuery.qualityCheckUserName" @on-change="qualityExceptionClear" placeholder="操作人" class="search-input" clearable   />
            <Button @click="qualityExceptionSearch" class="search-btn">查询</Button>
          </div>
          <!--细胞培养台账列表-->
          <Table :data="qualityExceptionList" :columns="qualityExceptionColumns" :loading="qualityExceptionListLoading" border stripe></Table>
          <!--细胞培养台账分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="qualityExceptionTotal>0"
                :total="qualityExceptionTotal"
                :current.sync="qualityExceptionQuery.pageNumber"
                :page-size.sync="qualityExceptionQuery.pageSize"
                @on-change="getPageQualityCheckExceptionList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
  </Tabs>
  <!-- 暂存打印预览页面 -->
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
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.sample.sampleCode}}</td>
          <td style="border:1px black solid;width:20%;">项目类型</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.sample.projectTypeName}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">细胞总量</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.cellTotal}}</td>
          <td style="border:1px black solid;width:20%;">细胞活率</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.cellViability}}%</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">细胞编码</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.produceNumber}}</td>
          <td style="border:1px black solid;width:20%;">规格</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.specification + tempStorePrintObj.cellCulture.specificationUnitName}}</td>
        </tr>
        <tr v-show="tempStorePrintObj.sample.sampleType === 1 || tempStorePrintObj.sample.sampleType === 2" style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">冻存液批号</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.freezeFluid}}</td>
          <td style="border:1px black solid;width:20%;">存储数量</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.cellQuantity}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">接收人</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.receiveUserName}}</td>
          <td style="border:1px black solid;width:20%;">接收时间</td>
          <td style="border:1px black solid;width:30%;">{{tempStorePrintObj.cellCulture.receiveTime}}</td>
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
  <!-- 入库打印预览页面 -->
  <div v-show="false" id="storePrintId" style="border:1px solid black;">
    <div style="width:100%; margin:auto;padding-top:5%;font-size:12px;">
      <div style="margin-bottom:1%;">
        <h3 style="text-align:center;font-size:18px;">细胞入库存储记录</h3>
      </div>
      <div style="margin:auto;width:98%;">
        <div style="float:right;margin-right:2%;">记录编码: REC-JS-01000</div>
        <div style="clear:both;"></div>
        <div style="text-align:left;margin-top:5px;">入库日期:</div><br/>
      </div>
      <table style="border-collapse:collapse; border-spacing: 0px; text-align:center; width:98%;font-size:14px;margin:auto;" >
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">样本条码</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.sample.sampleCode}}</td>
          <td style="border:1px black solid;width:20%;">项目类型</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.sample.projectTypeName}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">细胞总量</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.cellTotal}}</td>
          <td style="border:1px black solid;width:20%;">细胞活率</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.cellViability}}%</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">细胞编码</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.produceNumber}}</td>
          <td style="border:1px black solid;width:20%;">规格</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.specification + storePrintObj.cellCulture.specificationUnitName}}</td>
        </tr>
         <!-- v-show="storePrintObj.sample.sampleType === 1 || storePrintObj.sample.sampleType === 2" -->
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">冻存液批号</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.freezeFluid}}</td>
          <td style="border:1px black solid;width:20%;">存储数量</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.cellQuantity || storePrintObj.cellCulture.serumQuantity}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">接收人</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.receiveUserName}}</td>
          <td style="border:1px black solid;width:20%;">接收时间</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.cellCulture.receiveTime}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">冻存是否完成</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.qualityCheck.isCryopreservation === 1 ? "是" : (storePrintObj.qualityCheck.isCryopreservation === 0 ? "否" : "")}}</td>
          <td style="border:1px black solid;width:20%;">是否阳性样本</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.qualityCheck.isPositiveSample === 1 ? "是" : (storePrintObj.qualityCheck.isPositiveSample === 0 ? "否" : "")}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">质量检测结果</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.qualityCheck.qualityCheckRes === 1 ? "符合规定" : (storePrintObj.qualityCheck.qualityCheckRes === 0 ? "不符合规定" : "")}}</td>
          <td style="border:1px black solid;width:20%;">报告单编号</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.qualityCheck.reportNumber}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">质检人</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.qualityCheck.qualityCheckUserName}}</td>
          <td style="border:1px black solid;width:20%;">质检报告时间</td>
          <td style="border:1px black solid;width:30%;">{{storePrintObj.qualityCheck.qualityCheckTime}}</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">存储时间</td>
          <td style="border:1px black solid;width:30%;"></td>
          <td style="border:1px black solid;width:20%;">存储年限</td>
          <td style="border:1px black solid;width:30%;"></td>
        </tr>
        <tr style="height:60px; width:100%;">
          <td style="border:1px black solid;width:20%;">存储位置</td>
          <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">存储<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:40px;border-bottom:1px black solid;" />号</td>
        </tr>
        <tr style="height:60px; width:100%;">
          <td style="border:1px black solid;width:20%;">血清存储位置</td>
          <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">-80℃冰箱<input type="checkbox" />  <input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冰箱第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />层、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />试管架、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号<br/>
          液氮罐<input type="checkbox" />  <input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号</td>
        </tr>
        <tr style="height:60px; width:100%;">
          <td style="border:1px black solid;width:20%;">检测样品存储位置</td>
          <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">存储<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:40px;border-bottom:1px black solid;" />号</td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">备注</td>
          <td style="border:1px black solid;width:30%; text-align: left;" colspan="3"></td>
        </tr>
        <tr style="height:50px; width:100%;">
          <td style="border:1px black solid;width:20%;">QA</td>
          <td style="border:1px black solid;width:30%;">{{qaUserName}}</td>
          <td style="border:1px black solid;width:20%;">审核时间</td>
          <td style="border:1px black solid;width:30%;"></td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>
<script>
import '@/assets/css/common.less'
import { getPageCellCultureList, getPageTempStoreList, getPageQualityCheckList, getPageWaitStoreList, getPageWaitRecheckList, getPageQualityCheckExceptionList, closeQualityCheckException, getTempStoreAddView, getStoreAddView } from '@/api/cellCulture.js'
import { getSampleTypeList, getProjectTypeBySampleType, getAllProjectType } from '@/api/projectType.js'
import { mapState, mapActions } from 'vuex'
import { num2e } from '@/libs/tools.js'
import { getUserInfo } from '@/api/user'
import { getLodop } from '@/libs/LodopFuncs'
export default {
  name: 'storageDesk',
  data() {
    return {
      waitCultureCount: 0,
      // 显示待培养细胞条数
      waitCulture: (h) => {
        return h('div', [
          h('span', '待培养'),
          h('Badge', {
            props: {
              count: this.waitCultureCount
            }
          })
        ])
      },
      sampleTypes: [],
      // 待培养细胞列表显示及查询
      waitCultureProjectTypeList: [],
      waitCultureQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        originSampleCode: '',
        reciver: ''
      },
      waitCultureListLoading: false,
      waitCultureList: [],
      waitCultureTotal: 0,
      waitCultureColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitCultureQuery.pageNumber - 1) * this.waitCultureQuery.pageSize
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
      // ---------------------------------------------------
      waitTempStoreCount: 0,
      // 显示待暂存的细胞条数
      waitTempStore: (h) => {
        return h('div', [
          h('span', '待暂存'),
          h('Badge', {
            props: {
              count: this.waitTempStoreCount
            }
          })
        ])
      },
      // 当前选中的待暂存细胞cellCultureId
      selectTempStoreCellCultureId: '',
      // 待暂存细胞列表显示及查询
      waitTempStoreProjectTypeList: [],
      waitTempStoreQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        receiver: ''
      },
      waitTempStoreListLoading: false,
      waitTempStoreList: [],
      waitTempStoreTotal: 0,
      waitTempStoreColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitTempStoreQuery.pageNumber - 1) * this.waitTempStoreQuery.pageSize
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
                    this.reserveTempStoreAdd(params.row)
                  }
                }
              }, '暂存')
            ])
          }
        }
      ],
      // 打印单信息实体
      tempStorePrintObj: {
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
      // ------------------------------------------------
      waitQualityCount: 0,
      // 显示待质检细胞条数
      waitQualityCheck: (h) => {
        return h('div', [
          h('span', '待质检'),
          h('Badge', {
            props: {
              count: this.waitQualityCount
            }
          })
        ])
      },
      // 待质检细胞列表显示及查询
      waitQualityProjectTypeList: [],
      waitQualityQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        receiver: ''
      },
      waitQualityListLoading: false,
      waitQualityList: [],
      waitQualityTotal: 0,
      waitQualityColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitQualityQuery.pageNumber - 1) * this.waitQualityQuery.pageSize
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
                    this.reserveQualityCheckAdd(params.row)
                  }
                }
              }, '质检')
            ])
          }
        }
      ],
      // ------------------------------------------------------
      waitStoreCount: 0,
      // 显示待入库细胞条数
      waitStore: (h) => {
        return h('div', [
          h('span', '待入库'),
          h('Badge', {
            props: {
              count: this.waitStoreCount
            }
          })
        ])
      },
      // 当前选中的待入库细胞cellCultureId
      selectStoreCellCultureId: '',
      // 待入库细胞列表显示及查询
      waitStoreProjectTypeList: [],
      waitStoreQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        qualityCheckUserName: ''
      },
      waitStoreListLoading: false,
      waitStoreList: [],
      waitStoreTotal: 0,
      waitStoreColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitStoreQuery.pageNumber - 1) * this.waitStoreQuery.pageSize
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
        { title: '质检人', key: 'qualityCheckUserName', tooltip: true },
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
                    value: { rule: 'storeAdd' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveStoreAdd(params.row)
                  }
                }
              }, '入库')
            ])
          }
        }
      ],
      // 打印单信息实体
      storePrintObj: {
        sample: {},
        cellCulture: {},
        qualityCheck: {}
      },
      // qa用户名
      qaUserName: '',
      // 入库打印加载
      storePrintLoading: false,
      // ---------------------------------------------------
      waitRecheckCount: 0,
      // 显示待复核细胞条数
      waitRecheck: (h) => {
        return h('div', [
          h('span', '待复核'),
          h('Badge', {
            props: {
              count: this.waitRecheckCount
            }
          })
        ])
      },
      // 待复核细胞列表显示及查询
      waitRecheckProjectTypeList: [],
      waitRecheckQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        qaUserName: ''
      },
      waitRecheckListLoading: false,
      waitRecheckList: [],
      waitRecheckTotal: 0,
      waitRecheckColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitRecheckQuery.pageNumber - 1) * this.waitRecheckQuery.pageSize
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
        { title: '质检人', key: 'qualityCheckUserName', tooltip: true },
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
        { title: 'QA', key: 'qaUserName', tooltip: true },
        { title: '审核时间',
          key: 'reviewTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.reviewTime ? this.$formatDate(params.row.reviewTime, 'yyyy-MM-dd hh:mm') : ''
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
                    value: { rule: 'storeRecheck' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveRecheckAdd(params.row)
                  }
                }
              }, '复核')
            ])
          }
        }
      ],
      // ----------------------------------------------------------
      qualityExceptionCount: 0,
      // 显示待培养细胞条数
      qualityException: (h) => {
        return h('div', [
          h('span', '异常信息'),
          h('Badge', {
            props: {
              count: this.qualityExceptionCount
            }
          })
        ])
      },
      // 细胞培养台账列表显示及查询
      qualityExceptionProjectTypeList: [],
      qualityExceptionQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        receiver: '',
        qualityCheckUserName: ''
      },
      qualityExceptionListLoading: false,
      qualityExceptionList: [],
      qualityExceptionTotal: 0,
      qualityExceptionColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.qualityExceptionQuery.pageNumber - 1) * this.qualityExceptionQuery.pageSize
          }
        },
        { title: '流程状态',
          key: 'operateType',
          tooltip: true,
          render: (h, params) => {
            var text = '细胞质检'
            return h(
              'div',
              text
            )
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
        { title: '操作人', key: 'qualityCheckUserName', tooltip: true },
        // { title: '质检报告日期',
        //   key: 'qualityCheckTime',
        //   tooltip: true,
        //   width: 160,
        //   render: (h, params) => {
        //     return h('div',
        //       params.row.qualityCheckTime ? this.$formatDate(params.row.qualityCheckTime, 'yyyy-MM-dd hh:mm') : ''
        //     )
        //   }
        // },
        // { title: '质检结果',
        //   key: 'qualityCheckRes',
        //   tooltip: true,
        //   render: (h, params) => {
        //     return h('div',
        //       params.row.qualityCheckRes ? '符合规定' : '不符合规定'
        //     )
        //   }
        // },
        { title: '理由', key: 'qualityCheckRemark', tooltip: true },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'primary',
              //     size: 'small'
              //   },
              //   style: {
              //     margin: '3px 2px 2px 3px'
              //   },
              //   on: {
              //     click: () => {
              //       this.reserveQualityExceptionView(params.row)
              //     }
              //   }
              // }, '查看'),
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  title: '您确定要关闭吗'
                },
                on: {
                  'on-ok': () => {
                    this.closeQualityCheckException(params.row)
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
                      value: { rule: 'closeQualityCheckException' }
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
      // 获取待培养细胞数据列表
      this.getPageCellCultureList()
      // 获取待暂存细胞数据列表
      this.getPageTempStoreList()
      // 获取待质检细胞数据列表
      this.getPageQualityCheckList()
      // 获取待入库细胞数据列表
      this.getPageWaitStoreList()
      // 获取待复核细胞数据列表
      this.getPageWaitRecheckList()
      // 分页获取细胞质检异常信息列表
      this.getPageQualityCheckExceptionList()
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
      this.getPageCellCultureList()
      // 获取待暂存细胞数据列表
      this.getPageTempStoreList()
      // 获取待质检细胞数据列表
      this.getPageQualityCheckList()
      // 获取待入库细胞数据列表
      this.getPageWaitStoreList()
      // 获取待复核细胞数据列表
      this.getPageWaitRecheckList()
      // 分页获取细胞质检异常信息列表
      this.getPageQualityCheckExceptionList()
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
      storageDeskSate: state => state.storage.storageDeskSate
    })
  },
  methods: {
    ...mapActions([
      'setStorageDeskSate'
    ]),
    // 切换tab时保存选中的tab状态
    changeTab(e) {
      const storageDeskSate = e
      this.setStorageDeskSate({ storageDeskSate })
    },
    // 查询细胞待培养列表
    waitCultureSearch() {
      this.waitCultureQuery.pageNumber = 1
      this.getPageCellCultureList()
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitCultureClear(e) {
      if (!e.target.value) {
        this.getPageCellCultureList()
      }
    },
    // 获取待培养细胞数据列表
    getPageCellCultureList() {
      this.waitCultureListLoading = true
      getPageCellCultureList(this.waitCultureQuery).then(res => {
        // 待培养细胞的样本总条数
        this.waitCultureCount = res.data.totalRow
        this.waitCultureList = res.data.list
        this.waitCultureTotal = res.data.totalRow
        this.waitCultureListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待培养细胞列表切换样本类型时修改项目类型下拉数据
    waitCultureChangeSampleType(sampleType) {
      this.waitCultureProjectTypeList = []
      this.waitCultureQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitCultureProjectTypeList = res.data
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
    // 跳转到细胞培养新增页
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
    // --------------------------------------
    // 待暂存列表选中切换
    onTempStoreCurrentChange(currentRow, oldCurrentRow) {
      this.selectTempStoreCellCultureId = currentRow.id
    },
    // 查询细胞待暂存列表
    waitTempStoreSearch() {
      this.waitTempStoreQuery.pageNumber = 1
      this.getPageTempStoreList()
    },
    // 清空查询值的时候 重新加载待暂存细胞列表数据
    waitTempStoreClear(e) {
      if (e.target.value === '') {
        this.getPageTempStoreList()
      }
    },
    // 获取待暂存细胞数据列表
    getPageTempStoreList() {
      this.waitTempStoreListLoading = true
      getPageTempStoreList(this.waitTempStoreQuery).then(res => {
        // 待暂存细胞的样本总条数
        this.waitTempStoreCount = res.data.totalRow
        this.waitTempStoreList = res.data.list
        this.waitTempStoreTotal = res.data.totalRow
        this.waitTempStoreListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待暂存细胞列表切换样本类型时修改项目类型下拉数据
    waitTempStoreChangeSampleType(sampleType) {
      this.waitTempStoreProjectTypeList = []
      this.waitTempStoreQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitTempStoreProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞暂存打印页
    tempStorePrint() {
      if (!this.selectTempStoreCellCultureId) {
        this.$Message.error('请先选中一条待暂存细胞信息')
        return
      }
      this.getTempStorePrintView(this.selectTempStoreCellCultureId)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getTempStorePrintView(cellCultureId) {
      this.tempStorePrintLoading = true
      getTempStoreAddView(cellCultureId).then(res => {
        this.tempStorePrintObj = res.data
        // 获取项目类型名称
        let tempPro = this.projectTypes.filter(project => project.id === this.tempStorePrintObj.sample.projectType).map(project => project.projectTypeName)
        this.tempStorePrintObj.sample.projectTypeName = tempPro && tempPro.length > 0 ? tempPro[0] : ''

        this.tempStorePrintObj.cellCulture.receiveTime = this.$formatDate(this.tempStorePrintObj.cellCulture.receiveTime, 'yyyy-MM-dd hh:mm')
        this.tempStorePrintObj.cellCulture.specificationUnitName = this.tempStorePrintObj.cellCulture.specificationUnit === 1 ? '/1ml/管' : 'ml/袋'
        this.tempStorePrintObj.cellCulture.cellTotal = num2e(this.tempStorePrintObj.cellCulture.cellTotal)
        this.tempStorePrintView()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    tempStorePrintView() {
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      this.$nextTick(() => {
        LODOP.ADD_PRINT_HTM('0%', '1%', '100%', '100%',
          document.getElementById('tempStorePrintId').innerHTML)
        LODOP.PREVIEW()
        this.tempStorePrintLoading = false
      })
    },
    getTempStoreUserName() {
      getUserInfo().then(res => {
        // 获取暂存（当前登录用户）
        this.tempStoreUserName = res.data.realName
        // 获取qa（当前登录用户）
        this.qaUserName = res.data.realName
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
    // 跳转到细胞暂存新增页
    reserveTempStoreAdd(row) {
      const route = {
        name: 'tempStoreAdd',
        query: {
          id: 'tempStoreAdd',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // --------------------------------------
    // 查询细胞待质检列表
    waitQualitySearch() {
      this.waitQualityQuery.pageNumber = 1
      this.getPageQualityCheckList()
    },
    // 清空查询值的时候 重新加载待质检细胞列表数据
    waitQualityClear(e) {
      if (e.target.value === '') {
        this.getPageQualityCheckList()
      }
    },
    // 获取待质检细胞数据列表
    getPageQualityCheckList() {
      this.waitQualityListLoading = true
      getPageQualityCheckList(this.waitQualityQuery).then(res => {
        // 待质检细胞的样本总条数
        this.waitQualityCount = res.data.totalRow
        this.waitQualityList = res.data.list
        this.waitQualityTotal = res.data.totalRow
        this.waitQualityListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待质检细胞列表切换样本类型时修改项目类型下拉数据
    waitQualityChangeSampleType(sampleType) {
      this.waitQualityProjectTypeList = []
      this.waitQualityQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitQualityProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到质检新增页
    reserveQualityCheckAdd(row) {
      const route = {
        name: 'qualityCheckAdd',
        query: {
          id: 'qualityCheckAdd',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // -----------------------------------------------------------
    onStoreCurrentChange(currentRow, oldCurrentRow) {
      this.selectStoreCellCultureId = currentRow.id
    },
    // 查询细胞待入库列表
    waitStoreSearch() {
      this.waitStoreQuery.pageNumber = 1
      this.getPageWaitStoreList()
    },
    // 清空查询值的时候 重新加载待入库细胞列表数据
    waitStoreClear(e) {
      if (e.target.value === '') {
        this.getPageWaitStoreList()
      }
    },
    // 获取待入库细胞数据列表
    getPageWaitStoreList() {
      this.waitStoreListLoading = true
      getPageWaitStoreList(this.waitStoreQuery).then(res => {
        // 待入库细胞的样本总条数
        this.waitStoreCount = res.data.totalRow
        this.waitStoreList = res.data.list
        this.waitStoreTotal = res.data.totalRow
        this.waitStoreListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待入库细胞列表切换样本类型时修改项目类型下拉数据
    waitStoreChangeSampleType(sampleType) {
      this.waitStoreProjectTypeList = []
      this.waitStoreQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitStoreProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞入库打印页
    storePrint() {
      if (!this.selectStoreCellCultureId) {
        this.$Message.error('请先选中一条待入库的细胞信息')
        return
      }
      this.getStorePrintView(this.selectStoreCellCultureId)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getStorePrintView(cellCultureId) {
      // 加载进度
      this.storePrintLoading = true
      getStoreAddView(cellCultureId).then(res => {
        this.storePrintObj = res.data
        // 获取项目类型名称
        let tempPro = this.projectTypes.filter(project => project.id === this.storePrintObj.sample.projectType).map(project => project.projectTypeName)
        this.storePrintObj.sample.projectTypeName = tempPro && tempPro.length > 0 ? tempPro[0] : ''

        this.storePrintObj.cellCulture.receiveTime = this.$formatDate(this.storePrintObj.cellCulture.receiveTime, 'yyyy-MM-dd hh:mm')
        this.storePrintObj.qualityCheck.qualityCheckTime = this.$formatDate(this.storePrintObj.qualityCheck.qualityCheckTime, 'yyyy-MM-dd hh:mm')
        this.storePrintObj.cellCulture.specificationUnitName = this.storePrintObj.cellCulture.specificationUnit === 1 ? '/1ml/管' : 'ml/袋'
        this.storePrintObj.cellCulture.cellTotal = num2e(this.storePrintObj.cellCulture.cellTotal)
        this.storePrintView()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    storePrintView() {
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      this.$nextTick(() => {
        LODOP.ADD_PRINT_HTM('0%', '1%', '100%', '100%',
          document.getElementById('storePrintId').innerHTML)
        LODOP.PREVIEW()
        // 关闭加载进度
        this.storePrintLoading = false
      })
    },
    // 跳转到细胞入库页
    reserveStoreAdd(row) {
      const route = {
        name: 'storeAdd',
        query: {
          id: 'storeAdd',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // ----------------------------------------------
    // 查询细胞待入库列表
    waitRecheckSearch() {
      this.waitRecheckQuery.pageNumber = 1
      this.getPageWaitRecheckList()
    },
    // 清空查询值的时候 重新加载待复核细胞列表数据
    waitRecheckClear(e) {
      if (e.target.value === '') {
        this.getPageWaitRecheckList()
      }
    },
    // 获取待复核细胞数据列表
    getPageWaitRecheckList() {
      this.waitRecheckListLoading = true
      getPageWaitRecheckList(this.waitRecheckQuery).then(res => {
        // 待复核细胞的样本总条数
        this.waitRecheckCount = res.data.totalRow
        this.waitRecheckList = res.data.list
        this.waitRecheckTotal = res.data.totalRow
        this.waitRecheckListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待复核细胞列表切换样本类型时修改项目类型下拉数据
    waitRecheckChangeSampleType(sampleType) {
      this.waitRecheckProjectTypeList = []
      this.waitRecheckQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitRecheckProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞复核新增页
    reserveRecheckAdd(row) {
      const route = {
        name: 'storeRecheck',
        query: {
          id: 'storeRecheck',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // ----------------------------------------------
    // 跳转到质检信息查看页
    reserveQualityExceptionView(row) {
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
    qualityExceptionSearch() {
      this.qualityExceptionQuery.pageNumber = 1
      this.getPageQualityCheckExceptionList()
    },
    // 清空查询值的时候 重新加载培养细胞台账列表数据
    qualityExceptionClear(e) {
      if (e.target.value === '') {
        this.getPageQualityCheckExceptionList()
      }
    },
    // 获取培养细胞台账数据列表
    getPageQualityCheckExceptionList() {
      this.qualityExceptionListLoading = true
      getPageQualityCheckExceptionList(this.qualityExceptionQuery).then(res => {
        // 待培养细胞的样本总条数
        this.qualityExceptionCount = res.data.totalRow
        this.qualityExceptionList = res.data.list
        this.qualityExceptionTotal = res.data.totalRow
        this.qualityExceptionListLoading = false
      })
    },
    // 培养细胞台账列表切换样本类型时修改项目类型下拉数据
    qualityExceptionchangeSampleType(sampleType) {
      this.qualityExceptionProjectTypeList = []
      this.qualityExceptionQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.qualityExceptionProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 关闭异常
    closeQualityCheckException(row) {
      closeQualityCheckException(row.id).then(res => {
        this.$Message.success('关闭成功')
        this.getPageQualityCheckExceptionList()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    }
  }
}
</script>
