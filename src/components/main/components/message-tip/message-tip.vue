<template>
    <div >
      <Poptip placement="bottom-end" :width="400">
        <Button type="default" class="message-btn"  ghost>
            <Badge :count="value">
                <Icon type="ios-notifications" :size="21"></Icon>
            </Badge>
        </Button>
        <div slot="content">
          <Tabs value="name1">
              <TabPane v-if="noticeData.length" label="通知" name="name1">
                <ul class="message-item">
                  <li v-for="item in noticeData" :key="item.type">
                    <a @click ="showMessage" class="message-list"><Icon type="ios-cloud-upload" size="20" ></Icon>{{item.todoName}}</a>

                  </li>
                </ul>
              </TabPane>
              <!-- <TabPane label="消息" name="name2">
                <p>暂无数据</p>
              </TabPane> -->
          </Tabs>
        </div>
      </Poptip>
    </div>
</template>

<script>
export default {
  name: 'messageTip',
  props: {
    value: {
      type: Number,
      default: 0
    },
    noticeCount: 0,
    messageCount: 0,
    noticeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    showMessage() {
      // this.$router.push({ path: '/report/reportupload' })
      if (this.$store.state.user.btnRules.includes('reportupload')) {
        this.$router.push({
          name: 'reportupload'
        })
      } else {
        this.$Message.error('没有权限，请联系管理员分配权限！')
      }
    }
  }
}
</script>
