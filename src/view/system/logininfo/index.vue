<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        登录账号：
        <Input
          @on-clear="handleClear"
          clearable
          placeholder="登录账号"
          class="search-input"
          v-model="listQuery.loginName"
        />
        登录状态：
        <i-select style="width:200px" @on-clear="handleClear"  clearable v-model="listQuery.status">
          <i-option value="0">正常</i-option>
          <i-option value="1">异常</i-option>
        </i-select>
        创建时间：
        <Date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="handleStartTime" :editable="false" v-model="listQuery.startTime" @on-clear="handleClear" placeholder="选择日期和时间" style="width: 165px"></Date-picker>
        至
        <Date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" @on-change="listQuery.endTime=$event" :options="options" :editable="false" v-model="listQuery.endTime" @on-clear="handleClear" placeholder="选择日期和时间" style="width: 165px;margin-right:10px;"></Date-picker>
        <Button @click="handleSearch" class="search-btn">查询</Button>
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
import { fetchList } from '@/api/logininfo'

export default {
  name: 'logininfo',

  data() {
    return {
      list: [],

      tableColumns: [
        {
          title: '序号',
          align: 'center',
          minWidth: 65,
          render: (h, params) => {
            return h(
              'span',
              params.index +
                (this.listQuery.pageNumber - 1) * this.listQuery.pageSize +
                1
            )
          }
        },
        {
          title: '登录账号',
          key: 'loginName',
          minWidth: 110
        },
        {
          title: 'IP地址',
          key: 'ipAddr',
          minWidth: 140
        },
        {
          title: '登录地点',
          key: 'loginLocation',
          minWidth: 100
        },
        {
          title: '浏览器类型',
          key: 'browser',
          minWidth: 170
        },
        {
          title: '操作系统',
          key: 'os',
          minWidth: 120
        },
        {
          title: '提示消息',
          key: 'msg',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 180,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.createTime, 'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '登录状态',
          key: 'status',
          minWidth: 100,
          render: (h, params) => {
            const row = params.row
            const text = row.status === 0 ? '正常' : '异常'
            const color = row.status === 0 ? 'green' : 'red'
            return h('Badge',
              {
                props: {
                  color: color,
                  text: text
                }
              })
          }
        }
      ],

      total: 0,
      tableLoading: false,
      loading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        loginName: '',
        status: ''
      },
      dataListLoading: false,
      options: {
        disabledDate(date) {
          return false
        }
      }
    }
  },

  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据，
  // 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {
    this.getList()
  },

  // 编译好的HTML 挂载到页面完成后执行的事件钩子，
  // 此钩子函数中一般会做一些ajax请求获取数据进行数据初始化
  // mounted在整个实例中只执行一次
  mounted() {
  },

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
    handleClear() {
      this.$nextTick(() => {
        this.getList()
      })
    },

    handleStartTime(e) {
      this.listQuery.startTime = e
      this.options = {
        disabledDate(date) {
          return date.valueOf() < new Date(e)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
