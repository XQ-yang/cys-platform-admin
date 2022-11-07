<template>
  <div>
    <Row :gutter="30">
      <Col
:xs="12"
:md="8"
:lg="6"
v-for="(info, i) in infoCardData"
:key="`info-${i}`"
           style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="info.color" :icon="info.icon" :icon-size="36">
          <count-to :end="info.count" class="count-style"/>
          <p>{{ info.title }}</p>
        </infor-card>
      </Col>
      <!--<Col :xs="12" :md="8" :lg="6" style="height: 120px;padding-bottom: 10px;">-->
      <!--  <Card shadow color='#ff9900' icon="md-cog">-->
      <!--    {{this.equipmentTotal}}-->
      <!--    <p>设备总数</p>-->
      <!--  </Card>-->
      <!--</Col>-->
    </Row>
    <Row style="margin-top: 20px">
      <Col>
        <Card>
          <div id="main" style="width: 80%; height: 420px"></div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { getEchartsCardData, getEchartsData } from '@/api/statistical'

export default {
  name: '',
  components: {
    InforCard,
    CountTo
  },

  data() {
    return {
      infoCardData: [
        { title: '设备台数', icon: 'md-cog', count: 0, color: '#ff9900' },
        { title: '使用中设备数', icon: 'md-body', count: 0, color: '#2d8cf0' },
        { title: '空闲设备数', icon: 'md-moon', count: 0, color: '#19be6b' },
        { title: '待入帐设备数', icon: 'logo-usd', count: 0, color: '#ed3f14' }
      ],
      pieData: []

    }
  },

  created() {
    // 请求后台获取数据
    getEchartsCardData().then(res => {
      this.infoCardData[0].count = res.data.equipmentTotal
      this.infoCardData[1].count = res.data.countUsing
      this.infoCardData[2].count = res.data.countFree
      this.infoCardData[3].count = res.data.countNotAccount
    })
  },

  mounted() {
    // 渲染报表
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '设备类型统计',
        textStyle: {
          color: '#436EEE',
          fontSize: 20
        }
      },
      // 鼠标触发提示数量
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: []
      },
      // x轴显示
      xAxis: {
        data: [],
        splitLine: {
          show: false
        }
      },
      // y轴显示
      yAxis: {
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '未启用',
          type: 'bar',
          stack: '业务', // 折叠显示
          emphasis: {
            focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
          },
          data: [], // （此处的<%=zcfgData%>为后台传过来的数据，格式为[1,2,3,4,2,3,3],根据实际情况修改）
          barWidth: 100,
          // 显示颜色
          itemStyle: {
            normal: {
              // label:{
              //   show: true, //开启显示
              //   position: 'top', //在上方显示
              // },
              color: '#c0c0c0' }
          }
        },
        {
          name: '使用中',
          type: 'bar',
          stack: '业务',
          emphasis: {// 折线图的高亮状态。
            focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
          },
          data: [], // （此处的<%=jbgcData%>为后台传过来的数据，格式为[1,2,3,4,2,3,3],根据实际情况修改）
          barWidth: 100,
          itemStyle: {
            normal: { color: '#2d8cf0' }
          }
        },
        {
          name: '空闲',
          type: 'bar',
          stack: '业务',
          emphasis: {// 折线图的高亮状态。
            focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
          },
          data: [], // （此处的<%=ywcjmnData%>为后台传过来的数据，格式为[1,2,3,4,2,3,3],根据实际情况修改）
          barWidth: 100,
          itemStyle: {
            normal: { color: '#3FBB49' }
          }
        },
        {
          name: '维修',
          type: 'bar',
          stack: '业务',
          emphasis: {// 折线图的高亮状态。
            focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
          },
          data: [], // （此处的<%=cjwtData%>为后台传过来的数据，格式为[1,2,3,4,2,3,3],根据实际情况修改）
          barWidth: 100,
          itemStyle: {
            normal: { color: '#ff8000' }
          }
        },
        {
          name: '报废',
          type: 'bar',
          stack: '业务',
          emphasis: {// 折线图的高亮状态。
            focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
          },
          data: [], // （此处的<%=cjwtData%>为后台传过来的数据，格式为[1,2,3,4,2,3,3],根据实际情况修改）
          barWidth: 100,
          itemStyle: {
            normal: { color: '#ff0000' }
          }
        }
      ]
    }
    getEchartsData().then(res => {
      console.log(res.data)
      option.xAxis.data = res.data[0]
      option.legend.data = res.data[1]
      option.series[0].data = res.data[2][0]
      option.series[1].data = res.data[2][1]
      option.series[2].data = res.data[2][2]
      option.series[3].data = res.data[2][3]
      option.series[4].data = res.data[2][4]
      myChart.setOption(option)
    })

    // 使用刚指定的配置项和数据显示图表。
  }
}
</script>

<style scoped>
  .count-style {
    font-size: 50px;
  }
</style>
