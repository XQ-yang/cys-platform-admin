## Install
```bush
// install dependencies
npm install
```
## Run
### Development
```bush
npm run dev
```
### Production(Build)
```bush
npm run build
```
```bush
node proxy
```

## 功能

- 登录/登出
- 系统管理
    - 用户管理
    - 角色管理
    - 岗位管理
    - 机构管理
    - 系统菜单
## 文件结构
```shell
.
├── public  打包所需静态资源
└── src
    ├── api  AJAX请求
    └── assets  项目静态资源
        ├── icons  自定义图标资源
        └── images  图片资源
    ├── components  业务组件
    ├── config  项目运行配置
    ├── directive  自定义指令
    ├── libs  封装工具函数
    ├── locale  多语言文件
    ├── mock  mock模拟数据
    ├── router  路由配置
    ├── store  Vuex配置
    ├── view  页面文件
└── tests  测试相关
```

## Links
- [iView](https://github.com/iview/iview)
- [Vue](https://github.com/vuejs/vue)
- [Webpack](https://github.com/webpack/webpack)
- [vue 风格指南] (https://cn.vuejs.org/v2/style-guide/)
- [eslint] (https://eslint.org/docs/user-guide/command-line-interface#options)
- [vue cli3] (https://cli.vuejs.org/zh/guide/)
- [表单验证async-validator] https://github.com/yiminghe/async-validator）
- [vue 官方] (https://cn.vuejs.org/v2/guide/render-function.html)
