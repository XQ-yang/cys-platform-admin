<template>
  <div>
    <!-- <Steps :current="currentStep">
        <Step title="第一步" content="选择待移库细胞"></Step>
        <Step title="第二步" content="选择新存储位置"></Step>
    </Steps> -->
    <div id="stepOne" v-show="currentStep === 0">
    <Form ref="sampleForm" :model="sample" :label-width="90">
      <Card title="样本信息">
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="样本条码">
              <Input type="text" v-model="sample.sampleCode" disabled></Input>
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
              <Select v-model="sample.projectType" clearable disabled>
                <Option v-for="item in projectTypeList" :key="item.id" :value="item.id">{{item.projectTypeName}}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="顾客姓名">
              <Input type="text" v-model="customer.name" disabled></Input>
            </Form-item>
          </Col>
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
            <Form-item label="手机号">
              <Input type="text" v-model="customer.phone" disabled></Input>
            </Form-item>
          </Col>
        </Row>
      </Card>
    </Form>
    <Form ref="transferSelectForm" :model="transferAdd" :rules="rules" :loading="transferSelectFormLoading" :label-width="130" >
      <Card title="选择待移库细胞">
        <Row :gutter="48">
          <Col span="24">
            <Form-item :label-width="0" prop="locationIds">
              <!--细胞位置信息及细胞信息-->
              <Table ref="selection" :data="allCellLocationList" :columns="cellLocationColumns" :loading="allCellLocationListLoading" @on-selection-change='selectionClick' height="280" border stripe></Table>
              <Tag v-if="locationIds && locationIds.length" :key="0" color="green">{{caculateLocation(locationIds)}}</Tag>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="nextStep">下一步</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
      </div>
    </Form>
    </div>
    <div id=stepTwo v-show="currentStep === 1">
      <Form ref="transferStoreForm" :model="transferAdd" :rules="rules" :loading="transferStoreFormLoading" :label-width="90">
        <Card title="选择新存储位置">
          <Row :gutter="48">
            <Col span="24">
              <Form-item label="存储位置" prop="cellLocations" class="ivu-form-item-required">
                <Button @click="openChoiceStoreModal" type="success">分派位置</Button>
                <br />
                <!-- <Tag v-for="item in cellLocations" :key="item.latticeNum" type="dot" color="success">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Tag> -->
                <Tag v-if="cellLocations && cellLocations.length" :key="1" color="green">{{caculateLocation(cellLocations)}}</Tag>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="24">
              <FormItem label="移库备注" prop="transferRemark">
                <Input v-model="transferAdd.transferRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="255" placeholder="请输入移库备注"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="48">
            <Col span="8">
              <Form-item label="移库人" prop="transferUserName">
                <Input type="text" v-model="transferAdd.transferUserName" disabled></Input>
              </Form-item>
            </Col>
            <Col span="8">
              <Form-item label="移库时间" prop="transferTime">
                  <DatePicker type="datetime" placeholder="选择日期" v-model="transferAdd.transferTime" format="yyyy-MM-dd HH:mm" style="width:100%;" ></DatePicker>
              </Form-item>
            </Col>
            <Col span="8">
            </Col>
          </Row>
        </Card>
      </Form>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="forwardStep">上一步</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="submit">提交</Button>
      </div>
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
                <span>{{cellLocations.length}}/{{locationIds.length}}</span><Button @click="orderSelect" type="success" style="margin-left:10px;">顺序选号</Button> <Button @click="deleteSelect" type="success" style="margin-left:10px;">取消选择</Button>
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
                  <Tag type="dot" closable color="success" @on-close="cellLocationsSelectClose(item.latticeNum)" v-for="item in cellLocations" :key="'new' + item.latticeNum">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Tag>
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
    </div>
   </div>
</template>
<script>
import './transferAdd.less'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getStoreCellLocationListBySampleId, getTransferAddView, addTransfer } from '@/api/cellCulture.js'
import { getStorePot, getRegionByPotCode, getTowerOfRegion, getBoxOfTower, getBoxInfo } from '@/api/box.js'
import { getUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
import { num2e } from '@/libs/tools.js'
import { caculateLocation, isContinue, groupByProduceNumber, transferLocation } from '@/libs/cell.js'
export default {
  name: 'transferAdd',
  data() {
    // 校验选择待移库细胞数据
    const validateLocationIds = (rule, value, callback) => {
      if (!this.locationIds || !this.locationIds.length) {
        callback(new Error('请选择待移库细胞'))
      // } else if (!checkProduceAll(this.allCellLocationList, this.locationIds)) {
      //   callback(new Error('请选择已选批次下的所有细胞, 必须整批次移库'))
      } else if (!isContinue(this.locationIds)) {
        callback(new Error('所选待移库细胞存储位置不连续'))
      } else {
        callback()
      }
    }
    // 检测选择细胞是否连续
    const validateCellLocations = (rule, value, callback) => {
      if (!this.cellLocations || this.cellLocations.length < this.locationIds.length) {
        callback(new Error('还有细胞未分配存储位置'))
      } else if (this.cellLocations[this.cellLocations.length - 1].latticeNum - this.cellLocations[0].latticeNum !== this.cellLocations.length - 1) {
        callback(new Error('细胞存储位置不连续'))
      } else {
        callback()
      }
    }
    return {
      currentStep: 0,
      sampleId: '',
      sampleTypeList: [],
      // 样本信息表单
      projectTypeList: [],
      sample: {},
      // 客户信息
      customer: {},
      // 移库数据
      transferAdd: {
        transferTime: new Date()
      },
      // 所有细胞按批号分组
      cellMap: {},
      // 选中的待移库的细胞列表
      locationIds: [],
      // 新入库存储位置
      cellLocations: [],
      locationText: '',
      // // 移库细胞管数
      // transferQuantity: 0,
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
      // 存储时罐,区,塔,层盒 查询条件
      storeQuery: {
        potCode: '',
        regionCode: '',
        towerCode: '',
        boxCode: ''
      },
      // 细胞信息及位置信息
      allCellLocationListLoading: false,
      allCellLocationList: [],
      cellLocationColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { type: 'index', title: '序号', width: 70, tooltip: true },
        { title: '存储位置', key: 'locationText', width: 300, tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '细胞总量',
          key: 'cellTotal',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              num2e(params.row.cellTotal)
            )
          }
        },
        { title: '细胞活率',
          key: 'cellViability',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.cellViability + '%'
            )
          }
        },
        { title: '培养日期',
          key: 'cultureTime',
          width: 170,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      // 细胞移库选位置信息
      transferSelectFormLoading: true,
      transferStoreFormLoading: true,
      rules: {
        transferUserName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        transferTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        locationIds: [
          { validator: validateLocationIds, trigger: 'change' }
        ],
        cellLocations: [
          { validator: validateCellLocations, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    // 获取样本类型列表
    this.getSampleTypeList()
    // 加载样本信息
    this.getSampleInformation()
    // 加载样本对应的细胞信息及存储信息
    this.getAllCellLocationList()
    // 加载移库人信息
    this.getUserInfo()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 加载样本信息
    getSampleInformation() {
      this.sampleId = this.$route.query.sampleId
      getTransferAddView(this.sampleId).then(res => {
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          // 填充项目类型列表数据
          this.projectTypeList = res.data
        }).then(() => {
          // 样本信息
          this.sample = res.data.sample
          // 顾客信息
          this.customer = res.data.customer
          // 出库信息
          this.transferAdd.sampleId = this.sampleId
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取样本对应的细胞信息及存储信息
    getAllCellLocationList() {
      this.allCellLocationListLoading = true
      getStoreCellLocationListBySampleId(this.sampleId).then(res => {
        this.cellMap = groupByProduceNumber(res.data)
        this.allCellLocationList = transferLocation(res.data)
        this.allCellLocationListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取选中位置id
    selectionClick(rows) {
      let locationIds = []
      rows.forEach(element => {
        // locationIds.push(element.id)
        this.cellMap[element.produceNumber].forEach(cell => {
          locationIds.push(cell)
        })
      })
      this.locationIds = locationIds
      this.cellLocations = []
    },
    // 获取出库人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.transferAdd.transferUserName = res.data.realName
        this.transferAdd.transferUserId = res.data.id
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 提交表单，保存运输信息
    submit() {
      this.$refs['transferStoreForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 样本id
        this.transferAdd.sampleId = this.sample.id
        // 待移库细胞存储位置id
        this.transferAdd.selectCellLocationIds = this.locationIds.map(l => l.id)
        // 移库细胞新存储位置
        this.transferAdd.cellLocations = this.cellLocations
        // 待移库细胞所在位置文本
        this.transferAdd.transferInLocation = caculateLocation(this.cellLocations)
        // 细胞新入库位置文本
        this.transferAdd.transferOutLocation = caculateLocation(this.locationIds)
        addTransfer(this.transferAdd).then(res => {
          this.changeLoading()
          this.$Message.success(res.msg)
          this.closeTag({
            name: 'transferAdd',
            query: {
              id: 'transferAdd',
              sampleId: this.sampleId
            }
          })
        }).catch(error => {
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    changeSelectFormLoading() {
      this.transferSelectFormLoading = false
      this.$nextTick(() => {
        this.transferSelectFormLoading = true
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.transferStoreFormLoading = false
      this.$nextTick(() => {
        this.transferStoreFormLoading = true
      })
    },
    // 关闭
    close() {
      this.closeTag({
        name: 'transferAdd',
        query: {
          id: 'transferAdd',
          sampleId: this.sampleId
        }
      })
    },
    // 进入到下一步
    nextStep() {
      // validateField
      this.$refs['transferSelectForm'].validate(valid => {
        if (!valid) {
          return this.changeSelectFormLoading()
        }
        this.currentStep = 1
      })
    },
    forwardStep() {
      this.currentStep = 0
    },
    // 根据细胞位置集合, 计算细胞位置所在位置文本
    caculateLocation(cellLocations) {
      return caculateLocation(cellLocations)
    },
    // ---------------------------------------------------------------------------------------
    // 打开弹出层,细胞存储位置选取
    openChoiceStoreModal() {
      this.storeModalVisible = true
      this.getStorePot()
    },
    // 获取存储罐列表数据
    getStorePot() {
      // this.storeModalLoading = true
      getStorePot(!this.locationIds[0].isPositiveSample ? 1 : 2).then(res => {
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
      if (this.cellLocations && this.cellLocations.length >= this.locationIds.length) {
        this.$Message.error('存储位置已经选完')
        return
      }
      this.cellLocations.push({ 'potCode': this.storeQuery.potCode, 'regionCode': this.storeQuery.regionCode, 'towerCode': this.storeQuery.towerCode, 'boxCode': this.storeQuery.boxCode, 'latticeNum': num })
      // 排序
      this.cellLocations = this.cellLocations.sort((l1, l2) => l1.latticeNum - l2.latticeNum)
    },
    // 顺序选号
    orderSelect() {
      if (!this.boxInfo || !this.boxInfo.box) {
        this.$Message.error('请先选择存储盒')
        return
      }
      let startIndex = 0
      if (this.boxInfo && this.boxInfo.usedLattices && this.boxInfo.usedLattices.length > 0) {
        // 依次判断可选择位置
        for (let i = 0; i < this.boxInfo.usedLattices.length; i++) {
          let lattice = this.boxInfo.usedLattices[i]
          if (i === 0) {
            if (lattice.latticeNum - 1 >= this.locationIds.length) {
              startIndex = 1
              break
            }
          }
          if (i === this.boxInfo.usedLattices.length - 1) {
            if (this.boxInfo.box.latticeNum - lattice.latticeNum >= this.locationIds.length) {
              startIndex = lattice.latticeNum + 1
              break
            }
          }
          if (i !== 0 && i !== this.boxInfo.usedLattices.length - 1) {
            let beforLattice = this.boxInfo.usedLattices[i - 1]
            if (lattice.latticeNum - beforLattice.latticeNum > this.locationIds.length) {
              startIndex = beforLattice.latticeNum + 1
              break
            }
          }
        }
      } else {
        if (this.boxInfo.box.latticeNum >= this.locationIds.length) {
          startIndex = 1
        }
      }
      if (!startIndex) {
        this.$Message.error('没有合适的空余位置')
        return
      }
      this.cellLocations = []
      for (let i = 0; i < this.locationIds.length; i++) {
        this.cellLocations.push({ 'potCode': this.storeQuery.potCode, 'regionCode': this.storeQuery.regionCode, 'towerCode': this.storeQuery.towerCode, 'boxCode': this.storeQuery.boxCode, 'latticeNum': startIndex + i })
      }
    },
    deleteSelect() {
      this.cellLocations = []
    },
    // -------------------------------------------
    // 在modal验证罐存储位置是否够及是否连续
    storeModalOk() {
      if (!this.cellLocations || this.cellLocations.length < this.locationIds.length) {
        this.$Message.error('还有细胞未分配存储位置')
        return this.changeStoreModalLoading()
      } else if (this.cellLocations[this.cellLocations.length - 1].latticeNum - this.cellLocations[0].latticeNum !== this.cellLocations.length - 1) {
        this.$Message.error('细胞存储位置不连续')
        return this.changeStoreModalLoading()
      }
      // validateField
      this.$refs['transferStoreForm'].validateField('cellLocations')
      this.storeModalVisible = false
    },
    changeStoreModalLoading() {
      this.storeModalLoading = false
      this.$nextTick(() => {
        this.storeModalLoading = true
      })
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'transferAdd' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 加载样本信息
      this.getSampleInformation()
      // 加载样本对应的细胞信息及存储信息
      this.getAllCellLocationList()
      // 出库人
      this.getUserInfo()
    }
  }
}
</script>
