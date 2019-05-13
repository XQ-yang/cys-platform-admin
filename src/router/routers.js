import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
// 需要权限控制动态加载的路由
export const routerMap = [
  {
    path: '/overview',
    name: 'overview',
    meta: {
      icon: 'md-git-compare',
      title: '细胞业务总览',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'potSchedule',
        name: 'potSchedule',
        meta: {
          icon: 'ios-book',
          title: '液氮罐存储一览表'
        },
        component: () => import('@/view/overview/schedule')
      },
      {
        path: 'retrospect',
        name: 'retrospect',
        meta: {
          icon: 'md-git-network',
          title: '样本追溯台账'
        },
        component: () => import('@/view/overview/retrospect')
      },
      {
        path: 'retrospectView',
        name: 'retrospectView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '样本溯源'
        },
        component: () => import('@/view/overview/retrospect/view')
      }
    ]
  },
  {
    path: '/sampleManager',
    name: 'sampleManager',
    meta: {
      icon: 'ios-bookmark',
      title: '样本采集接收',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'appointment',
        name: 'appointment',
        meta: {
          icon: 'ios-paper-outline',
          title: '采集预约管理'
        },
        component: () => import('@/view/sampleManager/appointment')
      },
      {
        path: 'desk',
        name: 'desk',
        meta: {
          icon: 'ios-calendar-outline',
          title: '采集运输工作台',
          beforeCloseName: 'clear_sample_desk_state'
        },
        component: () => import('@/view/sampleManager/desk')
      },
      {
        path: 'collect',
        name: 'collect',
        meta: {
          icon: 'md-copy',
          title: '样本取样管理',
          beforeCloseName: 'clear_collect_state'
        },
        component: () => import('@/view/sampleManager/collect')
      },
      {
        path: 'unReserveCreate',
        name: 'unReserveCreate',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '未预约样本信息登记'
        },
        component: () => import('@/view/sampleManager/collect/unReserveCreate.vue')
      },
      {
        path: 'reserveCreate',
        name: 'reserveCreate',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '已预约样本信息登记'
        },
        component: () => import('@/view/sampleManager/collect/reserveCreate.vue')
      },
      {
        path: 'sampleUpdate',
        name: 'sampleUpdate',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '样本信息登记修改'
        },
        component: () => import('@/view/sampleManager/collect/sampleUpdate.vue')
      },
      {
        path: 'sampleView',
        name: 'sampleView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '样本信息登记查看'
        },
        component: () => import('@/view/sampleManager/collect/sampleView.vue')
      },
      {
        path: 'transport',
        name: 'transport',
        meta: {
          icon: 'ios-plane-outline',
          title: '样本运输管理',
          beforeCloseName: 'clear_transport_state'
        },
        component: () => import('@/view/sampleManager/transport')
      },
      {
        path: 'transportHandover',
        name: 'transportHandover',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '运输交接',
          notCache: false
        },
        component: () => import('@/view/sampleManager/transport/handover.vue')
      },
      {
        path: 'transportView',
        name: 'transportView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '运输交接查看'
        },
        component: () => import('@/view/sampleManager/transport/transportView.vue')
      },
      {
        path: 'receiveManager',
        name: 'receiveManager',
        meta: {
          icon: 'ios-link',
          title: '样本验收管理',
          beforeCloseName: 'clear_receive_state'
        },
        component: () => import('@/view/sampleManager/receive')
      },
      {
        path: 'sampleReceive',
        name: 'sampleReceive',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '样本验收'
        },
        component: () => import('@/view/sampleManager/receive/receive.vue')
      },
      {
        path: 'receiveView',
        name: 'receiveView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '样本验收查看'
        },
        component: () => import('@/view/sampleManager/receive/receiveView.vue')
      }
    ]
  },
  {
    path: '/storage',
    name: 'storage',
    meta: {
      icon: 'md-pricetags',
      title: '细胞存储管理',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: '/desk',
        name: 'storageDesk',
        meta: {
          icon: 'ios-calendar-outline',
          title: '细胞工作台'
        },
        component: () => import('@/view/storage/desk')
      },
      {
        path: 'culture',
        name: 'culture',
        meta: {
          icon: 'ios-cloud-outline',
          title: '细胞培养管理'
        },
        component: () => import('@/view/storage/culture')
      },
      {
        path: 'cultureAdd',
        name: 'cultureAdd',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '填写细胞信息',
          notCache: false
        },
        component: () => import('@/view/storage/culture/cultureAdd.vue'),
        props: true
      },
      {
        path: 'cultureView',
        name: 'cultureView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞培养台账查看',
          notCache: false
        },
        component: () => import('@/view/storage/culture/cultureView.vue'),
        props: true
      },
      {
        path: 'tempStore',
        name: 'tempStore',
        meta: {
          icon: 'md-clipboard',
          title: '细胞暂存登记'
        },
        component: () => import('@/view/storage/tempStore')
      },
      {
        path: 'tempStoreAdd',
        name: 'tempStoreAdd',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞暂存登记',
          notCache: false
        },
        component: () => import('@/view/storage/tempStore/tempStoreAdd.vue'),
        props: true
      },
      {
        path: 'tempStoreView',
        name: 'tempStoreView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞暂存查看',
          notCache: false
        },
        component: () => import('@/view/storage/tempStore/tempStoreView.vue'),
        props: true
      },
      {
        path: 'qualityCheck',
        name: 'qualityCheck',
        meta: {
          icon: 'md-help-buoy',
          title: '细胞质检管理'
        },
        component: () => import('@/view/storage/qualityCheck')
      },
      {
        path: 'qualityCheckAdd',
        name: 'qualityCheckAdd',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞质检',
          notCache: false
        },
        component: () => import('@/view/storage/qualityCheck/qualityCheckAdd.vue'),
        props: true
      },
      {
        path: 'qualityCheckView',
        name: 'qualityCheckView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞质检查看',
          notCache: false
        },
        component: () => import('@/view/storage/qualityCheck/qualityCheckView.vue'),
        props: true
      },
      {
        path: 'store',
        name: 'store',
        meta: {
          icon: 'ios-cube-outline',
          title: '细胞入库管理'
        },
        component: () => import('@/view/storage/store')
      },
      {
        path: 'storeAdd',
        name: 'storeAdd',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞入库',
          notCache: false
        },
        component: () => import('@/view/storage/store/storeAdd.vue'),
        props: true
      },
      {
        path: 'storeRecheck',
        name: 'storeRecheck',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞复核',
          notCache: false
        },
        component: () => import('@/view/storage/store/storeRecheck.vue'),
        props: true
      },
      {
        path: 'storeView',
        name: 'storeView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞入库查看',
          notCache: false
        },
        component: () => import('@/view/storage/store/storeView.vue'),
        props: true
      },
      {
        path: 'storeapply',
        name: 'storeapply',
        meta: {
          icon: 'md-git-compare',
          title: '物料领用管理',
          notCache: true
        },
        component: () => import('@/view/storage/storeApply')
      },
      {
        path: 'storeapplyAdd',
        name: 'storeapplyAdd',
        meta: {
          icon: 'md-git-compare',
          title: '物料领用新增',
          hideInMenu: true
        },
        component: () => import('@/view/storage/storeApply/storeApplyAdd.vue')
      },
      {
        path: 'storeapplyEdit',
        name: 'storeapplyEdit',
        meta: {
          icon: 'md-git-compare',
          title: '物料领用编辑',
          hideInMenu: true
        },
        component: () => import('@/view/storage/storeApply/storeApplyEdit.vue')
      },
      {
        path: 'storeapplyView',
        name: 'storeapplyView',
        meta: {
          icon: 'md-git-compare',
          title: '物料领用查看',
          hideInMenu: true
        },
        component: () => import('@/view/storage/storeApply/view.vue')
      },
      {
        path: 'transfer',
        name: 'transfer',
        meta: {
          icon: 'md-menu',
          title: '细胞移库管理'
        },
        component: () => import('@/view/storage/transfer')
      },
      {
        path: 'transferAdd',
        name: 'transferAdd',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞移库',
          notCache: false
        },
        component: () => import('@/view/storage/transfer/transferAdd.vue'),
        props: true
      },
      {
        path: 'transferView',
        name: 'transferView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞移库查看',
          notCache: false
        },
        component: () => import('@/view/storage/transfer/transferView.vue'),
        props: true
      },
      {
        path: 'pot',
        name: 'pot',
        meta: {
          icon: 'ios-nuclear-outline',
          title: '液氮罐管理'
        },
        component: () => import('@/view/storage/pot')
      },
      {
        path: 'allocation',
        name: 'allocation',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '液氮罐配置'
        },
        component: () => import('@/view/storage/pot/allocation.vue')
      },
      {
        path: 'fridge',
        name: 'fridge',
        meta: {
          icon: 'md-grid',
          title: '冰箱管理'
        },
        component: () => import('@/view/storage/fridge')
      },
      {
        path: 'fridgeAllocation',
        name: 'fridgeAllocation',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '冰箱配置'
        },
        component: () => import('@/view/storage/fridge/allocation.vue')
      }
    ]
  },
  {
    path: '/outstorageManager',
    name: 'outstorageManager',
    meta: {
      icon: 'md-square-outline',
      title: '细胞出库管理',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'outReservation',
        name: 'outReservation',
        meta: {
          icon: 'ios-ribbon',
          title: '预约出库管理',
          beforeCloseName: 'clear_out_apply_state'
        },
        component: () => import('@/view/outstorageManager/outReservation')
      },
      {
        path: 'outApply',
        name: 'outApply',
        meta: {
          icon: 'ios-star',
          title: '出库申请管理',
          beforeCloseName: 'clear_out_apply_state'
        },
        component: () => import('@/view/outstorageManager/outApply')
      },
      {
        path: 'outStoreApply',
        name: 'outStoreApply',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '出库申请'
        },
        component: () => import('@/view/outstorageManager/outApply/outStoreApply.vue')
      },
      {
        path: 'outStoreApplyView',
        name: 'outStoreApplyView',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '出库申请查看'
        },
        component: () => import('@/view/outstorageManager/outApply/outStoreApplyView.vue')
      },
      {
        path: 'outStoreApplyUpdate',
        name: 'outStoreApplyUpdate',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '出库申请编辑'
        },
        component: () => import('@/view/outstorageManager/outApply/outStoreApplyUpdate.vue')
      },
      {
        path: 'outStock',
        name: 'outStock',
        meta: {
          icon: 'ios-share-alt',
          title: '库存出库管理',
          beforeCloseName: 'clear_out_stock_state'
        },
        component: () => import('@/view/outstorageManager/outStock')
      },
      {
        path: 'outStoreOfStock',
        name: 'outStoreOfStock',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '库存出库'
        },
        component: () => import('@/view/outstorageManager/outStock/outStoreOfStock.vue')
      },
      {
        path: 'outStoreOfStockView',
        name: 'outStoreOfStockView',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '库存出库查看'
        },
        component: () => import('@/view/outstorageManager/outStock/outStoreOfStockView.vue')
      },
      {
        path: 'outReview',
        name: 'outReview',
        meta: {
          icon: 'ios-eye',
          title: '出库审核管理',
          beforeCloseName: 'clear_out_review_state'
        },
        component: () => import('@/view/outstorageManager/outReview')
      },
      {
        path: 'outReviewOfStock',
        name: 'outReviewOfStock',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '出库审核'
        },
        component: () => import('@/view/outstorageManager/outReview/outReviewOfStock.vue')
      },
      {
        path: 'outReviewOfStockView',
        name: 'outReviewOfStockView',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '出库审核查看'
        },
        component: () => import('@/view/outstorageManager/outReview/outReviewOfStockView.vue')
      },
      {
        path: 'outSignature',
        name: 'outSignature',
        meta: {
          icon: 'md-checkmark-circle',
          title: '签字确认管理',
          beforeCloseName: 'clear_out_signature_state'
        },
        component: () => import('@/view/outstorageManager/outSignature')
      },
      {
        path: 'outSignatureOfStock',
        name: 'outSignatureOfStock',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '签字确认'
        },
        component: () => import('@/view/outstorageManager/outSignature/outSignatureOfStock.vue')
      },
      {
        path: 'outSignatureOfStockView',
        name: 'outSignatureOfStockView',
        meta: {
          hideInMenu: true,
          icon: 'md-copy',
          title: '签字确认查看'
        },
        component: () => import('@/view/outstorageManager/outSignature/outSignatureOfStockView.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      icon: 'ios-podium',
      title: '统计报表',
      showAlways: true
    },
    component: Main,
    children: [{
      path: 'handover',
      name: 'handover',
      meta: {
        icon: 'ios-people',
        title: '样本交接'
      },
      component: () => import('@/view/statistics/handover')
    },
    {
      path: 'cellTempStore',
      name: 'cellTempStore',
      meta: {
        icon: 'logo-dropbox',
        title: '细胞暂存'
      },
      component: () => import('@/view/statistics/cellTempStore')
    },
    {
      path: 'cellStore',
      name: 'cellStore',
      meta: {
        icon: 'ios-home-outline',
        title: '细胞存储'
      },
      component: () => import('@/view/statistics/cellStore')
    }
    ]
  },
  {
    path: '/report',
    name: 'report',
    meta: {
      icon: 'ios-cloud-upload',
      title: '细胞质量管理',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'reportupload',
        name: 'reportupload',
        meta: {
          icon: 'ios-folder-outline',
          title: '检测报告'
        },
        component: () => import('@/view/report/reportupload')
      },
      {
        path: 'flowStop',
        name: 'flowStop',
        meta: {
          icon: 'md-menu',
          title: '细胞报废',
          beforeCloseName: 'clear_out_flow_stop'
        },
        component: () => import('@/view/storage/flowStop/flowStopList.vue')
      },
      {
        path: 'flowStopAdd',
        name: 'flowStopAdd',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞报废申请'
        },
        component: () => import('@/view/storage/flowStop/flowStopAdd.vue')
      },
      {
        path: 'flowStopAudit',
        name: 'flowStopAudit',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞报废审核'
        },
        component: () => import('@/view/storage/flowStop/flowStopAudit.vue')
      },
      {
        path: 'flowStopBrowse',
        name: 'flowStopBrowse',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞报废查看'
        },
        component: () => import('@/view/storage/flowStop/flowStopBrowse.vue')
      },
      {
        path: 'flowStopEdit',
        name: 'flowStopEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞报废编辑'
        },
        component: () => import('@/view/storage/flowStop/flowStopEdit.vue')
      },
      {
        path: 'flowStopStockOut',
        name: 'flowStopStockOut',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '细胞报废出库'
        },
        component: () => import('@/view/storage/flowStop/flowStopStockOut.vue')
      }
    ]
  },
  {
    path: '/basic',
    name: 'basic',
    meta: {
      icon: 'ios-podium',
      title: '基础信息管理',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'customer',
        name: 'customer',
        meta: {
          icon: 'ios-people',
          title: '顾客管理'
        },
        component: () => import('@/view/basics/customer')
      },
      {
        path: 'customerView',
        name: 'customerView',
        meta: {
          hideInMenu: true,
          icon: 'md-menu',
          title: '顾客信息查看'
        },
        component: () => import('@/view/basics/customer/customerView.vue')
      },
      {
        path: 'projectType',
        name: 'projectType',
        meta: {
          icon: 'ios-planet-outline',
          title: '项目类型管理'
        },
        component: () => import('@/view/basics/projectType')
      },
      {
        path: 'hospital',
        name: 'hospital',
        meta: {
          icon: 'md-heart-outline',
          title: '采集医院管理'
        },
        component: () => import('@/view/basics/hospital')
      },
      {
        path: 'distributor',
        name: 'distributor',
        meta: {
          icon: 'ios-link',
          title: '渠道管理'
        },
        component: () => import('@/view/basics/distributor')
      },
      {
        path: 'contract',
        name: 'contract',
        meta: {
          icon: 'ios-paper-outline',
          title: '合同管理'
        },
        component: () => import('@/view/basics/contract')
      },
      {
        path: 'addContract',
        name: 'addContract',
        meta: {
          title: '合同新增',
          hideInMenu: true
        },
        component: () => import('@/view/basics/contract/form')
      },
      {
        path: 'editContract',
        name: 'editContract',
        meta: {
          title: '合同编辑',
          hideInMenu: true
        },
        component: () => import('@/view/basics/contract/formUpdate')
      },
      {
        path: 'viewContract',
        name: 'viewContract',
        meta: {
          title: '合同查看',
          hideInMenu: true
        },
        component: () => import('@/view/basics/contract/view')
      },
      {
        path: 'product',
        name: 'product',
        meta: {
          icon: 'logo-dropbox',
          title: '物料信息管理'
        },
        component: () => import('@/view/basics/storeProduct/')
      },
      {
        path: 'storeStock',
        name: 'storeStock',
        meta: {
          icon: 'ios-basket-outline',
          title: '物料库存管理',
          notCache: true
        },
        component: () => import('@/view/basics/stock/')
      },
      {
        path: 'addStoreStock',
        name: 'addStoreStock',
        meta: {
          title: '物料库存新增',
          hideInMenu: true
        },
        component: () => import('@/view/basics/stock/form')
      }, {
        path: 'editStoreStock',
        name: 'editStoreStock',
        meta: {
          title: '物料库存编辑',
          hideInMenu: true
        },
        component: () => import('@/view/basics/stock/update')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统基础设置',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'md-contacts',
          title: '用户管理'
        },
        component: () => import('@/view/system/user')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'ios-lock-outline',
          title: '角色管理'
        },
        component: () => import('@/view/system/role')
      },
      {
        path: 'postion',
        name: 'postion',
        meta: {
          icon: 'md-locate',
          title: '岗位管理'
        },
        component: () => import('@/view/system/postion')
      },
      {
        path: 'organize',
        name: 'organize',
        meta: {
          icon: 'md-git-network',
          title: '机构管理'
        },
        component: () => import('@/view/system/organize')
      },
      {
        path: 'dept',
        name: 'department',
        meta: {
          icon: 'md-albums',
          title: '部门管理'
        },
        component: () => import('@/view/system/organize/dept.vue')
      },
      {
        path: 'module',
        name: 'module',
        meta: {
          icon: 'ios-document-outline',
          title: '系统菜单'
        },
        component: () => import('@/view/system/module')
      },
      {
        path: 'todo',
        name: 'todo',
        meta: {
          icon: 'ios-hammer',
          title: '待办事项管理'
        },
        component: () => import('@/view/system/todo')
      },
      {
        path: 'templateConf',
        name: 'templateConf',
        meta: {
          icon: 'md-settings',
          title: '模板信息配置管理'
        },
        component: () => import('@/view/system/template-conf')
      }
    ]
  }
]
// 默认加载的 登陆页、首页等路由
export const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home/home.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'userInfo',
    redirect: '/userInfo',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/ownspace',
        name: 'ownspace',
        meta: {
          hideInMenu: true,
          title: '个人中心',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/own-space/')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message')
      }
    ]
  }
]
// 错误处理页面
export const page404 = [
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
