<template>
  <div>
    <Form ref="cellCultureSampleForm" :model="sample" :loading="registerFormLoading" :label-width="110" >
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
    <Form ref="cellCultureCustomerForm" :model="customer" :loading="registerFormLoading" :label-width="110" >
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
    <Form ref="cellCultureListForm" :model="{}" :loading="registerFormLoading" :label-width="110" >
      <!-- 已经填写的细胞信息列表 -->
      <Card v-for="item in cellCultureList" :key="item.id" :title="'第'+ item.cultureTimes +'次细胞信息'">
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞总量">
              <Input type="text" v-model="item.cellTotal" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="培养日期">
              <DatePicker type="datetime" placeholder="选择日期" v-model="item.cultureTime" format="yyyy-MM-dd HH:mm" class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="细胞活率">
              <Input type="text" v-model="item.cellViability" style="width:90%;" disabled></Input> %
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞编码">
              <Input type="text" v-model="item.produceNumber" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Row>
              <Col span="17">
                <Form-item label="规格">
                  <Input type="text" v-model="item.specification" disabled></Input>
                </Form-item>
              </Col>
              <Col span="7">
                <Form-item :label-width="5">
                  <Select v-model="item.specificationUnit" disabled clearable>
                    <Option :value="1">/1ml/管</Option>
                    <Option :value="2">ml/袋</Option>
                  </Select>
                </Form-item>
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Form-item v-if="sample.sampleType === 3" label="存储数量">
              <Input type="text" v-model="item.serumQuantity" disabled></Input>
            </Form-item>
            <Form-item v-if="sample.sampleType !== 3" label="存储数量">
              <Input type="text" v-model="item.cellQuantity" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <!-- <Row v-if="sample.sampleType !== 3" :gutter="48">
          <Col span="8">
            <Form-item label="冻存液批号">
              <Input type="text" v-model="item.freezeFluid" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="存储数量">
              <Input type="text" v-model="item.cellQuantity" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row> -->
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="接收人">
              <Input type="text" v-model="item.receiveUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="接收时间">
                <DatePicker type="datetime" placeholder="选择日期" v-model="item.receiveTime" format="yyyy-MM-dd HH:mm" class="ivu-date-picker-100" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="培养完成">
              <RadioGroup v-model="item.isCultureFinished">
                <Radio :label="1" disabled>是</Radio>
                <Radio :label="0" disabled>否</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item :label-width="0">
              <!-- 当前培养领用的物料信息 -->
              <Table :data="caculateApplyDetailList(applyDetailList, item.produceNumber)" :columns="applyDetailColumns" border stripe></Table>
            </Form-item>
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
import { getCellCultureView } from '@/api/cellCulture.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
export default {
  name: 'cultureView',
  data() {
    return {
      // 样本id
      sampleId: '',
      registerFormLoading: true,
      projectTypeList: [],
      sampleTypeList: [],
      // 样本信息
      sample: {},
      // 客户信息
      customer: {},
      // 已填写的细胞信息
      cellCultureList: {},
      // 培养物料领用信息列表
      applyDetailList: [],
      applyDetailColumns: [
        {
          title: '序号',
          width: 70,
          type: 'index'
        },
        { title: '物料编号', key: 'materialNo' },
        { title: '物料名称', key: 'materialName' },
        { title: '批号', key: 'batchNumber' },
        {
          title: '生产日期',
          key: 'productTime',
          width: 116,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.productTime, 'yyyy-MM-dd')
            )
          }
        },
        {
          title: '有效期',
          key: 'expireTime',
          width: 116,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.expireTime, 'yyyy-MM-dd')
            )
          }
        },
        // { title: '单位', key: 'units', width: 80 },
        { title: '生产编号', key: 'productNo' },
        { title: '生产厂家', key: 'manufacturers' },
        {
          title: '领用量',
          key: 'applyQuantity'
        },
        {
          title: '领用单位',
          key: 'quality'
        },
        {
          title: '备注',
          key: 'remark'
        }
      ]
    }
  },
  mounted() {
    // 样本,顾客,已填写细胞信息列表
    this.getCellCultureView(this.$route.query.sampleId)
    // 初始化样本类型数据
    this.getSampleTypeList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 根据所有的当前样本下的领用物料, 和细胞编码计算该次培养领用的物料
    caculateApplyDetailList(applyDetailList, cellCode) {
      if (!applyDetailList) {
        return []
      }
      return applyDetailList.filter(item => item.cellCode === cellCode)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getCellCultureView(sampleId) {
      getCellCultureView(sampleId).then(res => {
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
          this.cellCultureList = res.data.cellCultureList
          // 培养物料领用信息列表
          this.applyDetailList = res.data.applyDetailList
          // 转换细胞总量的显示为科学计数法
          this.cellCultureList.map(cellCulture => {
            cellCulture.cellTotal = num2e(cellCulture.cellTotal)
            return cellCulture
          })
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
        name: 'cultureView',
        query: {
          id: 'cultureView',
          sampleId: this.$route.query.sampleId
        }
      })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'cultureView' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 样本,顾客,已填写细胞信息列表
      this.getCellCultureView(this.$route.query.sampleId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
