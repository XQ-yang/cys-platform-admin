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
              <DatePicker type="datetime" placeholder="请选择采集时间" v-model="sample.collectTime" format="yyyy-MM-dd HH:mm" disabled  class="ivu-date-picker-100"></DatePicker>
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
              <DatePicker type="datetime" placeholder="选择日期" v-model="item.cultureTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100" disabled></DatePicker>
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
                  <Select v-model="item.specificationUnit" placeholder="请选择" disabled clearable>
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
              <DatePicker type="datetime" placeholder="选择日期" v-model="item.receiveTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100" disabled></DatePicker>
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
    <Form ref="cellCultureAddForm" :model="cellCulture" :rules="rules" :loading="registerFormLoading" :label-width="110" >
      <!-- 新增细胞培养信息的表单 -->
      <Card :title="'第'+ ((sample.cultureTimes ? sample.cultureTimes : 0) + 1) +'次细胞信息'">
          <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞总量" prop="cellTotalText">
              <!-- <Input type="text" placeholder="如: 1.448e8" v-model="cellCulture.cellTotalText" :maxlength="11"></Input> -->
              <Input type="text" placeholder="请输入0.1-1000的数值" v-model="cellCulture.cellTotalText" style="width:80%;" :maxlength="11"></Input> 千万
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="培养日期" prop="cultureTime">
              <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.cultureTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100"></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="细胞活率" prop="cellViability">
              <Input type="text" v-model="cellCulture.cellViability" style="width:90%;" :maxlength="8" number></Input> %
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="细胞编码" prop="produceNumber">
              <Input type="text" v-model="cellCulture.produceNumber" :maxlength="30"></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Row>
              <Col span="17">
                <Form-item label="规格" prop="specification">
                  <Input type="text" v-model="cellCulture.specification" :maxlength="30"></Input>
                </Form-item>
              </Col>
              <Col span="7">
                <Form-item prop="specificationUnit" :label-width="5">
                  <Select v-model="cellCulture.specificationUnit" placeholder="请选择" clearable>
                    <Option :value="1">/1ml/管</Option>
                    <Option :value="2">ml/袋</Option>
                  </Select>
                </Form-item>
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Form-item v-if="sample.sampleType === 3" label="存储数量" prop="serumQuantity">
              <Input type="text" v-model="cellCulture.serumQuantity" :maxlength="3"></Input>
            </Form-item>
            <Form-item v-if="sample.sampleType !== 3" label="存储数量" prop="cellQuantity">
              <Input type="text" v-model="cellCulture.cellQuantity" :maxlength="3"></Input>
            </Form-item>
          </Col>
        </Row>
        <!-- <Row v-if="sample.sampleType !== 3" :gutter="48">
          <Col span="8">
            <Form-item label="冻存液批号" prop="freezeFluid">
              <Input type="text" v-model="cellCulture.freezeFluid" :maxlength="30"></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="存储数量" prop="cellQuantity">
              <Input type="text" v-model="cellCulture.cellQuantity" :maxlength="3"></Input>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row> -->
         <Row :gutter="48">
          <Col span="8">
            <Form-item label="接收人" prop="receiveUserName">
              <Input type="text" v-model="cellCulture.receiveUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="接收时间" prop="receiveTime">
              <DatePicker type="datetime" placeholder="选择日期" v-model="cellCulture.receiveTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100"></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="培养完成" prop="isCultureFinished">
              <RadioGroup v-model="cellCulture.isCultureFinished">
                <Radio :label="1">是</Radio>
                <Radio :label="0">否</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item :label-width="0">
              <!-- 当前培养领用的物料信息 -->
              <Table :data="caculateApplyDetailList(applyDetailList, cellCulture.produceNumber)" :columns="applyDetailColumns" border stripe></Table>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getCellCultureView, addCellCulture, existProduceNumber } from '@/api/cellCulture.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
export default {
  name: 'cultureAdd',
  data() {
    const validateProduceNumber = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      existProduceNumber(value).then(res => {
        if (res.data) {
          callback(new Error('细胞编码已经存在'))
        } else {
          callback()
        }
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    }
    const validateCellTotalText = (rule, value, callback) => {
      if (value && value > 1000) {
        callback(new Error('数值不能超过1000'))
      } else if (value && value <= 0) {
        callback(new Error('数值必须大于0'))
      } else {
        callback()
      }
    }
    const validateCellViability = (rule, value, callback) => {
      if (!value || value <= 0 || value >= 100) {
        callback(new Error('细胞活率必须为0-100数值'))
      } else {
        callback()
      }
    }

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
      // 待提交的细胞信息
      cellCulture: {
        specificationUnit: 1,
        cultureTime: new Date(),
        receiveTime: new Date()
      },
      rules: {
        cellTotalText: [
          { type: 'string', required: true, pattern: /^(\d+(?:\.\d+)?)$/, message: '请输入正确的数值', trigger: 'change' },
          { validator: validateCellTotalText, trigger: 'change' }
        ],
        cultureTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        cellViability: [
          { type: 'number', required: true, message: '请输入数字', trigger: 'change' },
          { validator: validateCellViability, trigger: 'change' }
        ],
        freezeFluid: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        cellQuantity: [
          // { type: 'number', required: true, message: '请输入数字', trigger: 'change' }
          { type: 'string', required: true, pattern: /^[0-9]*[1-9][0-9]*$/, message: '存储数量必须为正整数', trigger: 'change' }
        ],
        serumQuantity: [
          { type: 'string', required: true, pattern: /^[0-9]*[1-9][0-9]*$/, message: '存储数量必须为正整数', trigger: 'change' }
        ],
        specification: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        produceNumber: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' },
          { validator: validateProduceNumber, trigger: 'change' }
        ],
        specificationUnit: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isCultureFinished: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        receiveUserName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        receiveTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      },
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
    // 细胞培养接收人人
    this.getUserInfo()
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
    // 获取细胞接收人（当前登录用户）
    getUserInfo() {
      getUserInfo().then(res => {
        this.cellCulture.receiveUserName = res.data.realName
        this.cellCulture.receiveUserId = res.data.id
      }).catch(error => {
        this.$Message.error(error.msg)
      })
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
          // 给新增的细胞培养信息赋值样本id
          this.cellCulture.sampleId = res.data.sample.id
          // 给新增的细胞培养信息赋值客户id
          this.cellCulture.customerId = res.data.sample.customerId
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
    // 提交表单，保存填写的细胞信息
    submit() {
      this.$refs['cellCultureAddForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        // 将科学计数法转为数值
        this.cellCulture.cellTotal = Number.parseFloat(this.cellCulture.cellTotalText) * 10000000
        addCellCulture(this.cellCulture).then(res => {
          this.changeLoading()
          this.$Message.success(res.msg)
          this.closeTag({
            name: 'cultureAdd',
            query: {
              id: 'cultureAdd',
              sampleId: this.$route.query.sampleId
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
        name: 'cultureAdd',
        query: {
          id: 'cultureAdd',
          sampleId: this.$route.query.sampleId
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
      if (to.name === 'cultureAdd' && this.sampleId !== this.$route.query.sampleId) {
        this.sampleId = this.$route.query.sampleId
      }
    },
    sampleId() {
      // 细胞培养接收人人
      this.getUserInfo()
      // 样本,顾客,已填写细胞信息列表
      this.getCellCultureView(this.$route.query.sampleId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
