'use strict';
const path = require('path');
const pkgDir = require('pkg-dir').sync;
const pathExists = require('path-exists').sync
const fse = require('fs-extra')
const npminstall = require('npminstall')

const { isObject, formPath } = require('@sunshine-cli-dev/utils');
const { getDefaultRegistry, getNpmLastVersionSync } = require('@sunshine-cli-dev/npm-info')

class Package {
  constructor(options) {
    if (!options) {
      throw new Error('参数不能为空')
    }
    if (!isObject(options)) {
      throw new Error('参数必须为一个对象')
    }

    // 目标路径，调试模式会传入
    this.targetPath = options.targetPath;
    // 缓存路径，非调试模式会传入
    this.storeDir = options.storeDir;
    // package 包名
    this.pakcageName = options.pakcageName;
    // package 版本，默认 latest
    this.packageVersion = options.packageVersion;

    // 包名前缀
    this.pakcageNamePreFix = `_${this.pakcageName}`.replace(/\//g, '_');
  }

  get cacheFilePath() {
    /*
      为何这样命名
      utils.js 中的 getPackageStorePath() 有提现
    */
    return this.getSpecificCacheFilePath(this.packageVersion);
  }

  getSpecificCacheFilePath(version) {
    return path.resolve(this.storeDir, `${this.pakcageNamePreFix}@${version}@${this.pakcageName}`)
  }

  // 处理 latest 版本号
  prepare() {
    // 只有版本号是 latest 时才处理，否则使用传入的版本号
    if (this.packageVersion === 'latest') {
      this.packageVersion = getNpmLastVersionSync(this.pakcageName);
    }

    // 缓存目录不存在时执行创建   这一步不做也不会出错，保险起见还是加上判断
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir)
    }
  }

  // 安装
  async install() {
    this.prepare();
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      rigistry: getDefaultRegistry(),
      pkgs: [{ name: this.pakcageName, version: this.packageVersion }]
    })
  }

  // 更新
  async update() {
    this.prepare();

    const lastVersion = getNpmLastVersionSync(this.pakcageName);
    const lastVersionPath = this.getSpecificCacheFilePath(lastVersion);
    const lastVersionFilePath = path.resolve(this.storeDir, lastVersionPath);

    // 只有当前缓存中没有最新的包时，才更新
    if (!pathExists(lastVersionFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        rigistry: getDefaultRegistry(),
        pkgs: [{ name: this.pakcageName, version: this.lastVersion }]
      })
    }
    this.packageVersion = lastVersion;
  }

  // 路径是否存在
  isExists() {
    if (this.storeDir) {
      this.prepare();
      return pathExists(this.cacheFilePath)
    } else {
      return pathExists(this.targetPath)
    }
  }

  // 获取根路径
  getRootFilePath() {

    function _getRootPath(filePath) {

      // 此处 windows 上输入 unix 形式的路径( /c/test-project/test )
      // 在 cmd 的命令行会解析失败,可使用 git bash 或者 输入 windows 形式路径 ( E:\\learn\\learn-cli )
      const dir = pkgDir(filePath);
      if (dir) {
        const pkg = require(path.resolve(dir, 'package.json'))
        const enterFilePath = path.resolve(dir, pkg.main);
        return pathExists(enterFilePath) ? formPath(enterFilePath) : null
      }
    }
    if (this.storeDir) {
      return _getRootPath(this.cacheFilePath);
    } else {
      return _getRootPath(this.targetPath);
    }
  }

}
module.exports = Package;
