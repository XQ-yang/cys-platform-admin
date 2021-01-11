<template>
  <div>
    <diagram ref="diag" :model-data='modelData'  @model-changed='modelChanged' @changed-selection='changedSelection' style='border: solid 1px black; width:100%; height:500px'></diagram>
    <br/>选中的节点文本:
    <input v-model.lazy='currentNodeText' :disabled='currentNode === null'/>
    <br/>gojs的model数据:
     <textarea style='width:100%;height:200px' v-model="savedModelText"></textarea>
  </div>
</template>

<script>
import diagram from '_c/flow-chart/flow-tree'
let go = window.go
export default {
  name: 'flow',
  data() {
    return {
      diagram: null,
      modelData: {
        nodeDataArray: [
          { key: 1, text: 'Alpha', color: 'lightblue' },
          { key: 2, text: 'Beta', color: 'orange' },
          { key: 3, text: 'Gamma', color: 'lightgreen' },
          { key: 4, text: 'Delta', color: 'pink' }
        ],
        linkDataArray: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 3, to: 4 }
        ]
      },
      savedModelText: '',
      currentNode: null
    }
  },
  components: {
    diagram
  },
  mounted() {
  },
  methods: {
    model() {
      return this.$refs.diag.model()
    },
    modelChanged(e) {
      if (e.isTransactionFinished) { // show the model data in the page's TextArea
        this.savedModelText = e.model.toJson()
      }
    },
    changedSelection(e) {
      let node = e.diagram.selection.first()
      if (node instanceof go.Node) {
        this.currentNode = node
        this.currentNodeText = node.data.text
      } else {
        this.currentNode = null
        this.currentNodeText = ''
      }
    }
  },
  computed: {
    currentNodeText: {
      get: function() {
        let node = this.currentNode
        if (node instanceof window.go.Node) {
          return node.data.text
        } else {
          return ''
        }
      },
      set: function(val) {
        let node = this.currentNode
        if (node instanceof window.go.Node) {
          let model = this.model()
          model.startTransaction()
          model.setDataProperty(node.data, 'text', val)
          model.commitTransaction('edited text')
        }
      }
    }
  }
}

</script>
<style>
</style>
