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
    <Form ref="flowStopForm" :model="cellCulture" :loading="registerFormLoading" :label-width="110">
      <Card title="细胞信息">
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞总量">
              <Input type="text" v-model="cellCulture.cellTotal" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="培养日期">
              <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.cultureTime" format="yyyy-MM-dd HH:mm" style="width:100%;" disabled></DatePicker>
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
        <Row v-if="tempCellLocations && tempCellLocations.length && sample.sampleType !== 3" :gutter="48">
          <Col span="24">
            <Form-item label="细胞暂存位置">
              <Tag v-if="tempCellLocations && tempCellLocations.length" :key="1" color="green">{{caculateLocation(tempCellLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row v-if="cellLocations && cellLocations.length && sample.sampleType !== 3" :gutter="48">
          <Col span="24">
            <Form-item label="细胞存储位置">
              <Tag v-if="cellLocations && cellLocations.length" :key="1" color="green">{{caculateLocation(cellLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row v-if="serumLocationView && sample.sampleType === 3" :gutter="48">
          <Col span="24">
            <Form-item label="血清存储位置">
              <Tag v-if="serumLocationView && serumLocationView.cellLocations && serumLocationView.cellLocations.length" color="green">{{caculateLocation(serumLocationView.cellLocations)}}</Tag>
              <Tag v-else-if="serumLocationView && serumLocationView.serumLocations && serumLocationView.serumLocations.length" color="green">{{fridgeCaculateLocation(serumLocationView.serumLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row v-if="testCellLocation" :gutter="48">
          <Col span="24">
            <Form-item label="检测样品存储位置">
              <Tag v-if="testCellLocation" color="green">{{testCellLocation.potCode +' 罐-'+ testCellLocation.regionCode +' 区-'+ testCellLocation.towerCode +' 塔-'+ testCellLocation.boxCode +' 盒-第 '+ testCellLocation.latticeNum +' 号管'}}</Tag>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close" style="margin-left:20px">关闭</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { num2e } from '@/libs/tools.js'
import { getFlowStopView, outStock } from '@/api/flowStop'
import { mapMutations } from 'vuex'
import { caculateLocation, fridgeCaculateLocation } from '@/libs/cell.js'
export default {
  data() {
    return {
      registerFormLoading: true,
      projectTypeList: [],
      sampleTypeList: [],
      // 样本信息
      sample: {},
      // 客户信息
      customer: {},
      // 已填写的细胞信息
      cellCulture: {},
      // 细胞暂存位置信息列表
      tempCellLocations: [],
      // 细胞入库位置信息列表
      cellLocations: [],
      // 血清入库位置
      serumLocationView: null,
      // 检测样本存储位置
      testCellLocation: null,
      id: this.$route.query.id
    }
  },
  mounted() {
    this.getFlowStopView()
    // 初始化样本类型数据
    this.getSampleTypeList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.registerFormLoading = false
      this.$nextTick(() => {
        this.registerFormLoading = true
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
    // 根据细胞位置集合, 计算细胞位置所在位置文本
    caculateLocation(cellLocations) {
      return caculateLocation(cellLocations)
    },
    fridgeCaculateLocation(cellLocations) {
      return fridgeCaculateLocation(cellLocations)
    },
    getFlowStopView() {
      getFlowStopView(this.id).then(res => {
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          this.projectTypeList = res.data
        }).then(() => {
          // 样本信息
          this.sample = res.data.sample
          // 已填写的细胞信息列表
          this.cellCulture = res.data.cellCulture
          // 细胞暂存位置信息
          this.tempCellLocations = res.data.tempCellLocations
          // 细胞入库位置信息
          this.cellLocations = res.data.cellLocations
          // 入库的血清信息
          this.serumLocationView = res.data.serumLocationView
          // 检测样本存储位置
          this.testCellLocation = res.data.testCellLocation

          this.cellCulture.cellTotal = num2e(this.cellCulture.cellTotal)
        }).catch(error => {
          this.$Message.error(error.msg)
        })
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    submit() {
      outStock(this.id).then(res => {
        this.changeLoading()
        this.$Message.success(res.msg)
        this.closeTag({
          name: 'flowStopStockOut',
          query: {
            id: this.id
          }
        })
      }).catch(error => {
        this.changeLoading()
        this.$Message.error(error.msg)
      })
    },
    // 关闭表单
    close() {
      this.closeTag({
        name: 'flowStopStockOut',
        query: {
          id: this.id
        }
      })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'flowStopStockOut' && this.id !== this.$route.query.id) {
        this.id = this.$route.query.id
      }
    },
    id() {
      this.getFlowStopView()
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
