<template>
  <div>
    <Form ref="sampleForm" :model="sample" :label-width="90">
      <Card title="移库信息">
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
        <Row :gutter="48">
          <Col span="24">
            <FormItem label="移库备注">
              <Input v-model="transfer.transferRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :maxlength="255" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="移库人">
              <Input type="text" v-model="transfer.transferUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="移库时间">
              <DatePicker type="datetime" placeholder="选择日期" v-model="transfer.transferTime" format="yyyy-MM-dd HH:mm" style="width:100%;" disabled></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
      </Card>
    </Form>
    <Card title="移库位置及细胞信息">
      <Row :gutter="48">
        <Col span="24">
          <!--细胞位置信息及细胞信息-->
          <Table ref="outTable" :data="outCellLocations" :columns="cellLocationColumns" :loading="outCellLocationsLoading" height="280" border stripe></Table>
          <Tag v-if="outCellLocations && outCellLocations.length" :key="0" color="green">{{caculateLocation(outCellLocations)}}</Tag>
        </Col>
      </Row>
    </Card>
    <Card title="新入库位置及细胞信息">
      <Row :gutter="48">
        <Col span="24">
          <!--细胞位置信息及细胞信息-->
          <Table ref="inTable" :data="inCellLocations" :columns="cellLocationColumns" :loading="inCellLocationsLoading" height="280" border stripe></Table>
          <Tag v-if="inCellLocations && inCellLocations.length" :key="0" color="green">{{caculateLocation(inCellLocations)}}</Tag>
        </Col>
      </Row>
    </Card>
    <div class="form-btn">
      <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close">关闭</Button>
    </div>
  </div>
</template>

<script>
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getTransferView } from '@/api/cellCulture.js'
import { mapMutations } from 'vuex'
import { num2e } from '@/libs/tools.js'
import { caculateLocation } from '@/libs/cell.js'
export default {
  name: 'transferView',
  data() {
    return {
      // 细胞移库id
      transferId: '',
      registerFormLoading: true,
      projectTypeList: [],
      sampleTypeList: [],
      // 样本信息
      sample: {},
      // 客户信息
      customer: {},
      transfer: {},
      // 细胞移库存入位置信息列表
      inCellLocations: [],
      // 细胞移库取出位置信息列表
      outCellLocations: [],
      inCellLocationsLoading: false,
      outCellLocationsLoading: false,
      cellLocationColumns: [
        { type: 'index', title: '序号', width: 70, tooltip: true },
        { title: '存储位置',
          key: 'potCode',
          width: 250,
          tooltip: true,
          render: (h, params) => {
            var location = params.row.potCode + ' 罐-' +
                           params.row.regionCode + ' 区-' +
                           params.row.towerCode + ' 塔-' +
                           params.row.boxCode + ' 盒-' +
                           params.row.latticeNum + ' 号管'
            return h(
              'div',
              location
            )
          }
        },
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
      ]
    }
  },
  mounted() {
    // 样本,顾客,已填写细胞信息列表
    this.getTransferView(this.$route.query.transferId)
    // 初始化样本类型数据
    this.getSampleTypeList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 根据细胞位置集合, 计算细胞位置所在位置文本
    caculateLocation(cells) {
      return caculateLocation(cells)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getTransferView(transferId) {
      getTransferView(transferId).then(res => {
        // 加载项目类型下拉
        getProjectTypeBySampleType(res.data.sample.sampleType).then(res => {
          this.projectTypeList = res.data
        }).then(() => {
          // 样本信息
          this.sample = res.data.sample
          // 顾客信息
          this.customer = res.data.customer
          // 细胞移库主体信息
          this.transfer = res.data.transfer
          // 细胞移库存入位置信息列表
          this.inCellLocations = res.data.inCellLocations
          this.outCellLocations = res.data.outCellLocations
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
        name: 'transferView',
        query: {
          id: 'transferView',
          transferId: this.$route.query.transferId
        }
      })
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'transferView' && this.transferId !== this.$route.query.transferId) {
        this.transferId = this.$route.query.transferId
      }
    },
    transferId() {
      // 样本,顾客,已填写细胞信息列表
      this.getTransferView(this.$route.query.transferId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
