## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
### 打包命令
# npm包命令
npm run lib:build
# demo命令
npm run build

# 推送至npm库
npm login
npm publish



.
├─ .env.demo                                        // demo环境变量
├─ .env.npm                                         // npm环境变量
├─ .eslintignore                                    // eslint忽略检查文件
├─ .eslintrc.js                                     // eslint格式化配置
├─ .gitignore                                       // git上传忽略文件
├─ .npmignore                                       // git上传忽略文件
├─ README.md                                        // 说明文件
├─ babel.config.js                                  // babel打包配置
├─ config
│    ├─ config.demo.js                              // 打包为demo配置文件
│    ├─ config.npm.js                               // 打包为npm包配置文件
│    └─ utils.js                                    // 打包配置工具方法
├─ dist
│    ├─ .DS_Store
│    ├─ css
│    │    ├─ chunk-vendors.331f546b.css
│    │    └─ index.aa9ef6e3.css
│    ├─ favicon.ico
│    ├─ index.html
│    └─ js
│           ├─ chunk-vendors.db0356da.js
│           └─ index.787d2b88.js
├─ examples                                         // 示例目录等于普通项目src文件              
│    ├─ .DS_Store
│    ├─ App.vue                                     // 页面入口组件
│    ├─ main.js                                     // 页面入口js
│    ├─ router                
│    │    └─ index.js                               // 路由
│    ├─ settings.js                                 // 示例基本配置文件
│    ├─ style                                       // 样式
│    │    ├─ index.scss
│    │    └─ remake.scss
│    └─ views                                       // 各组件
│           └─ HomeView.vue
├─ jsconfig.json
├─ lib                                              // 可直接发布的npm包
│    ├─ .DS_Store
│    ├─ index
│    │    ├─ index.js
│    │    └─ style.css
│    ├─ ws-button
│    │    ├─ index.js
│    │    └─ style.css
│    └─ ws-card
│           ├─ index.js
│           └─ style.css
├─ package-lock.json
├─ package.json                                     // 项目依赖版本说明
├─ packages                                         // 组件目录
│    ├─ .DS_Store
│    ├─ button
│    │    ├─ .DS_Store
│    │    ├─ button.scss
│    │    ├─ button.vue
│    │    └─ index.js
│    ├─ card
│    │    ├─ card.scss
│    │    ├─ card.vue
│    │    └─ index.js
│    └─ index.js
├─ public
│    ├─ favicon.ico
│    └─ index.html
└─ vue.config.js                                     // 打包入口文件