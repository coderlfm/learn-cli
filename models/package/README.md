# `@sunshine-cli-dev/package`

通过 `Package` 描述一个包，实现以下主要功能
- 安装 install
- 更新 update
- 获取入口地址 getRootFilePath
- 包是在缓存中存在 isExists

constructor 接收以下参数 

- `options.targetPath`     目标路径，调试模式会传入，如果传入了则直接加载
- `options.storeDir`     缓存路径，非调试模式会传入
    通过 targetPath 和 storeDir 来判断是否开发模式 ，
- `options.pakcageName`     package 包名
- `options.packageVersion`     package 版本，默认 latest

## Usage

```
const package = require('@sunshine-cli-dev/package');

// TODO: DEMONSTRATE API
```
