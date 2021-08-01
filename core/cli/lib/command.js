/* 
  command 的基本使用
 */

const { program } = require('commander');
const pkg = require('../package.json')

module.exports = function (argv) {

  program
    .version(pkg.version)
    .option('-d, --debug', '开启 debug 模式')

  program.parse();

};

// program.