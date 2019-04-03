## 介绍

本仓库为与ap-fe-optimze配套的项目工程模板。

## 文件说明

```
│  fis-conf.js // fis3配置
│  gulpfile.js // gulp配置，用于启动服务及监听文件
│  package.json // 项目配置
│  README.md // 说明文件
│  
├─build
│      build.js // 产出dist目录
│      dev-server.js // 开发启动服务
├─config  // 配置文件
│      config/index.js 中可配置 fontsPath 属性 (module.exports.build.fontsPath) 字体图标css文件路径
│      fontFamilyName 属性 (module.exports.build.fontFamilyName) 磁贴配置页面中font-family名称
|      fontsName 属性 (module.exports.build.fontsName) 磁贴配置页面中tab显示名称
├─locals // 多语资源文件
│      
└─src  
    └─apps // 项目开发时修改的目录
       │      
       └─assets // 项目静态资源文件，图片、josn文件等，直接放入dist
       │  │
       │  └─fonts // 字体图标文件夹, 业务部门字体图标(除磁贴图标外)各自维护, 平台字体库不再增加没有通用性的业务图标. 字体文件将产出至 dist/i_hr/ifbp_hr/assets/fonts/ 目录下, 建议font-family及icon class 以 项目名-icon- 为前缀
       │      
       └─common // 项目公共资源，公共的js、vue组件等，进行打包后合并放入dist/包名/common/index.js
       │      
       └─pages // 项目功能节点
          │
          └─*** // HR模块目录，如hrhi、hrjf等
              │
              └─业务组件  	// 一般按照nchome/modules下的lib包命名
              	  │
	              └─index.js  // 功能节点下的路由信息
	              │
	              └─mockdemo.js  // 开发时mock数据，产出代码前需要将此文件的引用去掉
	              │
	              └─src  // 功能节点下的vue文件
	                    BjBrokaccDetailDetail.vue
	                    BjBrokaccDetailEdit.vue
	                    BjBrokaccDetailList.vue
	                    
```


#### 注意点：

- 项目开发时仅需要修改src/apps目录，其他内容理论不需要修改，但是开发相关的配置可适当调整
- 项目开发时要将src/apps/assets、src/apps/common、src/apps/pages目录清空，根据实际情况来添加对应内容
- 对于项目开发时的公共css，建议放到src/apps/common/css/index.css中进行维护
- 引用图片资源时在路径增加后缀`?__inline`，方便资源引用
- pages目录下，index.js只能用于定义路由信息，并且index.js中路由需要的vue文件需放入同级src目录下，其他依赖文件可随意存放。此设置是为了保证最终产出文件的路由配置与产出模块名称保持一致
- 以下文件必须修改
  - package.json
    - name：需要与ap-fe-optimze工程src/App.vue文件中请求(window.ctxs.ap + '/appMGT/appCenter/allList?showway=apparea&areaId=&groupId=')返回模块的areaKey值保持一致

## 开发说明

此工程中仅包含项目资源文件，平台内容需要代理到可用的测试工程。

### 修改config/index.js

按照实际情况修改proxyList下平台服务以及后台服务的地址及url的匹配规则。

### 启动服务

可通过以下方式启动服务

```
$ gulp
```

或者

```
npm run dev
```


### 线上部署

将产出的dist目录进行部署，并且保证线上服务可通过下面的地址找到对应文件

ip + port + '/ifbp-fe/config.js'
多语情况下为：
ip + port + '/ifbp-fe/' + 语种 + 'config.js'

### 注意点

* 如果模块名需要变成二级目录，则在build.js和fis-config.js中将`project-name/`替换为相应的内容
* 如果src下面有子目录，则在build.js中根据`// fs.mkdirSync(path.resolve(distPagesBasePath + '/base'))` 创建对应的子目录
