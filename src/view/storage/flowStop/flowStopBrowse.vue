<template>
  <div>
    <Form ref="flowStopForm" :model="flowStopTemp" :rules="rules" :label-width="90" style="padding-right:20px;">
      <Card title="报废信息">
        <Row>
            <Col span="12">
              <Form-item label="样本条码">
                <Input type="text" v-model="flowStopTemp.sampleCode" disabled :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="细胞编码">
                <Input type="text" v-model="flowStopTemp.batchNo" disabled :maxlength="20" ></Input>
              </Form-item>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <Form-item label="细胞规格">
                <Input type="text" v-model="flowStopTemp.standard" disabled :maxlength="20" ></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="报废数量">
                <Input type="text" v-model="flowStopTemp.amount" disabled :maxlength="20" ></Input>
              </Form-item>
            </Col>
        </Row>
        <Row>
            <Col span="24">
              <Form-item label="报废原因">
                <Input type="text" v-model="flowStopTemp.reason" disabled :maxlength="100"></Input>
              </Form-item>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <Form-item label="申请人">
                <Input type="text" v-model="flowStopTemp.proposer" disabled :maxlength="20"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="申请日期">
                <DatePicker type="date" placeholder="选择日期" disabled :options="optionsDate" :value="flowStopTemp.appDate" @on-change="flowStopTemp.appDate=$event" style="width:100%"></DatePicker>
              </Form-item>
            </Col>
        </Row>
      </Card>
      <Card title="审核信息">
        <Row>
          <Col span="24">
            <Form-item label="审核结果">
              <RadioGroup v-model="flowStopTemp.auditRes">
                <Radio :label="1" disabled>同意</Radio>
                <Radio :label="0" disabled>不同意</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="处理结果">
              <CheckboxGroup v-model="flowStopTemp.audit">
                <Checkbox label="重采" disabled ></Checkbox>
                <Checkbox label="退款" disabled></Checkbox>
              </CheckboxGroup>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Form-item label="审核意见">
              <Input type="text" v-model="flowStopTemp.opinion" :maxlength="100" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Form-item label="审核人">
              <Input type="text" v-model="flowStopTemp.auditor" :maxlength="20" disabled></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="审核时间">
                <DatePicker type="date" placeholder="选择日期" :options="optionsDate" :value="flowStopTemp.auditingDate" @on-change="flowStopTemp.auditingDate=$event" style="width:100%"  disabled></DatePicker>
            </Form-item>
          </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close"  style="margin-left:20px" >关闭</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import { getFlowStop } from '@/api/flowStop'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      flowStopTemp: {
        id: undefined,
        sampleCode: '', // 样本条码
        batchNo: '', // 细胞编码
        standard: '', // 细胞规格
        amount: '', // 报废数量
        reason: '', // 报废原因
        proposer: this.$store.state.user.userName, // 申请人
        appDate: '', // 申请日期
        audit: [], // 处理结果
        auditRes: null, // 审核结果
        opinion: '', // 审核意见
        auditor: '', // 审核人
        auditingDate: '', // 审核日期
        auditType: ''
      },
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      loading: true,
      id: this.$route.query.id
    }
  },
  mounted() {
    this.getFlowStopById()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getFlowStopById() {
      getFlowStop(this.id).then(res => {
        this.flowStopTemp = Object.assign({}, res.data)
        this.flowStopTemp.auditType = '2'
        // this.flowStopTemp.auditor = this.$store.state.user.userName
        if (this.flowStopTemp.audit) {
          this.flowStopTemp.audit = this.flowStopTemp.audit.split(',')
        } else {
          this.flowStopTemp.audit = []
        }
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 关闭表单
    close() {
      this.closeTag({
        name: 'flowStopBrowse',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>
