<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input @on-change="handleClear" clearable placeholder="存储人" class="search-input" v-model="listQuery.storeUserName"/>
        <Input @on-change="handleClear"  clearable placeholder="样本条码" class="search-input" v-model="listQuery.sampleCode"/>
        <DatePicker @on-change="handleDateClear" type="date" v-model="listQuery.storeTimeMin" style="width: 200px;margin-right:10px;" format="yyyy-MM-dd" placeholder="存储日期开始" ></DatePicker>
        <DatePicker @on-change="handleDateClear" type="date" v-model="listQuery.storeTimeMax" style="width: 200px;margin-right:10px;" format="yyyy-MM-dd" placeholder="存储日期结束" ></DatePicker>
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
import { getCellStoreList, getHalfYearParams } from '@/api/statistics'

export default {
  name: 'cellStore',
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
        { title: '入库日期',
          key: 'storeTime',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              this.$formatDate(params.row.storeTime, 'yyyy-MM-dd')
            )
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '存储数量', key: 'num', tooltip: true },
        { title: '液氮罐存储位置',
          key: 'pot_code',
          tooltip: true,
          minWidth: 240,
          render: (h, params) => {
            const row = params.row
            let text = `${row.potCode} 罐 - ${row.regionCode} 区 - ${row.towerCode} 塔
             - ${row.boxCode} 盒 - 第 ${row.minNum} - ${row.maxNum} 号管`
            let arr = [
              h(
                'span',
                { class: { msg: true }},
                text
              )
            ]
            return h(
              'div',
              arr
            )
          } },
        { title: '存储人', key: 'qaUserName', tooltip: true },
        { title: '复核人', key: 'recheckUserName', tooltip: true },
        { title: '备注', key: 'storeRemark', tooltip: true }
      ],
      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleCode: '',
        storeUserName: '',
        storeTimeMin: '',
        storeTimeMax: ''
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
  computed: {

  },
  // 组件方法
  methods: {
    getHalfYearParams() {
      getHalfYearParams().then(res => {
        this.listQuery.storeTimeMin = res.data.dateMin
        this.listQuery.storeTimeMax = res.data.dateMax
        this.getList()
      })
    },
    getList() {
      this.tableLoading = true
      getCellStoreList(this.listQuery).then(res => {
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
