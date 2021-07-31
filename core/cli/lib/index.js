'use strict';
const { add, log } = require('@sunshine-cli-dev/utils')
const semver = require('semver')
const colors = require('colors')
const pkg = require('../package.json')
const constant = require('./constant')

module.exports = cli;
function cli(argv) {
  try {
    checkPkgVersion();
    checkNodeVersion();

  } catch (error) {
    // 自定义错误处理
    log.error(error.message)
  }
}

/**
 * 校验最低 node 版本
 */
function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVsrion = constant.LOWEST_NODE_VERSION;

  if (semver.gte(lowestVsrion, currentVersion)) {
    throw new Error(colors.red(`sunshine cli 需要安装 v${lowestVsrion} 以上的 node 版本`))
  }
}

function checkPkgVersion() {
  log.info('sunshinle cli version：', pkg.version)
  log.verbose('test', 'debugger')

}