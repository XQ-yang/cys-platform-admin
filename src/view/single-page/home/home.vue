<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in waitData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :routerName="infor.routerName">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;" v-if="homeStatsShow" id="stats">
      <i-col :md="8" :lg="8" style="margin-bottom: 3px;">
        <Card title="存储工作台" shadow>
          <div class="pie">
            <div class="pie-content">
              <span class="info-span">储存罐总容量情况：</span>
              <span class="used">{{this.statsData.usedTotal}}</span>
              <span class="sum-color">/ {{this.statsData.total}}</span>
            </div>
            <div ref="potPie" style="height: 300px;"></div>
          </div>
        </Card>
      </i-col>
      <i-col :md="2" :lg="6" style="margin-bottom: 3px;">
        <Card title="重点环节总量统计" shadow style="min-height:437px;">
          <div v-for="(m, index) in keyLinksList" :key="index" class="statistics-list">
            <Tag type="dot" color="primary" style="cursor:default;">{{m.category}}</Tag>
            <span class="keyLinks">{{m.num}}</span>
          </div>
        </Card>
      </i-col>
      <i-col :md="6" :lg="10" style="margin-bottom: 3px;">
        <Card title="项目类型统计" shadow>
          <div class="pie">
            <div class="pie-content">
              <span :class="actived(0)" @click="clickProject(0)">样本总量：</span>
              <span class="keyLinks">{{sampleTotal}}</span>
              <span :class="actived(1)" @click="clickProject(1)">本月：</span>
              <span class="keyLinks">{{thisMonth}}</span>
              <span :class="actived(2)" @click="clickProject(2)">上月：</span>
              <span class="keyLinks">{{lastMonth}}</span>
            </div>
            <div ref="barDiv" style="height: 300px;"></div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row></Row>
  </div>
</template>

<script>
import Vue from 'vue'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {
  getHomeInfo,
  getPotStatsInfo,
  getSampleGroupSix
} from '@/api/retrospect'
import echarts from 'echarts'
import { on } from '@/libs/tools'
Vue.prototype.$echarts = echarts
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
  },
  data() {
    return {
      todoNumberList: [],
      waitData: [],
      inforCardData: [
        // permission角色权限
        {
          title: '样本待采集',
          icon: 'md-person-add',
          count: 809,
          color: '#2d8cf0',
          permission: 'reserveCreate',
          routerName: 'collect'
        },
        {
          title: '样本待运输',
          icon: 'md-locate',
          count: 232,
          color: '#31d2e1',
          permission: 'transportHandover',
          routerName: 'transport'
        },
        {
          title: '样本待验收',
          icon: 'md-help-circle',
          count: 142,
          color: '#ff9900',
          permission: 'sampleReceive',
          routerName: 'receiveManager'
        },
        {
          title: '样本异常',
          icon: 'ios-thunderstorm',
          count: 657,
          color: '#f9525e',
          permission: 'closeException',
          routerName: 'desk'
        },
        {
          title: '细胞待培养',
          icon: 'md-chatbubbles',
          count: 12,
          color: '#e46cbb',
          permission: 'cultureAdd',
          routerName: 'culture'
        },
        {
          title: '细胞待暂存',
          icon: 'md-map',
          count: 14,
          color: '#9a66e4',
          permission: 'tempStoreAdd',
          routerName: 'tempStore'
        },
        {
          title: '细胞待质检',
          icon: 'ios-cube',
          count: 10,
          color: '#1fbec3',
          permission: 'qualityCheckAdd',
          routerName: 'qualityCheck'
        },
        {
          title: '细胞待入库',
          icon: 'md-grid',
          count: 10,
          color: '#9a66e4',
          permission: 'storeAdd',
          routerName: 'store'
        },
        {
          title: '入库待复核',
          icon: 'md-checkbox-outline',
          count: 10,
          color: '#2d8cf0',
          permission: 'storeRecheck',
          routerName: 'store'
        },
        {
          title: '细胞异常',
          icon: 'md-pulse',
          count: 10,
          color: '#f5b01b',
          permission: 'closeQualityCheckException',
          routerName: 'storageDesk'
        },
        {
          title: '库存出库',
          icon: 'md-star-outline',
          count: 10,
          color: '#31d2e1',
          permission: 'outStoreOfStock',
          routerName: 'outStock'
        },
        {
          title: '出库待审核',
          icon: 'md-hammer',
          count: 10,
          color: '#3dbf6c',
          permission: 'outReviewOfStock',
          routerName: 'outReview'
        }
      ],
      statsData: {
        total: 0,
        usedTotal: 0,
        notStoredNum: 0,
        StoredNum: 0,
        fullNum: 0
      },
      keyLinksList: [], // 重点环节数据
      barData: [], // 项目类型柱状图数据
      category: 0,
      myBar: null,
      myPie: null,
      sampleTotal: 0,
      thisMonth: 0,
      lastMonth: 0
    }
  },
  computed: {
    homeStatsShow() {
      return this.$store.state.user.btnRules.includes('homeStats')
    }
  },
  mounted() {
    this.getHomeInfo()
    this.getPotStatsInfo()
    this.getSampleGroupSix()
  },
  methods: {

    getHomeInfo() {
      getHomeInfo()
        .then(res => {
          // 待办数量
          this.todoNumberList = res.data.todoNumberList
          let rules = this.$store.getters.roles
          this.todoNumberList.forEach(m => {
            let item = this.inforCardData.find(n => m.category === n.title)
            if (item) {
              item.count = m.num
              const hasPermission = rules.includes(item.permission)
              if (hasPermission) {
                this.waitData.push(item)
              }
            }
          })
          // 重点环节数据
          this.keyLinksList = res.data.keyLinksList
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    }, // 统计饼图
    initChart(pieData) {
      let option = {
        title: {
          text: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          left: 'left',
          color: ['#dFdFdF', '#25b3b7', '#E06584'],
          data: ['未储存', '未存满', '已存满']
        },
        series: [
          {
            name: '储存情况',
            type: 'pie',
            radius: [0, '60%'],
            hoverAnimation: false,
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#FF9900' // 改变标示线的颜色
                }
              }
            },
            label: {
              normal: {
                formatter: '{b} : {c} ({d}%) ',
                textStyle: {
                  color: '#FF9900' // 改变标示文字的颜色
                }
              }
            },
            center: ['50%', '50%'],
            data: pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#dFdFdF', '#25b3b7', '#E06584']
      }
      this.myPie = echarts.init(this.$refs.potPie, 'tdTheme')
      this.myPie.setOption(option)
      on(window, 'resize', this.resize)
    },
    getPotStatsInfo() {
      getPotStatsInfo()
        .then(res => {
          // 统计饼图
          this.statsData = res.data
          this.initChart([
            {
              value: res.data.notStoredNum === 0 ? '' : res.data.notStoredNum,
              name: '未储存'
            },
            {
              value: res.data.StoredNum === 0 ? '' : res.data.StoredNum,
              name: '未存满'
            },
            {
              value: res.data.fullNum === 0 ? '' : res.data.fullNum,
              name: '已存满'
            }
          ])
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    getSampleGroupSix() {
      getSampleGroupSix(this.category)
        .then(res => {
          this.barData = res.data.keyLinksList
          this.initBar(this.barData)
          let sampleStats = res.data.sampleStats
          if (sampleStats) {
            if (sampleStats.length === 3) {
              this.sampleTotal = sampleStats[0].num
              this.thisMonth = sampleStats[1].num
              this.lastMonth = sampleStats[2].num
            }
          }
        })
        .catch(error => {
          this.$Message.error(error.msg)
        })
    },
    initBar(barData) {
      let xAxisData = []
      let seriesData = []
      barData.forEach(item => {
        xAxisData.push(item.name)
        seriesData.push(item.num)
      })
      if (this.myBar != null) {
        // 更新数据
        var option2 = this.myBar.getOption()
        option2.series[0].data = seriesData
        option2.xAxis[0].data = xAxisData
        this.myBar.setOption(option2)
        return
      }
      let option = {
        title: {
          text: '',
          subtext: '',
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            rotate: -18,
            textStyle: {
              color: '#111'
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              normal: {
                color: '#4ecbcd'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'inside',
                textStyle: {
                  color: '#fff'
                }
              }
            }
          }
        ]
      }
      this.myBar = echarts.init(this.$refs.barDiv, 'tdTheme')
      this.myBar.setOption(option)
      on(window, 'resize', this.resize)
    },
    resize() {
      this.myBar.resize()
      this.myPie.resize()
    },
    clickProject(category) {
      this.category = category
      this.getSampleGroupSix()
    },
    actived(index) {
      return index === this.category ? 'info-span2 current-span' : 'info-span2'
    }
  }
}
</script>

<style lang="less">
.statistics-list{ height: 50px; border-bottom:1px solid #f0f2f4;
.ivu-tag-dot{
    height:  50px;
    line-height: 50px;
    border:none !important;
    color: #333 !important;
    background: none !important;
    padding: 0;
    margin: 0;
    font-size: 16px;
    .ivu-tag-dot-inner{ box-shadow:0 3px 6px #bdeff0;}
    .ivu-tag-text{ font-size: 16px; color: #333;}
     }
     .keyLinks{ text-align: right;
     float: right;
     height: 50px;
     line-height: 50px;}
}
.count-style {
  font-size: 50px;
}
.info-span {
  font-weight: bold;
}
.info-span2 {
  font-weight: bold;
  margin-left: 32px;
  cursor: pointer;
  font-size: 18px;
}
.used {
  color: #49bdbf;
}
.pie {
  width: 100%;
  min-height: 200px;
  height: auto !important;
  height: 200px;
}
.pie .pie-content {
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
}
.keyLinks {
  color: #ec6789;
  font-size: 18px;
}
.current-span {
  color: #4ecbcd;
}
#stats canvas:hover{
        cursor: default;
    }
</style>
