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
              <DatePicker type="datetime" placeholder="请选择采集时间" v-model="sample.collectTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100" disabled ></DatePicker>
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
    <Form ref="tempStoreAddForm" :model="tempStore" :rules="rules" :loading="registerFormLoading" :label-width="110" >
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
              <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.cultureTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100" disabled></DatePicker>
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
              <Input type="text" v-model="cellCulture.cellQuantity" disabled></Input>
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
              <Input type="text" v-model="cellCulture.cellQuantity" disabled></Input>
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
                <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.receiveTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="暂存位置" prop="cellLocations" class="ivu-form-item-required">
              <Button @click="openChoiceTempStoreModal" type="success">分派位置</Button>
              <br />
              <Tag v-if="cellLocations && cellLocations.length" :key="1" color="green">{{caculateLocation(cellLocations)}}</Tag>
              <!-- <Tag v-for="item in cellLocations" :key="item.latticeNum" type="dot" color="success">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Tag> -->
              <!-- <div v-for="item in cellLocations" :key="item.latticeNum">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</div> -->
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48" v-if="false">
          <Col span="24">
            <Form-item label="血清暂存位置">
              <Button @click="openChoiceSerumStoreModal" type="success">分派位置</Button>
              <br />
              <Tag v-if="serumLocationAdd && serumLocationAdd.cellLocation" color="green">{{serumLocationAdd.cellLocation.potCode +' 罐-'+ serumLocationAdd.cellLocation.regionCode +' 区-'+ serumLocationAdd.cellLocation.towerCode +' 塔-'+ serumLocationAdd.cellLocation.boxCode +' 盒-第 '+ serumLocationAdd.cellLocation.latticeNum +' 号管'}}</Tag>
              <Tag v-else-if="serumLocationAdd && serumLocationAdd.serumLocation" color="green">{{serumLocationAdd.serumLocation.fridgeCode +' 冰箱-'+ serumLocationAdd.serumLocation.layerCode +' 层-'+ serumLocationAdd.serumLocation.rackCode +' 试管架-第 '+ serumLocationAdd.serumLocation.cuvetteNum +' 号管'}}</Tag>
              <!-- <Tag v-if="serumLocationAdd && serumLocationAdd.cellLocation" type="dot" color="success">{{serumLocationAdd.cellLocation.potCode +' 罐-'+ serumLocationAdd.cellLocation.regionCode +' 区-'+ serumLocationAdd.cellLocation.towerCode +' 塔-'+ serumLocationAdd.cellLocation.boxCode +' 盒-'+ serumLocationAdd.cellLocation.latticeNum +' 号管'}}</Tag>
              <Tag v-else-if="serumLocationAdd && serumLocationAdd.serumLocation" type="dot" color="success">{{serumLocationAdd.serumLocation.fridgeCode +' 冰箱-'+ serumLocationAdd.serumLocation.layerCode +' 层-'+ serumLocationAdd.serumLocation.rackCode +' 试管架-'+ serumLocationAdd.serumLocation.cuvetteNum +' 号管'}}</Tag> -->
              <!-- <div v-if="serumLocationAdd && serumLocationAdd.cellLocation">{{serumLocationAdd.cellLocation.potCode +' 罐-'+ serumLocationAdd.cellLocation.regionCode +' 区-'+ serumLocationAdd.cellLocation.towerCode +' 塔-'+ serumLocationAdd.cellLocation.boxCode +' 盒-'+ serumLocationAdd.cellLocation.latticeNum +' 号管'}}</div>
              <div v-else-if="serumLocationAdd && serumLocationAdd.serumLocation">{{serumLocationAdd.serumLocation.fridgeCode +' 冰箱-'+ serumLocationAdd.serumLocation.layerCode +' 层-'+ serumLocationAdd.serumLocation.rackCode +' 试管架-'+ serumLocationAdd.serumLocation.cuvetteNum +' 号管'}}</div> -->
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="暂存人" prop="storeUserName">
              <Input type="text" v-model="tempStore.storeUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="暂存时间" prop="storeTime">
                <DatePicker type="datetime" placeholder="选择日期" v-model="tempStore.storeTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100"></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
      </Card>
       <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
      </div>
    </Form>
    <!-- 细胞暂存位置选择弹出层 -->
    <Modal
      v-model="tempStoreModalVisible"
      title="分派存储位置"
      :loading="tempStoreModalLoading"
      @on-ok="tempStoreModalOk"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :scrollable="true"
      width="768">
      <div style="height:519px; overflow-x:hidden; overflow-y:auto;">
        <Form ref="cellLocationsForm" :model="boxInfo">
          <Row :gutter="16">
            <Col span="24">
              <Form-item label="选择存储盒" :label-width="100" >
                <Select  v-model="tempStoreQuery.potCode" @on-change="potChange($event)" placeholder="请选择存储罐" style="width:120px" clearable>
                  <Option v-for="item in potList" :key="item.potCode" :value="item.potCode" >{{item.potCode}}</Option>
                </Select> 罐
                <Select v-model="tempStoreQuery.regionCode" @on-change="regionChange($event)" placeholder="请选择区" style="width:120px;margin-left:10px;"  clearable>
                  <Option v-for="item in regionList" :key="item.regionCode" :value="item.regionCode" >{{item.regionCode}}</Option>
                </Select> 区
                <Select v-model="tempStoreQuery.towerCode" @on-change="towerChange($event)" placeholder="请选择塔" style="width:120px;margin-left:10px;"  clearable>
                  <Option v-for="item in towerList" :key="item.towerCode" :value="item.towerCode" >{{item.towerCode}}</Option>
                </Select> 塔
                <Select v-model="tempStoreQuery.boxCode" @on-change="boxChange($event)" placeholder="请选择盒" style="width:120px;margin-left:10px;"  clearable>
                  <Option v-for="item in boxList" :key="item.boxCode" :value="item.boxCode" >{{item.boxCode}}</Option>
                </Select> 盒
              </Form-item>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <Form-item label="格数量" :label-width="100" >
                <span>{{cellLocations.length}}/{{cellCulture.cellQuantity}}</span><Button @click="orderSelect" type="success" style="margin-left:10px;">顺序选号</Button> <Button @click="deleteSelect" type="success" style="margin-left:10px;">取消选择</Button>
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
    </Modal>

    <!-- 血清冰箱暂存位置选择弹出层 -->
    <Modal
      v-model="serumStoreModalVisible"
      title="分派血清存储位置"
      :loading="serumStoreModalLoading"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="968">
      <Form ref="serumLocationsForm" :model="serumStoreQuery">
        <Row :gutter="16">
          <Col span="24">
            <Form-item label="选择存储位置" :label-width="100" >
              <Select v-model="serumLocationAdd.storageType" @on-change="serumStorageTypeChange($event)" placeholder="请选择存储设备" style="width:130px" clearable>
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
                <Select v-model="serumStoreQuery.cuvetteNum" @on-change="cuvetteChange($event)" placeholder="请选择试管" style="width:120px; margin-left:10px;" clearable>
                  <Option v-for="item in cuvetteList" :key="item.cuvetteNum" :value="item.cuvetteNum" :disabled="item.disabled" >{{item.cuvetteNum}}</Option>
                </Select> 试管
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
                <Select v-model="serumPotStoreQuery.latticeNum" @on-change="serumLatticeChange($event)" placeholder="请选择位置" style="width:100px; margin-left:10px;" clearable>
                  <Option v-for="item in serumLatticeList" :key="item.latticeNum" :value="item.latticeNum" :disabled="item.disabled">{{item.latticeNum}}</Option>
                </Select> 号
              </span>
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './tempStoreAdd.less'
import { getUserInfo } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getTempStoreAddView, addTempStore } from '@/api/cellCulture.js'
import { getTempStorePot, getRegionByPotCode, getTowerOfRegion, getBoxOfTower, getBoxInfo } from '@/api/box.js'
import { getFridgeList, getLayerByFridgeCode, getRackOfLayer, getRackInfo } from '@/api/rack.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
import { caculateLocation } from '@/libs/cell.js'
export default {
  name: 'tempStoreAdd',
  data() {
    const validateCellLocations = (rule, value, callback) => {
      if (!this.cellLocations || this.cellLocations.length < this.cellCulture.cellQuantity) {
        callback(new Error('还有细胞未分配暂存位置'))
      } else if (this.cellLocations[this.cellLocations.length - 1].latticeNum - this.cellLocations[0].latticeNum !== this.cellLocations.length - 1) {
        callback(new Error('细胞暂存位置不连续'))
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
      // 待提交的暂存信息
      tempStore: {
        storeTime: new Date()
      },
      rules: {
        storeUserName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        storeTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        cellLocations: [
          { validator: validateCellLocations, trigger: 'change' }
        ]
      },
      // 暂存弹出框是否显示
      tempStoreModalVisible: false,
      tempStoreModalLoading: true,
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
      // 暂存时罐,区,塔,层盒 查询条件
      tempStoreQuery: {
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: ''
      },
      // 血清新增对象
      serumLocationAdd: {
        // 暂存工具类型(1: 存储罐, 2 :冰箱)
        storageType: 2,
        // 血清冰箱暂存位置, 当为冰箱存储时, 当前对象有值
        serumLocation: null,
        // 血清存储罐暂存位置, 当为存储罐存储时, 当前对象必须有值
        cellLocation: null
      },
      // 暂存弹出框是否显示
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
      // 暂存时冰箱,层,试管架 查询条件
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
      // 血清存储暂存时罐,区,塔,层盒 查询条件
      serumPotStoreQuery: {
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: '',
        latticeNum: ''
      }
    }
  },
  mounted() {
    // 细胞培养接收人人
    this.getUserInfo()
    // 样本,顾客,已填写细胞信息
    this.getTempStoreAddView(this.$route.query.cellCultureId)
    // 初始化样本类型数据
    this.getSampleTypeList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 根据细胞位置集合, 计算细胞位置所在位置文本
    caculateLocation(cellLocations) {
      return caculateLocation(cellLocations)
    },
    // 获取细胞接收人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.tempStore.storeUserName = res.data.realName
        this.tempStore.storeUserId = res.data.id
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getTempStoreAddView(cellCultureId) {
      getTempStoreAddView(cellCultureId).then(res => {
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

          // 给新增的细胞暂存信息赋值细胞信息id
          this.tempStore.cellCultureId = res.data.cellCulture.id

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
    // 打开弹出层,细胞暂存位置选取
    openChoiceTempStoreModal() {
      this.tempStoreModalVisible = true
      this.getTempStorePot()
    },
    // 获取暂存罐列表数据
    getTempStorePot() {
      // this.tempStoreModalLoading = true
      getTempStorePot(this.tempStoreQuery).then(res => {
        this.potList = res.data
        // this.tempStoreModalLoading = false
      })
    },
    // 切换暂存罐下拉框
    potChange(potCode) {
      // 清空数据
      this.tempStoreQuery.potCode = potCode
      this.tempStoreQuery.regionCode = ''
      this.regionList = []
      this.tempStoreQuery.towerCode = ''
      this.towerList = []
      this.tempStoreQuery.boxCode = ''
      this.boxList = []
      this.boxInfo = {}
      this.cellLocations = []
      // 如果为清空值, 则不查询
      if (!potCode) {
        return
      }
      getRegionByPotCode(this.tempStoreQuery).then(res => {
        this.regionList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换区下拉框
    regionChange(regionCode) {
      // 清空数据
      this.tempStoreQuery.regionCode = regionCode
      this.tempStoreQuery.towerCode = ''
      this.towerList = []
      this.tempStoreQuery.boxCode = ''
      this.boxList = []
      this.boxInfo = {}
      this.cellLocations = []
      if (!regionCode) {
        return
      }
      getTowerOfRegion(this.tempStoreQuery).then(res => {
        this.towerList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换塔下拉框
    towerChange(towerCode) {
      // 清空数据
      this.tempStoreQuery.towerCode = towerCode
      this.tempStoreQuery.boxCode = ''
      this.boxList = []
      this.boxInfo = {}
      this.cellLocations = []
      if (!towerCode) {
        return
      }
      getBoxOfTower(this.tempStoreQuery).then(res => {
        this.boxList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 切换盒子下拉框
    boxChange(boxCode) {
      // 清空数据
      this.tempStoreQuery.boxCode = boxCode
      this.boxInfo = {}
      this.cellLocations = []
      if (!boxCode) {
        return
      }
      getBoxInfo(this.tempStoreQuery).then(res => {
        this.boxInfo = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    cellLocationsSelectClose(latticeNum) {
      for (let i = 0; i < this.cellLocations.length; i++) {
        let lattice = this.cellLocations[i]
        if (lattice.latticeNum === latticeNum) {
          this.cellLocations.splice(i, 1)
          return
        }
      }
    },
    // 判断单元格的颜色
    checkLocationStatus(num) {
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 判断该位置是否可选
        for (let i = 0; i < this.boxInfo.usedLattices.length; i++) {
          let lattice = this.boxInfo.usedLattices[i]
          if (lattice.latticeNum === num) {
            return 2
          }
        }
      }
      if (this.cellLocations && this.cellLocations.length > 0) {
        for (let i = 0; i < this.cellLocations.length; i++) {
          let lattice = this.cellLocations[i]
          if (lattice.latticeNum === num) {
            return 1
          }
        }
      }
      return 0
    },
    // 选中
    handleChooseLocation(num) {
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 判断该位置是否可选, 不可选择直接返回
        for (let i = 0; i < this.boxInfo.usedLattices.length; i++) {
          let lattice = this.boxInfo.usedLattices[i]
          if (lattice.latticeNum === num) {
            return
          }
        }
      }
      // 已选中则取消选择
      if (this.cellLocations && this.cellLocations.length > 0) {
        for (let i = 0; i < this.cellLocations.length; i++) {
          let lattice = this.cellLocations[i]
          if (lattice.latticeNum === num) {
            this.cellLocations.splice(i, 1)
            return
          }
        }
      }
      // 未选中则选中
      if (this.cellLocations && this.cellLocations.length >= this.cellCulture.cellQuantity) {
        this.$Message.error('存储位置已经选完')
        return
      }
      this.cellLocations.push({ 'potCode': this.tempStoreQuery.potCode, 'regionCode': this.tempStoreQuery.regionCode, 'towerCode': this.tempStoreQuery.towerCode, 'boxCode': this.tempStoreQuery.boxCode, 'latticeNum': num })
      // 排序
      this.cellLocations = this.cellLocations.sort((l1, l2) => l1.latticeNum - l2.latticeNum)
    },
    // 顺序选号
    orderSelect() {
      if (!this.boxInfo || !this.boxInfo.box) {
        this.$Message.error('请先选择暂存盒')
        return
      }
      let startIndex = 0
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 依次判断可选择位置
        for (let i = 0; i < this.boxInfo.usedLattices.length; i++) {
          let lattice = this.boxInfo.usedLattices[i]
          if (i === 0) {
            if (lattice.latticeNum - 1 >= this.cellCulture.cellQuantity) {
              startIndex = 1
              break
            }
          }
          if (i === this.boxInfo.usedLattices.length - 1) {
            if (this.boxInfo.box.latticeNum - lattice.latticeNum >= this.cellCulture.cellQuantity) {
              startIndex = lattice.latticeNum + 1
              break
            }
          }
          if (i !== 0 && i !== this.boxInfo.usedLattices.length - 1) {
            let beforLattice = this.boxInfo.usedLattices[i - 1]
            if (lattice.latticeNum - beforLattice.latticeNum > this.cellCulture.cellQuantity) {
              startIndex = beforLattice.latticeNum + 1
              break
            }
          }
        }
      } else {
        if (this.boxInfo.box.latticeNum >= this.cellCulture.cellQuantity) {
          startIndex = 1
        }
      }
      if (!startIndex) {
        this.$Message.error('没有合适的空余位置')
        return
      }
      this.cellLocations = []
      for (let i = 0; i < this.cellCulture.cellQuantity; i++) {
        this.cellLocations.push({ 'potCode': this.tempStoreQuery.potCode, 'regionCode': this.tempStoreQuery.regionCode, 'towerCode': this.tempStoreQuery.towerCode, 'boxCode': this.tempStoreQuery.boxCode, 'latticeNum': startIndex + i })
      }
    },
    deleteSelect() {
      this.cellLocations = []
    },
    // -------------------------------------------
    // 在modal验证罐存储位置是否够及是否连续
    tempStoreModalOk() {
      if (!this.cellLocations || this.cellLocations.length < this.cellCulture.cellQuantity) {
        this.$Message.error('还有细胞未分配暂存位置')
        return this.changeTempStoreModalLoading()
      } else if (this.cellLocations[this.cellLocations.length - 1].latticeNum - this.cellLocations[0].latticeNum !== this.cellLocations.length - 1) {
        this.$Message.error('细胞暂存位置不连续')
        return this.changeTempStoreModalLoading()
      }
      // validateField
      this.$refs['tempStoreAddForm'].validateField('cellLocations')
      this.tempStoreModalVisible = false
    },
    changeTempStoreModalLoading() {
      this.tempStoreModalLoading = false
      this.$nextTick(() => {
        this.tempStoreModalLoading = true
      })
    },
    // -------------------------------------------
    // 血清的相关操作------------------------------------------
    serumStorageTypeChange(storageType) {
      this.serumLocationAdd.storageType = storageType
      this.serumLocationAdd.serumLocation = null
      this.serumLocationAdd.cellLocation = null
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
        getTempStorePot(this.serumPotStoreQuery).then(res => {
          this.serumPotList = res.data
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      } else if (storageType === 2) {
        this.getFridgeList()
      }
    },
    // 打开血清暂存位置选取弹出层
    openChoiceSerumStoreModal() {
      this.serumStoreModalVisible = true
      this.getFridgeList()
    },
    // 获取所有的冰箱列表
    getFridgeList() {
      this.serumStoreModalLoading = true
      getFridgeList(this.serumStoreQuery).then(res => {
        this.fridgeList = res.data
        this.serumStoreModalLoading = false
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
      this.serumLocationAdd.serumLocation = null
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
      this.serumLocationAdd.serumLocation = null
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
      this.serumLocationAdd.serumLocation = null
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
    // 切换试管下拉框
    cuvetteChange(cuvetteNum) {
      this.serumStoreQuery.cuvetteNum = cuvetteNum
      // 清空数据
      this.serumLocationAdd.serumLocation = null
      if (!cuvetteNum) {
        return
      }
      this.serumLocationAdd.serumLocation = {
        'fridgeCode': this.serumStoreQuery.fridgeCode,
        'layerCode': this.serumStoreQuery.layerCode,
        'rackCode': this.serumStoreQuery.rackCode,
        'cuvetteNum': this.serumStoreQuery.cuvetteNum
      }
    },
    // 切换暂存罐下拉框
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
      this.serumLocationAdd.cellLocation = null
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
      this.serumLocationAdd.cellLocation = null
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
      this.serumLocationAdd.cellLocation = null
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
      this.serumLocationAdd.cellLocation = null
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
          // 细胞选择暂存位置时已经暂存的位置
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
    // 切换存储位置下拉框
    serumLatticeChange(latticeNum) {
      this.serumPotStoreQuery.latticeNum = latticeNum
      // 清空数据
      this.serumLocationAdd.cellLocation = null
      if (!latticeNum) {
        return
      }
      this.serumLocationAdd.cellLocation = {
        'potCode': this.serumPotStoreQuery.potCode,
        'regionCode': this.serumPotStoreQuery.regionCode,
        'towerCode': this.serumPotStoreQuery.towerCode,
        'boxCode': this.serumPotStoreQuery.boxCode,
        'latticeNum': this.serumPotStoreQuery.latticeNum
      }
    },
    // 提交表单，保存填写的细胞信息
    submit() {
      this.$refs['tempStoreAddForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 将细胞暂存位置信息赋值提交
        this.tempStore.cellLocations = this.cellLocations
        // 将血清的暂存位置信息赋值提交
        this.tempStore.serumLocationAdd = this.serumLocationAdd
        addTempStore(this.tempStore).then(res => {
          this.changeLoading()
          this.$Message.success(res.msg)
          this.closeTag({
            name: 'tempStoreAdd',
            query: {
              id: 'tempStoreAdd',
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
        name: 'tempStoreAdd',
        query: {
          id: 'tempStoreAdd',
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
      if (to.name === 'tempStoreAdd' && this.cellCultureId !== this.$route.query.cellCultureId) {
        this.cellCultureId = this.$route.query.cellCultureId
      }
    },
    cellCultureId() {
      // 细胞培养接收人
      this.getUserInfo()
      // 样本,顾客,已填写细胞信息
      this.getTempStoreAddView(this.$route.query.cellCultureId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>

