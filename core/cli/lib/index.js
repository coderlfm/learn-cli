'use strict';
const { add, log } = require('@sunshine-cli-dev/utils')
const pkg = require('../package.json')

module.exports = cli;
function cli(argv) {
  // console.log('sunshine cli', argv);
  log.info('sunshinle cli version：', pkg.version)
  // log.success('sunshine cli', '启动成功')
  // console.log(add(10, 209));
}
