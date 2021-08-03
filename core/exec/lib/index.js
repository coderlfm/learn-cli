'use strict';
const path = require('path');
const cp = require('child_process')
const Package = require('@sunshine-cli-dev/package')
const log = require('@sunshine-cli-dev/log')
const { exec: spawn } = require('@sunshine-cli-dev/utils')

module.exports = exec;

const CACHE_DIR = 'dependecies';
const SETTINGS = {
  // 'init': '@vue/cli'
  'init': 'foo'
}

async function exec(souce, destination, objCmd) {
  const name = objCmd.name();

  let targetPath = process.env.CLI_TARGET_PATH;
  const pakcageName = SETTINGS[name];
  const packageVersion = '0.0.5';

  let pkg;

  if (!targetPath) {
    targetPath = path.resolve(process.env.CLI_HOME_PATH, CACHE_DIR);
    let storeDir = path.resolve(targetPath, 'node_modules');

    pkg = new Package({
      targetPath,
      storeDir,
      pakcageName,
      packageVersion
    })

    if (pkg.isExists()) {
      // 更新
      console.log('更新');
      await pkg.update();
    } else {
      // 安装
      await pkg.install()
      console.log('安装');
    }
    console.log('pkg', pkg);


  } else { // 加载本地模式
    pkg = new Package({
      targetPath,
      pakcageName,
      packageVersion
    })
  }

  const filePath = pkg.getRootFilePath()
  console.log('file:', filePath);
  if (filePath) {
    // 加载文件
    // require(filePath).call(null, Array.from(arguments));
    console.log('加载文件');

    try {

      const args = Array.from(arguments);
      const cmd = args[args.length - 1];
      const o = Object.create(null);
      Object.keys(cmd).forEach(key => {
        if (
          cmd.hasOwnProperty(key) &&
          !key.startsWith('_') &&
          key !== 'parent'
        ) {
          o[key] = cmd[key];
        }
      })

      args[args.length - 1] = o;
      // console.log(args);

      // 注意需要引号
      const code = `require('${filePath}').call(null, ${JSON.stringify(args)})`;

      const child = spawn('node', ['-e', code], { cwd: process.cwd(), stdio: 'inherit' })


      child.on('error', e => {
        log.error('发生错误', e.message);
        process.exit(1)
      })

      child.on('exit', (e) => {
        log.verbose('命令执行成功', e)
        process.exit(e)
      })
      // 改造，使用 多进程执行
    } catch (error) {
      log.error('error', error)
    }

  }
}
