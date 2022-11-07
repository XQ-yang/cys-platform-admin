<template>
  <div>
    <Modal
      v-model="visible"
      :loading="loading"
      ok-text="导出PDF"
      @on-ok="exportInfo()"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :fullscreen="true"
      styles="background:#eee;padding: 20px"
      width="900"
    >
      <Card style="margin-top: 20px">
        <template #title>
          <h4>基本信息</h4>
        </template>
        <Row>
          <Col span="8">
            <p>设备编号：{{ equipmentInfo.equId }}</p>
            <p>使用组织：{{ equipmentInfo.orgName }}</p>
            <p>SN码：{{ equipmentInfo.snNo }}</p>
            <p>采购日期：{{ equipmentInfo.purchaseDate }}</p>
            <p>使用状态：
              <span v-if="equipmentInfo.useStatus === 0">未启用</span>
              <span v-if="equipmentInfo.useStatus === 1">使用中</span>
              <span v-if="equipmentInfo.useStatus === 2">空闲</span>
              <span v-if="equipmentInfo.useStatus === 3">维修</span>
              <span v-if="equipmentInfo.useStatus === 4">报废</span>
            </p>
            <p>配置信息：{{ equipmentInfo.configInfo }}</p>
          </Col>
          <Col span="8">
            <p>设备名称：{{ equipmentInfo.equName }}</p>
            <p>使用部门：{{ equipmentInfo.deptName }}</p>
            <p>保修政策：{{ equipmentInfo.warrantyPolicy }}</p>
            <p>采购金额（元）：{{ equipmentInfo.purchaseAmount }}</p>
            <p>
              财务状态：{{
                equipmentInfo.financeStatus === 0 ? '未入账' : equipmentInfo.financeStatus === 1 ? '已入账' : null
              }}</p>
          </Col>
          <Col span="8">
            <p>设备分类：{{ equipmentInfo.typeName }}</p>
            <p>使用人：{{ equipmentInfo.realName }}</p>
            <p>登记日期：{{ equipmentInfo.registerDate }}</p>
            <p>采购地点：{{ equipmentInfo.purchaseLocation }}</p>
          </Col>
        </Row>
      </Card>
      <Card>
        <template #title>
          <h4>设备图片</h4>
        </template>
        <el-image
          v-for="url in urlList"
          :key="url"
          style="width: 100px; height: 100px; margin: 10px"
          :src="url"
          :preview-src-list="urlList">
        </el-image>
      </Card>
      <Card>
        <template #title>
          <h4>使用记录</h4>
        </template>
        <Table :columns="recordColumns" :data="repairRecordList"></Table>
      </Card>
      <Card>
        <template #title>
          <h4>维修记录</h4>
        </template>
        <Table :columns="usageRecordColumns" :data="usageRecord">
        </Table>
      </Card>

    </Modal>
  </div>
</template>

<script>
import { getEquipDetail } from '@/api/equipment'

export default {
  name: '',
  data() {
    return {
      visible: false,
      loading: true,
      equipmentInfo: {},
      repairRecordList: [],
      usageRecord: [],
      id: null,
      equId: null,
      usageRecordColumns: [
        {
          title: 'ID',
          type: 'index',
          width: 200
        },
        {
          title: '记录内容',
          slot: 'content',
          render: (h, params) => {
            let msg = params.row.content === '设备领用' ? '领用人' : '归还人'
            return h(
              'span',
              '【' + params.row.content + '】 ' + msg + '：' + params.row.orgName + '-' + params.row.deptName + '-' + params.row.userName +
                ' 【设备编号】：' + params.row.equId
            )
          }
        },
        {
          title: '记录时间',
          key: 'recordTime'
        }
      ],
      recordColumns: [
        {
          title: 'ID',
          type: 'index',
          width: 200
        },
        {
          title: '维修内容',
          key: 'repairContent'
        },
        {
          title: '记录时间',
          key: 'recordTime'
        }
      ],

      urlList: [
        'https://file.iviewui.com/images/image-demo-1.jpg',
        'https://file.iviewui.com/images/image-demo-2.jpg',
        'https://file.iviewui.com/images/image-demo-3.jpg',
        'https://file.iviewui.com/images/image-demo-4.jpg',
        'https://file.iviewui.com/images/image-demo-5.jpg',
        'https://file.iviewui.com/images/image-demo-6.jpg'
      ]

    }
  },

  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        if (this.id) {
          this.detailVisible = true
          getEquipDetail(this.id, this.equId).then(res => {
            this.equipmentInfo = res.data.equipDetail
            this.repairRecordList = res.data.repairRecordList
            this.usageRecord = res.data.usageRecord
          })
        } else {
          this.detailVisible = false
        }
      })
    },

    exportInfo() {
      alert('hello, world')
    },

    changeLoading() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  }
}
</script>

<style scoped>
  p {
    color: #8c8c8c;
    padding: 10px;
  }
</style>
