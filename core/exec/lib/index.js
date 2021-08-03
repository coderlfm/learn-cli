'use strict';
const path = require('path');
const Package = require('@sunshine-cli-dev/package')

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
    console.log('加载文件');
    require(filePath).call(null, Array.from(arguments));
  }
}
