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
    <Form ref="storeForm" :model="store" :loading="registerFormLoading" :label-width="110" >
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
                <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.receiveTime" format="yyyy-MM-dd HH:mm" style="width:100%;" disabled></DatePicker>
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
              <DatePicker type="datetime" placeholder="选择日期" v-model="qualityCheck.qualityCheckTime" format="yyyy-MM-dd HH:mm"  style="width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="取样检测时间">
              <DatePicker type="datetime" placeholder="选择日期" v-model="qualityCheck.sampleTestTime" format="yyyy-MM-dd HH:mm" style="width:100%;" class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="存储时间">
                <DatePicker type="datetime" placeholder="选择日期" v-model="store.storeTime" format="yyyy-MM-dd" style="width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item v-if="sample.sampleType !== 3" label="存储年限">
              <Input type="text" v-model="store.storeYear" :maxlength="3" style="width:90%;" number disabled></Input> 年
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row v-if="sample.sampleType !== 3" :gutter="48">
          <Col span="24">
            <Form-item label="存储位置">
              <Tag v-if="cellLocations && cellLocations.length" :key="1" color="green">{{caculateLocation(cellLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row v-if="sample.sampleType === 3" :gutter="48">
          <Col span="24">
            <Form-item label="血清存储位置">
              <Tag v-if="serumLocationView && serumLocationView.cellLocations && serumLocationView.cellLocations.length" color="green">{{caculateLocation(serumLocationView.cellLocations)}}</Tag>
              <Tag v-else-if="serumLocationView && serumLocationView.serumLocations && serumLocationView.serumLocations.length" color="green">{{fridgeCaculateLocation(serumLocationView.serumLocations)}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="检测样品存储位置">
              <Tag v-if="testCellLocation" color="green">{{testCellLocation.potCode +' 罐-'+ testCellLocation.regionCode +' 区-'+ testCellLocation.towerCode +' 塔-'+ testCellLocation.boxCode +' 盒-第 '+ testCellLocation.latticeNum +' 号管'}}</Tag>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="入库放行记录">
              <Alert v-for="item in storageReleaseRecordFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
              <!-- <div v-for="item in storageReleaseRecordFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></div> -->
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="审查结论">
              <RadioGroup v-model="store.reviewRes">
                <Radio :label="1" disabled>符合规定，允许放行</Radio>
                <Radio :label="0" disabled>不符合规定，拒绝放行</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <FormItem label="入库备注">
              <Input v-model="store.storeRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="QA">
              <Input type="text" v-model="store.qaUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="审核时间">
                <DatePicker type="datetime" placeholder="选择日期" v-model="store.reviewTime" format="yyyy-MM-dd HH:mm" style="width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
           <Form-item label="入库人">
              <Input type="text" v-model="store.storeUserName" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row v-if="otherReportFile" :gutter="48">
          <Col span="24">
            <Form-item label="其他报告附件">
              <Alert v-for="item in otherReportFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
              <!-- <div v-for="item in otherReportFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></div> -->
            </Form-item>
          </Col>
        </Row>
        <Row v-if="storageCardFile" :gutter="48">
          <Col span="24">
            <Form-item label="存储凭证">
              <Alert v-for="item in storageCardFile" :key="item.id"><a target="_blank" :href="item.mediaPath">{{item.originalMediaName}}</a></Alert>
              <!-- <div v-for="item in storageCardFile" :key="item.id">
                <img :src="item.mediaPath" style="width: 100%;" />
              </div> -->
            </Form-item>
          </Col>
        </Row>
        <Row v-if="cellCulture.status === 5" :gutter="48">
          <Col span="24">
            <FormItem label="复核备注">
              <Input v-model="store.recheckRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="255" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="cellCulture.status === 5" :gutter="48">
          <Col span="8">
            <Form-item label="复核人">
              <Input type="text" v-model="store.recheckUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="复核时间">
              <DatePicker type="datetime" placeholder="选择日期" v-model="store.recheckTime" format="yyyy-MM-dd HH:mm" style="width:100%;" disabled></DatePicker>
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
import { getStoreView } from '@/api/cellCulture.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
import { caculateLocation, fridgeCaculateLocation } from '@/libs/cell.js'
export default {
  name: 'storeView',
  data() {
    return {
      // 细胞存储id
      storeId: '',
      registerFormLoading: true,
      projectTypeList: [],
      sampleTypeList: [],
      // 样本信息
      sample: {},
      // 客户信息
      customer: {},
      // 已填写的细胞信息
      cellCulture: {},
      // 细胞质检信息
      qualityCheck: {},
      // 质检报告文件列表
      qualityCheckReportFile: [],
      // 细胞入库主体信息
      store: {},
      // 细胞入库位置信息列表
      cellLocations: [],
      // 血清入库位置
      serumLocationView: null,
      // 检测样本存储位置
      testCellLocation: null,
      // 入库放行记录文件列表
      storageReleaseRecordFile: [],
      // 其他报告附件
      otherReportFile: [],
      // 存储凭证
      storageCardFile: []
    }
  },
  mounted() {
    // 样本,顾客,已填写细胞信息列表
    this.getStoreView(this.$route.query.storeId)
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
    fridgeCaculateLocation(cellLocations) {
      return fridgeCaculateLocation(cellLocations)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getStoreView(storeId) {
      getStoreView(storeId).then(res => {
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
          // 质检信息
          this.qualityCheck = res.data.qualityCheck
          // 质检报告文件列表
          this.qualityCheckReportFile = res.data.qualityCheckReportFile
          // 细胞入库主体信息
          this.store = res.data.store
          // 细胞入库位置信息
          this.cellLocations = res.data.cellLocations
          // 入库的血清信息
          this.serumLocationView = res.data.serumLocationView
          // 检测样本存储位置
          this.testCellLocation = res.data.testCellLocation
          // 入库放行记录文件列表
          this.storageReleaseRecordFile = res.data.storageReleaseRecordFile
          // 其他报告附件
          this.otherReportFile = res.data.otherReportFile
          // 存储凭证
          this.storageCardFile = res.data.storageCardFile

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
        name: 'storeView',
        query: {
          id: 'storeView',
          storeId: this.$route.query.storeId
        }
      })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'storeView' && this.storeId !== this.$route.query.storeId) {
        this.storeId = this.$route.query.storeId
      }
    },
    storeId() {
      // 样本,顾客,已填写细胞信息列表
      this.getStoreView(this.$route.query.storeId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
