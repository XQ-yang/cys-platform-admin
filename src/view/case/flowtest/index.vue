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
// let dataTemp = {
//   'class': 'GraphLinksModel',
//   'modelData': { 'position': '-399 -104' },
//   'nodeDataArray': [
//     { 'key': '110100345', 'nodeType': 0, 'nodeWidth': 65, 'nodeHeight': 90, 'imgWidth': 50, 'imgHeight': 50, 'bgImage': '/RtManageCon/jsLib/gojs/images/os.svg', 'imgAlign': { 'class': 'go.Spot', 'x': 0.5, 'y': 0.5, 'offsetX': 0, 'offsetY': 0 }, 'pictrueMargin': { 'class': 'go.Margin', 'top': -26, 'right': 0, 'bottom': 0, 'left': 0 }, 'contentText': '110100345\nH:97  P:96', 'text': '', 'textAlign': { 'class': 'go.Spot', 'x': 0.5, 'y': 1, 'offsetX': 0, 'offsetY': 0 },
// 'loc': '-120 -67', 'panelVisible': true },
//     { 'key': '210100376', 'nodeType': 1, 'nodeWidth': 65, 'nodeHeight': 90, 'imgWidth': 50, 'imgHeight': 50, 'bgImage': '/RtManageCon/jsLib/gojs/images/oracle.svg', 'imgAlign': { 'class': 'go.Spot', 'x': 0.5, 'y': 0.5, 'offsetX': 0, 'offsetY': 0 }, 'pictrueMargin': { 'class': 'go.Margin', 'top': -26, 'right': 0, 'bottom': 0, 'left': 0 }, 'contentText': '210100376\nH:97  P:96', 'text': '', 'textAlign': { 'class': 'go.Spot', 'x': 0.5, 'y': 1, 'offsetX': 0, 'offsetY': 0 }, 'loc': '39.453125 66.5', 'panelVisible': true },
//     { 'key': '210100375', 'nodeType': 1, 'nodeWidth': 65, 'nodeHeight': 90, 'imgWidth': 50, 'imgHeight': 50, 'bgImage': '/RtManageCon/jsLib/gojs/images/oracle.svg', 'imgAlign': { 'class': 'go.Spot', 'x': 0.5, 'y': 0.5, 'offsetX': 0, 'offsetY': 0 }, 'pictrueMargin': { 'class': 'go.Margin', 'top': -26, 'right': 0, 'bottom': 0, 'left': 0 }, 'contentText': '210100375\nH:97  P:96', 'text': '', 'textAlign': { 'class': 'go.Spot', 'x': 0.5, 'y': 1, 'offsetX': 0, 'offsetY': 0 }, 'loc': '-284 54', 'panelVisible': true }
//   ],
//   'linkDataArray': [
//     { 'from': '110100345', 'to': '210100375' },
//     { 'from': '110100345', 'to': '210100376' }
//   ]
// }
export default {
  name: '',
  data() {
    return {
      modelData: null,
      diagram: null,
      savedModelText: '',
      nodeDataArray: [
        { key: '1', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/1.png'), location: '230 196' },
        { key: '2', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/2.png'), location: '295 89' },
        { key: '3', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/3.png'), location: '444 57' },
        { key: '4', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/4.png'), location: '587.9999999999998 79' },
        { key: '5', imgWidth: 38, imgHeight: 38, img: require('../../../assets/images/gs/5.png'), location: '674 190.99999999999994' },
        { key: '6', text: '6', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/save.png'), location: '-116.00000000000006 -217.00000000000003' },
        { key: '7', text: '7', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/network.png'), location: '144.99999999999994 -223.00000000000006' },
        { key: '8', text: '8', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/plugin.png'), location: '415.9999999999999 -229.99999999999991' },
        { key: '9', text: '9', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/sys.png'), location: '670.0000000000001 -218' },
        { key: '10', text: '10', imgWidth: 92, imgHeight: 96, img: require('../../../assets/images/gs/database.png'), location: '887.0000000000001 -221.0000000000002' },
        { key: '11', text: '', imgWidth: 378, imgHeight: 252, img: require('../../../assets/images/gs/AI.png'), location: '278.9999999999999 112.99999999999994' }
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
       { routing: go.Link.Normal, selectable: true },
       $(go.Shape,
         { strokeWidth: 3 })
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
      myDiagram.nodeTemplate = $(go.Node, 'Auto',
        $(go.Picture,
          { name: 'Picture' },
          new go.Binding('width', 'imgWidth'), // 绑定图片的宽高
          new go.Binding('height', 'imgHeight'), // 绑定图片的宽高
          new go.Binding('source', 'img')), // 绑定图片的资源路径
        $(go.TextBlock,
          { margin: new go.Margin(5, 0, 0, 0),
            maxSize: new go.Size(100, 30),
            isMultiline: false },
          new go.Binding('text', 'text')),
        new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify)
      )
      // 定义节点数据
      myDiagram.model.nodeDataArray = this.nodeDataArray
      myDiagram.model.linkDataArray = this.linkDataArray
      // myDiagram.model = new go.GraphLinksModel(
      //   [{ key: 'Hello' }, // two node data, in an Array
      //     { key: 'World!' }],
      //   [{ from: 'Hello', to: 'World!' }] // one link data, in an Array
      // )
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
    }
  }
}

</script>
<style>
</style>
