<template>
  <div>
    <div ref="myDiagram" style='border: solid 1px black; width:100%; height:700px'></div>
    <br>
    <textarea style='width:100%;height:200px' v-model="savedModelText"></textarea>
  </div>
</template>

<script>
let go = window.go
let $ = window.go.GraphObject.make
export default {
  name: '',
  data() {
    return {
      modelData: null,
      diagram: null,
      savedModelText: '',
      nodeDataArray: [
        { key: '1', text: '', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/1.png'), location: '230 196' },
        { key: '2', text: '', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/2.png'), location: '295 89' },
        { key: '3', text: '', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/3.png'), location: '444 57' },
        { key: '4', text: '', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/4.png'), location: '587.9999999999998 79' },
        { key: '5', text: '', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/5.png'), location: '674 190.99999999999994' },
        {
          key: '6',
          text: '存储健康模型',
          imgWidth: 92,
          imgHeight: 96,
          img: require('../../../assets/images/gs/save.png'),
          location: '-116.00000000000006 -217.00000000000003',
          score: 80
        },
        { key: '7', text: '网络健康模型', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/network.png'), location: '144.99999999999994 -223.00000000000006', score: 95 },
        { key: '8', text: '中间件健康模型', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/plugin.png'), location: '416.9999999999998 -225.99999999999994', score: 95 },
        { key: '9', text: '应用系统健康模型', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/sys.png'), location: '670.0000000000001 -218', score: 95 },
        { key: '10', text: '数据库健康模型', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/database.png'), location: '887.0000000000001 -221.0000000000002', score: 95 },
        { key: '11', text: '系统健康模型', imgWidth: 378, imgHeight: 252, img: require('../../../assets/images/gs/AI.png'), location: '278.9999999999999 112.99999999999994' }
      ],
      linkDataArray: [
        { from: 1, to: 6 },
        { from: 2, to: 7 },
        { from: 3, to: 8 },
        { from: 4, to: 9 },
        { from: 5, to: 10 }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let self = this
      // 初始化设置
      let myDiagram = $(go.Diagram, this.$refs.myDiagram, {
        initialContentAlignment: go.Spot.Center, // 居中
        allowDelete: false, // 不允许删除
        allowCopy: false, // 不允许copy
        // 显示网格
        'grid.visible': true,
        // 启动Ctrl+Z（撤销）、Ctrl+Y（恢复）
        'undoManager.isEnabled': true,
        allowDrop: true,
        // 数据变化触发事件changed
        'ModelChanged': function(e) {
          // console.log(e.model.toJson())
          self.savedModelText = e.model.toJson()
        },
        'TextEdited': function(e) {
          console.log('edited')
        },
        grid: $(go.Panel, 'Grid', {
          gridCellSize: new go.Size(60, 60), // 网格大小
          background: 'white'
        },
        // 设置网格线条样式
        $(go.Shape, 'LineH', { stroke: '#F2F2F2' }),
        $(go.Shape, 'LineV', { stroke: '#F2F2F2' })
        )
      })
      myDiagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          fromEndSegmentLength: 20,
          toEndSegmentLength: 20,
          corner: 50
        },
        new go.Binding('points').makeTwoWay(), // 精准定位，但会影响容器位置 ,
        // 线路外观
        $(go.Shape, { isPanelMain: true, stroke: '#62aeae', strokeWidth: 5 }, new go.Binding('visible')),
        $(go.Shape, { isPanelMain: true, stroke: '#258e8f', strokeWidth: 3 }, new go.Binding('visible')),
        $(go.Shape, { isPanelMain: true, stroke: '#fff', strokeWidth: 1, name: 'PIPE', strokeDashArray: [10, 10] }
          , new go.Binding('stroke', 'strokeDashColor')
          , new go.Binding('strokeDashArray')
          , new go.Binding('strokeWidth')),
        // 连接线的文本
        $(go.TextBlock,
          new go.Binding('text', 'text'),
          new go.Binding('segmentIndex', 'segmentIndex'),
          new go.Binding('segmentOffset', 'segmentOffset', go.Point.parse),
          new go.Binding('segmentFraction', 'segmentFraction')),

        // 设置异常连接线的打叉图(从上到下的元素中，每一级元素位置会遮盖上一级元素，本次图片位置显示最前面)
        $(go.Picture, new go.Binding('source', 'errorImg'))
      )
      // 屏蔽Ctrl+C（复制）、Ctrl+V（粘贴）、Ctrl+X（剪切）
      myDiagram.commandHandler.doKeyDown = function() {
        var e = myDiagram.lastInput
        var control = e.control || e.meta
        var key = e.key
        if (control && (key === 'C' || key === 'V' || key === 'X')) {
          return
        }
        go.CommandHandler.prototype.doKeyDown.call(this)
      }
      // myDiagram.nodeTemplateMap.add()
      // 定义节点模板
      myDiagram.nodeTemplate = $(go.Node, 'Vertical',
        $(go.Picture,
          new go.Binding('source', 'img'),
          new go.Binding('width', 'imgWidth'),
          new go.Binding('height', 'imgHeight'),
        ),
        $(go.TextBlock,
          {
            margin: new go.Margin(3, 0, 0, 0),
            isMultiline: false
          },
          new go.Binding('text', 'text')
        ),
        $(go.TextBlock,
          {
            margin: new go.Margin(3, 0, 0, 0),
            isMultiline: false
          },
          new go.Binding('text', 'score')
        ),
        new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify)
      )
      // 定义节点数据
      myDiagram.model.nodeDataArray = this.nodeDataArray
      myDiagram.model.linkDataArray = this.linkDataArray
      myDiagram.model = $(go.GraphLinksModel, {
        linkFromPortIdProperty: 'fromPort', // 用于记录做任意端与端连接点位置信息
        linkToPortIdProperty: 'toPort', // 用于记录做任意端与端连接点位置信息
        nodeDataArray: this.nodeDataArray,
        linkDataArray: this.linkDataArray
      })
    },
    makePort(name, spot, output, input) {
      return $(go.Shape, 'Circle',
        {
          fill: 'transparent',
          stroke: null, // this is changed to 'white' in the showPorts function
          desiredSize: new go.Size(8, 8),
          alignment: spot,
          alignmentFocus: spot, // align the port on the main Shape
          portId: name, // declare this object to be a 'port'
          fromSpot: spot,
          toSpot: spot, // declare where links may connect at this port
          fromLinkable: output,
          toLinkable: input, // declare whether the user may draw links to/from here
          cursor: 'pointer' // show a different cursor to indicate potential link point
        })
    },

    nodeStyle() {
      return [
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationSpot: go.Spot.Center,
          mouseEnter: (e, obj) => {
            this.showPorts(obj.part, true)
          },
          mouseLeave: (e, obj) => {
            this.showPorts(obj.part, false)
          }
        }
      ]
    },
    showPorts(node, show) {
      var diagram = node.diagram
      if (!diagram || diagram.isReadOnly || !diagram.allowLink) return
      node.ports.each(function(port) {
        port.fill = show ? 'rgba(0,0,0,.3)' : null
      })
    }
  }
}

</script>
<style>
</style>
