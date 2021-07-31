#! usr/bin/env node
'use strict';
// const { add } = require('@sunshine-cli-dev/utils')
// console.log(add(1, 2));
// console.log('hello sunshine-cli-dev');

debugger;
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')
const dedent = require('dedent')
const pck = require('../package.json')

const cli = yargs();
// const cli = yargs(process.argv.slice(2));
// const cli = yargs(hideBin(process.argv));
// const cli = yargs(process.argv);


const context = {
  cliVersion: pck.version
}


// 注册命令
cli

  // 注册一个指定端口的命令，这个 $0 为当前脚本的名称 例如执行 Leran 8000，那么 $0 就是 Leran 
  .usage('$0 create <name> ')

  // 严格模式
  .strict()

  // 注册一个基本的命令
  .command('init', '初始化项目', (yargs) => {
    // return yargs
    // yargs
  }, (argv) => {
    console.log('项目开始初始化... ');
    console.log(argv);
  })

  // 设置最小需要几位参数
  // .demandCommand(2, '需要一位')

  .command('create <name>', '创建项目', (yargs) => {
    return yargs
  }, (argv) => {
    console.log('创建项目... ');
    const { name } = argv;
    console.log('项目名称:', name);
  })


  // 添加多个选项
  .options({
    "force": {
      alias: 'f',   // 配置别名 可使用 --force 或者 -f
      describe: '强制覆盖目录',
      type: 'boolean'
    },
    "run": {
      alias: 'r',
      describe: '启动一个服务',
      type: 'boolean'
    },
    "debug": {
      describe: 'debuger 模式',
      type: 'boolean',
      hidden: true,     // 隐藏的命令，不显示，一般用于开发人员的调试
    },

  })

  // 注册一个选项
  .option("update", {
    describe: '更新脚手架',
  })

  // 配置选项别名
  .alias("u", "update")     // -u  --update

  // 给选项分组
  .group(['run', 'force'], "Deve Options")

  // 设置终端的宽度
  // .wrap(cli.terminalWidth())    // 也可设置数值，或者占满终端宽度
  // .wrap(null)    // 也可设置数值，或者占满终端宽度

  // // 尾部提示及去除缩进空格，此处为 es6 语法
  // .epilogue(dedent`尾部提示 我要准备
  // 换行了`)

  // 指定某个选项后面必须跟上参数
  // .requiresArg('u')

  .recommendCommands()    // 推荐命令


  // 错误处理
  .fail((msg, err, yargs) => {
    // console.log('发生错误', msg, err);
    if (err) throw err // preserve stack
    console.error('发生错误!')
    console.error(msg)
    // console.error('You should be doing', yargs.help())
    process.exit(1)
  })

  // 会合并环境变量
  .parse(process.argv.slice(2), context)

  // 注册多个选项
  // .argv

// 查看命令 

// console.log(cli.argv);
