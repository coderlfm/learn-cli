const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "index.js"
  },
  // 设置成 node 才能够在 es module 中使用 node 内置模块 
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // 有关 preset-env 的配置 可以在 [这里](https://blog.liufengmao.cn/2021/02/02/babel/babel/#preset-%E5%85%B7%E4%BD%93%E4%BD%BF%E7%94%A8) 查看
            presets: [['@babel/preset-env', {
              targets: {
                //  编译成低版本的 node | 'current'
                // node: '7.0.0',
                node: 'current'
              },
              useBuiltIns: 'usage',
              corejs: '3'
            }]]
          }
        }
      }
    ]
  }
}