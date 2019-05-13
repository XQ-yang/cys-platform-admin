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
    <Form ref="qualityCheckAddForm" :model="qualityCheckAdd" :rules="rules" :loading="registerFormLoading" :label-width="110" >
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
          <Col span="8">
            <Form-item label="冻存是否完成" prop="isCryopreservation">
              <RadioGroup v-model="qualityCheckAdd.isCryopreservation">
                <Radio :label="1">是</Radio>
                <Radio :label="0">否</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="是否阳性样本" prop="isPositiveSample">
              <RadioGroup v-model="qualityCheckAdd.isPositiveSample">
                <Radio :label="1">是</Radio>
                <Radio :label="0">否</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="报告编号" prop="reportNumber">
              <Input type="text" placeholder="请输入报告编号" v-model="qualityCheckAdd.reportNumber"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="质量检测结果" prop="qualityCheckRes">
              <RadioGroup v-model="qualityCheckAdd.qualityCheckRes">
                <Radio :label="1">符合规定</Radio>
                <Radio :label="0">不符合规定</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
          <Col span="16">
            <Form-item label="质检结果备注" prop="qualityCheckRemark">
              <Input type="text" placeholder="如果选择不符合规定请输入质检结果备注" v-model="qualityCheckAdd.qualityCheckRemark"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="24">
            <Form-item label="上传质检报告" prop="qualityCheckReportFile" class="ivu-form-item-required">
              <Upload
              ref="upload"
              :action="actionUrl"
              :headers="headers"
              multiple
              paste
              accept=".png,.jpg,.jpeg,.pdf"
              :before-upload="handleBeforeUpload"
              :max-size="102400"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleUploadSuccess"
              :on-preview="handleUploadPreview">
                <Button icon="ios-cloud-upload-outline" style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传png, jpg, jpeg或pdf格式的文件,最大100M)</span>
              </Upload>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="48">
          <Col span="8">
            <Form-item label="质检人" prop="qualityCheckUserName">
              <Input type="text" v-model="qualityCheckAdd.qualityCheckUserName" disabled></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="质检报告时间" prop="qualityCheckTime">
              <DatePicker type="datetime" placeholder="选择日期" v-model="qualityCheckAdd.qualityCheckTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100"></DatePicker>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="取样检测时间" prop="sampleTestTime">
              <DatePicker type="datetime" placeholder="选择日期" v-model="qualityCheckAdd.sampleTestTime" format="yyyy-MM-dd HH:mm"  class="ivu-date-picker-100"></DatePicker>
            </Form-item>
          </Col>
        </Row>
      </Card>
    </Form>
    <div class="form-btn">
      <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="submit">提交</Button>
      <Button class="ivu-btn ivu-btn-primary ivu-btn-large" style="margin-left:20px" @click="close">关闭</Button>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { getToken } from '@/libs/util'
import { getProjectTypeBySampleType, getSampleTypeList } from '@/api/projectType.js'
import { getQualityCheckAddView, addQualityCheck } from '@/api/cellCulture.js'
import { mapMutations } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
export default {
  name: 'qualityCheckAdd',
  data() {
    const validateQualityCheckRemark = (rule, value, callback) => {
      if (this.qualityCheckAdd.qualityCheckRes === 0 && !value) {
        callback(new Error('请输入质检结果备注'))
      } else {
        callback()
      }
    }
    const validateQualityCheckReportFile = (rule, value, callback) => {
      if (!this.$refs.upload.fileList || this.$refs.upload.fileList.length <= 0) {
        callback(new Error('请上传至少一份报告文件'))
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
      // 细胞质检信息
      qualityCheckAdd: {
        isCryopreservation: 1,
        isPositiveSample: 0,
        qualityCheckTime: new Date(),
        sampleTestTime: new Date(),
        qualityCheckReportFile: []
      },
      rules: {
        qualityCheckUserName: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        qualityCheckTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        sampleTestTime: [
          { type: 'date', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isCryopreservation: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        isPositiveSample: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        reportNumber: [
          { type: 'string', required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        qualityCheckRes: [
          { type: 'number', required: true, message: '必填项，不能为空', trigger: 'change' }
        ],
        qualityCheckRemark: [
          { validator: validateQualityCheckRemark, trigger: 'change' }
        ],
        qualityCheckReportFile: [
          { validator: validateQualityCheckReportFile, trigger: 'change' }
        ]
      },
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { 'Authorization': getToken() }
    }
  },
  mounted() {
    // 细胞培养接收人人
    this.getUserInfo()
    // 样本,顾客,已填写细胞信息列表
    this.getQualityCheckAddView(this.$route.query.cellCultureId)
    // 初始化样本类型数据
    this.getSampleTypeList()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
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
        this.qualityCheckAdd.qualityCheckUserName = res.data.realName
        this.qualityCheckAdd.qualityCheckUserId = res.data.id
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getQualityCheckAddView(cellCultureId) {
      getQualityCheckAddView(cellCultureId).then(res => {
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

          // 给新增的细胞暂存信息赋值细胞信息id
          this.qualityCheckAdd.cellCultureId = res.data.cellCulture.id

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
    // 切换样本类型时修改项目类型下拉数据
    // changeSampleType(sampleType) {
    //   getProjectTypeBySampleType(sampleType).then(res => {
    //     this.projectTypeList = res.data
    //   }).catch(error => {
    //     this.$Message.error(error.msg)
    //   })
    // },
    // 提交表单，保存填写的质检信息
    submit() {
      this.$refs['qualityCheckAddForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.qualityCheckAdd.qualityCheckReportFile = this.$refs.upload.fileList.map(file => file.id)
        addQualityCheck(this.qualityCheckAdd).then(res => {
          this.changeLoading()
          this.$Message.success(res.msg)
          this.closeTag({
            name: 'qualityCheckAdd',
            query: {
              id: 'qualityCheckAdd',
              cellCultureId: this.$route.query.cellCultureId
            }
          })
        }).catch(error => {
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    // 关闭查看页面
    close() {
      this.closeTag({
        name: 'qualityCheckAdd',
        query: {
          id: 'qualityCheckAdd',
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
      if (to.name === 'qualityCheckAdd' && this.cellCultureId !== this.$route.query.cellCultureId) {
        this.cellCultureId = this.$route.query.cellCultureId
      }
    },
    cellCultureId() {
      // 细胞培养接收人人
      this.getUserInfo()
      // 样本,顾客,已填写细胞信息列表
      this.getQualityCheckAddView(this.$route.query.cellCultureId)
      // 初始化样本类型数据
      this.getSampleTypeList()
    }
  }
}
</script>
