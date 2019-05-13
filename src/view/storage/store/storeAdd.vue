<template>
  <div>
    <Form ref="sampleForm" :model="sample" :loading="registerFormLoading" :label-width="110" >
      <Card title="样本信息">
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="样本条码">
              <Input type="text" v-model="sample.sampleCode" disabled ></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="样本类型">
              <RadioGroup v-model="sample.sampleType" >
                <Radio v-for="item in sampleTypeList" :label="item.sampleTypeId" :key="item.sampleTypeId" disabled>
                  <span>{{item.sampleTypeName}}</span>
                </Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="项目类型">
              <Select v-model="sample.projectType" placeholder="请选择项目类型"  disabled clearable>
                <Option v-for="item in projectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="采集时间">
              <DatePicker type="datetime" placeholder="请选择采集时间" v-model="sample.collectTime" format="yyyy-MM-dd HH:mm" style="width:100%;" disabled ></DatePicker>
            </Form-item>
          </Col>
        </Row>
      </Card>
    </Form>
    <Form ref="customerForm" :model="customer" :loading="registerFormLoading" :label-width="110" >
      <Card title="顾客信息">
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="顾客姓名">
              <Input type="text" v-model="customer.name" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="身份证号">
              <Input type="text" v-model="customer.idNumber" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="手机号">
              <Input type="text" v-model="customer.phone" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="性别">
              <RadioGroup v-model="customer.gender">
                <Radio :label="0" disabled>未知</Radio>
                <Radio :label="1" disabled>男</Radio>
                <Radio :label="2" disabled>女</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="年龄">
              <Input type="text" v-model="sample.age" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="婚否">
              <Select v-model="customer.maritalStatus" placeholder="请选择" disabled clearable>
                <Option :value="0">未知</Option>
                <Option :value="1">已婚</Option>
                <Option :value="2">未婚</Option>
                <Option :value="3">离异</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
      </Card>
    </Form>
    <Form ref="storeAddForm" :model="store" :rules="rules" :loading="registerFormLoading" :label-width="110" >
      <!-- 新增细胞培养信息的表单 -->
      <Card title="细胞信息">
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞总量">
              <Input type="text" v-model="cellCulture.cellTotal" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="培养日期">
              <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.cultureTime" format="yyyy-MM-dd HH:mm"  style="width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="细胞活率">
              <Input type="text" v-model="cellCulture.cellViability" style="width:90%;" disabled></Input> %
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞编码">
              <Input type="text" v-model="cellCulture.produceNumber" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Row>
              <Col span="17">
                <Form-item label="规格">
                  <Input type="text" v-model="cellCulture.specification" disabled :maxlength="30"></Input>
                </Form-item>
              </Col>
              <Col span="7">
                <Form-item :label-width="5">
                  <Select v-model="cellCulture.specificationUnit" disabled clearable>
                    <Option :value="1">/1ml/管</Option>
                    <Option :value="2">ml/袋</Option>
                  </Select>
                </Form-item>
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Form-item v-if="sample.sampleType === 3" label="存储数量">
              <Input type="text" v-model="cellCulture.serumQuantity" disabled></Input>
            </Form-item>
            <Form-item v-if="sample.sampleType !== 3" label="存储数量">
              <Input type="text" v-model="cellCulture.cellQuantity"  disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <!-- <Row v-if="sample.sampleType !== 3" :gutter="48">
          <Col span="8">
            <Form-item label="冻存液批号">
              <Input type="text" v-model="cellCulture.freezeFluid" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="存储数量">
              <Input type="text" v-model="cellCulture.cellQuantity"  disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row> -->
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="接收人">
              <Input type="text" v-model="cellCulture.receiveUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="接收时间">
                <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.receiveTime" format="yyyy-MM-dd HH:mm"  style="width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="冻存是否完成">
              <RadioGroup v-model="qualityCheck.isCryopreservation">
                <Radio :label="1" disabled>是</Radio>
                <Radio :label="0" disabled>否</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="是否阳性样本">
              <RadioGroup v-model="qualityCheck.isPositiveSample">
                <Radio :label="1" disabled>是</Radio>
                <Radio :label="0" disabled>否</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="报告编号">
              <Input type="text" placeholder="请输入报告编号" v-model="qualityCheck.reportNumber" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="质检报告">
              <Alert v-for="item in qualityCheckReportFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
              <!-- <div v-for="item in qualityCheckReportFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></div> -->
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="质检人">
              <Input type="text" v-model="qualityCheck.qualityCheckUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="质检报告时间">
              <DatePicker type="datetime" placeholder="选择日期" v-model="qualityCheck.qualityCheckTime" format="yyyy-MM-dd HH:mm"  style=" width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="取样检测时间">
              <DatePicker type="datetime" placeholder="选择日期" v-model="qualityCheck.sampleTestTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="存储时间" prop="storeTime">
              <DatePicker type="datetime" placeholder="选择日期" v-model="store.storeTime" style="width:100%;"  format="yyyy-MM-dd" ></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item v-if="sample.sampleType !== 3" label="存储年限" prop="storeYear">
              <Input type="text" v-model="store.storeYear" :maxlength="3" style="width:80%;"></Input> 年
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row v-show="sample.sampleType !== 3" :gutter="48">
          <Col span="24">
            <Form-item label="存储位置" prop="cellLocations" class="ivu-form-item-required">
              <Button @click="openChoiceStoreModal" type="success">分派位置</Button>
              <br />
              <Tag v-if="cellLocations && cellLocations.length" :key="1" color="green">{{caculateLocation(cellLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row v-show="sample.sampleType === 3" :gutter="48">
          <Col span="24">
            <Form-item label="血清存储位置" prop="serumLocationAdd" class="ivu-form-item-required">
              <Button @click="openChoiceSerumStoreModal" type="success">分派位置</Button>
              <br />
              <Tag :key="2" v-if="serumLocationAdd && serumLocationAdd.cellLocations && serumLocationAdd.cellLocations.length" color="green">{{caculateLocation(serumLocationAdd.cellLocations)}}</Tag>
              <Tag :key="3" v-else-if="serumLocationAdd && serumLocationAdd.serumLocations && serumLocationAdd.serumLocations.length" color="green">{{fridgeCaculateLocation(serumLocationAdd.serumLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="检测样品存储位置">
              <Button @click="openChoiceTestCellStoreModal" type="success">分派位置</Button>
              <br />
              <Tag v-if="testCellLocation" color="green">{{testCellLocation.potCode +' 罐-'+ testCellLocation.regionCode +' 区-'+ testCellLocation.towerCode +' 塔-'+ testCellLocation.boxCode +' 盒-第 '+ testCellLocation.latticeNum +' 号管'}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="上传入库放行记录" prop="storageReleaseRecordFile" class="ivu-form-item-required">
              <!-- <span slot="label">上传入库<br/>放行记录</span> -->
              <Upload
              ref="upload"
              :action="actionUrl"
              :headers="headers"
              multiple
              paste
              accept=".pdf,.jpg,.jpeg,.png"
              :before-upload="handleBeforeUpload"
              :max-size="102400"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleUploadSuccess"
              :on-preview="handleUploadPreview">
                <Button icon="ios-cloud-upload-outline" style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传.png,.jpg,.jpeg或pdf格式的文件,最大100M)</span>
              </Upload>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="审查结论" prop="reviewRes">
              <RadioGroup v-model="store.reviewRes">
                <Radio :label="1">符合规定，允许放行</Radio>
                <Radio :label="0">不符合规定，拒绝放行</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <FormItem label="入库备注" prop="storeRemark">
              <Input v-model="store.storeRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="255" placeholder="请输入入库备注"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="QA" prop="qaUserId">
              <Select v-model="store.qaUserId" placeholder="请选择QA" clearable on-change="qaChange">
                <Option v-for="item in qualityUserList" :key="item.id" :value="item.id" >{{item.realName}}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="审核时间" prop="reviewTime">
              <DatePicker type="datetime" placeholder="选择日期" v-model="store.reviewTime" format="yyyy-MM-dd HH:mm" style="width:100%;" ></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
           <Form-item label="入库人">
              <Input type="text" v-model="store.storeUserName" disabled></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
      </div>
    </Form>
    <!-- 细胞存储位置选择弹出层 -->
    <Modal
      v-model="storeModalVisible"
      title="分派存储位置"
      :loading="storeModalLoading"
      @on-ok="storeModalOk"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :scrollable="true"
      width="768">
      <div style="height:519px; overflow-x:hidden; overflow-y:auto;">
        <Form ref="cellLocationsForm" :model="boxInfo">
          <Row :gutter="16">
            <Col span="24">
              <Form-item label="选择存储盒" :label-width="100" >
                <Select  v-model="storeQuery.potCode" @on-change="potChange($event)" placeholder="请选择存储罐" style="width:120px" clearable>
                  <Option v-for="item in potList" :key="item.potCode" :value="item.potCode" >{{item.potCode}}</Option>
                </Select> 罐
                <Select v-model="storeQuery.regionCode" @on-change="regionChange($event)" placeholder="请选择区" style="width:120px;margin-left:10px;"  clearable>
                  <Option v-for="item in regionList" :key="item.regionCode" :value="item.regionCode" >{{item.regionCode}}</Option>
                </Select> 区
                <Select v-model="storeQuery.towerCode" @on-change="towerChange($event)" placeholder="请选择塔" style="width:120px;margin-left:10px;"  clearable>
                  <Option v-for="item in towerList" :key="item.towerCode" :value="item.towerCode" >{{item.towerCode}}</Option>
                </Select> 塔
                <Select v-model="storeQuery.boxCode" @on-change="boxChange($event)" placeholder="请选择盒" style="width:120px;margin-left:10px;"  clearable>
                  <Option v-for="item in boxList" :key="item.boxCode" :value="item.boxCode" >{{item.boxCode}}</Option>
                </Select> 盒
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="格数量" :label-width="100" >
                <span>{{cellLocations.length}}/{{cellCulture.cellQuantity ? cellCulture.cellQuantity : 0}}</span><Button @click="orderSelect" type="success" style="margin-left:10px;">顺序选号</Button> <Button @click="deleteSelect" type="success" style="margin-left:10px;">取消选择</Button>
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="管编号" :label-width="100" style="margin-bottom:0px;">
                <div style="clear:both;position:relative;top:-28px;" v-if="boxInfo.box">
                  <div v-if="boxInfo.box" v-for="row in boxInfo.box.boxRowNum" :key="row">
                    <div v-if="boxInfo.box" v-for="col in boxInfo.box.boxColumnNum" :key="col" class="seat">
                      <div
                        v-if="boxInfo.box"
                        class="inner-seat"
                        @click="handleChooseLocation((row-1)*boxInfo.box.boxColumnNum + col)"
                        :class="checkLocationStatus((row-1)*boxInfo.box.boxColumnNum + col) === 2?'bought-seat':(checkLocationStatus((row-1)*boxInfo.box.boxColumnNum + col) === 1?'selected-seat':'unselected-seat')">
                        {{(row-1)*boxInfo.box.boxColumnNum + col}}
                      </div>
                    </div>
                    <div style="clear:both;"></div>
                  </div>
                </div>
                <!-- <div class="alert-item"> -->
                  <Tag type="dot" closable color="success" @on-close="cellLocationsSelectClose(item.latticeNum)" v-for="item in cellLocations" :key="'new' + item.latticeNum">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Tag>
                  <!-- <Alert closable @on-close="cellLocationsSelectClose(item.latticeNum)" v-for="item in cellLocations" :key="'new' + item.latticeNum">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Alert> -->
                <!-- </div> -->
              </Form-item>
            </Col>
          </Row>
        </Form>
      </div>
      <!-- <div slot="footer">
        <Button type="text" size="large" @click="showRejectModal=false">取消</Button>
        <Button type="primary" size="large" @click="doSomething">确定</Button>
      </div> -->
    </Modal>

    <!-- 血清冰箱存储位置选择弹出层 -->
    <Modal
      v-model="serumStoreModalVisible"
      title="分派血清存储位置"
      :loading="serumStoreModalLoading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="serumStoreModalOk"
      :scrollable="true"
      width="780">
      <!-- 838 -->
      <div style="height:519px; overflow-x:hidden; overflow-y:auto;">
        <Form ref="serumLocationsForm" :model="rackInfo">
          <Row :gutter="16">
            <Col span="24">
              <Form-item label="选择存储位置" :label-width="100" >
                <Select v-if="false" v-model="serumLocationAdd.storageType" @on-change="serumStorageTypeChange($event)" placeholder="请选择存储设备" style="width:130px" clearable>
                  <Option :value="1">液氮罐</Option>
                  <Option :value="2">-80℃冰箱</Option>
                </Select>
                <span v-if="serumLocationAdd.storageType === 2">
                  <Select  v-model="serumStoreQuery.fridgeCode" @on-change="fridgeChange($event)" placeholder="请选择冰箱" style="width:120px; margin-left:10px;" clearable>
                    <Option v-for="item in fridgeList" :key="item.fridgeCode" :value="item.fridgeCode" >{{item.fridgeCode}}</Option>
                  </Select> 冰箱
                  <Select v-model="serumStoreQuery.layerCode" @on-change="layerChange($event)" placeholder="请选择层" style="width:120px; margin-left:10px;" clearable>
                    <Option v-for="item in layerList" :key="item.layerCode" :value="item.layerCode" >{{item.layerCode}}</Option>
                  </Select> 层
                  <Select v-model="serumStoreQuery.rackCode" @on-change="rackChange($event)" placeholder="请选择试管架" style="width:120px; margin-left:10px;" clearable>
                    <Option v-for="item in rackList" :key="item.rackCode" :value="item.rackCode" >{{item.rackCode}}</Option>
                  </Select> 试管架
                </span>
                <span v-else-if="serumLocationAdd.storageType === 1">
                  <Select  v-model="serumPotStoreQuery.potCode" @on-change="serumPotChange($event)" placeholder="请选择存储罐" style="width:120px; margin-left:10px;" clearable>
                    <Option v-for="item in serumPotList" :key="item.potCode" :value="item.potCode" >{{item.potCode}}</Option>
                  </Select> 罐
                  <Select v-model="serumPotStoreQuery.regionCode" @on-change="serumRegionChange($event)" placeholder="请选择区" style="width:100px; margin-left:10px;" clearable>
                    <Option v-for="item in serumRegionList" :key="item.regionCode" :value="item.regionCode" >{{item.regionCode}}</Option>
                  </Select> 区
                  <Select v-model="serumPotStoreQuery.towerCode" @on-change="serumTowerChange($event)" placeholder="请选择塔" style="width:100px; margin-left:10px;" clearable>
                    <Option v-for="item in serumTowerList" :key="item.towerCode" :value="item.towerCode" >{{item.towerCode}}</Option>
                  </Select> 塔
                  <Select v-model="serumPotStoreQuery.boxCode" @on-change="serumBoxChange($event)" placeholder="请选择盒" style="width:100px; margin-left:10px;" clearable>
                    <Option v-for="item in serumBoxList" :key="item.boxCode" :value="item.boxCode" >{{item.boxCode}}</Option>
                  </Select> 盒
                </span>
              </Form-item>
            </Col>
          </Row>
          <!--- 血清存入冰箱 --->
          <Row v-if="serumLocationAdd.storageType === 2">
            <Col span="24">
              <Form-item label="格数量" :label-width="100" >
                <span>{{serumLocationAdd.serumLocations.length}}/{{cellCulture.serumQuantity ? cellCulture.serumQuantity : 0}}</span><Button @click="serumFridgeOrderSelect" type="success" style="margin-left:10px;">顺序选号</Button> <Button @click="serumFridgeDeleteSelect" type="success" style="margin-left:10px;">取消选择</Button>
              </Form-item>
            </Col>
          </Row>
          <Row v-if="serumLocationAdd.storageType === 2">
            <Col span="24">
              <Form-item label="管编号" :label-width="100" style="margin-bottom:0px;">
                <div style="clear:both;position:relative;top:-28px;" v-if="rackInfo.rack">
                  <div v-if="rackInfo.rack" v-for="row in rackInfo.rack.rackRowNum" :key="row">
                    <div v-if="rackInfo.rack" v-for="col in rackInfo.rack.rackColumnNum" :key="col" class="seat">
                      <div
                        v-if="rackInfo.rack"
                        class="inner-seat"
                        @click="handleSerumFridgeChooseLocation((row-1)*rackInfo.rack.rackColumnNum + col)"
                        :class="checkSerumFridgeLocationStatus((row-1)*rackInfo.rack.rackColumnNum + col) === 2?'bought-seat':(checkSerumFridgeLocationStatus((row-1)*rackInfo.rack.rackColumnNum + col) === 1?'selected-seat':'unselected-seat')">
                        {{(row-1)*rackInfo.rack.rackColumnNum + col}}
                      </div>
                    </div>
                    <div style="clear:both;"></div>
                  </div>
                </div>
                <Tag type="dot" closable color="success" @on-close="serumFridgeCellLocationsSelectClose(item.cuvetteNum)" v-for="item in serumLocationAdd.serumLocations" :key="'new' + item.cuvetteNum">{{item.fridgeCode +' 冰箱-'+ item.layerCode +' 层-'+ item.rackCode +' 试管架-第 '+ item.cuvetteNum +' 号管'}}</Tag>
              </Form-item>
            </Col>
          </Row>
          <!--- 血清存入液氮罐 --->
          <Row v-if="serumLocationAdd.storageType === 1">
            <Col span="24">
              <Form-item label="格数量" :label-width="100" >
                <span>{{serumLocationAdd.cellLocations.length}}/{{cellCulture.serumQuantity ? cellCulture.serumQuantity : 0}}</span><Button @click="serumPotOrderSelect" type="success" style="margin-left:10px;">顺序选号</Button> <Button @click="serumPotDeleteSelect" type="success" style="margin-left:10px;">取消选择</Button>
              </Form-item>
            </Col>
          </Row>
          <Row v-if="serumLocationAdd.storageType === 1">
            <Col span="24">
              <Form-item label="管编号" :label-width="100" style="margin-bottom:0px;">
                <div style="clear:both;position:relative;top:-28px;" v-if="serumBoxInfo.box">
                  <div v-if="serumBoxInfo.box" v-for="row in serumBoxInfo.box.boxRowNum" :key="row">
                    <div v-if="serumBoxInfo.box" v-for="col in serumBoxInfo.box.boxColumnNum" :key="col" class="seat">
                      <div
                        v-if="serumBoxInfo.box"
                        class="inner-seat"
                        @click="handleSerumPotChooseLocation((row-1)*serumBoxInfo.box.boxColumnNum + col)"
                        :class="checkSerumPotLocationStatus((row-1)*serumBoxInfo.box.boxColumnNum + col) === 2?'bought-seat':(checkSerumPotLocationStatus((row-1)*serumBoxInfo.box.boxColumnNum + col) === 1?'selected-seat':'unselected-seat')">
                        {{(row-1)*serumBoxInfo.box.boxColumnNum + col}}
                      </div>
                    </div>
                    <div style="clear:both;"></div>
                  </div>
                </div>
                <Tag type="dot" closable color="success" @on-close="serumPotCellLocationsSelectClose(item.latticeNum)" v-for="item in cellLocations" :key="'new' + item.latticeNum">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Tag>
              </Form-item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>

    <!-- 检测样品存储位置选择弹出层 -->
    <Modal
      v-model="testCellStoreModalVisible"
      title="分派检测样品存储位置"
      :loading="testCellStoreModalLoading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="968">
      <Form ref="testCellLocationsForm" :model="testCellPotStoreQuery">
        <Row :gutter="16">
          <Col span="24">
            <Form-item label="选择存储位置" :label-width="100" >
              <Select  v-model="testCellPotStoreQuery.potCode" @on-change="testCellPotChange($event)" placeholder="请选择存储罐" style="width:120px; margin-left:10px;" clearable>
                <Option v-for="item in testCellPotList" :key="item.potCode" :value="item.potCode" >{{item.potCode}}</Option>
              </Select> 罐
              <Select v-model="testCellPotStoreQuery.regionCode" @on-change="testCellRegionChange($event)" placeholder="请选择区" style="width:120px; margin-left:10px;" clearable>
                <Option v-for="item in testCellRegionList" :key="item.regionCode" :value="item.regionCode" >{{item.regionCode}}</Option>
              </Select> 区
              <Select v-model="testCellPotStoreQuery.towerCode" @on-change="testCellTowerChange($event)" placeholder="请选择塔" style="width:120px; margin-left:10px;" clearable>
                <Option v-for="item in testCellTowerList" :key="item.towerCode" :value="item.towerCode" >{{item.towerCode}}</Option>
              </Select> 塔
              <Select v-model="testCellPotStoreQuery.boxCode" @on-change="testCellBoxChange($event)" placeholder="请选择盒" style="width:120px; margin-left:10px;" clearable>
                <Option v-for="item in testCellBoxList" :key="item.boxCode" :value="item.boxCode" >{{item.boxCode}}</Option>
              </Select> 盒
              <Select v-model="testCellPotStoreQuery.latticeNum" @on-change="testCellLatticeChange($event)" placeholder="请选择位置" style="width:120px; margin-left:10px;" clearable>
                <Option v-for="item in testCellLatticeList" :key="item.latticeNum" :value="item.latticeNum" :disabled="item.disabled">{{item.latticeNum}}</Option>
              </Select> 号
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './storeAdd.less'
import { getUserInfo, getQualityUserList } from '@/api/user'
import { getToken } from '@/libs/util'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getStoreAddView, addStore } from '@/api/cellCulture.js'
import { getStorePot, getPublicStorePot, getRegionByPotCode, getTowerOfRegion, getBoxOfTower, getBoxInfo } from '@/api/box.js'
import { getFridgeList, getLayerByFridgeCode, getRackOfLayer, getRackInfo } from '@/api/rack.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
import { caculateLocation, fridgeCaculateLocation } from '@/libs/cell.js'
export default {
  name: 'storeAdd',
  data() {
    const validateCellLocations = (rule, value, callback) => {
      if (!this.cellLocations || this.cellLocations.length < this.cellCulture.cellQuantity) {
        callback(new Error('还有细胞未分配存储位置'))
      } else if (this.cellLocations.length > 0 && this.cellLocations[this.cellLocations.length - 1].latticeNum - this.cellLocations[0].latticeNum !== this.cellLocations.length - 1) {
        callback(new Error('细胞存储位置不连续'))
      } else {
        callback()
      }
    }
    // 制备类型血清入库, 需要在入库的时候同样入库
    const validateSerumLocationAdd = (rule, value, callback) => {
      let storeType = this.serumLocationAdd.storageType
      let storeCount = this.cellCulture.serumQuantity
      if (this.cellCulture && storeCount) {
        if (!this.serumLocationAdd || !storeType) {
          callback(new Error('还有血清未分配存储位置'))
          return
        }
        if (storeType === 1 && (!this.serumLocationAdd.cellLocations || this.serumLocationAdd.cellLocations.length < storeCount)) {
          callback(new Error('还有血清未分配存储位置'))
          return
        }
        if (storeType === 2 && (!this.serumLocationAdd.serumLocations || this.serumLocationAdd.serumLocations.length < storeCount)) {
          callback(new Error('还有血清未分配存储位置'))
          return
        }
        if (storeType === 1 && this.serumLocationAdd.cellLocations[this.serumLocationAdd.cellLocations.length - 1].latticeNum - this.serumLocationAdd.cellLocations[0].latticeNum !== this.serumLocationAdd.cellLocations.length - 1) {
          callback(new Error('血清存储位置不连续'))
          return
        }
        if (storeType === 2 && this.serumLocationAdd.serumLocations[this.serumLocationAdd.serumLocations.length - 1].cuvetteNum - this.serumLocationAdd.serumLocations[0].cuvetteNum !== this.serumLocationAdd.serumLocations.length - 1) {
          callback(new Error('血清存储位置不连续'))
          return
        }
      }
      callback()
    }
    const validateStoreRemark = (rule, value, callback) => {
      if (this.store.reviewRes === 0 && !value) {
        callback(new Error('请输入入库备注'))
      } else {
        callback()
      }
    }
    const validateStorageReleaseRecordFile = (rule, value, callback) => {
      if (!this.$refs.upload.fileList || this.$refs.upload.fileList.length <= 0) {
        callback(new Error('请上传入库放行记录'))
      } else {
        callback()
      }
    }

    return {
      // 细胞培养id
      cellCultureId: '',
      registerFormLoading: true,
      projectTypeList: [],
      sampleTypeList: [],
      // 样本信息
      sample: {},
      // 客户信息
      customer: {},
      // 已填写的细胞信息
      cellCulture: {},
      // 质检信息
      qualityCheck: {},
      // 质检报告文件列表
      qualityCheckReportFile: [],
      // 质检用户列表
      qualityUserList: [],
      // 待提交的细胞存储信息
      store: {
        storeTime: new Date(),
        reviewTime: new Date(),
        qaUserName: '',
        qaUserId: '',
        storeUserId: '',
        storeUserName: ''
      },
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { 'Authorization': getToken() },
      rules: {
        storeTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        reviewRes: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        // 入库放行不通过需要填写入库备注
        storeRemark: [
          { validator: validateStoreRemark, trigger: 'change' }
        ],
        qaUserId: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        reviewTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        storeYear: [
          // { type: 'number', required: true, message: '请输入数字', trigger: 'change' }
          { type: 'string', required: true, pattern: /^[0-9]*[1-9][0-9]*$/, message: '存储年限必须为正整数', trigger: 'change' }
        ],
        storageReleaseRecordFile: [
          { validator: validateStorageReleaseRecordFile, trigger: 'change' }
        ],
        cellLocations: [
          { validator: validateCellLocations, trigger: 'change' }
        ],
        serumLocationAdd: [
          { validator: validateSerumLocationAdd, trigger: 'change' }
        ]
      },
      // 存储弹出框是否显示
      storeModalVisible: false,
      storeModalLoading: true,
      // 罐下拉框
      potList: [],
      // 区下拉框信息,
      regionList: [],
      // 塔下拉框信息
      towerList: [],
      // 盒下拉框信息
      boxList: [],
      // 选中的盒子信息
      boxInfo: {},
      // 选中的细胞存储位置
      cellLocations: [],
      // 存储时罐,区,塔,层盒 查询条件
      storeQuery: {
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: ''
      },
      // 血清新增对象
      serumLocationAdd: {
        // 存储工具类型(1: 存储罐, 2 :冰箱)
        storageType: 2,
        // 血清冰箱存储位置, 当为冰箱存储时, 当前对象有值
        serumLocations: [],
        // 血清存储罐存储位置, 当为存储罐存储时, 当前对象必须有值
        cellLocations: []
      },
      // 存储弹出框是否显示
      serumStoreModalVisible: false,
      serumStoreModalLoading: true,
      // 冰箱下拉框
      fridgeList: [],
      // 层下拉框信息,
      layerList: [],
      // 试管架下拉框信息
      rackList: [],
      // 试管下拉框信息
      cuvetteList: [],
      // 选中的试管架信息
      rackInfo: {},
      // 存储时冰箱,层,试管架 查询条件
      serumStoreQuery: {
        fridgeCode: '',
        layerCode: '',
        rackCode: '',
        cuvetteNum: ''
      },
      // 血清存储罐下拉框
      serumPotList: [],
      // 血清存储区下拉框信息,
      serumRegionList: [],
      // 血清存储塔下拉框信息
      serumTowerList: [],
      // 血清存储盒下拉框信息
      serumBoxList: [],
      // 血清存储选中的盒子信息
      serumBoxInfo: {},
      // 血清存储盒子中位置列表
      serumLatticeList: [],
      // 血清存储存储时罐,区,塔,层盒 查询条件
      serumPotStoreQuery: {
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: '',
        latticeNum: ''
      },
      // 检测样品存储位置的罐选择搜索下拉框数据
      // 存储弹出框是否显示
      testCellStoreModalVisible: false,
      testCellStoreModalLoading: true,
      // 检测样品存储罐下拉框
      testCellPotList: [],
      // 检测样品存储区下拉框信息,
      testCellRegionList: [],
      // 检测样品存储塔下拉框信息
      testCellTowerList: [],
      // 检测样品存储盒下拉框信息
      testCellBoxList: [],
      // 检测样品存储选中的盒子信息
      testCellBoxInfo: {},
      // 检测样品存储盒子中位置列表
      testCellLatticeList: [],
      // 选中的测试样本细胞存储位置
      testCellLocation: null,
      // 检测样品存储存储时罐,区,塔,层盒 查询条件
      testCellPotStoreQuery: {
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: '',
        latticeNum: ''
      }
    }
  },
  mounted() {
    // 细胞培养接收人
    this.getUserInfo()
    // 样本,顾客,已填写细胞信息
    this.getStoreAddView(this.$route.query.cellCultureId)
    // 初始化样本类型数据
    this.getSampleTypeList()
    // 获取角色为“质检”的用户
    this.getQualityUserList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 根据细胞位置集合, 计算细胞位置所在位置文本
    caculateLocation(cellLocations) {
      return caculateLocation(cellLocations)
    },
    fridgeCaculateLocation(cellLocations) {
      return fridgeCaculateLocation(cellLocations)
    },
    handleBeforeUpload(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      const arr = ['png', 'jpg', 'jpeg', 'pdf']
      if (!arr.includes(fileExt)) {
        this.$Notice.warning({
          title: '文件类型错误', // .pdf, .doc, .docx, .xls, .xlsx
          desc: '文件：' + file.name + '不是' + arr.join('，') + '文件，请选择允许的文件类型进行上传。'
        })
        return false
      }
      return true
    },
    handleMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    handleUploadPreview(file) {
      window.open(file.mediaPath)
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$Message.error(res.msg)
        // 移除api端发生错误时的文件
        if (fileList && fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            let curFile = fileList[i]
            if (file.uid === curFile.uid) {
              fileList.splice(i, 1)
              return
            }
          }
        }
        return
      }
      file.id = res.data.id
      file.mediaPath = res.data.mediaPath
      if (fileList && fileList.length > 0) {
        let start = 0
        for (let i = 0; i < fileList.length; i++) {
          let curFile = fileList[i]
          if (res.data.id === curFile.id) {
            start++
            if (start === 2) {
              this.$Message.error('该文件已在文件列表')
              fileList.splice(i, 1)
              return
            }
          }
        }
      }
    },
    // 获取细胞接收人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.store.storeUserName = res.data.realName
        this.store.storeUserId = res.data.id
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取角色为“质检”的用户
    getQualityUserList() {
      getQualityUserList().then(res => {
        this.qualityUserList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    qaChange(value) {
      let items = this.qualityUserList.filter(m => m.id === value)
      if (items != null && items.length > 0) {
        this.storeUserName = items[0].realName
      }
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getStoreAddView(cellCultureId) {
      getStoreAddView(cellCultureId).then(res => {
        // 加载项目类型下拉
        // this.changeSampleType(res.data.sample.sampleType)
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          this.projectTypeList = res.data
        }).then(() => {
          // 样本信息
          this.sample = res.data.sample
          this.sample.age = getAge(res.data.customer.birthday)
          // 顾客信息
          this.customer = res.data.customer
          // 已填写的细胞信息
          this.cellCulture = res.data.cellCulture
          // this.cellCulture.cellQuantity = this.cellCulture.cellQuantity || 0
          // this.cellCulture.serumQuantity = this.cellCulture.serumQuantity || 0
          // 质检信息
          this.qualityCheck = res.data.qualityCheck
          // 质检报告文件列表
          this.qualityCheckReportFile = res.data.qualityCheckReportFile

          // 给新增的细胞存储信息赋值细胞信息id
          this.store.cellCultureId = res.data.cellCulture.id

          this.cellCulture.cellTotal = num2e(this.cellCulture.cellTotal)
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 从后台获取样本类型数据
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // // 切换样本类型时修改项目类型下拉数据
    // changeSampleType(sampleType) {
    //   getProjectTypeBySampleType(sampleType).then(res => {
    //     this.projectTypeList = res.data
    //   }).catch(error => {
    //     this.$Message.error(error.msg)
    //   })
    // },
    // 打开弹出层,细胞存储位置选取
    openChoiceStoreModal() {
      this.storeModalVisible = true
      this.getStorePot()
    },
    // 获取存储罐列表数据
    getStorePot() {
      // this.storeModalLoading = true
      getStorePot(!this.qualityCheck.isPositiveSample ? 1 : 2).then(res => {
        this.potList = res.data
        // this.storeModalLoading = false
      })
    },
    // 切换存储罐下拉框
    potChange(potCode) {
      // 清空数据
      this.storeQuery.potCode = potCode
      this.storeQuery.regionCode = ''
      this.regionList = []
      this.storeQuery.towerCode = ''
      this.towerList = []
      this.storeQuery.boxCode = ''
      this.boxList = []
      this.boxInfo = {}
      this.cellLocations = []
      // 如果为清空值, 则不查询
      if (!potCode) {
        return
      }
      getRegionByPotCode(this.storeQuery).then(res => {
        this.regionList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换区下拉框
    regionChange(regionCode) {
      // 清空数据
      this.storeQuery.regionCode = regionCode
      this.storeQuery.towerCode = ''
      this.towerList = []
      this.storeQuery.boxCode = ''
      this.boxList = []
      this.boxInfo = {}
      this.cellLocations = []
      if (!regionCode) {
        return
      }
      getTowerOfRegion(this.storeQuery).then(res => {
        this.towerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换塔下拉框
    towerChange(towerCode) {
      // 清空数据
      this.storeQuery.towerCode = towerCode
      this.storeQuery.boxCode = ''
      this.boxList = []
      this.boxInfo = {}
      this.cellLocations = []
      if (!towerCode) {
        return
      }
      getBoxOfTower(this.storeQuery).then(res => {
        this.boxList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换盒子下拉框
    boxChange(boxCode) {
      // 清空数据
      this.storeQuery.boxCode = boxCode
      this.boxInfo = {}
      this.cellLocations = []
      if (!boxCode) {
        return
      }
      getBoxInfo(this.storeQuery).then(res => {
        this.boxInfo = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    cellLocationsSelectClose(latticeNum) {
      this.cellLocations = this.cellLocations.filter(item => item.latticeNum !== latticeNum)
    },
    // 判断单元格的颜色
    checkLocationStatus(num) {
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 判断该位置是否可选
        if (this.boxInfo.usedLattices.filter(item => item.latticeNum === num).length > 0) {
          return 2
        }
      }
      if (this.cellLocations && this.cellLocations.length > 0) {
        if (this.cellLocations.filter(item => item.latticeNum === num).length > 0) {
          return 1
        }
      }
      return 0
    },
    // 选中
    handleChooseLocation(num) {
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 判断该位置是否可选, 不可选择直接返回
        if (this.boxInfo.usedLattices.filter(item => item.latticeNum === num).length > 0) {
          return
        }
      }
      // 已选中则取消选择
      if (this.cellLocations && this.cellLocations.length > 0) {
        if (this.cellLocations.filter(item => item.latticeNum === num).length > 0) {
          this.cellLocations.splice(this.cellLocations.findIndex(item => item.latticeNum === num), 1)
          return 1
        }
      }
      // 未选中则选中
      if (this.cellLocations && this.cellLocations.length >= this.cellCulture.cellQuantity) {
        this.$Message.error('存储位置已经选完')
        return
      }
      this.cellLocations.push({
        'potCode': this.storeQuery.potCode,
        'regionCode': this.storeQuery.regionCode,
        'towerCode': this.storeQuery.towerCode,
        'boxCode': this.storeQuery.boxCode,
        'latticeNum': num
      })
      // 排序
      this.cellLocations = this.cellLocations.sort((l1, l2) => l1.latticeNum - l2.latticeNum)
    },
    // 顺序选号
    orderSelect() {
      if (!this.boxInfo || !this.boxInfo.box) {
        this.$Message.error('请先选择存储盒')
        return
      }
      // 要存储的数量
      let storeCount = this.cellCulture.cellQuantity
      let startIndex = 0
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 对已经被选中的位置数组按从小到大排序
        this.boxInfo.usedLattices = this.boxInfo.usedLattices.sort((l1, l2) => l1.latticeNum - l2.latticeNum)
        // 依次判断可选择位置
        for (let i = 0; i < this.boxInfo.usedLattices.length; i++) {
          let lattice = this.boxInfo.usedLattices[i]
          if (i === 0) {
            if (lattice.latticeNum - 1 >= storeCount) {
              startIndex = 1
              break
            }
          }
          if (i === this.boxInfo.usedLattices.length - 1) {
            if (this.boxInfo.box.latticeNum - lattice.latticeNum >= storeCount) {
              startIndex = lattice.latticeNum + 1
              break
            }
          }
          if (i !== 0 && i !== this.boxInfo.usedLattices.length - 1) {
            let beforLattice = this.boxInfo.usedLattices[i - 1]
            if (lattice.latticeNum - beforLattice.latticeNum > storeCount) {
              startIndex = beforLattice.latticeNum + 1
              break
            }
          }
        }
      } else {
        if (this.boxInfo.box.latticeNum >= storeCount) {
          startIndex = 1
        }
      }
      if (!startIndex) {
        this.$Message.error('没有合适的空余位置')
        return
      }
      this.cellLocations = []
      for (let i = 0; i < storeCount; i++) {
        this.cellLocations.push({
          'potCode': this.storeQuery.potCode,
          'regionCode': this.storeQuery.regionCode,
          'towerCode': this.storeQuery.towerCode,
          'boxCode': this.storeQuery.boxCode,
          'latticeNum': startIndex + i
        })
      }
    },
    deleteSelect() {
      this.cellLocations = []
    },
    // -------------------------------------------
    // 在modal验证罐存储位置是否够及是否连续
    storeModalOk() {
      if (!this.cellLocations || this.cellLocations.length < this.cellCulture.cellQuantity) {
        this.$Message.error('还有细胞未分配存储位置')
        return this.changeStoreModalLoading()
      } else if (this.cellLocations.length > 1 && this.cellLocations[this.cellLocations.length - 1].latticeNum - this.cellLocations[0].latticeNum !== this.cellLocations.length - 1) {
        this.$Message.error('细胞存储位置不连续')
        return this.changeStoreModalLoading()
      }
      // validateField
      this.$refs['storeAddForm'].validateField('cellLocations')
      this.storeModalVisible = false
    },
    changeStoreModalLoading() {
      this.storeModalLoading = false
      this.$nextTick(() => {
        this.storeModalLoading = true
      })
    },
    // -------------------------------------------
    // 血清的相关操作------------------------------------------
    serumStorageTypeChange(storageType) {
      this.serumLocationAdd.storageType = storageType
      this.serumLocationAdd.serumLocations = []
      this.serumLocationAdd.cellLocations = []
      // 清空所有下拉框数据和搜索条件
      // 冰箱相关
      this.serumStoreQuery = {}
      this.fridgeList = []
      this.layerList = []
      this.rackList = []
      this.rackInfo = {}
      this.cuvetteList = []
      // 液氮罐相关
      this.serumPotStoreQuery = {}
      this.serumPotList = []
      this.serumRegionList = []
      this.serumTowerList = []
      this.serumBoxList = []
      this.serumBoxInfo = {}
      this.serumLatticeList = []
      // 选择存储类型
      if (storageType === 1) {
        getStorePot(!this.qualityCheck.isPositiveSample ? 1 : 2).then(res => {
          this.serumPotList = res.data
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      } else if (storageType === 2) {
        this.getFridgeList()
      }
    },
    // 打开血清存储位置选取弹出层
    openChoiceSerumStoreModal() {
      this.serumStoreModalVisible = true
      this.getFridgeList()
    },
    openChoiceTestCellStoreModal() {
      this.testCellStoreModalVisible = true
      this.testCellStoreModalLoading = true
      getPublicStorePot(!this.qualityCheck.isPositiveSample ? 1 : 2).then(res => {
        this.testCellPotList = res.data
        this.testCellStoreModalLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取所有的冰箱列表
    getFridgeList() {
      // this.serumStoreModalLoading = true
      getFridgeList(this.serumStoreQuery).then(res => {
        this.fridgeList = res.data
        // this.serumStoreModalLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换冰箱下拉框
    fridgeChange(fridgeCode) {
      // 清空数据
      this.serumStoreQuery.fridgeCode = fridgeCode
      this.serumStoreQuery.layerCode = ''
      this.layerList = []
      this.serumStoreQuery.rackCode = ''
      this.rackList = []
      this.serumStoreQuery.cuvetteNum = ''
      this.rackInfo = {}
      this.cuvetteList = []
      this.serumLocationAdd.serumLocations = []
      // 如果为清空值, 则不查询
      if (!fridgeCode) {
        return
      }
      getLayerByFridgeCode(this.serumStoreQuery).then(res => {
        this.layerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换冰箱层下拉框
    layerChange(layerCode) {
      // 清空数据
      this.serumStoreQuery.layerCode = layerCode
      this.serumStoreQuery.rackCode = ''
      this.rackList = []
      this.serumStoreQuery.cuvetteNum = ''
      this.rackInfo = {}
      this.cuvetteList = []
      this.serumLocationAdd.serumLocations = []
      if (!layerCode) {
        return
      }
      getRackOfLayer(this.serumStoreQuery).then(res => {
        this.rackList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换试管架下拉框
    rackChange(rackCode) {
      // 清空数据
      this.serumStoreQuery.rackCode = rackCode
      this.serumStoreQuery.cuvetteNum = ''
      this.rackInfo = {}
      this.cuvetteList = []
      this.serumLocationAdd.serumLocations = []
      if (!rackCode) {
        return
      }
      getRackInfo(this.serumStoreQuery).then(res => {
        this.rackInfo = res.data
        this.cuvetteList = []
        for (let i = 1; i <= this.rackInfo.rack.cuvetteNum; i++) {
          let cuvetteObj = {
            'cuvetteNum': i,
            'disabled': false
          }
          if (this.rackInfo.usedCuvettes && this.rackInfo.usedCuvettes.length > 0) {
            for (let j = 0; j < this.rackInfo.usedCuvettes.length; j++) {
              let usedCuvette = this.rackInfo.usedCuvettes[j]
              if (usedCuvette.cuvetteNum === i) {
                cuvetteObj.disabled = true
              }
            }
          }
          this.cuvetteList.push(cuvetteObj)
        }
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 判断血清存入冰箱的单元格的颜色
    checkSerumFridgeLocationStatus(num) {
      if (this.rackInfo && this.rackInfo.usedCuvettes && this.rackInfo.usedCuvettes.length > 0) {
        // 判断该位置是否可选
        if (this.rackInfo.usedCuvettes.filter(item => item.cuvetteNum === num).length > 0) {
          return 2
        }
      }
      if (this.serumLocationAdd.serumLocations && this.serumLocationAdd.serumLocations.length > 0) {
        if (this.serumLocationAdd.serumLocations.filter(item => item.cuvetteNum === num).length > 0) {
          return 1
        }
      }
      return 0
    },
    // 选中
    handleSerumFridgeChooseLocation(num) {
      if (this.rackInfo && this.rackInfo.usedCuvettes && this.rackInfo.usedCuvettes.length > 0) {
        // 判断该位置是否可选, 不可选择直接返回
        if (this.rackInfo.usedCuvettes.filter(item => item.cuvetteNum === num).length > 0) {
          return
        }
      }
      // 已选中则取消选择
      if (this.serumLocationAdd.serumLocations && this.serumLocationAdd.serumLocations.length > 0) {
        if (this.serumLocationAdd.serumLocations.filter(item => item.cuvetteNum === num).length > 0) {
          this.serumLocationAdd.serumLocations.splice(this.serumLocationAdd.serumLocations.findIndex(item => item.cuvetteNum === num), 1)
          return
        }
      }
      // 未选中则选中
      if (this.serumLocationAdd.serumLocations && this.serumLocationAdd.serumLocations.length >= this.cellCulture.serumQuantity) {
        this.$Message.error('存储位置已经选完')
        return
      }
      this.serumLocationAdd.serumLocations.push({
        'fridgeCode': this.serumStoreQuery.fridgeCode,
        'layerCode': this.serumStoreQuery.layerCode,
        'rackCode': this.serumStoreQuery.rackCode,
        'cuvetteNum': num
      })
      // 排序
      this.serumLocationAdd.serumLocations = this.serumLocationAdd.serumLocations.sort((l1, l2) => l1.cuvetteNum - l2.cuvetteNum)
    },
    // 移除已选血清冰箱位置
    serumFridgeCellLocationsSelectClose(cuvetteNum) {
      this.serumLocationAdd.serumLocations = this.serumLocationAdd.serumLocations.filter(item => item.cuvetteNum !== cuvetteNum)
    },
    // 血清入库冰箱顺序选号
    serumFridgeOrderSelect() {
      if (!this.rackInfo || !this.rackInfo.rack) {
        this.$Message.error('请先选择试管架')
        return
      }
      // 要存储的数量
      let storeCount = this.cellCulture.serumQuantity
      // 存储的起始位置
      let startIndex = 0
      // 如果盒子里有被占用的位置
      if (this.rackInfo && this.rackInfo.usedCuvettes && this.rackInfo.usedCuvettes.length > 0) {
        // 对已经被选中的位置数组按从小到大排序
        this.rackInfo.usedCuvettes = this.rackInfo.usedCuvettes.sort((l1, l2) => l1.cuvetteNum - l2.cuvetteNum)
        // 依次判断可选择位置
        for (let i = 0; i < this.rackInfo.usedCuvettes.length; i++) {
          let cuvette = this.rackInfo.usedCuvettes[i]
          // 当第一个被占用位置的管号大于要存储数量时,表示从第一个位置开始放
          if (i === 0) {
            if (cuvette.cuvetteNum - 1 >= storeCount) {
              startIndex = 1
              break
            }
          }
          // 当最后一个被占用位置时, 最后连续的位置大于要存储的管数
          if (i === this.rackInfo.usedCuvettes.length - 1) {
            if (this.rackInfo.rack.cuvetteNum - cuvette.cuvetteNum >= storeCount) {
              startIndex = cuvette.cuvetteNum + 1
              break
            }
          }
          // 当为中间某个被占用位置时
          if (i !== 0 && i !== this.rackInfo.usedCuvettes - 1) {
            // 前一个被占用的位置
            let beforCuvette = this.rackInfo.usedCuvettes[i - 1]
            // 上一个被占用位置号到当前被占用位置号中间空余位置刚好够放要存储
            if (cuvette.cuvetteNum - beforCuvette.cuvetteNum > storeCount) {
              startIndex = beforCuvette.cuvetteNum + 1
              break
            }
          }
        }
      } else {
        // 当前盒子没有一个被占用的位置时,只需要判断盒子的容量可以放下要存储的管数即可
        if (this.rackInfo.rack.cuvetteNum >= storeCount) {
          startIndex = 1
        }
      }
      // 如果startIndex为0,则没有找到合适的空余位置
      if (!startIndex) {
        this.$Message.error('没有合适的空余位置')
        return
      }
      // 构建要存入的位置信息
      this.serumLocationAdd.serumLocations = []
      for (let i = 0; i < storeCount; i++) {
        this.serumLocationAdd.serumLocations.push({
          'fridgeCode': this.serumStoreQuery.fridgeCode,
          'layerCode': this.serumStoreQuery.layerCode,
          'rackCode': this.serumStoreQuery.rackCode,
          'cuvetteNum': startIndex + i
        })
      }
    },
    // 血清入库冰箱取消选择
    serumFridgeDeleteSelect() {
      this.serumLocationAdd.serumLocations = []
    },
    // 血清存储位置选择弹出框点击确认
    serumStoreModalOk() {
      let storeType = this.serumLocationAdd.storageType
      let storeCount = this.cellCulture.serumQuantity
      if (this.cellCulture && storeCount) {
        if (!this.serumLocationAdd || !storeType) {
          this.$Message.error('还有血清未分配存储位置')
          return this.changeSerumStoreModalLoading()
        }
        if (storeType === 1 && (!this.serumLocationAdd.cellLocations || this.serumLocationAdd.cellLocations.length < storeCount)) {
          this.$Message.error('还有血清未分配存储位置')
          return this.changeSerumStoreModalLoading()
        }
        if (storeType === 2 && (!this.serumLocationAdd.serumLocations || this.serumLocationAdd.serumLocations.length < storeCount)) {
          this.$Message.error('还有血清未分配存储位置')
          return this.changeSerumStoreModalLoading()
        }
        if (storeType === 1 && this.serumLocationAdd.cellLocations[this.serumLocationAdd.cellLocations.length - 1].latticeNum - this.serumLocationAdd.cellLocations[0].latticeNum !== this.serumLocationAdd.cellLocations.length - 1) {
          this.$Message.error('血清存储位置不连续')
          return this.changeSerumStoreModalLoading()
        }
        if (storeType === 2 && this.serumLocationAdd.serumLocations[this.serumLocationAdd.serumLocations.length - 1].cuvetteNum - this.serumLocationAdd.serumLocations[0].cuvetteNum !== this.serumLocationAdd.serumLocations.length - 1) {
          this.$Message.error('血清存储位置不连续')
          return this.changeSerumStoreModalLoading()
        }
      }
      // validateField
      this.$refs['storeAddForm'].validateField('serumLocationAdd')
      this.serumStoreModalVisible = false
    },
    changeSerumStoreModalLoading() {
      this.serumStoreModalLoading = false
      this.$nextTick(() => {
        this.serumStoreModalLoading = true
      })
    },

    // 切换存储罐下拉框-------------------------------------------
    serumPotChange(potCode) {
      // 清空数据
      this.serumPotStoreQuery.potCode = potCode
      this.serumPotStoreQuery.regionCode = ''
      this.serumRegionList = []
      this.serumPotStoreQuery.towerCode = ''
      this.serumTowerList = []
      this.serumPotStoreQuery.boxCode = ''
      this.serumBoxList = []
      this.serumBoxInfo = {}
      this.serumLatticeList = []
      this.serumPotStoreQuery.latticeNum = ''
      this.serumLocationAdd.cellLocations = []
      // 如果为清空值, 则不查询
      if (!potCode) {
        return
      }
      getRegionByPotCode(this.serumPotStoreQuery).then(res => {
        this.serumRegionList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换区下拉框
    serumRegionChange(regionCode) {
      // 清空数据
      this.serumPotStoreQuery.regionCode = regionCode
      this.serumPotStoreQuery.towerCode = ''
      this.serumTowerList = []
      this.serumPotStoreQuery.boxCode = ''
      this.serumBoxList = []
      this.serumBoxInfo = {}
      this.serumLatticeList = []
      this.serumPotStoreQuery.latticeNum = ''
      this.serumLocationAdd.cellLocations = []
      if (!regionCode) {
        return
      }
      getTowerOfRegion(this.serumPotStoreQuery).then(res => {
        this.serumTowerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换塔下拉框
    serumTowerChange(towerCode) {
      // 清空数据
      this.serumPotStoreQuery.towerCode = towerCode
      this.serumPotStoreQuery.boxCode = ''
      this.serumBoxList = []
      this.serumBoxInfo = {}
      this.serumLatticeList = []
      this.serumPotStoreQuery.latticeNum = ''
      this.serumLocationAdd.cellLocations = []
      if (!towerCode) {
        return
      }
      getBoxOfTower(this.serumPotStoreQuery).then(res => {
        this.serumBoxList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换盒子下拉框
    serumBoxChange(boxCode) {
      // 清空数据
      this.serumPotStoreQuery.boxCode = boxCode
      this.serumBoxInfo = {}
      this.serumLatticeList = []
      this.serumPotStoreQuery.latticeNum = ''
      this.serumLocationAdd.cellLocations = []
      if (!boxCode) {
        return
      }
      getBoxInfo(this.serumPotStoreQuery).then(res => {
        this.serumBoxInfo = res.data
        this.serumLatticeList = []
        for (let i = 1; i <= this.serumBoxInfo.box.latticeNum; i++) {
          let latticeObj = {
            'latticeNum': i,
            'disabled': false
          }
          // 数据库中查询的已经被占用的存储位置
          if (this.serumBoxInfo.usedLattices && this.serumBoxInfo.usedLattices.length > 0) {
            for (let j = 0; j < this.serumBoxInfo.usedLattices.length; j++) {
              let usedLattice = this.serumBoxInfo.usedLattices[j]
              if (usedLattice.latticeNum === i) {
                latticeObj.disabled = true
                break
              }
            }
          }
          // 细胞选择存储位置时已经存储的位置
          if (this.cellLocations && this.cellLocations.length > 0) {
            for (let k = 0; k < this.cellLocations.length; k++) {
              let usedLattice = this.cellLocations[k]
              if (usedLattice.potCode === this.serumBoxInfo.box.potCode && usedLattice.regionCode === this.serumBoxInfo.box.regionCode && usedLattice.towerCode === this.serumBoxInfo.box.towerCode && usedLattice.boxCode === this.serumBoxInfo.box.boxCode && usedLattice.latticeNum === i) {
                latticeObj.disabled = true
                break
              }
            }
          }
          this.serumLatticeList.push(latticeObj)
        }
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    serumPotCellLocationsSelectClose(latticeNum) {
      this.serumLocationAdd.cellLocations = this.serumLocationAdd.cellLocations.filter(item => item.latticeNum !== latticeNum)
    },
    // 判断单元格的颜色
    checkSerumPotLocationStatus(num) {
      if (this.serumBoxInfo && this.serumBoxInfo.usedLattices && this.serumBoxInfo.usedLattices.length > 0) {
        // 判断该位置是否可选
        if (this.serumBoxInfo.usedLattices.filter(item => item.latticeNum === num).length > 0) {
          return 2
        }
      }
      if (this.serumLocationAdd.cellLocations && this.serumLocationAdd.cellLocations.length > 0) {
        if (this.serumLocationAdd.cellLocations.filter(item => item.latticeNum === num).length > 0) {
          return 1
        }
      }
      return 0
    },
    // 选中
    handleSerumPotChooseLocation(num) {
      if (this.serumBoxInfo && this.serumBoxInfo.usedLattices && this.serumBoxInfo.usedLattices.length > 0) {
        // 判断该位置是否可选, 不可选择直接返回
        if (this.serumBoxInfo.usedLattices.filter(item => item.latticeNum === num).length > 0) {
          return
        }
      }
      // 已选中则取消选择
      if (this.serumLocationAdd.cellLocations && this.serumLocationAdd.cellLocations.length > 0) {
        if (this.serumLocationAdd.cellLocations.filter(item => item.latticeNum === num).length > 0) {
          this.serumLocationAdd.cellLocations.splice(this.serumLocationAdd.cellLocations.findIndex(item => item.latticeNum === num), 1)
          return 1
        }
      }
      // 未选中则选中
      if (this.serumLocationAdd.cellLocations && this.serumLocationAdd.cellLocations.length >= this.cellCulture.serumQuantity) {
        this.$Message.error('存储位置已经选完')
        return
      }
      this.serumLocationAdd.cellLocations.push({
        'potCode': this.serumPotStoreQuery.potCode,
        'regionCode': this.serumPotStoreQuery.regionCode,
        'towerCode': this.serumPotStoreQuery.towerCode,
        'boxCode': this.serumPotStoreQuery.boxCode,
        'latticeNum': num
      })
      // 排序
      this.serumLocationAdd.cellLocations = this.serumLocationAdd.cellLocations.sort((l1, l2) => l1.latticeNum - l2.latticeNum)
    },
    // 顺序选号
    serumPotOrderSelect() {
      if (!this.serumBoxInfo || !this.serumBoxInfo.box) {
        this.$Message.error('请先选择存储盒')
        return
      }
      // 要存储的数量
      let storeCount = this.cellCulture.serumQuantity
      let startIndex = 0
      if (this.serumBoxInfo && this.serumBoxInfo.usedLattices && this.serumBoxInfo.usedLattices.length > 0) {
        // 对已经被选中的位置数组按从小到大排序
        this.serumBoxInfo.usedLattices = this.serumBoxInfo.usedLattices.sort((l1, l2) => l1.latticeNum - l2.latticeNum)
        // 依次判断可选择位置
        for (let i = 0; i < this.serumBoxInfo.usedLattices.length; i++) {
          let lattice = this.serumBoxInfo.usedLattices[i]
          if (i === 0) {
            if (lattice.latticeNum - 1 >= storeCount) {
              startIndex = 1
              break
            }
          }
          if (i === this.serumBoxInfo.usedLattices.length - 1) {
            if (this.serumBoxInfo.box.latticeNum - lattice.latticeNum >= storeCount) {
              startIndex = lattice.latticeNum + 1
              break
            }
          }
          if (i !== 0 && i !== this.serumBoxInfo.usedLattices.length - 1) {
            let beforLattice = this.serumBoxInfo.usedLattices[i - 1]
            if (lattice.latticeNum - beforLattice.latticeNum > storeCount) {
              startIndex = beforLattice.latticeNum + 1
              break
            }
          }
        }
      } else {
        if (this.serumBoxInfo.box.latticeNum >= storeCount) {
          startIndex = 1
        }
      }
      if (!startIndex) {
        this.$Message.error('没有合适的空余位置')
        return
      }
      this.serumLocationAdd.cellLocations = []
      for (let i = 0; i < storeCount; i++) {
        this.serumLocationAdd.cellLocations.push({
          'potCode': this.serumPotStoreQuery.potCode,
          'regionCode': this.serumPotStoreQuery.regionCode,
          'towerCode': this.serumPotStoreQuery.towerCode,
          'boxCode': this.serumPotStoreQuery.boxCode,
          'latticeNum': startIndex + i
        })
      }
    },
    serumPotDeleteSelect() {
      this.serumLocationAdd.cellLocations = []
    },
    // // 切换存储位置下拉框
    // serumLatticeChange(latticeNum) {
    //   this.serumPotStoreQuery.latticeNum = latticeNum
    //   // 清空数据
    //   this.serumLocationAdd.cellLocations = []
    //   if (!latticeNum) {
    //     return
    //   }
    //   this.serumLocationAdd.cellLocation = {
    //     'potCode': this.serumPotStoreQuery.potCode,
    //     'regionCode': this.serumPotStoreQuery.regionCode,
    //     'towerCode': this.serumPotStoreQuery.towerCode,
    //     'boxCode': this.serumPotStoreQuery.boxCode,
    //     'latticeNum': this.serumPotStoreQuery.latticeNum
    //   }
    // },
    // 切换测试样本公共罐下拉框------------------------------------------
    testCellPotChange(potCode) {
      // 清空数据
      this.testCellPotStoreQuery.potCode = potCode
      this.testCellPotStoreQuery.regionCode = ''
      this.testCellRegionList = []
      this.testCellPotStoreQuery.towerCode = ''
      this.testCellTowerList = []
      this.testCellPotStoreQuery.boxCode = ''
      this.testCellBoxList = []
      this.testCellBoxInfo = {}
      this.testCellLatticeList = []
      this.testCellPotStoreQuery.latticeNum = ''
      this.testCellLocation = null
      // 如果为清空值, 则不查询
      if (!potCode) {
        return
      }
      getRegionByPotCode(this.testCellPotStoreQuery).then(res => {
        this.testCellRegionList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换区下拉框
    testCellRegionChange(regionCode) {
      // 清空数据
      this.testCellPotStoreQuery.regionCode = regionCode
      this.testCellPotStoreQuery.towerCode = ''
      this.testCellTowerList = []
      this.testCellPotStoreQuery.boxCode = ''
      this.testCellBoxList = []
      this.testCellBoxInfo = {}
      this.testCellLatticeList = []
      this.testCellPotStoreQuery.latticeNum = ''
      this.testCellLocation = null
      if (!regionCode) {
        return
      }
      getTowerOfRegion(this.testCellPotStoreQuery).then(res => {
        this.testCellTowerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换塔下拉框
    testCellTowerChange(towerCode) {
      // 清空数据
      this.testCellPotStoreQuery.towerCode = towerCode
      this.testCellPotStoreQuery.boxCode = ''
      this.testCellBoxList = []
      this.testCellBoxInfo = {}
      this.testCellLatticeList = []
      this.testCellPotStoreQuery.latticeNum = ''
      this.testCellLocation = null
      if (!towerCode) {
        return
      }
      getBoxOfTower(this.testCellPotStoreQuery).then(res => {
        this.testCellBoxList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换盒子下拉框
    testCellBoxChange(boxCode) {
      // 清空数据
      this.testCellPotStoreQuery.boxCode = boxCode
      this.testCellBoxInfo = {}
      this.testCellLatticeList = []
      this.testCellPotStoreQuery.latticeNum = ''
      this.testCellLocation = null
      if (!boxCode) {
        return
      }
      getBoxInfo(this.testCellPotStoreQuery).then(res => {
        this.testCellBoxInfo = res.data
        this.testCellLatticeList = []
        for (let i = 1; i <= this.testCellBoxInfo.box.latticeNum; i++) {
          let latticeObj = {
            'latticeNum': i,
            'disabled': false
          }
          // 数据库中查询的已经被占用的存储位置
          if (this.testCellBoxInfo.usedLattices && this.testCellBoxInfo.usedLattices.length > 0) {
            for (let j = 0; j < this.testCellBoxInfo.usedLattices.length; j++) {
              let usedLattice = this.testCellBoxInfo.usedLattices[j]
              if (usedLattice.latticeNum === i) {
                latticeObj.disabled = true
                break
              }
            }
          }
          this.testCellLatticeList.push(latticeObj)
        }
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换存储位置下拉框
    testCellLatticeChange(latticeNum) {
      this.testCellPotStoreQuery.latticeNum = latticeNum
      // 清空数据
      this.testCellLocation = null
      if (!latticeNum) {
        return
      }
      this.testCellLocation = {
        'potCode': this.testCellPotStoreQuery.potCode,
        'regionCode': this.testCellPotStoreQuery.regionCode,
        'towerCode': this.testCellPotStoreQuery.towerCode,
        'boxCode': this.testCellPotStoreQuery.boxCode,
        'latticeNum': this.testCellPotStoreQuery.latticeNum
      }
    },
    // 提交表单，保存填写的细胞信息
    submit() {
      this.$refs['storeAddForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 将细胞存储位置信息赋值提交
        this.store.cellLocations = this.cellLocations
        // 将血清的存储位置信息赋值提交
        this.store.serumLocationAdd = this.serumLocationAdd
        // 检测样本存储位置
        this.store.testCellLocation = this.testCellLocation
        // 入库放行记录文件
        this.store.storageReleaseRecordFile = this.$refs.upload.fileList.map(file => file.id)
        addStore(this.store).then(res => {
          this.changeLoading()
          this.$Message.success(res.msg)
          this.closeTag({
            name: 'storeAdd',
            query: {
              id: 'storeAdd',
              cellCultureId: this.$route.query.cellCultureId
            }
          })
        }).catch(error => {
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    close() {
      this.closeTag({
        name: 'storeAdd',
        query: {
          id: 'storeAdd',
          cellCultureId: this.$route.query.cellCultureId
        }
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.registerFormLoading = false
      this.$nextTick(() => {
        this.registerFormLoading = true
      })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'storeAdd' && this.cellCultureId !== this.$route.query.cellCultureId) {
        this.cellCultureId = this.$route.query.cellCultureId
      }
    },
    cellCultureId() {
      // 细胞培养接收人
      this.getUserInfo()
      // 样本,顾客,已填写细胞信息
      this.getStoreAddView(this.$route.query.cellCultureId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>

