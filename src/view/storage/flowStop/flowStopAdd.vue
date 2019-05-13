<template>
  <div>
    <Form ref="flowStopForm" :model="flowStopTemp" :rules="rules" :label-width="90" >
      <Card title="报废信息" class="scrap-from">
        <a href="#" slot="extra" @click.prevent="chooseSampleCode">
          <Button class="ivu-btn-success">
             <Icon type="ios-loop-strong"></Icon>
              选择细胞
          </Button>
        </a>
        <Row  :gutter="56">
            <Col span="12">
              <Form-item label="样本条码" prop="sampleCode">
                <Input type="text" v-model="flowStopTemp.sampleCode" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="细胞编码" prop="batchNo">
                <Input type="text" v-model="flowStopTemp.batchNo" :maxlength="20" disabled ></Input>
              </Form-item>
            </Col>
        </Row>
        <Row  :gutter="56">
            <Col span="12">
              <Form-item label="细胞规格" prop="standard">
                <Input type="text" v-model="flowStopTemp.standard" :maxlength="20" disabled ></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="报废数量" prop="amount">
                <Input type="text" v-model="flowStopTemp.amount" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
        </Row>
        <Row  :gutter="56">
            <Col span="24">
              <Form-item label="报废原因" prop="reason">
                <Input type="text" v-model="flowStopTemp.reason" :maxlength="100"></Input>
              </Form-item>
            </Col>
        </Row>
        <Row  :gutter="56">
            <Col span="12">
              <Form-item label="申请人" prop="proposer" >
                <Input type="text" v-model="flowStopTemp.proposer" :maxlength="20" disabled></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="申请日期" prop="appDate">
                <DatePicker type="date" placeholder="选择日期" :options="optionsDate" :value="flowStopTemp.appDate" @on-change="flowStopTemp.appDate=$event" style="width:100%"></DatePicker>
              </Form-item>
            </Col>
        </Row>
      </Card>
      <div class="form-btn">
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="createData" >提交</Button>
        <Button class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close"  style="margin-left:20px" >关闭</Button>
      </div>
    </Form>
    <Modal
    v-model="dialogFormVisible"
    title="选择细胞"
    class-name="vertical-center-modal"
    :mask-closable="false"
    :footer-hide="true"
    width="800"
    >
      <div class="search-con search-con-top">
        <Input v-model="waitCollectQuery.sampleCode" @on-change="waitCollectClear" placeholder="样本条码" class="search-input" style="width:190px" clearable />
        <Button @click="waitCollectSearch" class="search-btn">查询</Button>
      </div>
      <Table :data="waitCollectList" :columns="waitCollectColumns" @on-row-dblclick="dbclickRow" :loading="waitCollectListLoading" border stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="waitColletTotal>0"
            :total="waitColletTotal"
            :current.sync="waitCollectQuery.pageNumber"
            :page-size.sync="waitCollectQuery.pageSize"
            @on-change="getPageCellCultureList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { addflowStop } from '@/api/flowStop'
import { pageNotStopFlowCellBySampleCode } from '@/api/cellCulture'
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
        auditType: '1'
      },
      rules: {
        sampleCode: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        batchNo: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '必填项，不能为空', trigger: 'blur' }
        ],
        amount: [
          {
            required: true,
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: '请输入正确的数量',
            trigger: 'blur'
          }
        ],
        appDate: [
          { required: true, message: '必填项，不能为空', trigger: 'change' }
        ]
      },
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      loading: true,
      waitCollectQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: ''
      },
      waitCollectListLoading: false,
      waitCollectList: [],
      waitColletTotal: 0,
      waitCollectColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitCollectQuery.pageNumber - 1) * this.waitCollectQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '细胞规格',
          key: 'specification',
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              params.row.specification + '  ' +
              this.specificationUnitText(params.row.specificationUnit)
            )
          } }
      ],
      dialogFormVisible: false

    }
  },
  mounted() {

  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    specificationUnitText(unit) {
      const units = ['/1ml/管', 'ml/袋']
      return units[unit - 1]
    },
    createData() {
      this.$refs['flowStopForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        addflowStop(this.flowStopTemp).then(res => {
          this.changeLoading()
          this.close()
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.$Message.error(error.msg)
        })
      })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    chooseSampleCode() {
      this.dialogFormVisible = true
      this.getPageCellCultureList()
    },
    // 获取待培养细胞数据列表
    getPageCellCultureList() {
      this.waitCollectListLoading = true
      pageNotStopFlowCellBySampleCode(this.waitCollectQuery).then(res => {
        // 待培养细胞的样本总条数
        this.waitCount = res.data.totalRow
        this.waitCollectList = res.data.list
        this.waitColletTotal = res.data.totalRow
        this.waitCollectListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitCollectClear(e) {
      if (!e.target.value) {
        this.getPageCellCultureList()
      }
    },
    // 查询细胞待培养列表
    waitCollectSearch() {
      this.waitCollectQuery.pageNumber = 1
      this.getPageCellCultureList()
    },
    dbclickRow(currentRow, index) {
      this.flowStopTemp.sampleCode = currentRow.sampleCode
      this.flowStopTemp.batchNo = currentRow.produceNumber
      this.flowStopTemp.standard = currentRow.specification + ' ' + this.specificationUnitText(currentRow.specificationUnit)
      this.flowStopTemp.amount = currentRow.sampleType === 3 ? currentRow.serumQuantity : currentRow.cellQuantity
      this.dialogFormVisible = false
    },
    // 关闭表单
    close() {
      this.closeTag({
        name: 'flowStopAdd'
      })
    }
  }
}
</script>

