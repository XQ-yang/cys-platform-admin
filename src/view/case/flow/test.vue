<template>
    <div style='width:100%; white-space:nowrap;'>
        <span style='border: 1px solid gray;display: inline-block; vertical-align: top; width:100%;'>
            <div ref='myDiagramDiv' style='height: 410px'></div>
        </span>
        <br>
        <textarea style='width:100%;height:200px' v-model="savedModelText"></textarea>
    </div>
</template>

<script>
let go = window.go
var $ = go.GraphObject.make
export default {
  name: '',
  data() {
    return {
      savedModelText: ''
    }
  },

  components: {},

  mounted() {
    this.init()
  },
  computed: {},

  methods: {
    init() {
      var self = this
      var myDiagram = $(go.Diagram, this.$refs.myDiagramDiv, // create a Diagram for the DIV HTML element
        {
          'ModelChanged': function(e) {
            self.savedModelText = e.model.toJson()
          },
          // eslint-disable-next-line no-undef
          draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.js
          'draggingTool.horizontalGuidelineColor': 'blue',
          'draggingTool.verticalGuidelineColor': 'blue',
          'draggingTool.centerGuidelineColor': 'green',
          'draggingTool.guidelineWidth': 1,
          'undoManager.isEnabled': true // enable undo & redo
        })

      // define a simple Node template
      myDiagram.nodeTemplate =
        $(go.Node, 'Auto', // the Shape will go around the TextBlock
          $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            { margin: 8 }, // some room around the text
            // TextBlock.text is bound to Node.data.key
            new go.Binding('text', 'key')),
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
        )

      // but use the default Link template, by not setting Diagram.linkTemplate

      // create the model data that will be represented by Nodes and Links
      myDiagram.model = new go.GraphLinksModel(
        [
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Beta', color: 'orange' },
          { key: 'Gamma', color: 'lightgreen' },
          { key: 'Delta', color: 'pink' }
        ],
        [

        ])
    }
  }
}

</script>
<style>
</style>
