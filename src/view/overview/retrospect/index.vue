<template>
  <div>
    <Card>
      <!--采集台账查询条件及操作按钮-->
      <div class="search-con search-con-top">
        <Input
          v-model="bookQuery.customerName"
          @on-change="bookClear"
          placeholder="顾客姓名"
          class="search-input"
          clearable
        />
        <Input
          v-model="bookQuery.customerPhone"
          @on-change="bookClear"
          placeholder="手机号"
          class="search-input"
          clearable
        />
        <Select
          v-model="bookQuery.sampleType"
          @on-change="bookChangeSampleType($event)"
          placeholder="请选择样本类型"
          style="width:200px"
          clearable
        >
          <Option
            v-for="item in sampleTypeList"
            :key="item.sampleTypeId"
            :value="item.sampleTypeId"
          >{{item.sampleTypeName}}</Option>
        </Select>
        <Input
          v-model="bookQuery.sampleCode"
          @on-change="bookClear"
          placeholder="样本条码"
          class="search-input"
          clearable
        />
        <Button @click="bookSearch" class="search-btn">查询</Button>
      </div>

      <!--采集台账列表-->
      <Table :data="bookList" :columns="bookColumns" :loading="bookListLoading" border stripe></Table>

      <!--采集台账分页-->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            v-show="bookTotal>0"
            :total="bookTotal"
            :current.sync="bookQuery.pageNumber"
            :page-size.sync="bookQuery.pageSize"
            @on-change="getBookList"
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
import '@/assets/css/common.less'
import { getRetrospectList } from '@/api/retrospect.js'
import {
  getSampleTypeList
} from '@/api/projectType.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'retrospect',
  data() {
    return {
      // 显示待采集条数
      count: 1,
      // 样本类型数据
      sampleTypeList: [],
      // 采集台账列表显示及查询
      bookProjectTypeList: [],
      bookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        sampleCode: '',
        customerName: '',
        customerPhone: ''
      },
      bookListLoading: false,
      bookList: [],
      bookTotal: 0,
      bookColumns: [
        { type: 'index', title: '序号', width: 70 },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '顾客姓名', key: 'name', tooltip: true },
        { title: '手机号', key: 'phone', tooltip: true },
        { title: '采集医院', key: 'hospitalName', tooltip: true },
        {
          title: '采集时间',
          key: 'collectTime',
          width: 170,
          tooltip: true,
          render: (h, params) => {
            return h(
              'div',
              this.$formatDate(params.row.collectTime, 'yyyy-MM-dd hh:mm')
            )
          }
        },
        { title: '采集人', key: 'collector', tooltip: true },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '3px 2px 2px 3px'
                  },
                  on: {
                    click: () => {
                      this.retrospectView(params.row)
                    }
                  }
                },
                '查看'
              )
            ])
          }
        }
      ],
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取采集台账数据列表
      this.getBookList()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取采集台账数据列表
      this.getBookList()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      collectListSate: state => state.sample.collectListSate
    })
  },
  methods: {
    ...mapMutations(['setCollectListSate']),
    // 获取样本类型列表
    getSampleTypeList() {
      getSampleTypeList()
        .then(res => {
          this.sampleTypeList = res.data
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    // 跳转到样本信息查看
    retrospectView(row) {
      const route = {
        name: 'retrospectView',
        query: {
          sampleId: row.id
        }
      }
      this.$router.push(route)
    },
    // 采集台账列表按条件查询
    bookSearch() {
      this.bookQuery.pageNumber = 1
      this.getBookList()
    },
    // 清空查询值的时候 重新加载待采集台账列表数据
    bookClear(e) {
      if (e.target.value === '') {
        this.getBookList()
      }
    },
    // 清空查询值的时候 重新加载采集台账列表数据(下拉框)
    bookSelectClear(e) {
      if (e === undefined) {
        this.getBookList()
      }
    },
    // 获取采集台账数据列表
    getBookList() {
      this.bookListLoading = true
      getRetrospectList(this.bookQuery).then(res => {
        this.bookList = res.data.list
        this.bookTotal = res.data.totalRow
        this.bookListLoading = false
      })
    }
  }
}
</script>
