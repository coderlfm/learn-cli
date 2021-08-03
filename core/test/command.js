/*
  command 的基本使用
 */

const commander = require('commander');
const pkg = require('../cli/package.json')

const { program } = commander

module.exports = function (argv) {

  // 执行 --help 查看帮助
  program
    .name('sunshine-cli-dev')
    .usage('install')
    .version(pkg.version)
    .option('-d, --debug', '开启 debug 模式', false)  // 选项默认值
    .option('-e, --envName <envName>', '环境变量名称') // 选项必传参数

  // console.log(program);
  // program.outputHelp()          // 打印帮助面板
  // console.log(program.opts());  // 获取所有 options

  // 注册命令
  program
    // .command('clone <souce> [destination]')    // 命令

    // 该方式等同于上述，只不过是上述没有描述
    .command('clone')    // 命令
    .argument('<souce>', '目标源')
    .argument('[destination]', '目标地址')

    .description('克隆项目')                    // 描述
    .option('-f, --force', '强制覆盖')          // 该命令的选项
    .action((souce, destination, objCmd) => {          // 命令处理函数
      console.log('souce:', souce, 'destination:', destination, 'objCmd:', objCmd);
    })
    .hook('preAction', (thisCommand, actionCommand) => {
      // console.log('执行前',thisCommand,actionCommand);
      console.log('执行前');
    })
    .hook('postAction', (thisCommand, actionCommand) => {
      // console.log('执行后',thisCommand,actionCommand);
      console.log('执行后');
    })

  // 注册命令方式二，子命令 /命令分组
  const serve = new commander.Command('serve');
  serve
    .command('start')
    .argument('<port>', '端口号')
    .action((port) => {
      console.log('服务启动在', port);
    })

  serve
    .command('stop')
    .action(() => {
      console.log('服务关闭');
    })

  program.addCommand(serve)
  /* sunshine-cli-dev serve start  3000 */

  /* 参数解析,以上所有命令未命中，则来到这里 */
  /* sunshine-cli-dev www qqqq      www qqqq */
  // program.arguments('<cwd> [options]')
  //   .action((cwd, options) => {
  //     console.log(cwd, options);
  //   })




  // program
  //   .command('install [name]', '安装', {
  //     executableFile: 'npm',   // 可执行命令
  //     isDefault: true,
  //     // hidden: true,

  //   })
  //   .action(() => {
  //     console.log('install');
  //   })



  // 自定义 help 信息
  program.helpInformation = function () {
    return '自定义帮助信息'
  }

  // 自定义事件监听
  program.on('option:debug', (e) => {
    console.log('help被输出', e);
  })

  program.on('command:*', () => {
    const command = program.commands.map(cwd => cwd.name());
    console.log('无效命令', program.commands.map(cwd => cwd.name()));
    console.log('无效命令，请输入以下命令', command);
    process.exitCode = 1;
  })

  program.parse();

  // console.log(program.option.envName);


};

// program.
