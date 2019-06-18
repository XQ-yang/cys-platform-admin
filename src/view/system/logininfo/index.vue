<template>
  <div>
    <Card>
      <!--查询条件及操作按钮-->
      <div class="search-con search-con-top">
        登录账号：
        <Input
          @on-change="handleClear"
          clearable
          placeholder="登录账号"
          class="search-input"
          v-model="listQuery.loginName"
        />
        登录状态：
        <i-select style="width:200px" @on-change="handleClear" clearable v-model="listQuery.status">
          <i-option value="0">正常</i-option>
          <i-option value="1">异常</i-option>
        </i-select>
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
  filters: {
  },
  data() {
    return {
      list: [],
      tableColumns: [
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
        { title: '登录账号', key: 'loginName', tooltip: true },
        { title: 'IP地址', key: 'ipAddr', tooltip: true },
        { title: '登录地点', key: 'loginLocation', tooltip: true },
        { title: '浏览器类型', key: 'browser', tooltip: true },
        { title: '操作系统', key: 'os', tooltip: true },
        { title: '提示消息', key: 'msg', tooltip: true },
        {
          title: '创建时间',
          key: 'createTime',
          tooltip: true,
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
          render: (h, params) => {
            const row = params.row
            const text = row.status === 0 ? '正常' : '异常'
            const color = row.status === 0 ? 'success' : 'error'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
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
        loginName: '',
        status: ''
      },
      dataListLoading: false
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
      if (e.target.value === '') {
        this.getList()
      }
    }
  }
}
</script>
<style >
</style>
