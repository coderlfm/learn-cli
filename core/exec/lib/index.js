'use strict';

const Package = require('@sunshine-cli-dev/package')

module.exports = exec;

const SETTINGS = {
  'init': '@vuejs/cli'
}

function exec(souce, destination, objCmd) {
  const name = objCmd.name();
  const targetPath = process.env.CLI_TARGET_PATH;
  const pakcageName = SETTINGS[name];
  const packageVersion = 'latest';


  const pkg = new Package({
    targetPath,
    pakcageName,
    packageVersion
  })

  const path = pkg.getRootFilePath()
  // console.log('pkg:', pkg, 'path:', path);

  // 加载文件
  require(path).apply(null, arguments);
}
