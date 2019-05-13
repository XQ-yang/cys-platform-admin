<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear" clearable placeholder="顾客姓名" class="search-input" v-model="listQuery.customerName"/>
        <Input @on-change="handleClear"  clearable placeholder="样本条码" class="search-input" v-model="listQuery.sampleCode"/>

        <DatePicker  @on-change="handleDateClear" type="date" v-model="listQuery.reciveTimeMin" style="width: 200px;margin-right:10px;" format="yyyy-MM-dd" placeholder="接收日期开始" ></DatePicker>
        <DatePicker  @on-change="handleDateClear" type="date" v-model="listQuery.reciveTimeMax" style="width: 200px;margin-right:10px;" format="yyyy-MM-dd" placeholder="接收日期结束" ></DatePicker>
        <Button @click="handleSearch" class="search-btn">查询</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"></Page>
        </div>
      </div>
    </Card>
  </div>

</template>
<script>
import '@/assets/css/common.less'
import { getSampleHandoverList, getHalfYearParams } from '@/api/statistics'

export default {
  name: 'handover',
  data() {
    return {
      list: [],
      tableColumns: [
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1)
          }
        },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '采集数量', key: 'collectQuantity', tooltip: true },
        { title: '交接人', key: 'transporter', tooltip: true },
        { title: '接样人', key: 'reciver', tooltip: true },
        { title: '交接日期',
          key: 'reciveTime',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.reciveTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '备注', key: 'remark', tooltip: true }
      ],
      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        customerName: '',
        reciveTimeMin: '',
        reciveTimeMax: ''
      },
      isFirstEnter: true
    }
  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
    if (this.isFirstEnter) {
      // 获取列表数据
      this.getHalfYearParams()
    }
    // this.getList()
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取列表数据
      this.getHalfYearParams()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  // 组件方法
  methods: {
    getHalfYearParams() {
      getHalfYearParams().then(res => {
        this.listQuery.reciveTimeMin = res.data.dateMin
        this.listQuery.reciveTimeMax = res.data.dateMax
        this.getList()
      })
    },
    getList() {
      this.tableLoading = true
      getSampleHandoverList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRow
        this.tableLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },

    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e.target.value === '') {
        this.getList()
      }
    },
    handleDateClear(v) {
      if (v === '') {
        this.getList()
      }
    }
  }
}
</script>
<style >

</style>
