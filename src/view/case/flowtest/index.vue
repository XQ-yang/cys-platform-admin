<template>
    <div style='width:100%; white-space:nowrap;'>
        <span style='border: 1px solid gray;display: inline-block; vertical-align: top; width:220px;'>
            <div ref='myPaletteDiv' style='height: 410px;'></div>
        </span>
        <span style='border: 1px solid gray;display: inline-block; vertical-align: top; width:100%;'>
            <div ref='myDiagramDiv' style='height: 410px'></div>
        </span>
        <br>
        <textarea style='width:100%;height:200px' v-model="savedModelText"></textarea>
    </div>
</template>

<script>
let go = window.go
var $ = go.GraphObject.make // for conciseness in defining templates
// let $ = window.go.GraphObject.make
export default {
  name: '',
  data() {
    return {
      modelData: null,
      diagram: null,
      savedModelText: '',
      nodeDataArray: [
      ],
      linkDataArray: [
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var self = this
      var myDiagram =
        $(go.Diagram, this.$refs.myDiagramDiv, // must name or refer to the DIV HTML element
          {
            initialContentAlignment: go.Spot.Center, // 居中
            // 显示网格
            'grid.visible': false,
            // 启动Ctrl+Z（撤销）、Ctrl+Y（恢复）
            'undoManager.isEnabled': true,
            'ModelChanged': function(e) {
              self.savedModelText = e.model.toJson()
            }
          })
      // 监听拖拽事件
      myDiagram.addDiagramListener('ExternalObjectsDropped', function(e) {
        // var nodes = myDiagram.selection.first().data
        // console.log(nodes)
      })
      myDiagram.nodeTemplateMap.add('',
        $(go.Node, 'Spot', this.nodeStyle(),
          $(go.Panel, 'Vertical',
            $(go.Picture, {
              margin: 3
            },
            new go.Binding('source', 'img'),
            new go.Binding('width', 'imgWidth'),
            new go.Binding('height', 'imgHeight')),
            $(go.TextBlock,
              {
                alignment: go.Spot.BottomCenter,
                // 文本不允许换行
                isMultiline: true,
                font: '13px sans-serif'
              },
              new go.Binding('text', 'text'),
              new go.Binding('text').makeTwoWay()
            )
          ),
          this.makePort('TC', go.Spot.TopCenter, true, true),
          this.makePort('TL', go.Spot.TopLeft, true, true),
          this.makePort('TR', go.Spot.TopRight, true, true),
          this.makePort('LC', go.Spot.LeftCenter, true, true),
          this.makePort('R', go.Spot.Right, true, true),
          this.makePort('BC', go.Spot.BottomCenter, true, true),
          this.makePort('BL', go.Spot.BottomLeft, true, true),
          this.makePort('BR', go.Spot.BottomRight, true, true)
        ))
      myDiagram.linkTemplate = $(go.Link,
        // the whole link panel
        {
          routing: go.Link.Bezier,
          // curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: false,
          resegmentable: false,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) {
            link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'
          },
          mouseLeave: function(e, link) {
            link.findObject('HIGHLIGHT').stroke = 'transparent'
          }
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
        $(go.Shape, // the link path shape
          { isPanelMain: true, stroke: 'gray', strokeWidth: 2 }),
        $(go.Shape, // the arrowhead
          { toArrow: 'standard', stroke: null, fill: 'gray' }),
        $(go.Shape, { toArrow: 'Standard' }),
        $(go.TextBlock, 'from', { segmentIndex: 0, segmentFraction: 0.2, editable: true }, new go.Binding('text', 'fromText').makeTwoWay()),
        $(go.TextBlock, 'mid', { segmentIndex: 0, segmentFraction: 0.5, editable: true }, new go.Binding('text', 'midText').makeTwoWay()),
        $(go.TextBlock, 'to', { segmentIndex: 0, segmentFraction: 0.8, editable: true }, new go.Binding('text', 'toText').makeTwoWay())
      )
      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      // myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
      // myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal
      // initialize the Palette that is on the left side of the page
      // eslint-disable-next-line no-unused-vars
      var myPalette =
        $(go.Palette, this.$refs.myPaletteDiv)

      myPalette.nodeTemplate = $(go.Node, 'Vertical',
        $(go.Picture, { margin: 3 },
          new go.Binding('source', 'img'),
          new go.Binding('width', 'imgWidth'),
          new go.Binding('height', 'imgHeight'))
      )
      myPalette.model.nodeDataArray = [
        {
          img: require('../../../assets/images/temp/01.png'),
          imgWidth: 50,
          imgHeight: 50,
          text: '12333'
        },
        {
          img: require('../../../assets/images/temp/02.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/03.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/04.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/05.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/06.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/07.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/08.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/09.png'),
          imgWidth: 50,
          imgHeight: 50
        },
        {
          img: require('../../../assets/images/temp/10.png'),
          imgWidth: 50,
          imgHeight: 50
        }
      ]
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
      let diagram = node.diagram
      if (!diagram || diagram.isReadOnly || !diagram.allowLink) return
      node.ports.each(function(port) {
        port.stroke = (show ? 'rgba(0,0,0,.3)' : null)
      })
    }

  }
}

</script>
<style>
</style>
