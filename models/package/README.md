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

## getRootFilePath
  1. 当成 package 解析，获取到 package.json 所在的目录 (pkg-dir)
  2. 取到 main 或 lib
  3. path.resolve 拼接得到入口地址
  3. 路径兼容
