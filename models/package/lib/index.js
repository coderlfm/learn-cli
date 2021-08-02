const pkgDir = require('pkg-dir').sync;
const { isObject } = require('@sunshine-cli-dev/utils');
const pathExists = require('path-exists').sync

'use strict';

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

  }

  // 安装
  install() { }

  // 更新
  update() { }

  // 路径是否存在
  isExists() { }

  // 获取根路径
  getRootFilePath() {
    if (this.targetPath) {
      const dir = pkgDir(this.targetPath);
      return pathExists(dir) ? dir : null
    }
  }

}
module.exports = Package;
