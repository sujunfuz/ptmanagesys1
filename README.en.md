<div align="center"> 
  <h1>后台管理系统v3版</h1>
</div>

[English](./README.md) | **中文**

## 简介

后台管理系统v3 是一个基于免费开源框架 `element-plus` 的中后台解决方案，使用了最新的 `Vue 3`、`Vite` 和 `TypeScript` 技术进行开发。该系统是在 `vue-element-plus-admin 2.2.0` 基础模板的基础上进行二次开发而成，旨在提供一个开箱即用的中后台前端启动模板，为项目的快速搭建提供便利。

## 前序准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) - 项目开发环境
- [Vite4](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉 `TypeScript` 基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Element-Plus](https://element-plus.org/) - element-plus 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 版本依赖

- **Node.js**:  
`16.19.1`
- **pnpm**: 
`8.6.12`
- **vscode插件**: 
`ESLint` `i18n Ally` `Prettier - Code formatter` `Vue Language Features (Volar)` `GitLens — Git supercharged`

## 初次运行
- 安装依赖

``` base
pnpm install
//运行
pnpm run dev 或者 pnpm dev
//打包
pnpm run build:pro
```

## 目录结构
```base
├── mock # 自定义 mock 数据及配置
├── public # 静态资源
├── src # 项目代码
│   ├── api # api接口管理
│   ├── assets # 静态资源
│   ├── components # 公用组件
│   ├── constants # 存放常量
│   ├── hooks # 常用hooks
│   ├── layout # 布局组件
│   ├── locales # 语言文件
│   ├── plugins # 外部插件
│   ├── router # 路由配置
│   ├── store # 状态管理
│   ├── styles # 全局样式
│   ├── utils # 全局工具类
│   ├── views # 路由页面
│   ├── App.vue # 入口vue文件
│   ├── main.ts # 主入口文件
│   └── permission.ts # 路由拦截
├── types # 全局类型
├── .env.base # 本地开发环境 环境变量配置
├── .env.dev # 打包到开发环境 环境变量配置
├── .env.gitee # 针对 gitee 的环境变量 可忽略
├── .env.pro # 打包到生产环境 环境变量配置
├── .env.test # 打包到测试环境 环境变量配置
├── .eslintignore # eslint 跳过检测配置
├── .eslintrc.js # eslint 配置
├── .gitignore # git 跳过配置
├── .prettierignore # prettier 跳过检测配置
├── .stylelintignore # stylelint 跳过检测配置
├── CHANGELOG.md # 更新记录
├── commitlint.config.js # git commit 提交规范配置
├── index.html # 入口页面
├── package.json
├── .postcssrc.js # postcss 配置
├── prettier.config.js # prettier 配置
├── README.md # 英文 README
├── README.zh-CN.md # 中文 README
├── stylelint.config.js # stylelint 配置
├── tsconfig.json # typescript 配置
├── vite.config.ts # vite 配置
└── uno.config.ts # unocss 配置
```

## 公共代码

- **页面数据加载**：
``` base
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)

import { useStorage } from '@/hooks/web/useStorage'
const { getStorage } = useStorage('localStorage')
const userInfo = getStorage('ptUserInfo')
userInfo.topMerchantNo
userInfo.merchantName
```

- **基础分页定义**：
```base
searchForm:{},
pageObj: {
    pageNum: 1,
    numPerPage: 10,
},
total: 0,
tableData:[]
```
- **基础函数名称定义**
```
queryTableData     搜索
queryTableTop   获取表头和枚举
resetSearchForm    重置
exportData  导出
delData  删除
changeStatus 上下架  激活冻结
refresh  刷新
```

后端传来的json字段字符串转为TableColumn
* 公共的写入schemaUtil.tsx   
* 私有的写入单个页面文件，单独传入【私有比公有优先，会实现覆盖】
```base
import generateSchema from '@/utils/schemaUtil'
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'xxxx',
    title: 'uuuuu',
    formatter: () => {
      return (
        <>
          <div>
            ssssss
          </div>
        </>
      )
    }
  }
])
let fieldColumns = ref<TableColumn[]>([])
fieldColumns.value = generateSchema(接手后端返回的表头pageColumn参数, tableColumns)
<Table :columns="fieldColumns" </Table>
```

* 多个简单的dialog里的内容写在一个write里组件里，若遇复杂形式内容的弹窗则进行拆分分装引入
简单dialog合并形式，子组件的弹窗定义通过父组件的type，依据computed来判断展示哪个，代码如下
```base
const Allschema = computed(() => { return props.openType == 'setform' ? setformSchema : baseSchema })
const baseSchema = reactive<FormSchema[]>([])
const setformSchema = reactive<FormSchema[]>([])
<Form :schema="Allschema" />

弹窗数据双向绑定，无需使用watch监听
const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
})
父组件<Write :currentRow="currentRow" />
子组件<Form :model="currentRow"/>

实现某个表单数据变化时,另外表单的显示与隐藏
const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods
{
    field: 'parentId',
    label: t('menu.parentMenu'),
    component: 'Select',
    componentProps: {
      placeholder: t('menu.selParentMenu'),
      props: {
        label: 'title',
        value: 'id'
      },
      <!-- 主要部分 -->
      on: {
        change: (data) => {
          if (data != '0') {
            formMethods.setSchema([
              {
                field: 'title',
                path: 'remove',
                value: true
              }
            ])
          } else {
            formMethods.setSchema([
              {
                field: 'title',
                path: 'remove',
                value: false
              }
            ])
          }
        }
      },
      options: props.parentList,
      style: {
        width: '100%'
      }
    }
  }
}
```
## demo
* [页面示例](./demo.md)