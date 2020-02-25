<template>
  <div>
    <add-or-update @myEnvet="selectName" :list="list"></add-or-update>
    <h1>{{name}}</h1>
    <br>
    <coma></coma>
    <comb></comb>
    <comc></comc>
    <br>
    <com1 :foo="foo" :boo="boo" :coo="coo" :doo="doo" title="共同学习小组"></com1>
  </div>
</template>

<script>
import addOrUpdate from './add-or-update'
import coma from './coma'
import comb from './comb'
import comc from './comc'
import com1 from './com1'
export default {
  name: 'lesson',
  provide: {
    userName: '前端成员-lester'
  },
  data() {
    return {
      list: ['张三', '李四', '王五'],
      name: '',
      foo: 'javascript',
      boo: 'html',
      coo: 'css',
      doo: 'vue'
    }
  },

  components: {
    addOrUpdate,
    coma,
    comb,
    comc,
    com1
  },

  mounted() {
    // 查找组件的所有子组件
    console.log(this.$children)
  },
  computed: {

  },

  methods: {
    selectName(e) {
      this.name = e
    }
  }
}

</script>
<style>
</style>
