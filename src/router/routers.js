import Main from '@/components/main'

/**
 * 路由中meta除了原生参数外可配置的参数:
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
export const routerMap = () => [
  {
    path: '/system',
    name: 'system',
    access: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统设置',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        access: 'user',
        meta: {
          icon: 'ios-contact-outline',
          title: '用户管理'
        },
        component: () => import('@/view/system/user')
      },
      {
        path: 'role',
        name: 'role',
        access: 'role',
        meta: {
          icon: 'ios-lock-outline',
          title: '角色管理'
        },
        component: () => import('@/view/system/role')
      },
      {
        path: 'org',
        name: 'org',
        access: 'org',
        meta: {
          icon: 'md-git-network',
          title: '机构管理'
        },
        component: () => import('@/view/system/organization')
      },
      {
        path: 'dept',
        name: 'dept',
        access: 'dept',
        meta: {
          icon: 'ios-bookmark-outline',
          title: '部门管理'
        },
        component: () => import('@/view/system/dept')
      },
      {
        path: 'equipment',
        name: 'equipment',
        access: 'equipment',
        meta: {
          icon: 'ios-cog-outline',
          title: '设备管理'
        },
        component: () => import('@/view/system/equipment')
      },
      {
        path: 'equip-type',
        name: 'equip-type',
        access: 'equip-type',
        meta: {
          icon: 'ios-podium-outline',
          title: '设备类型'
        },
        component: () => import('@/view/system/equip-type')
      },
      {
        path: 'menu',
        name: 'menu',
        access: 'menu',
        meta: {
          icon: 'ios-grid-outline',
          title: '系统菜单'
        },
        component: () => import('@/view/system/menu/index.vue')
      },
      {
        path: 'sms-send',
        name: 'sms-send',
        access: 'sms-send',
        meta: {
          icon: 'ios-mail-outline',
          title: '短信管理'
        },
        component: () => import('@/view/system/sms')
      },
      {
        path: 'operlog',
        name: 'operlog',
        access: 'operlog',
        meta: {
          icon: 'md-bulb',
          title: '操作日志'
        },
        component: () => import('@/view/system/operlog/index.vue')
      },
      {
        path: 'logininfo',
        name: 'logininfo',
        access: 'logininfo',
        meta: {
          icon: 'ios-bulb-outline',
          title: '登录日志'
        },
        component: () => import('@/view/system/logininfo/index.vue')
      }
    ]
  },
  {
    path: '/activiti',
    name: 'activiti',
    access: 'activiti',
    meta: {
      icon: 'md-git-compare',
      title: '工作流',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'process-definition',
        name: 'process-definition',
        access: 'process-definition',
        meta: {
          icon: 'logo-codepen',
          title: '流程部署'
        },
        component: () => import('@/view/activiti/process-definition')
      },
      {
        path: 'process-instance',
        name: 'process-instance',
        access: 'process-instance',
        meta: {
          icon: 'logo-instagram',
          title: '流程实例'
        },
        component: () => import('@/view/activiti/process-instance')
      },
      {
        path: 'act-task',
        name: 'act-task',
        access: 'act-task',
        meta: {
          icon: 'ios-flask',
          title: '代办任务'
        },
        component: () => import('@/view/activiti/act-task')
      },
      {
        path: 'act-history',
        name: 'act-history',
        access: 'act-history',
        meta: {
          icon: 'logo-buffer',
          title: '历史任务'
        },
        component: () => import('@/view/activiti/act-history')
      }
    ]
  },
  {
    path: '/case',
    name: 'case',
    access: 'case',
    meta: {
      icon: 'ios-briefcase-outline',
      title: '常用案例',
      showAlways: true
    },
    component: Main,
    children: [
      {
        path: 'uploadfile',
        name: 'uploadfile',
        access: 'uploadfile',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '文件上传'
        },
        component: () => import('@/view/case/upload-file/')
      },
      {
        path: 'oss',
        name: 'oss',
        access: 'oss',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '阿里OSS'
        },
        component: () => import('@/view/case/upload-oss/')
      },
      {
        path: 'artical',
        name: 'artical',
        access: 'artical',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '文章管理'
        },
        component: () => import('@/view/case/artical/')
      },
      {
        path: 'websocket',
        name: 'websocket',
        access: 'websocket',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '消息推送'
        },
        component: () => import('@/view/case/websocket/')
      },
      {
        path: 'flow',
        name: 'flow',
        access: 'flow',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '流程图'
        },
        component: () => import('@/view/case/flow/test.vue')
      },
      {
        path: 'workflow',
        name: 'workflow',
        access: 'workflow',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '工作流设计'
        },
        component: () => import('@/view/case/workflow/')
      },
      {
        path: 'flowtest',
        name: 'flowtest',
        access: 'flowtest',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '流程图测试'
        },
        component: () => import('@/view/case/flowtest/')
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
        component: () => import('@/view/single-page/home/equipmentIndex')
      }
    ]
  },
  {
    path: '/userInfo',
    name: 'userInfo',
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
