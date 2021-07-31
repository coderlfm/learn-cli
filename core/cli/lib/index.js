'use strict';
const path = require('path')

const { log } = require('@sunshine-cli-dev/utils')
const semver = require('semver')
const colors = require('colors')
const rootCheck = require('root-check')
const userHome = require('user-home')
const pathExists = require('path-exists').sync

const pkg = require('../package.json')
const constant = require('./constant')

module.exports = cli;
function cli(argv) {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
  } catch (error) {
    // 自定义错误处理
    log.error(error.message)
  }
}

/**
 * 校验用户主目录是否存在
 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red(`当前登录用户主目录不存在`));
  }
  console.log('用户主目录:', userHome);
}

/**
 * 校验是否root用户启动
 */
function checkRoot() {
  rootCheck();
  // windows 上无效
  console.log('getuid:', process.getuid);
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