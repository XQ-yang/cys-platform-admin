<template>
  <div>
    <Card>
      <!--查询条件区域-->
      <div class="search-con search-con-top">
        <Button @click="addOrUpdate" class="search-btn">新增</Button>
      </div>
      <!--列表分页-->
      <Table :columns="column" :data="data"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float:right;">
          <Page
            v-show="total>0"
            :total="total"
            :current.sync="listQuery.pageNumber"
            :page-size.sync="listQuery.pageSize"
            @on-change="getList"
            show-total
            prev-text="上一页"
            next-text="下一页"
            >
          </Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'lesson',
  data() {
    return {
      column: [],
      data: [],
      total: 0,
      listQuery: {
        pageNumber: 1,
        pageSize: 10,
        roleName: ''
      }
    }
  },
  components: {},
  mounted() {},

  methods: {
    getList() {
      return []
    },
    addOrUpdate() {
      const route = {
        name: 'addlesson',
        query: {
          id: 'addlesson'
        }
      }
      this.$router.push(route)
    }
  }
}

</script>
<style>
</style>
