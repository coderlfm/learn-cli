'use strict';
const colors = require('colors')
const semver = require('semver')
const log = require('@sunshine-cli-dev/log')

const LOWEST_NODE_VERSION = "12.0.0";

class Command {
  constructor(argv) {
    // console.log('command:', argv);

    if (!argv) throw new Error(colors.reset('参数不能为空'))
    if (!Array.isArray(argv)) throw new Error(colors.reset('参数必须为数组'))

    this._argv = argv;
    new Promise(() => {
      let chain = Promise.resolve();

      chain = chain.then(() => this.checkNodeVersion())
      chain = chain.then(() => this.initArgv())

      // 通过在构造函数中启用微任务实现子类必须实现 init exec 函数
      chain = chain.then(() => this.init())
      chain = chain.then(() => this.exec())

      // 异步的错误必须单独捕获
      chain.catch((err) => {
        log.error(err.message)
      })
    })

  }

  /**
  * 校验最低 node 版本
  */
  checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVsrion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVsrion)) {
      throw new Error(colors.red(`sunshine cli 需要安装 v${lowestVsrion} 以上的 node 版本`))
    }
  }

  initArgv() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv[0];
    // console.log(this._cmd, this._argv);
  }

  init() {
    throw new Error(colors.reset('init 必须实现'))
  }

  exec() {
    throw new Error(colors.reset('exec 必须实现'))

  }

}
module.exports = Command;
