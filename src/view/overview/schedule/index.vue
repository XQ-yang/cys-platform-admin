/* eslint-disable vue/require-v-for-key */
<template>
  <div class="container">
       <!--查询条件及操作按钮-->
       <div style="display:table-row;">
      <Card class="search-con search-con-top pot-search"  style="display:table-cell;">
        <Select
          v-model="potQuery.potType"
          placeholder="请选择存储罐类型"
          style="width:160px"
          @on-change="handleClear"
          clearable
        >
          <Option :value="1">干细胞存储罐</Option>
          <Option :value="2">免疫细胞存储罐</Option>
          <Option :value="3">暂存罐</Option>
          <Option :value="4">公共罐</Option>
        </Select>
        <Select
          v-model="potQuery.potState"
          placeholder="请选择存储罐状态"
          style="width:140px"
          @on-change="handleClear"
          clearable
        >
          <Option :value="1">未储存</Option>
          <Option :value="2">未存满</Option>
          <Option :value="3">已存满</Option>
        </Select>
        <Button @click="handleSearch" class="search-btn">查询</Button>
      </Card></div>
    <div class="wrap" >
      <Card class="left" :style="styleLeft" id="potCard" style="width:800px;">
        <div class="pot-canvas-top">
          <span class="no-pot-icon">未储存 {{statsData.notStoredNum}} 个</span>
          <span class="under-pot-icon">未存满 {{statsData.StoredNum}} 个</span>
          <span class="full-pot-icon">已存满 {{statsData.fullNum}} 个</span>
        </div>
        <div style=" margin: 0; padding: 0;">
          <v-stage :config="configPot" ref="potStage" style="width:100%;"></v-stage>
        </div>
      </Card>
      <div class="right" :style="styleRight" >
        <div class="pie ivu-card ivu-card-bordered">
          <div class="pie-content">
            <span class="info-span">储存罐总容量情况：</span>
            <span class="used">{{this.statsData.usedTotal}}</span>
            <span class="sum-color">  / {{this.statsData.total}}</span>
          </div>
          <div id="potPie" :style="{width: leftWidth + 'px', height: '180px'}"></div>
        </div>
        <div :style="styleRegion" class="ivu-card ivu-card-bordered pot-storage" style="min-width:600px;width:100%;">
          <div class="pot-storage-content">
           <div class="pot-storage-top"> <span class="info-span">{{this.currentItem.potCode}} 号罐存储情况：</span>
            <span class="used">{{this.currentItem.potUsedTotal}}</span>
           <span class="sum-color"> / {{this.currentItem.potTotal}}</span></div>
            <div class="regions">
              <ul>
                <li
                  v-for="(item, index) in regionList"
                  :key="item.id"
                  v-bind:class="{'current':currentItem.regionCode==item.regionCode}"
                  @click="regionClick(item, index)"
                >
                 <a> <span>{{item.regionCode}}</span>区
                  <span class="number-bg">{{item.towerNum}}</span>
                  </a>
                </li>
              </ul>
            </div>

          <div></div>
          <div>
            <v-stage :config="configRegion" ref="regionStage" ></v-stage>
          </div>
        </div>
         </div>
        <div :style="styleBox" class="ivu-card ivu-card-bordered pot-position" style=" margin-bottom:0;">
          <div class="pot-position-content">
            <div class="pot-position-title">
            <span class="info-span">{{this.currentItem.potCode}} 号罐</span> -
            <span>{{this.currentItem.regionCode}}区</span> -
            <span>{{this.currentItem.box.towerCode}}号塔</span> -
            <span>{{this.currentItem.box.boxCode}}号盒：</span>
            <span class="used">{{this.currentItem.box.usedLatticeNum}}</span>
            <span class="sum-color">/ {{this.currentItem.box.latticeNum}}</span>
          </div>
          <div  style="width:100%;">
            <v-stage :config="configBox" ref="boxStage"></v-stage>
          </div>
        </div>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/css/common.less'
import './index.less'
import {
  getPotStatsData,
  getScheduleRegionData,
  getLatticeDataByBoxId
} from '@/api/schedule.js'
import Vue from 'vue'
import VueKonva from 'vue-konva'
import konva from 'konva'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(VueKonva)
Vue.use(konva)
export default {
  props: {},
  name: 'schedule',
  data() {
    return {
      potKonva: null,
      regionKonva: null,
      boxKonva: null,
      temperaturetLayer: null,
      potEventLayer: null,
      ctx: null,
      potQuery: {
        potType: '',
        potState: ''
      },
      // 请求的数据结果
      currentItem: {
        potId: '',
        potIndex: 0,
        potCode: '',
        potTotal: 0,
        potUsedTotal: 0,
        regionIndex: 0,
        regionCode: '',
        towerCode: '',
        box: {}
      },
      potList: [],
      statsData: {
        total: 0,
        usedTotal: 0,
        notStoredNum: 0,
        StoredNum: 0,
        fullNum: 0
      },
      pieData: [],
      regionList: [],
      towerList: [],
      boxList: [],
      latticeList: [],
      maxCodes: {},
      // end
      pot: {// 液氮罐尺寸参数
        colNum: 4, // 每行罐数
        position: {
          left: 26, // 罐图左顶起始x坐标
          top: 20, // 罐图左顶y坐标
          height: 200// 罐总占用高度包括空白
        },
        size: {
          width: 122, // 罐宽
          height: 160, // 罐高
          radius: 5, // 罐圆弧半径
          indent: 16, // 头部尺寸缩进
          headHeight: 15, // 头部高度
          bottomHeight1: 8, // 底部倒角高度1
          bottomHeight2: 8// 底部倒角高度2
        },
        potColor: '#dFdFdF', // 罐初始色彩（空）
        gradualPotColor: '#c8c8c8', // 罐初始色彩（空）渐变阴影
        storedColor: '#25b3b7', // 未存满色彩
        storedColor2: '#22a3a6', // 底部梯形未存满色彩
        fullColor: '#E06584', // 存满色彩
        gradualFullColor: '#d06584', // 存满色彩渐变阴影
        shadowColor: '#bfbfbf', // 阴影色彩
        fullShadowColor: '#C95B78', // 存满阴影色彩
        txtColor: '#111111', // 文本色彩
        txtBackgroundColor: '#f8f8f8', // 文本背景色彩
        groundWidth: 60, // 文本背景宽度
        groundHeight: 20// 文本背景高度
      },
      box: {// 分区图盒子尺寸
        left: 32, // 盒子左上角x
        top: 50, // 盒子左上角y
        width: 60, // 盒子宽
        height: 32, // 盒子高
        xLeft: 42, // x坐标文字左起点x
        xTop: 32, // x坐标文本左y坐标
        yLeft: 3, // y轴坐标文本x
        yTop: 60, // y轴左上角起点y坐标
        padding: 3, //
        lineColor: '#ccc', // 线颜色
        boxColor: '#e4e7ea', // 盒子颜色
        storedColor: '#24b1b4', // 已存储颜色
        fullColor: '#ec6789', // 盒子储存满颜色
        radius: 3// 盒子圆角半径
      },
      lattice: {// 盒子试管图参数，试管的倾斜角度45度没加参数
        left: 32, // 左上角x坐标
        top: 40, // 左上角y坐标
        width: 60, // 宽度
        height: 40, // 高度
        xLeft: 42, // x坐标文本左起点x坐标
        xTop: 12, // x坐标文本y坐标
        yLeft: 3, // y坐标文本x坐标
        yTop: 45, // y坐标左上角y坐标
        // padding: 3, //
        lineColor: '#ccc', // 分割线色彩
        latticeColor: '#e4e7ea', // 试管色彩
        fullColor: '#ee4b6d', // 装试管色彩
        tubeWidth: 18, // 试管宽
        tubeHeight: 32, // 试管高
        tubeRadius: 4, // 试管圆弧半径
        thick: 4, // 试管口厚度
        blank: 10, // 上边空白高度
        txtRadius: 16// 为有试管园半径
      },
      leftWidth: 590,
      configPot: {
        width: 696,
        height: 500
      },
      configRegion: {
        width: 500,
        height: 380
      },
      region: {},
      configBox: {
        width: 572,
        height: 300
      },
      styleLeft: {
        width: '792px'
      },

      styleRight: {
        width: '100%'
      },
      styleRegion: {
        width: '100%',
        height: '380px'
      },
      styleBox: {
        height: '320px'
      },
      timerHandle: null, // 定时器
      interval: 1000 * 60, // 定时器间隔
      positions: []
    }
  },
  computed: {},
  // 一般ajaxajax请求数据放到created里面就可以了，这样可以及早发请求获取数据， 如果有依赖dom必须存在的情况则需要放导 mounted
  created() {},
  // 编译好的HTML 挂载到页面完成后执行的事件钩子，此钩子函数中一般会做一些ajax请求获取数据进行数据初始化,mounted在整个实例中只执行一次
  mounted() {
    // 初始化罐，区，盒子画布对象参数
    this.potKonva = this.$refs.potStage.getStage()
    this.regionKonva = this.$refs.regionStage.getStage()
    this.boxKonva = this.$refs.boxStage.getStage()
    this.getSchedule()
  },
  methods: {
    restCurrentItem() {
      this.currentItem = {
        potId: '',
        potIndex: 0,
        potCode: '',
        potTotal: 0,
        potUsedTotal: 0,
        regionIndex: 0,
        regionCode: '',
        towerCode: '',
        box: {}
      }
    },
    getSchedule() {
      getPotStatsData(this.potQuery).then(res => {
        if (res.data.potList.length === 0) {
          this.emptyData()
          return
        }
        this.potList = res.data.potList
        let _pot = res.data.potList[0]
        this.currentItem.potId = _pot.id
        this.currentItem.potCode = _pot.potCode
        this.currentItem.potTotal = _pot.latticeNum
        this.currentItem.potUsedTotal = _pot.usedLatticeNum
        // 统计饼图
        this.statsData = res.data.statsData
        this.initChart([
          {
            value:
              res.data.statsData.notStoredNum === 0
                ? ''
                : res.data.statsData.notStoredNum,
            name: '未储存'
          },
          {
            value:
              res.data.statsData.StoredNum === 0
                ? ''
                : res.data.statsData.StoredNum,
            name: '未存满'
          },
          {
            value:
              res.data.statsData.fullNum === 0
                ? ''
                : res.data.statsData.fullNum,
            name: '已存满'
          }
        ])

        this.drawPots()
        this.drawRegions(_pot.id)
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handleSearch() {
      this.getSchedule()
    },
    emptyData() { // 没有罐数据
      this.potKonva.destroyChildren()
      this.regionKonva.destroyChildren()
      this.boxKonva.destroyChildren()
      this.currentItem = {
        potId: '',
        potIndex: 0,
        potCode: '',
        potTotal: 0,
        potUsedTotal: 0,
        regionIndex: 0,
        regionCode: '',
        towerCode: '',
        box: {}
      }
      this.statsData = {
        total: 0,
        usedTotal: 0,
        notStoredNum: 0,
        StoredNum: 0,
        fullNum: 0
      }
      this.regionList = []
      this.pieData = []
      this.initChart([])
    },
    // 清空查询值的时候 重新加载列表数据
    handleClear(e) {
      if (e === undefined || e === '') {
        if (!this.potQuery.potState && !this.potQuery.potType) {
          this.getSchedule(this.potQuery)
        }
      }
    },
    drawPots() {
      // 绘罐图
      // let w = document.getElementById('potCard').clientWidth
      // this.configPot.width = w
      // this.potKonva.width(w)
      this.temperaturetLayer = null// 使之前的温度层为空
      this.potKonva.destroyChildren()
      const potCount = this.potList.length
      let rowCount = Math.ceil(potCount / this.pot.colNum)
      this.potKonva.height(rowCount * this.pot.position.height + 20)
      this.height = rowCount * (this.pot.position.height + 20)
      let layer = new konva.Layer()
      // 添加事件层
      let eventLayer = new konva.Layer()
      this.potEventLayer = eventLayer
      let colWidth = Math.floor(this.configPot.width / this.pot.colNum)
      let potNum = 0
      let positions = []// 温度定时刷新用到位置参数
      for (let i = 0; i < rowCount; i++) {
        let y = this.pot.position.top + this.pot.position.height * i
        for (let n = 0; n < this.pot.colNum; n++) {
          let x = this.pot.position.left + colWidth * n
          potNum = i * this.pot.colNum + n
          if (potNum >= potCount) {
            break
          }
          let group = this.singlePot(x, y, potNum, eventLayer)
          layer.add(group)
          let rectEvent = this.drawCurrentRect(x, y, potNum)
          eventLayer.add(rectEvent)
          positions.push({ x: x, y: y, index: i * this.pot.colNum + n })
        }
      }
      this.potKonva.add(layer)
      // 温度定时显示切换
      this.temperaturetLayer = new konva.Layer()
      this.positions = positions
      this.potTemperature()
      if (this.timerHandle != null) {
        window.clearInterval(this.timerHandle)
      }
      this.timerHandle = window.setInterval(() => { this.potTemperature() }, this.interval)
      this.potKonva.add(this.temperaturetLayer)

      // 事件层
      this.potKonva.add(eventLayer)
    },
    singlePot(x, y, potNum, eventLayer) {
      // 单个罐绘制
      let potData = this.potList[potNum]
      let [
        potWodth,
        potHeight,
        radius,
        indent,
        headHeight,
        bottomHeight1,
        bottomHeight2
      ] = [
        this.pot.size.width,
        this.pot.size.height,
        this.pot.size.radius,
        this.pot.size.indent,
        this.pot.size.headHeight,
        this.pot.size.bottomHeight1,
        this.pot.size.bottomHeight2
      ]
      let percent = potData.usedLatticeNum / potData.latticeNum
      let potColor = this.pot.potColor
      let gradualPotColor = this.pot.gradualPotColor
      let shadowColor = this.pot.shadowColor
      if (percent >= 1) {
        potColor = this.pot.fullColor
        shadowColor = this.pot.fullShadowColor
        gradualPotColor = this.pot.gradualFullColor
      }
      // x,y左上起始点；要返回的组数据，形状往里面添加，形状坐标以它的左上为起点
      let group = new konva.Group({
        x: x,
        y: y,
        rotation: 0
      })

      // 口部圆弧
      let wedgeLeftTop = new konva.Wedge({
        x: radius + indent,
        y: radius + 1,
        radius: radius,
        angle: 90,
        fill: gradualPotColor,
        rotation: -180
      })
      group.add(wedgeLeftTop)
      let rectTop = new konva.Rect({
        x: radius + indent,
        y: 1,
        width: potWodth - (indent + radius) * 2,
        height: radius,
        fillLinearGradientStartPoint: {
          x: 0,
          y: headHeight + radius
        },
        fillLinearGradientEndPoint: {
          x: potWodth,
          y: headHeight + radius
        },
        fillLinearGradientColorStops: [0, gradualPotColor, 0.5, potColor, 1, gradualPotColor]
        // fill: potColor
      })
      group.add(rectTop)
      let wedgeRightTop = new konva.Wedge({
        x: potWodth - radius - indent,
        y: radius + 1,
        radius: radius,
        angle: 90,
        fill: gradualPotColor,
        rotation: -90
      })
      group.add(wedgeRightTop)
      let rectHead = new konva.Rect({
        x: indent,
        y: radius,
        width: potWodth - indent * 2,
        height: headHeight - radius + 1,
        fillLinearGradientStartPoint: {
          x: 0,
          y: headHeight + radius
        },
        fillLinearGradientEndPoint: {
          x: potWodth,
          y: headHeight + radius
        },
        fillLinearGradientColorStops: [0, gradualPotColor, 0.5, potColor, 1, gradualPotColor]
        // fill: potColor
      })
      group.add(rectHead)

      // 罐上部圆弧
      let wedgeLeft = new konva.Wedge({
        x: radius,
        y: headHeight + radius + 1,
        radius: radius,
        angle: 90,
        fill: gradualPotColor,
        rotation: -180
      })
      group.add(wedgeLeft)

      let rect = new konva.Rect({
        x: radius,
        y: headHeight + 1,
        width: potWodth - radius * 2,
        height: radius,
        fillLinearGradientStartPoint: {
          x: 0,
          y: headHeight + radius
        },
        fillLinearGradientEndPoint: {
          x: potWodth,
          y: headHeight + radius
        },
        fillLinearGradientColorStops: [0, gradualPotColor, 0.5, potColor, 1, gradualPotColor]
        // fill: potColor
      })
      group.add(rect)
      let lineShadow = new konva.Line({
        x: radius,
        y: headHeight + 1,
        points: [0, 0, potWodth - radius * 2, 0],
        tension: 0,
        stroke: shadowColor,
        strokeWidth: 1
      })
      group.add(lineShadow)
      let wedgeRight = new konva.Wedge({
        x: potWodth - radius,
        y: headHeight + radius + 1,
        radius: radius,
        angle: 90,
        fill: gradualPotColor,
        rotation: -90
      })
      group.add(wedgeRight)
      // 罐体
      let bodyHeight =
        potHeight -
        radius -
        headHeight -
        this.pot.size.bottomHeight1 -
        this.pot.size.bottomHeight2
      let rectBody = new konva.Rect({
        x: 0,
        y: headHeight + radius,
        width: potWodth,
        height: bodyHeight,
        fillLinearGradientStartPoint: {
          x: 0,
          y: headHeight + radius
        },
        fillLinearGradientEndPoint: {
          x: potWodth,
          y: headHeight + radius
        },
        fillLinearGradientColorStops: [0, gradualPotColor, 0.5, potColor, 1, gradualPotColor]
        // fill: potColor
      })
      group.add(rectBody)
      let [x1, y1] = [0, potHeight - bottomHeight1 - bottomHeight2]
      let [x2, y2] = [potWodth, y1]
      let [x3, y3] = [x2 - bottomHeight1 / 2, y2 + bottomHeight1]
      let [x4, y4] = [x1 + bottomHeight1 / 2, y2 + bottomHeight1]
      let echelon1 = new konva.Line({
        points: [x1, y1, x2, y2, x3, y3, x4, y4],
        // fill: potColor,
        fillLinearGradientStartPoint: {
          x: 0,
          y: headHeight + radius
        },
        fillLinearGradientEndPoint: {
          x: potWodth,
          y: headHeight + radius
        },
        fillLinearGradientColorStops: [0, gradualPotColor, 0.5, potColor, 1, gradualPotColor],
        closed: true
      })
      group.add(echelon1)
      let echelon2 = new konva.Line({
        points: [
          x4,
          y4,
          x3,
          y3,
          x3 - bottomHeight2 / 2,
          y3 + bottomHeight2,
          x4 + bottomHeight2 / 2,
          y4 + bottomHeight2
        ],
        fill: shadowColor,
        closed: true
      })
      group.add(echelon2)
      // 罐存储状态
      if (percent < 1) {
        let usedHeight = Math.ceil(percent * potHeight)
        // 第二个梯形处理
        if (usedHeight > 0 && usedHeight < bottomHeight2) {
          let echelon211 = new konva.Line({
            points: [
              x3 - bottomHeight2 / 2,
              y3 + bottomHeight2,
              x4 + bottomHeight2 / 2,
              y4 + bottomHeight2,
              x4 + (bottomHeight2 - usedHeight) / 2,
              y4 + bottomHeight2 - usedHeight,
              x3 - (bottomHeight2 - usedHeight) / 2,
              y3 + bottomHeight2 - usedHeight
            ],
            fill: this.pot.storedColor2,
            closed: true
          })
          group.add(echelon211)
        }
        if (usedHeight >= bottomHeight2) {
          // 大于等于最底下
          let echelon21 = new konva.Line({
            points: [
              x4,
              y4,
              x3,
              y3,
              x3 - bottomHeight2 / 2,
              y3 + bottomHeight2,
              x4 + bottomHeight2 / 2,
              y4 + bottomHeight2
            ],
            fill: this.pot.storedColor2,
            closed: true
          })
          group.add(echelon21)
        }
        // 第一个梯形处理
        if (
          usedHeight > bottomHeight2 &&
          usedHeight < bottomHeight1 + bottomHeight2
        ) {
          // 底部第二梯形未满
          let h1 = usedHeight - bottomHeight2
          let echelon111 = new konva.Line({
            points: [
              x3,
              y3,
              x4,
              y4,
              x4 - h1 / 2,
              y4 - h1,
              x3 + h1 / 2,
              y3 - h1
            ],
            fill: this.pot.storedColor,
            opacity: 1,
            closed: true
          })
          group.add(echelon111)
        }

        if (usedHeight >= bottomHeight1 + bottomHeight2) {
          // 如果大于等于下面第二个高度
          let echelon11 = new konva.Line({
            points: [x1, y1, x2, y2, x3, y3, x4, y4],
            fill: this.pot.storedColor,
            closed: true
          })
          group.add(echelon11)
        }
        // 罐体矩形
        if (usedHeight > bottomHeight1 + bottomHeight2) {
          // 如果没到罐的顶部圆弧高
          let [by, bh] = [
            potHeight - usedHeight,
            usedHeight - (bottomHeight1 + bottomHeight2)
          ]
          if (usedHeight >= potHeight - this.pot.size.headHeight - radius) {
            by = this.pot.size.headHeight + radius
            bh = bodyHeight
          }
          let rectBody1 = new konva.Rect({
            x: 0,
            y: by,
            width: potWodth,
            height: bh,
            fill: this.pot.storedColor
          })
          group.add(rectBody1)
        }
        // 罐上部圆弧
        if (usedHeight >= potHeight - headHeight - radius) {
          // 没到口部，全算圆弧
          let wedgeLeft1 = new konva.Wedge({
            x: radius,
            y: headHeight + radius + 1,
            radius: radius,
            angle: 90,
            fill: this.pot.storedColor,
            rotation: -180
          })
          group.add(wedgeLeft1)
          let rect1 = new konva.Rect({
            x: radius - 1,
            y: headHeight + 1,
            width: potWodth - radius * 2 + 2,
            height: radius,
            fill: this.pot.storedColor
          })
          group.add(rect1)

          let wedgeRight1 = new konva.Wedge({
            x: potWodth - radius,
            y: headHeight + radius + 1,
            radius: radius,
            angle: 90,
            fill: this.pot.storedColor,
            rotation: -90
          })
          group.add(wedgeRight1)
        }
        // 头部状态
        if (usedHeight > potHeight - headHeight) {
          // 绘口部，没到圆弧
          let [hy, hh] = [
            potHeight - usedHeight,
            headHeight - potHeight + usedHeight
          ]
          if (usedHeight > potHeight - radius) {
            [hy, hh] = [radius, headHeight - radius]
          }
          let rectHead1 = new konva.Rect({
            x: indent,
            y: hy,
            width: potWodth - indent * 2,
            height: hh + 1,
            fill: this.pot.storedColor
          })
          group.add(rectHead1)
          let lineShadow2 = new konva.Line({
            x: radius,
            y: headHeight + 1,
            points: [0, 0, potWodth - radius * 2, 0],
            tension: 0,
            stroke: this.pot.storedColor2,
            strokeWidth: 1
          })
          group.add(lineShadow2)
        }
        if (usedHeight > potHeight - radius && percent >= 1) {
          // 绘制头部圆弧,没到100%就不设置状态
          // 口部圆弧
          let wedgeLeftTop = new konva.Wedge({
            x: radius + indent,
            y: radius + 1,
            radius: radius,
            angle: 90,
            fill: this.pot.storedColor,
            rotation: -180
          })
          group.add(wedgeLeftTop)
          let rectTop = new konva.Rect({
            x: radius + indent,
            y: 1,
            width: potWodth - (indent + radius) * 2,
            height: radius,
            fill: this.pot.storedColor
          })
          group.add(rectTop)
          let wedgeRightTop = new konva.Wedge({
            x: potWodth - radius - indent,
            y: radius + 1,
            radius: radius,
            angle: 90,
            fill: this.pot.storedColor,
            rotation: -90
          })
          group.add(wedgeRightTop)
        }
      }
      // 文本
      // 背景框
      let [gx, gy] = [
        (potWodth - this.pot.groundWidth) / 2,
        (potHeight - this.pot.groundHeight) / 2 + 20
      ]
      let wedgeGroundLeft = new konva.Wedge({
        x: gx,
        y: gy + this.pot.groundHeight / 2,
        radius: this.pot.groundHeight / 2,
        angle: 180,
        fill: this.pot.txtBackgroundColor,
        rotation: -270
      })
      group.add(wedgeGroundLeft)

      let rectGround = new konva.Rect({
        x: gx,
        y: gy,
        width: this.pot.groundWidth,
        height: this.pot.groundHeight,
        fill: this.pot.txtBackgroundColor
      })
      group.add(rectGround)

      let wedgeGroundRight = new konva.Wedge({
        x: gx + this.pot.groundWidth,
        y: gy + this.pot.groundHeight / 2,
        radius: this.pot.groundHeight / 2,
        angle: 180,
        fill: this.pot.txtBackgroundColor,
        rotation: -90
      })
      group.add(wedgeGroundRight)
      // 文本
      let per = (percent * 100).toFixed(2)
      let txt = `${potData.potCode}（${per}%）`
      var potText = new konva.Text({
        x: gx,
        y: gy + 4,
        text: txt,
        fontSize: 12,
        fontFamily: 'Microsoft YaHei',
        fill: this.pot.txtColor
      })
      group.add(potText)
      // 点击事件
      this.potAddClick(group, potNum, eventLayer)
      return group
    },
    potAddClick(group, potNum, eventLayer) {
      // 点击事件
      group.on('click', () => {
        let pot = this.potList[potNum]
        this.currentItem.potId = pot.id
        this.currentItem.potCode = pot.potCode
        this.currentItem.potIndex = potNum
        this.currentItem.potTotal = pot.latticeNum
        this.currentItem.potUsedTotal = pot.usedLatticeNum
        this.currentItem.regionIndex = 0
        this.currentItem.regionCode = ''
        this.currentItem.towerCode = ''
        this.currentItem.box = {}
        this.drawRegions(pot.id)
        let shapes = eventLayer.find('Rect')
        for (let i = 0; i < shapes.length; i++) {
          let rect = shapes[i]
          if (i === potNum) {
            rect.show()
          } else {
            rect.hide()
          }
        }
        eventLayer.draw()
      })
    },
    drawCurrentRect(x, y, potNum) {
      let isVisible = this.currentItem.potIndex === potNum
      let rect = new konva.Rect({
        x: x - 5,
        y: y - 5,
        width: this.pot.size.width + 10,
        height: this.pot.size.height + 10,
        stroke: '#F2A2B7',
        strokeWidth: 1,
        opacity: 1,
        visible: isVisible
      })
      return rect
    },
    getTemperature(len) { // 模拟获取实时温度
      const getNumArray = len => [...new Array(len).keys()]
      const genRandom = (min, max) => (Math.random() + min)
      let wdArr = getNumArray(len)
      wdArr.forEach((v, i) => {
        wdArr[i] = -genRandom(195, 196).toFixed(2)
      })
      return wdArr
    },
    potTemperature() { // 罐工作温度
      this.temperaturetLayer.destroyChildren()
      let positions = this.positions
      let wdArr = this.getTemperature(positions.length)
      positions.forEach((value, index, array) => {
        let group = new konva.Group({
          id: value.index,
          x: value.x,
          y: value.y,
          rotation: 0
        })
        let t = wdArr[index] + ' ℃'
        this.drawText(group, t)
        this.temperaturetLayer.add(group)
        this.temperaturetLayer.draw()
      })
    },
    drawText(group, txt) {
      // 文本
      // 背景框
      let [gx, gy] = [
        (this.pot.size.width - this.pot.groundWidth) / 2,
        (this.pot.size.height - this.pot.groundHeight) / 2 - 40
      ]
      let wedgeGroundLeft = new konva.Wedge({
        x: gx,
        y: gy + this.pot.groundHeight / 2,
        radius: this.pot.groundHeight / 2,
        angle: 180,
        fill: this.pot.txtBackgroundColor,
        rotation: -270
      })
      group.add(wedgeGroundLeft)

      let rectGround = new konva.Rect({
        x: gx,
        y: gy,
        width: this.pot.groundWidth,
        height: this.pot.groundHeight,
        fill: this.pot.txtBackgroundColor
      })
      group.add(rectGround)

      let wedgeGroundRight = new konva.Wedge({
        x: gx + this.pot.groundWidth,
        y: gy + this.pot.groundHeight / 2,
        radius: this.pot.groundHeight / 2,
        angle: 180,
        fill: this.pot.txtBackgroundColor,
        rotation: -90
      })
      group.add(wedgeGroundRight)
      // 文本
      var wdText = new konva.Text({
        x: gx + 4,
        y: gy + 4,
        text: txt,
        fontSize: 12,
        fontFamily: 'Microsoft YaHei',
        fill: this.pot.txtColor
      })
      group.add(wdText)
      let id = group.attrs.id
      this.potAddClick(group, id, this.potEventLayer)
    },
    // 统计饼图
    initChart(pieData) {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          color: [this.pot.potColor, this.pot.storedColor, this.pot.fullColor],
          data: ['未储存', '未存满', '已存满']
        },
        series: [
          {
            name: '储存情况',
            type: 'pie',
            radius: [0, '72%'],
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
            center: ['40%', '50%'],
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
        color: [this.pot.potColor, this.pot.storedColor, this.pot.fullColor]
      }
      let myChart = echarts.init(document.getElementById('potPie'))
      myChart.setOption(option)
    },
    // 区域图
    drawRegions(potId) {
      getScheduleRegionData({
        potId: this.currentItem.potId,
        regionCode: this.currentItem.regionCode
      }).then(res => {
        if (res.data.regionData) {
          this.regionList = res.data.regionData
        }
        this.towerList = res.data.towerData
        this.boxList = res.data.boxData
        this.latticeList = res.data.latticeData
        let item = res.data.currentItem
        this.currentItem.regionCode = item.regionCode
        this.currentItem.towerCode = item.towerCode
        this.currentItem.box = item.firstBox
        this.maxCodes = item.maxCodes
        this.regionKonva.destroyChildren() // 清除之前绘制
        let layerBox = new konva.Layer()
        // 添加事件层
        let eventBoxLayer = new konva.Layer()
        let [towerNum, boxNum] = [
          parseInt(this.maxCodes.towerCode),
          parseInt(this.maxCodes.boxCode)
        ]
        let maxHeight = boxNum * this.box.height + this.box.top + 64
        let maxWidth = this.box.left + towerNum * this.box.width + 20
        if (maxWidth > this.leftWidth) {
          this.leftWidth = maxWidth
        }
        this.styleRegion.height = maxHeight + 'px'

        let [x, y] = [this.box.xLeft, this.box.xTop]
        // 绘颜色标识块
        let maxX = this.box.left + towerNum * this.box.width
        let colorX = maxX < this.leftWidth ? this.leftWidth : maxX
        // this.styleRegion.width = (colorX + 20) + 'px'
        this.regionKonva.width(colorX)
        let colorY = this.box.xTop - 28
        let colorBlockFull = new konva.Rect({
          x: colorX - 80,
          y: colorY,
          width: 24,
          height: 12,
          fill: this.box.fullColor,
          cornerRadius: 5
        })
        layerBox.add(colorBlockFull)
        let full = new konva.Text({
          x: colorX - 50,
          y: colorY,
          text: '已存满',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei',
          fill: this.pot.txtColor
        })
        layerBox.add(full)
        let colorstored = new konva.Rect({
          x: colorX - 160,
          y: colorY,
          width: 24,
          height: 12,
          fill: this.box.storedColor,
          cornerRadius: 5
        })
        layerBox.add(colorstored)
        let stored = new konva.Text({
          x: colorX - 130,
          y: colorY,
          text: '未存满',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei',
          fill: this.pot.txtColor
        })
        layerBox.add(stored)
        let colorBlock = new konva.Rect({
          x: colorX - 240,
          y: colorY,
          width: 24,
          height: 12,
          fill: this.box.boxColor,
          cornerRadius: 5
        })
        layerBox.add(colorBlock)
        let block = new konva.Text({
          x: colorX - 210,
          y: colorY,
          text: '未储存',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei',
          fill: this.pot.txtColor
        })
        layerBox.add(block)
        // 绘制纵横坐标文字,线
        for (let n = 0; n < towerNum; n++) {
          // 绘x轴标题
          let num = n + 1
          let towerCode = num < 10 ? '0' + num : num
          let boxXTitle = new konva.Text({
            x: x,
            y: y,
            text: towerCode + '号塔',
            fontSize: 12,
            fontFamily: 'Microsoft YaHei',
            fill: this.pot.txtColor
          })
          layerBox.add(boxXTitle)
          x += this.box.width
          // 绘方格纵向
          let verticalLine = new konva.Line({
            points: [
              this.box.left + n * this.box.width,
              this.box.top,
              this.box.left + n * this.box.width,
              this.box.top + this.box.height * boxNum
            ],
            tension: 0,
            stroke: this.box.lineColor,
            strokeWidth: 1
          })
          layerBox.add(verticalLine)
          // 一列（塔）绘制盒子
          let colArr = this.boxList.filter(m => m.towerCode === towerCode.toString())
          colArr.forEach(box => {
            let indexY = parseInt(box.boxCode) // 以盒编号解析整数为行号（没顺序来，有点可能已弃用）
            let [x, y] = [
              this.box.left + n * this.box.width,
              this.box.top + (indexY - 1) * this.box.height
            ]
            let group = this.singleBox(x, y, box, eventBoxLayer)
            layerBox.add(group)
            let rectEvent = this.drawCurrentBoxRect(x, y, box)
            eventBoxLayer.add(rectEvent)
          })
        }
        // 最后纵线
        let verticalLine2 = new konva.Line({
          points: [
            this.box.left + (towerNum) * this.box.width,
            this.box.top,
            this.box.left + (towerNum) * this.box.width,
            this.box.top + this.box.height * boxNum
          ],
          tension: 0,
          stroke: this.box.lineColor,
          strokeWidth: 1
        })
        layerBox.add(verticalLine2)
        x = this.box.yLeft
        y = this.box.yTop
        for (let m = 0; m < boxNum; m++) {
          // y坐标标题
          let num = m + 1
          let boxYTitle = new konva.Text({
            x: x,
            y: y,

            text: (num < 10 ? '0' + num : num) + '盒',
            fontSize: 12,
            fontFamily: 'Microsoft YaHei',
            fill: this.pot.txtColor
          })
          layerBox.add(boxYTitle)
          // 水平线
          let horizontallLine = new konva.Line({
            points: [
              this.box.left,
              this.box.top + m * this.box.height,
              this.box.left + this.box.width * towerNum,
              this.box.top + m * this.box.height
            ],
            tension: 0,
            stroke: this.box.lineColor,
            strokeWidth: 1
          })
          layerBox.add(horizontallLine)
          y += this.box.height
        }
        // 绘水平线
        let horizontallLine2 = new konva.Line({
          points: [
            this.box.left,
            this.box.top + boxNum * this.box.height,
            this.box.left + this.box.width * towerNum,
            this.box.top + boxNum * this.box.height
          ],
          tension: 0,
          stroke: this.box.lineColor,
          strokeWidth: 1
        })
        layerBox.add(horizontallLine2)
        this.regionKonva.add(layerBox)
        this.regionKonva.add(eventBoxLayer)
        this.drawBox(this.currentItem.box)
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    singleBox(x, y, box, eventLayer) {
      let group = new konva.Group({
        x: x,
        y: y,
        rotation: 0
      })
      let [
        bx,
        by,
        radius,
        boxColor,
        storedColor,
        fullColor,
        boxWidth,
        boxHeight
      ] = [
        this.box.padding,
        this.box.padding,
        this.box.radius,
        this.box.boxColor,
        this.box.storedColor,
        this.box.fullColor,
        this.box.width - this.box.padding * 2,
        this.box.height - this.box.padding * 2
      ]
      let [latticeNum, usedLatticeNum] = [box.latticeNum, box.usedLatticeNum]
      let percent = usedLatticeNum / latticeNum
      if (percent === 1) {
        boxColor = fullColor
      }
      let uw = Math.ceil(boxWidth * percent)
      // 左侧圆弧
      let wedgeLeftTop = new konva.Wedge({
        x: radius + bx,
        y: radius + by,
        radius: radius,
        angle: 90,
        fill: boxColor,
        rotation: -180
      })
      group.add(wedgeLeftTop)
      let rectLeft = new konva.Rect({
        x: bx,
        y: by + radius,
        width: radius,
        height: boxHeight - radius * 2,
        fill: boxColor
      })
      group.add(rectLeft)
      let wedgeLeftBottom = new konva.Wedge({
        x: radius + bx,
        y: by + boxHeight - radius,
        radius: radius,
        angle: 90,
        fill: boxColor,
        rotation: -270
      })
      group.add(wedgeLeftBottom)
      // 盒体
      let rectBox = new konva.Rect({
        x: bx + radius,
        y: by,
        width: boxWidth - radius * 2,
        height: boxHeight,
        stroke: boxColor,
        strokeWidth: 1,
        fill: boxColor
      })
      group.add(rectBox)
      // 右侧圆弧
      let wedgeRightTop = new konva.Wedge({
        x: boxWidth + bx - radius,
        y: radius + by,
        radius: radius,
        angle: 90,
        fill: boxColor,
        rotation: -90
      })
      group.add(wedgeRightTop)
      let rectRight = new konva.Rect({
        x: boxWidth + bx - radius,
        y: by + radius,
        width: radius,
        height: boxHeight - radius * 2,
        fill: boxColor
      })
      group.add(rectRight)
      let wedgeRightBottom = new konva.Wedge({
        x: boxWidth + bx - radius,
        y: by + boxHeight - radius,
        radius: radius,
        angle: 90,
        fill: boxColor,
        rotation: -0
      })
      group.add(wedgeRightBottom)
      // 绘使用状态
      if (uw > 0) {
        // 左侧圆弧
        let wedgeLeftTop1 = new konva.Wedge({
          x: radius + bx,
          y: radius + by,
          radius: radius,
          angle: 90,
          fill: storedColor,
          rotation: -180
        })
        group.add(wedgeLeftTop1)
        let rectLeft1 = new konva.Rect({
          x: bx,
          y: by + radius,
          width: radius,
          height: boxHeight - radius * 2,
          fill: storedColor
        })
        group.add(rectLeft1)
        let wedgeLeftBottom1 = new konva.Wedge({
          x: radius + bx,
          y: by + boxHeight - radius,
          radius: radius,
          angle: 90,
          fill: storedColor,
          rotation: -270
        })
        group.add(wedgeLeftBottom1)
        // 文本
        let txt = `${usedLatticeNum} / ${latticeNum}`
        var potText = new konva.Text({
          x: bx + radius + 6,
          y: by + radius + 4,
          text: txt,
          fontSize: 11,
          fontFamily: '黑体',
          fill: this.pot.txtColor
        })
        group.add(potText)
      }

      // 点击事件
      group.on('click', () => {
        getLatticeDataByBoxId({ boxId: box.id }).then(res => {
          this.latticeList = res.data.latticeData
          this.drawBox(box)
        })
        this.currentItem.box = box
        let shapes = eventLayer.find('Rect')
        for (let i = 0; i < shapes.length; i++) {
          let rect = shapes[i]
          let id = shapes[i].attrs.id
          if (id === box.towerCode + '_' + box.boxCode) {
            rect.show()
          } else {
            rect.hide()
          }
        }
        eventLayer.draw()
      })
      return group
    },
    drawCurrentBoxRect(x, y, box) {
      let isVisible =
        this.currentItem.towerCode === box.towerCode &&
        this.currentItem.boxCode === box.boxCode
      let rect = new konva.Rect({
        id: box.towerCode + '_' + box.boxCode,
        x: x,
        y: y,
        width: this.box.width,
        height: this.box.height,
        stroke: 'red',
        strokeWidth: 1,
        visible: isVisible
      })
      return rect
    },
    regionClick(item, index) {
      this.currentItem.regionCode = item.regionCode
      this.drawRegions(item.potId)
    },
    // 盒子图
    drawBox(box) {
      let layerLattice = new konva.Layer()
      // 添加事件层
      let eventLayer = new konva.Layer()
      this.boxKonva.destroyChildren()
      let [rowNum, colNum] = [box.boxRowNum, box.boxColumnNum]
      let maxX = this.lattice.left + colNum * this.lattice.width + 10
      if (maxX > this.leftWidth) {
        this.leftWidth = maxX
        this.boxKonva.width(maxX)
      }
      let maxHeight = this.lattice.top + rowNum * this.lattice.height + 32
      this.styleBox.height = maxHeight + 'px'
      this.boxKonva.height(maxHeight)
      let [x, y] = [this.lattice.xLeft, this.lattice.xTop]
      // 绘制纵横坐标文字,线
      // 横线
      let horizontallLine0 = new konva.Line({
        // 顶部水平线
        points: [
          this.lattice.yLeft,
          this.lattice.xTop,
          this.lattice.left + this.lattice.width * colNum,
          this.lattice.xTop
        ],
        tension: 0,
        stroke: this.lattice.lineColor,
        strokeWidth: 1
      })
      layerLattice.add(horizontallLine0)
      // 绘方格纵向
      let verticalLine0 = new konva.Line({
        // 左侧竖线
        points: [
          this.lattice.yLeft,
          this.lattice.xTop,
          this.lattice.yLeft,
          this.lattice.top + this.lattice.height * rowNum
        ],
        tension: 0,
        stroke: this.lattice.lineColor,
        strokeWidth: 1
      })
      layerLattice.add(verticalLine0)
      for (let n = 0; n < colNum; n++) {
        // 绘x轴标题
        let num = n + 1
        let latticeXTitle = new konva.Text({
          x: x + 16,
          y: y + 8,
          text: num,
          fontSize: 12,
          fontFamily: 'Microsoft YaHei',
          fill: this.pot.txtColor
        })
        layerLattice.add(latticeXTitle)
        x += this.lattice.width
        // 绘方格纵向
        let verticalLine = new konva.Line({
          points: [
            this.lattice.left + n * this.lattice.width,
            this.lattice.xTop,
            this.lattice.left + n * this.lattice.width,
            this.lattice.top + this.lattice.height * rowNum
          ],
          tension: 0,
          stroke: this.lattice.lineColor,
          strokeWidth: 1
        })
        layerLattice.add(verticalLine)
      }
      // 最后纵线
      let verticalLine2 = new konva.Line({
        points: [
          this.lattice.left + colNum * this.lattice.width,
          this.lattice.xTop,
          this.lattice.left + colNum * this.lattice.width,
          this.lattice.top + this.lattice.height * rowNum
        ],
        tension: 0,
        stroke: this.lattice.lineColor,
        strokeWidth: 1
      })
      layerLattice.add(verticalLine2)
      x = this.lattice.yLeft
      y = this.lattice.yTop
      for (let m = 0; m < rowNum; m++) {
        // y坐标标题
        let num = m + 1
        let latticeYTitle = new konva.Text({
          x: x + 10,
          y: y + 10,
          text: num,
          fontSize: 11,
          fontFamily: '黑体',
          fill: this.pot.txtColor
        })
        layerLattice.add(latticeYTitle)
        // 横线
        let horizontallLine = new konva.Line({
          points: [
            this.lattice.yLeft,
            this.lattice.top + m * this.lattice.height,
            this.lattice.left + this.lattice.width * colNum,
            this.lattice.top + m * this.lattice.height
          ],
          tension: 0,
          stroke: this.lattice.lineColor,
          strokeWidth: 1
        })
        layerLattice.add(horizontallLine)
        y += this.lattice.height
        for (let i = 0; i < colNum; i++) {
          let latticeNum = m * colNum + i + 1
          let [tx, ty] = [
            this.lattice.width * i + this.lattice.left,
            this.lattice.height * m + this.lattice.top
          ]
          let group = this.singleLattice(
            tx,
            ty,
            this.latticeList,
            latticeNum,
            eventLayer
          )
          eventLayer.add(group)
        }
      }
      // 水平线
      let horizontallLine2 = new konva.Line({
        points: [
          this.lattice.yLeft,
          this.lattice.top + rowNum * this.lattice.height,
          this.lattice.left + this.lattice.width * colNum,
          this.lattice.top + rowNum * this.lattice.height
        ],
        tension: 0,
        stroke: this.lattice.lineColor,
        strokeWidth: 1
      })
      layerLattice.add(horizontallLine2)
      this.boxKonva.add(layerLattice)
      this.boxKonva.add(eventLayer)
    },
    singleLattice(x, y, latticeArr, latticeNum, eventLayer) {
      let group = new konva.Group({
        x: x,
        y: y,
        rotation: 0
      })
      let [
        cx,
        cy,
        radius,
        latticeColor,
        fullColor,
        tubeWidth,
        tubeHeight,
        thick,
        blank
      ] = [
        this.lattice.width / 2,
        this.lattice.height / 2,
        this.lattice.tubeRadius,
        this.lattice.latticeColor,
        this.lattice.fullColor,
        this.lattice.tubeWidth,
        this.lattice.tubeHeight,
        this.lattice.thick,
        this.lattice.blank
      ]
      let lattice = latticeArr.find(m => m.latticeNum === latticeNum)
      if (!lattice) {
        var circle = new konva.Circle({
          x: cx,
          y: cy,
          radius: this.lattice.txtRadius,
          fill: latticeColor
        })
        group.add(circle)
        let latticeText = new konva.Text({
          x: cx - 3,
          y: cy - 6,
          text: latticeNum,
          fontSize: 11,
          fontFamily: '黑体',
          fill: this.pot.txtColor
        })
        group.add(latticeText)
      } else {
        // 绘斜放试管
        let latticeGroup = new konva.Group({
          x: 20,
          y: -12,
          rotation: 45
        })
        let [tubeX, tubey] = [
          cx - tubeWidth / 2,
          (this.lattice.height - tubeHeight) / 2
        ]
        let rectTop = new konva.Rect({
          x: tubeX,
          y: tubey,
          width: tubeWidth,
          height: this.lattice.thick,
          fill: fullColor,
          cornerRadius: this.lattice.thick / 2
        })
        latticeGroup.add(rectTop)
        let rectbody = new konva.Rect({
          x: cx - radius,
          y: tubey + this.lattice.thick - 1,
          width: radius * 2,
          height: tubeHeight - 4 - radius,
          stroke: fullColor,
          strokeWidth: 2
        })
        latticeGroup.add(rectbody)
        let wedge = new konva.Wedge({
          x: cx,
          y: tubeHeight + 2 - radius,
          radius: radius + 1,
          angle: 180,
          fill: fullColor,
          rotation: 0
        })
        latticeGroup.add(wedge)

        let poly = new konva.Line({
          points: [
            cx - radius,
            2 + thick + blank + radius,
            cx + radius,
            2 + thick + blank - radius,
            cx + radius,
            tubeHeight + 2 - radius,
            cx - radius,
            tubeHeight + 2 - radius
          ],
          fill: fullColor,
          closed: true
        })
        latticeGroup.add(poly)

        group.add(latticeGroup)
      }

      return group
    }
  }
}
</script>

