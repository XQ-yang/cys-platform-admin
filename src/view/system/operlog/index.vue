<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        操作模块：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="操作模块"
          class="search-input"
          v-model="listQuery.module"
        />
        操作内容：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="操作内容"
          class="search-input"
          v-model="listQuery.operation"
        />
        操作状态：
        <i-select style="width:200px" @on-clear="handleClear" clearable v-model="listQuery.responseCode">
          <i-option value="0">正常</i-option>
          <i-option value="1">异常</i-option>
        </i-select>
        <span v-show="show"></br>创建时间：</span>
        <Date-picker v-show="show" type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="handleStartTime" :editable="false" v-model="listQuery.startTime" @on-clear="handleClear" placeholder="选择日期和时间" style="width: 200px"></Date-picker>
        <span style="margin:2px;" v-show="show">至</span>
        <Date-picker v-show="show" type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="listQuery.endTime=$event" :options="options" :editable="false" v-model="listQuery.endTime" @on-clear="handleClear" placeholder="选择日期和时间" style="width: 200px;margin-right:10px;"></Date-picker>
        <Button @click="handleSearch" class="search-btn">查询</Button>
        <Button @click="exportData" :loading="exportLoading" class="search-btn">导出</Button>
        <Button @click="handleStretch">{{stretchName}}</Button>
      </div>
      <!--列表 分页-->
      <Table :data="list" :columns="tableColumns" :loading="tableLoading" border stripe>
        <template slot-scope="{ row, index }" slot="action">
        </template>
      </Table>
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
            next-text="下一页"
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { fetchList, exportOperlog } from '@/api/operlog'
import expandRow from './table-expand.vue'
import { export_json_to_excel } from '@/libs/exportExcel'
export default {
  name: 'operlog',
  filters: {
  },
  data() {
    return {
      list: [],
      tableColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '序号',
          width: 65,
          render: (h, params) => {
            return h(
              'span',
              params.index +
                (this.listQuery.pageNumber - 1) * this.listQuery.pageSize +
                1
            )
          }
        },
        { title: '操作模块', key: 'module', tooltip: true },
        { title: '操作内容', key: 'operation', tooltip: true },
        { title: '请求url', key: 'requestUrl', tooltip: true },
        { title: '耗时', key: 'spendTime', tooltip: true, width: 65 },
        { title: '请求来源', key: 'clientId', tooltip: true },
        {
          title: '创建时间',
          key: 'createTime',
          tooltip: true,
          width: 180,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '操作状态',
          key: 'status',
          width: 100,
          render: (h, params) => {
            const row = params.row
            const text = row.responseCode === 0 ? '正常' : '异常'
            return h(
              'div',
              text
            )
          }
        }
      ],
      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        module: '',
        operation: '',
        responseCode: '',
        startTime: '',
        endTime: ''
      },
      dataListLoading: false,
      options: {
        disabledDate(date) {
          return false
        }
      },
      stretchName: '展开',
      show: false,
      exportLoading: false
    }
  },
  components: {
  },
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据，
  // 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {
    this.getList()
  },
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {},
  // 组件方法
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery)
        .then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    handleSearch() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      this.getList()
    },
    handleStartTime(e) {
      this.listQuery.startTime = e
      this.options = {
        disabledDate(date) {
          return date.valueOf() < new Date(e)
        }
      }
    },
    handleStretch() {
      var s = this.stretchName
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      if (s === '展开') {
        this.show = true
        this.stretchName = '收起'
      } else {
        this.show = false
        this.stretchName = '展开'
      }
    },
    exportData() {
      exportOperlog(this.listQuery)
        .then(res => {
          if (res.data.length) {
            this.exportLoading = true
            const header = ['操作模块', '操作内容', '请求url', '耗时', '请求来源']
            const key = ['module', 'operation', 'requestUrl', 'spendTime', 'clientId']
            const data = res.data
            export_json_to_excel({
              header: header, // 表头
              key, // 对应的数据库字段
              data, // 查询出的列表数据
              filename: '操作日志', // 文件名称
              autoWidth: true, // 单元格宽度自适应
              bookType: 'xlsx'// 导出文件类型
            })
            this.exportLoading = false
          } else {
            this.$Message.info('表格数据不能为空！')
          }
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    }
  }
}
</script>
<style >
</style>
