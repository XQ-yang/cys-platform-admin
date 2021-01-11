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
            // initialContentAlignment: go.Spot.Center, // 居中
            // 显示网格
            'grid.visible': false,
            // 启动Ctrl+Z（撤销）、Ctrl+Y（恢复）
            'ModelChanged': function(e) {
              self.savedModelText = e.model.toJson()
            },
            // eslint-disable-next-line no-undef
            draggingTool: new GuidedDraggingTool(),
            'draggingTool.horizontalGuidelineColor': 'blue',
            'draggingTool.verticalGuidelineColor': 'blue',
            'draggingTool.centerGuidelineColor': 'green',
            'draggingTool.guidelineWidth': 1,
            'undoManager.isEnabled': !0
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
          this.makePort('TC', new go.Spot(0, 0), true, true),
          this.makePort('1', new go.Spot(0.25, 0), true, true),
          this.makePort('TL', new go.Spot(0.5, 0), true, true),
          this.makePort('2', new go.Spot(0.75, 0), true, true),
          this.makePort('TR', new go.Spot(1, 0), true, true),
          this.makePort('3', new go.Spot(0, 0.25), true, true),
          this.makePort('LC', new go.Spot(0, 0.5), true, true),
          this.makePort('4', new go.Spot(0, 0.75), true, true),
          this.makePort('BL', new go.Spot(0, 1), true, true),
          this.makePort('5', new go.Spot(0.25, 1), true, true),
          this.makePort('BR', new go.Spot(0.5, 1), true, true),
          this.makePort('6', new go.Spot(0.75, 1), true, true),
          this.makePort('7', new go.Spot(1, 1), true, true),
          this.makePort('8', new go.Spot(1, 0.25), true, true),
          this.makePort('9', new go.Spot(1, 0.5), true, true),
          this.makePort('10', new go.Spot(1, 0.75), true, true)
        ))
      myDiagram.linkTemplate = $(go.Link,
        // the whole link panel
        {
          routing: go.Link.Normal,
          curve: go.Link.JumpOver,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true
          // // mouse-overs subtly highlight links:
          // mouseEnter: function(e, link) {
          //   link.findObject('HIGHLIGHT').stroke = 'rgba(255,255,255,0.2)'
          // },
          // mouseLeave: function(e, link) {
          //   link.findObject('HIGHLIGHT').stroke = 'transparent'
          // }
        },
        new go.Binding('points').makeTwoWay(),
        $(go.Shape, // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
        $(go.Shape, // the link path shape
          { isPanelMain: true, stroke: 'gray', strokeWidth: 2 }),
        $(go.Shape, { toArrow: 'Standard' }),
        $(go.Panel, 'Horizontal',
          $(go.TextBlock, 'from', { segmentIndex: 0, segmentFraction: 0.2, editable: true }, new go.Binding('text', 'fromText').makeTwoWay()),
          $(go.TextBlock, 'mid', { segmentIndex: 1, segmentFraction: 0.5, editable: true }, new go.Binding('text', 'midText').makeTwoWay()),
          $(go.TextBlock, 'to', { segmentIndex: 2, segmentFraction: 0.8, editable: true }, new go.Binding('text', 'toText').makeTwoWay())
        )
      )

      myDiagram.model =
      $(go.GraphLinksModel,
        { linkFromPortIdProperty: 'fromPort', // required information:
          linkToPortIdProperty: 'toPort' // identifies data property names
        })
      var myPalette =
        $(go.Palette, this.$refs.myPaletteDiv)

      myPalette.nodeTemplate = $(go.Node, 'Auto',
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
      return $(go.Shape, 'RoundedRectangle',
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
        }, new go.Binding('portId', 'portId'))
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
