'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const inrequirer = require('inquirer');
const semver = require('semver');

const Command = require('@sunshine-cli-dev/command')
const log = require('@sunshine-cli-dev/log')

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';
class IninCommand extends Command {
  init() {
    this.projectName = this._argv;
    this.force = this._cmd.opts.force;
    // console.log('init', this._cmd);
    console.log(this.projectName, this.force);
  }

  async exec() {
    console.log('exec');
    await this.preParse()
  }

  async preParse() {
    const localPath = process.cwd();

    if (!this.dirIsEmpty(localPath)) {
      let isContinue;

      if (!this.force) {  // 当没有添加 force 的时候才会询问
        isContinue = (await inrequirer.prompt({
          type: 'confirm',
          name: 'isContinue',
          message: '当前目录不为空，是否继续创建',
          default: false,
        })).isContinue;
        console.log(isContinue);
        if (!isContinue) return
      }


      const { isRemove } = await inrequirer.prompt({
        type: 'confirm',
        name: 'isRemove',
        message: '是否删除当前文件夹内容',
        default: false,
      });

      if (isRemove) fse.emptyDirSync(localPath);

    }

    return this.getProjectInfo()
  }

  // 校验文件夹是否为空
  dirIsEmpty(path) {
    let dirs = fs.readdirSync(path)
    dirs = dirs.filter(dir => (!dir.startsWith('.')) && (!dir.includes('node_modules')))
    console.log(dirs);
    return dirs.length === 0
  }

  async getProjectInfo() {

    // 校验项目名称是否合法
    function _isValidName(v) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }

    const { type } = await inrequirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择创建类型',
      choices: [
        { value: TYPE_PROJECT, name: '项目' },
        { value: TYPE_COMPONENT, name: '组件' },
      ]
    })

    if (type === TYPE_PROJECT) {
      console.log('创建项目');
      const { name, version, template } = await inrequirer.prompt([
        // 项目名称需要兼容，用户是否在命令行输入
        {
          type: 'input',
          name: 'name',
          message: '请输入项目名称',
          validate: function (v) {
            const done = this.async();
            if (!_isValidName(v)) return done('请输入规范的项目名称');
            done(null, true);
          }
        },
        {
          type: 'input',
          name: 'version',
          message: '请输入版本号',
          default: '1.0.0',
          validate: function (v) {
            const done = this.async();
            if (!semver.valid(v)) return done('请输入合法的版本号');
            done(null, true);
          }
        },
        {
          type: 'list',
          name: 'template',
          message: '请输入版本号项目模板',
          choices: [{ value: 'vue', name: 'vue2标准', }, { value: 'vue-admin', name: 'vue2后台管理' }]
        }
      ])
      log.verbose('name:', name, 'version:', version, 'template:', template);
      // console.log('name:', name, 'version:', version);

    } else if (type === TYPE_COMPONENT) {
      console.log('创建组件');
    }

    // console.log(type);
  }
}

function init(argv) {
  try {
    new IninCommand(argv);

  } catch (error) {
    // console.log(log);
    log.error(error.message)
    log.verbose(error)
  }
}

module.exports = init;
