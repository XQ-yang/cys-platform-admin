<template>
  <div>
  <Tabs :value="cellCultureListSate" @on-click="changeTab($event)" type="card">
    <TabPane :label="waitCellCulture" name="waitCellCulture">
      <div>
        <Card>
          <!--待入库细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitCollectQuery.sampleType"  @on-change="waitColletchangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitCollectQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitCollectQuery.sampleCode" @on-change="waitCollectClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitCollectQuery.qualityCheckUserName" @on-change="waitCollectClear" placeholder="细胞质检人" class="search-input" clearable   />
            <Button @click="waitCollectSearch" class="search-btn">查询</Button>
            <Button v-permission="{rule:'storePrint'}" @click="storePrint" class="ivu-btn ivu-btn-primary search-btn">打印</Button>
          </div>
          <!--待培养细胞列表-->
          <Table highlight-row @on-current-change="onCurrentChange" :data="waitCollectList" :columns="waitCollectColumns" :loading="waitCollectListLoading" border stripe></Table>
          <!--待培养细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitColletTotal>0"
                :total="waitColletTotal"
                :current.sync="waitCollectQuery.pageNumber"
                :page-size.sync="waitCollectQuery.pageSize"
                @on-change="getPageWaitStoreList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
          <Spin size="large" fix v-if="storePrintLoading"></Spin>
        </Card>
      </div>
    </TabPane>
    <TabPane :label="waitRecheck" name="waitRecheck">
      <div>
        <Card>
          <!--待入库细胞查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="waitRecheckQuery.sampleType"  @on-change="waitRecheckchangeSampleType($event)"  placeholder="请选择样本类型" style="width:200px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="waitRecheckQuery.projectType" placeholder="请选择项目类型" style="width:200px"  clearable>
              <Option v-for="item in waitRecheckProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="waitRecheckQuery.sampleCode" @on-change="waitRecheckClear" placeholder="样本条码" class="search-input" clearable />
            <Input v-model="waitRecheckQuery.qaUserName" @on-change="waitRecheckClear" placeholder="QA" class="search-input" clearable   />
            <Button @click="waitRecheckSearch" class="search-btn">查询</Button>
          </div>
          <!--待培养细胞列表-->
          <Table :data="waitRecheckList" :columns="waitRecheckColumns" :loading="waitRecheckListLoading" border stripe></Table>
          <!--待培养细胞分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="waitRecheckTotal>0"
                :total="waitRecheckTotal"
                :current.sync="waitRecheckQuery.pageNumber"
                :page-size.sync="waitRecheckQuery.pageSize"
                @on-change="getPageWaitRecheckList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
    <TabPane label="细胞入库台账" name="cellCultureBook">
      <div>
        <Card>
          <!--细胞培养台账查询条件及操作按钮-->
          <div class="search-con search-con-top">
            <Select  v-model="collectBookQuery.sampleType"  @on-change="collectBookchangeSampleType($event)" placeholder="请选择样本类型" style="width:180px" clearable>
              <Option v-for="item in sampleTypes" :key="item.sampleTypeId" :value="item.sampleTypeId" >{{item.sampleTypeName}}</Option>
            </Select>
            <Select v-model="collectBookQuery.projectType" placeholder="请选择项目类型" style="width:180px" clearable>
              <Option v-for="item in bookProjectTypeList" :key="item.id" :value="item.id" >{{item.projectTypeName}}</Option>
            </Select>
            <Input v-model="collectBookQuery.sampleCode" @on-change="collectBookClear" placeholder="样本条码" class="search-input" style="width:180px" clearable />
            <Input v-model="collectBookQuery.qaUserName" @on-change="collectBookClear" placeholder="QA" class="search-input" style="width:180px" clearable />
            <Button @click="collectBookSearch" class="search-btn">查询</Button>
            <Button v-permission="{rule:'storeOtherReportFileUpload'}" @click="openOtherReportFileUpload" class="ivu-btn ivu-btn-primary search-btn">上传报告附件</Button>
            <Button v-permission="{rule:'storeStorageCardFileUpload'}" @click="openStorageCardFileUpload" class="ivu-btn ivu-btn-primary search-btn">上传存储凭证</Button>
          </div>
          <!--细胞培养台账列表-->
          <Table :data="collectBookList" @on-current-change="onUploadCurrentChange" :columns="collectBookColumns" :loading="collectBookListLoading" highlight-row border stripe></Table>
          <!--细胞培养台账分页-->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                v-show="collectBookTotal>0"
                :total="collectBookTotal"
                :current.sync="collectBookQuery.pageNumber"
                :page-size.sync="collectBookQuery.pageSize"
                @on-change="getPageStoreDeskList"
                show-total
                prev-text="上一页"
                next-text="下一页"></Page>
            </div>
          </div>
        </Card>
      </div>
    </TabPane>
  </Tabs>

    <!-- 上传报告附件弹出层 -->
    <Modal
      v-model="otherReportFileUploadModalVisible"
      title="上传报告附件"
      :loading="registerFormLoading"
      @on-ok="handlerOtherReportFileUpload"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="668">
      <Form ref="otherReportFileUploadAddForm" :model="otherReportFileUploadAdd" :rules="rules" :label-width="110" :loading="registerFormLoading" style="padding-right:20px;">
        <Row :gutter="16">
          <Col span="12">
            <Form-item label="样本条码">
              <Input type="text" v-model="sample.sampleCode" disabled ></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="顾客姓名">
              <Input type="text" v-model="customer.name" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="24">
            <Form-item label="上传报告附件" prop="otherReportFile">
              <Upload
              ref="otherReportFileUpload"
              :default-file-list="defaultOtherReportFileList"
              :action="actionUrl"
              :headers="headers"
              multiple
              paste
              accept=".pdf"
              :before-upload="handleBeforeUploadOtherReport"
              :max-size="102400"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleUploadSuccess"
              :on-preview="handleUploadPreview">
                <Button icon="ios-cloud-upload-outline" style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传 pdf 格式的文件,最大100M)</span>
              </Upload>
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>

    <!-- 上传存储证明弹出层 -->
    <Modal
      v-model="storageCardFileUploadModalVisible"
      title="上传存储证明"
      :loading="registerFormLoading"
      @on-ok="handlerStorageCardFileUpload"
      class-name="vertical-center-modal"
      :mask-closable="false"
      width="668">
      <Form ref="storageCardFileUploadAddForm" :model="storageCardFileUploadAdd" :rules="rules" :label-width="110" :loading="registerFormLoading" style="padding-right:20px;">
        <Row :gutter="16">
          <Col span="12">
            <Form-item label="样本条码">
              <Input type="text" v-model="sample.sampleCode" disabled ></Input>
            </Form-item>
          </Col>
          <Col span="12">
            <Form-item label="顾客姓名">
              <Input type="text" v-model="customer.name" disabled></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="24">
            <Form-item label="上传存储证明" prop="storageCardFile">
              <Upload
              ref="storageCardFileUpload"
              :default-file-list="defaultStorageCardFileList"
              :action="actionUrl"
              :headers="headers"
              multiple
              paste
              accept=".pdf, .png, .jpg, .jpeg"
              :before-upload="handleBeforeUploadStorageCard"
              :max-size="102400"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleUploadSuccess"
              :on-preview="handleUploadPreview">
                <Button icon="ios-cloud-upload-outline" style="width:140px;font-size:14px;" class="ivu-btn ivu-btn-success">上传文件</Button><span style="margin-left:10px;font-size:12px;color:red;">(请上传png, jpg, jpeg或pdf格式的文件,最大100M)</span>
              </Upload>
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Modal>

    <!-- 打印预览页面 -->
    <div v-show="false" id="storePrintId">
      <div style="width:100%; margin:auto;padding-top:5%;font-size:12px;">
        <div style="margin-bottom:1%;">
          <h3 style="text-align:center;font-size:18px;">细胞入库存储记录</h3>
        </div>
        <div style="margin:auto;width:98%;">
          <div style="float:right;margin-right:2%;">记录编码: REC-JS-01000</div>
          <div style="clear:both;"></div>
          <div style="text-align:left;margin-top:5px;">入库日期:</div><br/>
        </div>
        <table style="border-collapse:collapse; border-spacing: 0px; text-align:center; width:98%;font-size:14px;margin:auto;" >
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">样本条码</td>
            <td style="border:1px black solid;width:30%;">{{printObj.sample.sampleCode}}</td>
            <td style="border:1px black solid;width:20%;">项目类型</td>
            <td style="border:1px black solid;width:30%;">{{printObj.sample.projectTypeName}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">细胞总量</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.cellTotal}}</td>
            <td style="border:1px black solid;width:20%;">细胞活率</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.cellViability}}%</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">细胞编码</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.produceNumber}}</td>
            <td style="border:1px black solid;width:20%;">规格</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.specification + printObj.cellCulture.specificationUnitName}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">冻存液批号</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.freezeFluid}}</td>
            <td style="border:1px black solid;width:20%;">存储数量</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.cellQuantity || printObj.cellCulture.serumQuantity}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">接收人</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.receiveUserName}}</td>
            <td style="border:1px black solid;width:20%;">接收时间</td>
            <td style="border:1px black solid;width:30%;">{{printObj.cellCulture.receiveTime}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">冻存是否完成</td>
            <td style="border:1px black solid;width:30%;">{{printObj.qualityCheck.isCryopreservation === 1 ? "是" : (printObj.qualityCheck.isCryopreservation === 0 ? "否" : "")}}</td>
            <td style="border:1px black solid;width:20%;">是否阳性样本</td>
            <td style="border:1px black solid;width:30%;">{{printObj.qualityCheck.isPositiveSample === 1 ? "是" : (printObj.qualityCheck.isPositiveSample === 0 ? "否" : "")}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">质量检测结果</td>
            <td style="border:1px black solid;width:30%;">{{printObj.qualityCheck.qualityCheckRes === 1 ? "符合规定" : (printObj.qualityCheck.qualityCheckRes === 0 ? "不符合规定" : "")}}</td>
            <td style="border:1px black solid;width:20%;">报告单编号</td>
            <td style="border:1px black solid;width:30%;">{{printObj.qualityCheck.reportNumber}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">质检人</td>
            <td style="border:1px black solid;width:30%;">{{printObj.qualityCheck.qualityCheckUserName}}</td>
            <td style="border:1px black solid;width:20%;">质检报告时间</td>
            <td style="border:1px black solid;width:30%;">{{printObj.qualityCheck.qualityCheckTime}}</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">存储时间</td>
            <td style="border:1px black solid;width:30%;"></td>
            <td style="border:1px black solid;width:20%;">存储年限</td>
            <td style="border:1px black solid;width:30%;"></td>
          </tr>
          <tr style="height:60px; width:100%;">
            <td style="border:1px black solid;width:20%;">存储位置</td>
            <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">存储<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:40px;border-bottom:1px black solid;" />号</td>
          </tr>
          <tr style="height:60px; width:100%;">
            <td style="border:1px black solid;width:20%;">血清存储位置</td>
            <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">-80℃冰箱<input type="checkbox" />  <input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冰箱第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />层、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />试管架、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号<br/>
            液氮罐<input type="checkbox" />  <input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号</td>
          </tr>
          <tr style="height:60px; width:100%;">
            <td style="border:1px black solid;width:20%;">检测样品存储位置</td>
            <td style="border:1px black solid;width:30%; font-size:12px; text-align: left;padding: 0px 5px;" colspan="3">存储<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号液氮罐<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />区、第<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />个吊塔、<input type="text" style="border:none;width:30px;border-bottom:1px black solid;" />号冻存盒、第<input type="text" style="border:none;width:40px;border-bottom:1px black solid;" />号</td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">备注</td>
            <td style="border:1px black solid;width:30%; text-align: left;" colspan="3"></td>
          </tr>
          <tr style="height:50px; width:100%;">
            <td style="border:1px black solid;width:20%;">QA</td>
            <td style="border:1px black solid;width:30%;">{{qaUserName}}</td>
            <td style="border:1px black solid;width:20%;">审核时间</td>
            <td style="border:1px black solid;width:30%;"></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/common.less'
import { getToken } from '@/libs/util'
import { getPageWaitStoreList, getPageStoreDeskList, getPageWaitRecheckList, getUploadCultureView, uploadOtherReportFile, uploadStorageCardFile, getStoreAddView } from '@/api/cellCulture.js'
import { getSampleTypeList, getProjectTypeBySampleType, getAllProjectType } from '@/api/projectType.js'
import { mapState, mapActions } from 'vuex'
import { num2e, getAge } from '@/libs/tools.js'
import { getUserInfo } from '@/api/user'
import { getLodop } from '@/libs/LodopFuncs'
export default {
  name: 'store',
  data() {
    const validateOtherReportFile = (rule, value, callback) => {
      if (!this.$refs.otherReportFileUpload.fileList || this.$refs.otherReportFileUpload.fileList.length <= 0) {
        callback(new Error('请上传至少一份报告附件'))
      } else {
        callback()
      }
    }
    const validateStorageCardFile = (rule, value, callback) => {
      if (!this.$refs.storageCardFileUpload.fileList || this.$refs.storageCardFileUpload.fileList.length <= 0) {
        callback(new Error('请上传存储证明'))
      } else {
        callback()
      }
    }

    return {
      waitCount: 0,
      // 显示待培养细胞条数
      waitCellCulture: (h) => {
        return h('div', [
          h('span', '细胞待入库'),
          h('Badge', {
            props: {
              count: this.waitCount
            }
          })
        ])
      },
      // 当前选中的待暂存细胞cellCultureId
      selectCellCultureId: '',
      sampleTypes: [],
      // 待培养细胞列表显示及查询
      waitProjectTypeList: [],
      waitCollectQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        qualityCheckUserName: ''
      },
      waitCollectListLoading: false,
      waitCollectList: [],
      waitColletTotal: 0,
      waitCollectColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitCollectQuery.pageNumber - 1) * this.waitCollectQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '存储数量',
          key: 'cellQuantity',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.sampleType === 3 ? params.row.serumQuantity : params.row.cellQuantity
            )
          }
        },
        { title: '质检人', key: 'qualityCheckUserName', tooltip: true },
        { title: '质检报告日期',
          key: 'qualityCheckTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.qualityCheckTime ? this.$formatDate(params.row.qualityCheckTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        { title: '培养日期',
          key: 'cultureTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.cultureTime ? this.$formatDate(params.row.cultureTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'storeAdd' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveStoreAdd(params.row)
                  }
                }
              }, '入库')
            ])
          }
        }
      ],
      // ------------------------------------
      waitRecheckCount: 0,
      // 显示待复核细胞条数
      waitRecheck: (h) => {
        return h('div', [
          h('span', '细胞待复核'),
          h('Badge', {
            props: {
              count: this.waitRecheckCount
            }
          })
        ])
      },
      // 待培养细胞列表显示及查询
      waitRecheckProjectTypeList: [],
      waitRecheckQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        qaUserName: ''
      },
      waitRecheckListLoading: false,
      waitRecheckList: [],
      waitRecheckTotal: 0,
      waitRecheckColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.waitRecheckQuery.pageNumber - 1) * this.waitRecheckQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '存储数量',
          key: 'cellQuantity',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.sampleType === 3 ? params.row.serumQuantity : params.row.cellQuantity
            )
          }
        },
        { title: '质检人', key: 'qualityCheckUserName', tooltip: true },
        { title: '质检报告日期',
          key: 'qualityCheckTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.qualityCheckTime ? this.$formatDate(params.row.qualityCheckTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        { title: 'QA', key: 'qaUserName', tooltip: true },
        { title: '审核时间',
          key: 'reviewTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.reviewTime ? this.$formatDate(params.row.reviewTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'storeRecheck' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveRecheckAdd(params.row)
                  }
                }
              }, '复核')
            ])
          }
        }
      ],
      // ------------------------------------------
      // 细胞培养台账列表显示及查询
      bookProjectTypeList: [],
      collectBookQuery: {
        pageNumber: 1,
        pageSize: 10,
        sampleType: '',
        projectType: '',
        sampleCode: '',
        qaUserName: ''
      },
      collectBookListLoading: false,
      collectBookList: [],
      collectBookTotal: 0,
      collectBookColumns: [
        { type: 'index',
          title: '序号',
          width: 70,
          tooltip: true,
          indexMethod: (row) => {
            return row._index + 1 + (this.collectBookQuery.pageNumber - 1) * this.collectBookQuery.pageSize
          }
        },
        { title: '样本条码', key: 'sampleCode', tooltip: true },
        { title: '样本类型', key: 'sampleTypeName', tooltip: true },
        { title: '项目类型', key: 'projectTypeName', tooltip: true },
        { title: '细胞编码', key: 'produceNumber', tooltip: true },
        { title: '存储数量',
          key: 'cellQuantity',
          tooltip: true,
          render: (h, params) => {
            return h('div',
              params.row.sampleType === 3 ? params.row.serumQuantity : params.row.cellQuantity
            )
          }
        },
        // { title: '质检报告日期',
        //   key: 'qualityCheckTime',
        //   tooltip: true,
        //   width: 160,
        //   render: (h, params) => {
        //     return h('div',
        //       params.row.qualityCheckTime ? this.$formatDate(params.row.qualityCheckTime, 'yyyy-MM-dd hh:mm') : ''
        //     )
        //   }
        // },
        { title: '存储时间',
          key: 'storeTime',
          tooltip: true,
          width: 115,
          render: (h, params) => {
            return h('div',
              params.row.storeTime ? this.$formatDate(params.row.storeTime, 'yyyy-MM-dd') : ''
            )
          }
        },
        { title: '存储年限', key: 'storeYear', tooltip: true },
        { title: 'QA', key: 'qaUserName', tooltip: true },
        { title: '审核时间',
          key: 'reviewTime',
          tooltip: true,
          width: 160,
          render: (h, params) => {
            return h('div',
              params.row.reviewTime ? this.$formatDate(params.row.reviewTime, 'yyyy-MM-dd hh:mm') : ''
            )
          }
        },
        // { title: '审查结论',
        //   key: 'reviewRes',
        //   tooltip: true,
        //   width: 180,
        //   render: (h, params) => {
        //     return h('div',
        //       params.row.sampleType === 3 || params.row.reviewRes ? '符合规定，允许放行' : '不符合规定，拒绝放行'
        //     )
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                directives: [
                  {
                    name: 'permission',
                    value: { rule: 'storeView' }
                  }
                ],
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.reserveStoreView(params.row)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      // 上传弹出层相关
      // 已选中的待上传的行细胞信息id
      actionUrl: this.$baseUrl + '/media/upload',
      headers: { 'Authorization': getToken() },
      uploadCellCultureId: '',
      registerFormLoading: true,
      // 样本信息
      sample: {},
      // 顾客信息
      customer: {},
      rules: {
        otherReportFile: [
          { validator: validateOtherReportFile, trigger: 'change' }
        ],
        storageCardFile: [
          { validator: validateStorageCardFile, trigger: 'change' }
        ]
      },
      otherReportFileUploadModalVisible: false,
      otherReportFileUploadModalLoading: true,
      // 上传报告附件实体
      otherReportFileUploadAdd: {},
      defaultOtherReportFileList: [],
      // 存储证明模态框
      storageCardFileUploadModalVisible: false,
      storageCardFileUploadModalLoading: true,
      // 上传存储证明实体
      storageCardFileUploadAdd: {},
      defaultStorageCardFileList: [],
      // 打印单信息实体
      printObj: {
        sample: {},
        cellCulture: {},
        qualityCheck: {}
      },
      // qa用户名
      qaUserName: '',
      // 所有的项目类型
      projectTypes: [],
      // 入库打印加载
      storePrintLoading: false,
      isFirstEnter: true
    }
  },
  mounted() {
    if (this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待入库细胞数据列表
      this.getPageWaitStoreList()
      // 获取待复核细胞数据列表
      this.getPageWaitRecheckList()
      // 获取细胞入库台账数据列表
      this.getPageStoreDeskList()
      // 获取Qa用户名
      this.getQaUserName()
      // 获取所有的项目类型
      this.getAllProjectType()
    }
  },
  activated() {
    if (!this.isFirstEnter) {
      // 获取样本类型列表
      this.getSampleTypeList()
      // 获取待入库细胞数据列表
      this.getPageWaitStoreList()
      // 获取待复核细胞数据列表
      this.getPageWaitRecheckList()
      // 获取细胞入库台账数据列表
      this.getPageStoreDeskList()
      // 获取Qa用户名
      this.getQaUserName()
      // 获取所有的项目类型
      this.getAllProjectType()
    }
  },
  deactivated() {
    this.isFirstEnter = false
  },
  computed: {
    ...mapState({
      cellCultureListSate: state => state.storage.cellStoreSate
    })
  },
  methods: {
    ...mapActions([
      'setCellStoreSate'
    ]),
    onCurrentChange(currentRow, oldCurrentRow) {
      this.selectCellCultureId = currentRow.id
    },
    // 切换tab时保存选中的tab状态
    changeTab(e) {
      const cellStoreSate = e
      this.setCellStoreSate({ cellStoreSate })
    },
    // 查询细胞待入库列表
    waitCollectSearch() {
      this.waitCollectQuery.pageNumber = 1
      this.getPageWaitStoreList()
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitCollectClear(e) {
      if (e.target.value === '') {
        this.getPageWaitStoreList()
      }
    },
    // 获取待培养细胞数据列表
    getPageWaitStoreList() {
      this.waitCollectListLoading = true
      getPageWaitStoreList(this.waitCollectQuery).then(res => {
        // 待培养细胞的样本总条数
        this.waitCount = res.data.totalRow
        this.waitCollectList = res.data.list
        this.waitColletTotal = res.data.totalRow
        this.waitCollectListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待培养细胞列表切换样本类型时修改项目类型下拉数据
    waitColletchangeSampleType(sampleType) {
      this.waitProjectTypeList = []
      this.waitCollectQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    getSampleTypeList() {
      getSampleTypeList().then(res => {
        this.sampleTypes = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // -----------------------------------------------------
    // 查询细胞待入库列表
    waitRecheckSearch() {
      this.waitRecheckQuery.pageNumber = 1
      this.getPageWaitRecheckList()
    },
    // 清空查询值的时候 重新加载待培养细胞列表数据
    waitRecheckClear(e) {
      if (e.target.value === '') {
        this.getPageWaitRecheckList()
      }
    },
    // 获取待培养细胞数据列表
    getPageWaitRecheckList() {
      this.waitRecheckListLoading = true
      getPageWaitRecheckList(this.waitRecheckQuery).then(res => {
        // 待培养细胞的样本总条数
        this.waitRecheckCount = res.data.totalRow
        this.waitRecheckList = res.data.list
        this.waitRecheckTotal = res.data.totalRow
        this.waitRecheckListLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 待培养细胞列表切换样本类型时修改项目类型下拉数据
    waitRecheckchangeSampleType(sampleType) {
      this.waitRecheckProjectTypeList = []
      this.waitRecheckQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.waitRecheckProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞暂存打印页
    storePrint() {
      if (!this.selectCellCultureId) {
        this.$Message.error('请先选中一条待入库的细胞信息')
        return
      }
      this.getPrintView(this.selectCellCultureId)
    },
    // 加载 样本,顾客,已填写细胞信息列表
    getPrintView(cellCultureId) {
      // 加载进度
      this.storePrintLoading = true
      getStoreAddView(cellCultureId).then(res => {
        this.printObj = res.data
        // 获取项目类型名称
        let tempPro = this.projectTypes.filter(project => project.id === this.printObj.sample.projectType).map(project => project.projectTypeName)
        this.printObj.sample.projectTypeName = tempPro && tempPro.length > 0 ? tempPro[0] : ''

        this.printObj.cellCulture.receiveTime = this.$formatDate(this.printObj.cellCulture.receiveTime, 'yyyy-MM-dd hh:mm')
        this.printObj.qualityCheck.qualityCheckTime = this.$formatDate(this.printObj.qualityCheck.qualityCheckTime, 'yyyy-MM-dd hh:mm')
        this.printObj.cellCulture.specificationUnitName = this.printObj.cellCulture.specificationUnit === 1 ? '/1ml/管' : 'ml/袋'
        this.printObj.cellCulture.cellTotal = num2e(this.printObj.cellCulture.cellTotal)
        this.printView()
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    printView() {
      let LODOP = getLodop()
      LODOP.PRINT_INIT('')
      // LODOP.SET_PRINT_STYLE('FontSize', 18)
      // LODOP.SET_PRINT_STYLE('Bold', 1)
      // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, '用户打印')
      this.$nextTick(() => {
        LODOP.ADD_PRINT_HTM('0%', '1%', '100%', '100%',
          document.getElementById('storePrintId').innerHTML)
        LODOP.PREVIEW()
        // 关闭加载进度
        this.storePrintLoading = false
      })
    },
    // 获取qa（当前登录用户）
    getQaUserName() {
      getUserInfo().then(res => {
        this.qaUserName = res.data.realName
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 获取所有的项目类型
    getAllProjectType() {
      getAllProjectType().then(res => {
        this.projectTypes = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 跳转到细胞入库页
    reserveStoreAdd(row) {
      const route = {
        name: 'storeAdd',
        query: {
          id: 'storeAdd',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到细胞复核页
    reserveRecheckAdd(row) {
      const route = {
        name: 'storeRecheck',
        query: {
          id: 'storeRecheck',
          cellCultureId: row.id
        }
      }
      this.$router.push(route)
    },
    // 跳转到细胞信息查看页
    reserveStoreView(row) {
      const route = {
        name: 'storeView',
        query: {
          id: 'storeView',
          storeId: row.id
        }
      }
      this.$router.push(route)
    },
    // 培养细胞台账列表按条件查询
    collectBookSearch() {
      this.collectBookQuery.pageNumber = 1
      this.getPageStoreDeskList()
    },
    // 清空查询值的时候 重新加载培养细胞台账列表数据
    collectBookClear(e) {
      if (e.target.value === '') {
        this.getPageStoreDeskList()
      }
    },
    // 获取培养细胞台账数据列表
    getPageStoreDeskList() {
      this.collectBookListLoading = true
      getPageStoreDeskList(this.collectBookQuery).then(res => {
        this.collectBookList = res.data.list
        this.collectBookTotal = res.data.totalRow
        this.collectBookListLoading = false
      })
    },
    // 培养细胞台账列表切换样本类型时修改项目类型下拉数据
    collectBookchangeSampleType(sampleType) {
      this.bookProjectTypeList = []
      this.collectBookQuery.projectType = ''
      if (!sampleType) {
        return
      }
      getProjectTypeBySampleType(sampleType).then(res => {
        this.bookProjectTypeList = res.data
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    // 报告附件/存储证明上传相关
    // 重置loading状态 防止重复提交
    changeLoading() {
      this.registerFormLoading = false
      this.$nextTick(() => {
        this.registerFormLoading = true
      })
    },
    handleBeforeUploadOtherReport(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf' && fileExt !== 'doc' && fileExt !== 'docx' && fileExt !== 'xls' && fileExt !== 'xlsx' && fileExt !== 'rar' && fileExt !== 'zip') {
        this.$Notice.warning({
          title: '文件类型错误', // .pdf, .doc, .docx, .xls, .xlsx, .rar, .zip
          desc: '文件：' + file.name + '不是PDF或word, excel, 压缩文件，请选择后缀为.pdf, .doc, .docx, .xls, .xlsx, .rar, .zip的文件进行上传。'
        })
        return false
      }
      return true
    },
    handleBeforeUploadStorageCard(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt !== 'pdf' && fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
        this.$Notice.warning({
          title: '文件类型错误', // .pdf, .png, .jpg, .jpeg
          desc: '文件：' + file.name + '不是PDF或图片文件，请选择后缀为.pdf, .png, .jpg, .jpeg的文件进行上传。'
        })
        return false
      }
      return true
    },
    handleMaxSize(file) {
      this.$Notice.error({
        title: '文件太大',
        desc: '文件：' + file.name + '不能超过100M。'
      })
    },
    handleUploadPreview(file) {
      window.open(file.mediaPath)
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 0) {
        this.$Message.error(res.msg)
        // 移除api端发生错误时的文件
        if (fileList && fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            let curFile = fileList[i]
            if (file.uid === curFile.uid) {
              fileList.splice(i, 1)
              return
            }
          }
        }
        return
      }
      file.id = res.data.id
      file.mediaPath = res.data.mediaPath
      if (fileList && fileList.length > 0) {
        let start = 0
        for (let i = 0; i < fileList.length; i++) {
          let curFile = fileList[i]
          if (res.data.id === curFile.id) {
            start++
            if (start === 2) {
              this.$Message.error('该文件已在文件列表')
              fileList.splice(i, 1)
              return
            }
          }
        }
      }
    },
    onUploadCurrentChange(currentRow, oldCurrentRow) {
      this.uploadCellCultureId = currentRow.cellCultureId
    },
    openOtherReportFileUpload() {
      if (!this.uploadCellCultureId) {
        this.$Message.error('请先选中一条待上传报告附件的细胞信息')
        return
      }
      // 对上传报告表单进行重置，将所有字段值重置为空并移除校验结果
      this.$refs['otherReportFileUploadAddForm'].resetFields()
      // 获取样本和顾客信息
      this.otherReportFileUploadModalVisible = true
      this.otherReportFileUploadModalLoading = true
      getUploadCultureView(this.uploadCellCultureId).then(res => {
        this.sample = res.data.sample
        this.sample.age = getAge(res.data.customer.birthday)
        this.customer = res.data.customer
        // 已上传的文件列表
        if (res.data.otherReportFile && res.data.otherReportFile.length) {
          this.defaultOtherReportFileList = res.data.otherReportFile.map(media => {
            media.name = media.originalMediaName
            media.url = media.mediaPath
            return media
          })
        } else {
          this.defaultOtherReportFileList = []
        }
        // 将细胞id赋值
        this.otherReportFileUploadAdd.cellCultureId = res.data.cellCulture.id
        this.otherReportFileUploadModalLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handlerOtherReportFileUpload() {
      this.$refs['otherReportFileUploadAddForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.otherReportFileUploadAdd.otherReportFile = this.$refs.otherReportFileUpload.fileList.map(file => file.id)
        uploadOtherReportFile(this.otherReportFileUploadAdd).then(res => {
          this.changeLoading()
          this.otherReportFileUploadModalVisible = false
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.otherReportFileUploadModalVisible = true
          this.$Message.error(error.msg)
        })
      })
    },
    // 上传存储证明 storageCardFile
    openStorageCardFileUpload() {
      if (!this.uploadCellCultureId) {
        this.$Message.error('请先选中一条待上传存储证明的细胞信息')
        return
      }
      // 对上传存储证明表单进行重置，将所有字段值重置为空并移除校验结果
      this.$refs['storageCardFileUploadAddForm'].resetFields()
      // 获取样本和顾客信息
      this.storageCardFileUploadModalVisible = true
      this.storageCardFileUploadModalLoading = true
      getUploadCultureView(this.uploadCellCultureId).then(res => {
        this.sample = res.data.sample
        this.sample.age = getAge(res.data.customer.birthday)
        this.customer = res.data.customer
        // 已上传的文件列表
        if (res.data.storageCardFile && res.data.storageCardFile.length) {
          this.defaultStorageCardFileList = res.data.storageCardFile.map(media => {
            media.name = media.originalMediaName
            media.url = media.mediaPath
            return media
          })
        } else {
          this.defaultStorageCardFileList = []
        }
        // 将细胞id赋值
        this.storageCardFileUploadAdd.cellCultureId = res.data.cellCulture.id
        this.storageCardFileUploadModalLoading = false
      }).catch(error => {
        this.$Message.error(error.msg)
      })
    },
    handlerStorageCardFileUpload() {
      this.$refs['storageCardFileUploadAddForm'].validate(valid => {
        if (!valid) {
          return this.changeLoading()
        }
        this.storageCardFileUploadAdd.storageCardFile = this.$refs.storageCardFileUpload.fileList.map(file => file.id)
        uploadStorageCardFile(this.storageCardFileUploadAdd).then(res => {
          this.changeLoading()
          this.storageCardFileUploadModalVisible = false
          this.$Message.success(res.msg)
        }).catch(error => {
          this.changeLoading()
          this.storageCardFileUploadModalVisible = true
          this.$Message.error(error.msg)
        })
      })
    }
  }
}
</script>
