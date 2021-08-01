# 脚手架开发

## TODOS

- [ ] import-local 判断加载本地模块
- [x] npmlog 自定义日志，例如 debug 模式
- [x] node 版本检测
      如大于 `12.0.0`
- [x] root 账户启动降级
      `root-check` 2.0.0 改为了 es Module 导出，如需使用 require 加载则需要使用 1.0.0 版本
- [x] 获取用户主目录
      设置缓存目录
- [x] debugger 模式
      通过 `--debug`
- [x] 环境变量检测
      注入 .env 文件到环境变量中，可以配置缓存目录等
- [x] 提示更新版本
  - https://registry.npmjs.org/xxx
  - npm view xxx version

nodejs 中使用 es6 模块化的方式
使用 webpack
使用 webpack 将 es module 的代码编译，然后 node 主入口文件直接引入打包后的文件
如果需要支持低版本的 node，如在代码中使用了 promise，则需要使用 `babel babel-loader @babel/core @babel/preset-env`
如果需要兼容低版本 node，则还需要安装 `core-js regenerator-runtime/runtime`
有关更多，可以在 [这里](https://blog.liufengmao.cn/2021/02/02/babel/babel/#preset-%E5%85%B7%E4%BD%93%E4%BD%BF%E7%94%A8) 查看

```js
presets: [
  [
    '@babel/preset-env',
    {
      targets: {
        //  编译成低版本的 node | 'current'
        // node: '7.0.0',
        node: 'current',
      },
      useBuiltIns: 'usage',
      corejs: '3',
    },
  ],
];
```

使用 mjs
