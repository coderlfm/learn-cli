'use strict';
const { add, log } = require('@sunshine-cli-dev/utils')

module.exports = cli;
function cli(argv) {
  // console.log('sunshine cli', argv);
  log.success('sunshine cli', '启动成功')
  console.log(add(10, 209));
}
// (function cli(argv) {
//   console.log('sunshine cli', argv);
// })()