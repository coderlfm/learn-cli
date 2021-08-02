'use strict';
const path = require('path')

const { log } = require('@sunshine-cli-dev/utils')
const { getNpmVersion, getNpmVersionSync } = require('@sunshine-cli-dev/npm-info')
const semver = require('semver')
const colors = require('colors')
const rootCheck = require('root-check')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const dotenv = require('dotenv')

const pkg = require('../package.json')
const constant = require('./constant')

const commander = require('commander');

const { program } = commander


module.exports = cli;

async function cli(argv) {

  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    // checkInputArgs();
    checkEnv();
    await checkVersionUpdate();
    registryCommand();
    log.verbose('test', 'test debug')
  } catch (error) {
    // 自定义错误处理
    log.error(error.message)
    log.verbose(error)
  }
}

function registryCommand() {
  program
    .name('sunshine-cli-dev')
    .usage('install')
    .version(pkg.version)
    .option('-d, --debug', '开启 debug 模式', false)  // 选项默认值
    .option('-tp, --targetPath', '本地地址')


  // 注册命令
  program
    .command('init')
    .description('初始化项目')
    .argument('[projectName]', '项目名称')
    .action((souce, destination, objCmd) => {          // 命令处理函数
      // console.log('初始化', objCmd);
      // console.log('souce:', souce, 'destination:', destination, 'objCmd:', objCmd);
    })

  // 自定义事件监听
  program.on('option:debug', (e) => {
    if (program.debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL;
  })

  program.on('command:*', (params) => {
    const command = program.commands.map(cwd => cwd.name());
    log.info('无效命令', params);
    log.info('无效命令，请输入以下命令', command);
    process.exitCode = 1;
  })

  program.parse();

  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }

}

/**
 * 校验版本更新
 */
async function checkVersionUpdate() {
  // console.log('校验版本更新');
  // const currentVersion = pkg.version;
  // const pkgName = pkg.name;

  const currentVersion = '16.10.0';
  const pkgName = 'react';

  // const newVserion = await getNpmVersion(currentVersion, pkgName);
  const newVserion = await getNpmVersionSync(currentVersion, pkgName);
  if (newVserion) {
    const msg = `当前版本为：${colors.cyan(currentVersion)} ，最新版本为：${colors.cyan(newVserion)} ，请执行 ${colors.cyan(`npm install ${pkgName} -g`)}  执行更新`;
    log.notice(colors.yellow('更新提示', msg));
  }
}

/**
 * 判断是否有 .env 文件
 */
function checkEnv() {
  const dotenvPath = path.resolve(process.cwd(), '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  }

  createDefaultEnv();
  // console.log('缓存主目录 process.env.CLI_HOME_PATH:', process.env.CLI_HOME_PATH);
}

/**
 * 设置缓存目录
 */
function createDefaultEnv() {
  let home;
  if (process.env.CLI_HOME_PATH) {
    home = path.join(userHome, process.env.CLI_HOME_PATH);
  } else {
    home = path.join(userHome, constant.DEFAULT_CLI_HOME_PATH);
  }
  process.env.CLI_HOME_PATH = home;
}


/**
 * 校验用户主目录是否存在
 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red(`当前登录用户主目录不存在`));
  }
  // console.log('用户主目录:', userHome);
}

/**
 * 校验是否root用户启动
 */
function checkRoot() {
  rootCheck();
  // windows 上无效
  // console.log('getuid:', process.getuid);
}

/**
 * 校验最低 node 版本
 */
function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVsrion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVsrion)) {
    throw new Error(colors.red(`sunshine cli 需要安装 v${lowestVsrion} 以上的 node 版本`))
  }
}

/**
 * 检测当前版本号
 */
function checkPkgVersion() {
  log.info('sunshinle cli version：', pkg.version)
  // log.verbose('test', 'debugger')

}