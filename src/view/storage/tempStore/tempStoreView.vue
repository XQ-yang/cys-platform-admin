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
              <DatePicker type="datetime" placeholder="请选择采集时间" v-model="sample.collectTime" format="yyyy-MM-dd HH:mm" class="ivu-date-picker-100" disabled ></DatePicker>
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
    <Form ref="tempStoreForm" :model="tempStore" :loading="registerFormLoading" :label-width="110" >
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
              <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.cultureTime" format="yyyy-MM-dd HH:mm" class="ivu-date-picker-100" disabled></DatePicker>
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
                <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.receiveTime" format="yyyy-MM-dd HH:mm" class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="暂存位置" prop="cellLocations">
              <Tag v-if="cellLocations && cellLocations.length" :key="1" color="green">{{caculateLocation(cellLocations)}}</Tag>
              <!-- <Tag v-for="item in cellLocations" :key="item.latticeNum" type="dot" color="success">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</Tag> -->
              <!-- <div v-for="item in cellLocations" :key="item.latticeNum">{{item.potCode +' 罐-'+ item.regionCode +' 区-'+ item.towerCode +' 塔-'+ item.boxCode +' 盒-'+ item.latticeNum +' 号管'}}</div> -->
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48" v-if="false">
          <Col span="24">
            <Form-item label="血清暂存位置">
              <Tag v-if="serumLocationView && serumLocationView.cellLocation" color="green">{{serumLocationView.cellLocation.potCode +' 罐-'+ serumLocationView.cellLocation.regionCode +' 区-'+ serumLocationView.cellLocation.towerCode +' 塔-'+ serumLocationView.cellLocation.boxCode +' 盒-第 '+ serumLocationView.cellLocation.latticeNum +' 号管'}}</Tag>
              <Tag v-else-if="serumLocationView && serumLocationView.serumLocation" color="green">{{serumLocationView.serumLocation.fridgeCode +' 冰箱-'+ serumLocationView.serumLocation.layerCode +' 层-'+ serumLocationView.serumLocation.rackCode +' 试管架-第 '+ serumLocationView.serumLocation.cuvetteNum +' 号管'}}</Tag>
              <!-- <Tag v-if="serumLocationView && serumLocationView.cellLocation" type="dot" color="success">{{serumLocationView.cellLocation.potCode +' 罐-'+ serumLocationView.cellLocation.regionCode +' 区-'+ serumLocationView.cellLocation.towerCode +' 塔-'+ serumLocationView.cellLocation.boxCode +' 盒-'+ serumLocationView.cellLocation.latticeNum +' 号管'}}</Tag>
              <Tag v-else-if="serumLocationView && serumLocationView.serumLocation" type="dot" color="success">{{serumLocationView.serumLocation.fridgeCode +' 冰箱-'+ serumLocationView.serumLocation.layerCode +' 层-'+ serumLocationView.serumLocation.rackCode +' 试管架-'+ serumLocationView.serumLocation.cuvetteNum +' 号管'}}</Tag> -->
              <!-- <div v-if="serumLocationView && serumLocationView.cellLocation">{{serumLocationView.cellLocation.potCode +' 罐-'+ serumLocationView.cellLocation.regionCode +' 区-'+ serumLocationView.cellLocation.towerCode +' 塔-'+ serumLocationView.cellLocation.boxCode +' 盒-'+ serumLocationView.cellLocation.latticeNum +' 号管'}}</div>
              <div v-else-if="serumLocationView && serumLocationView.serumLocation">{{serumLocationView.serumLocation.fridgeCode +' 冰箱-'+ serumLocationView.serumLocation.layerCode +' 层-'+ serumLocationView.serumLocation.rackCode +' 试管架-'+ serumLocationView.serumLocation.cuvetteNum +' 号管'}}</div> -->
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
                <DatePicker type="datetime" placeholder="选择日期" v-model="tempStore.storeTime" format="yyyy-MM-dd HH:mm" class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
      </Card>
    </Form>
    <div class="form-btn">
      <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close">关闭</Button>
    </div>
  </div>
</template>

<script>
// import { getUserInfo } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getTempStoreView } from '@/api/cellCulture.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
import { caculateLocation } from '@/libs/cell.js'
export default {
  name: 'tempStoreView',
  data() {
    return {
      // 暂存id
      tempStoreId: '',
      registerFormLoading: true,
      projectTypeList: [],
      sampleTypeList: [],
      // 样本信息
      sample: {},
      // 客户信息
      customer: {},
      // 细胞暂存信息
      tempStore: {},
      // 已填写的细胞信息
      cellCulture: {},
      // 选中的存储位置
      cellLocations: [],
      // 暂存的血清信息
      serumLocationView: null
    }
  },
  mounted() {
    // 样本,顾客,已填写细胞信息列表
    this.getTempStoreView(this.$route.query.tempStoreId)
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
    // 加载 样本,顾客,已填写细胞信息列表
    getTempStoreView(tempStoreId) {
      getTempStoreView(tempStoreId).then(res => {
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
          // 已填写的细胞信息列表
          this.cellCulture = res.data.cellCulture
          // 细胞暂存位置信息
          this.cellLocations = res.data.cellLocations
          // 暂存信息
          this.tempStore = res.data.tempStore
          // 暂存的血清信息
          this.serumLocationView = res.data.serumLocationView

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
    // 关闭查看页面
    close() {
      this.closeTag({
        name: 'tempStoreView',
        query: {
          id: 'tempStoreView',
          tempStoreId: this.$route.query.tempStoreId
        }
      })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'tempStoreView' && this.tempStoreId !== this.$route.query.tempStoreId) {
        this.tempStoreId = this.$route.query.tempStoreId
      }
    },
    tempStoreId() {
      // 样本,顾客,已填写细胞信息列表
      this.getTempStoreView(this.$route.query.tempStoreId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
