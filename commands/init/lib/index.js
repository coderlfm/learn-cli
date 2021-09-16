'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const inrequirer = require('inquirer');
const semver = require('semver');
const userHome = require('user-home');
const ejs = require('ejs');
let glob = require('glob');
const kebabCase = require('kebab-case');
const { promisify } = require('util');

const Command = require('@sunshine-cli-dev/command');
const log = require('@sunshine-cli-dev/log');
const request = require('@sunshine-cli-dev/request');
const Package = require('@sunshine-cli-dev/package');
const { startSpinner, execPromise } = require('@sunshine-cli-dev/utils');
const { loadavg } = require('os');

glob = promisify(glob);

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

// 命令白名单
const WHITE_COMMAND = ['npm', 'cnpm', 'pnpm', 'yarn'];

class IninCommand extends Command {
  init() {
    // 项目名，如果在命令行已经输入，且名称合法，可跳过输入项目名的过程
    this.projectName = this._argv;
    this.force = this._cmd.opts.force;
    log.verbose('项目名称', this.projectName, this.force);
  }

  async exec() {
    // console.log('exec');
    const projectInfo = await this.preParse();

    if (!projectInfo) return;

    // 缓存项目信息
    this.projectInfo = projectInfo;

    // 下载/更新模板
    await this.downloadTemplate(this.projectInfo);

    // 安装模板到当前目录
    await this.installTemplate();

    // 项目启动
    await this.start();
  }

  // 校验是否空文件夹及初始化项目
  async preParse() {
    // 预先获取模板
    const { data } = await request({ url: '/project' });
    if (!data || !data.length) throw new Error('暂无模板');
    this.templateList = data;

    const localPath = process.cwd();
    if (!this.dirIsEmpty(localPath)) {
      let isContinue;

      if (!this.force) {
        // 当没有添加 force 的时候才会询问
        isContinue = (
          await inrequirer.prompt({
            type: 'confirm',
            name: 'isContinue',
            message: '当前目录不为空，是否继续创建',
            default: false,
          })
        ).isContinue;
        // console.log(isContinue);
        if (!isContinue) return;
      }

      const { isRemove } = await inrequirer.prompt({
        type: 'confirm',
        name: 'isRemove',
        message: '是否删除当前文件夹内容',
        default: false,
      });

      if (isRemove) fse.emptyDirSync(localPath);
    }

    return this.getProjectInfo();
  }

  // 校验文件夹是否为空
  dirIsEmpty(path) {
    let dirs = fs.readdirSync(path);
    dirs = dirs.filter((dir) => !dir.startsWith('.') && !dir.includes('node_modules'));
    // console.log(dirs);
    return dirs.length === 0;
  }

  // 询问选择项目或者模板，获取项目或者模板的信息
  async getProjectInfo() {
    // 校验项目名称是否合法

    const { type } = await inrequirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择创建类型',
      choices: [
        { value: TYPE_PROJECT, name: '项目' },
        { value: TYPE_COMPONENT, name: '组件' },
      ],
    });

    let projectInfo;
    switch (type) {
      case TYPE_PROJECT:
        projectInfo = await this.createProject();
        break;
      case TYPE_COMPONENT:
        projectInfo = await this.createComponent();
        break;
    }
    return projectInfo;
  }

  // 创建项目
  async createProject() {
    // console.log('创建项目');

    function _isValidName(v) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }

    const { projectName, projectVersion, template } = await inrequirer.prompt(
      [
        // 项目名称需要兼容，用户是否在命令行输入
        (!this.projectName || (this.projectName && !_isValidName(this.projectName))) && {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          validate: function (v) {
            const done = this.async();
            if (!_isValidName(v)) return done('请输入规范的项目名称');
            done(null, true);
          },
        },
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入版本号',
          default: '1.0.0',
          validate: function (v) {
            const done = this.async();
            if (!semver.valid(v)) return done('请输入合法的版本号');
            done(null, true);
          },
        },
        {
          type: 'list',
          name: 'template',
          message: '请选择项目模板',
          choices: this.templateList,
        },
      ].filter(Boolean),
    );

    return {
      projectName,
      projectVersion,
      projectClassName: kebabCase(projectName),
      type: TYPE_PROJECT,
      npmName: template,
    };
  }

  // 创建组件
  async createComponent() {}

  // 下载/更新项目模板到缓存
  async downloadTemplate(projectInfo) {
    // console.log(userHome);

    const { npmName, projectVersion } = projectInfo;
    const targetPath = path.resolve(userHome, '.sunshine-cli-dev', 'template');
    const storeDir = path.resolve(targetPath, 'node_modules');

    // 缓存当前选择模板
    this.templateInfo = this.templateList.find((template) => template.value === npmName);

    const templatePkg = new Package({
      pakcageName: npmName,
      packageVersion: 'latest', // 只有填写指定版本才能够显示更新 如：1.0.1，此处不通过服务端来获取版本号
      targetPath,
      storeDir,
    });

    // 区分，安装和更新
    const isUpload = templatePkg.isExists();
    const msg = isUpload ? '更新' : '安装';

    const spinner = startSpinner(`模板${msg}中...`);

    try {
      isUpload ? await templatePkg.update() : await templatePkg.install();
      // await sleep(3000);
      console.log();
      spinner.stop(true);

      // 记录当前选中的模板信息
      this.templatePkg = templatePkg;

      log.success(`模板${msg}成功`);
    } catch (error) {
      log.error(error.message);
      throw error;
    }
  }

  // 安装模板到当前目录
  async installTemplate() {
    // console.log('安装模板', this.templatePkg);
    const soucePath = path.resolve(this.templatePkg.cacheFilePath, 'template');
    const targetPaht = process.cwd();

    // 判断路径是否为空，如果为空，则创建目录
    fse.ensureDirSync(soucePath);
    fse.ensureDirSync(targetPaht);

    // 拷贝模板到当前目录
    fse.copySync(soucePath, targetPaht);

    // ejs 模板引擎渲染 package.json 名称及版本
    await this.ejsRender();
  }

  // ejs模板渲染
  async ejsRender() {
    const dir = process.cwd();

    try {
      // 匹配当前目录下的所有文件
      const files = await glob('**', { cwd: dir, nodir: true, ignore: ['**/node_modules/**', '**/public/**'] });
      // log.verbose('this.projectInfo', this.projectInfo);

      // 批量渲染
      await Promise.all(files.map((file) => _renderFile(path.resolve(dir, file), this.projectInfo)));

      // log.verbose('ejsrender end');
    } catch (error) {
      log.error(error.message);
      throw new Error(error);
    }

    /**
     * ejs渲染文件
     * @param {String} filePath 需要渲染的文件路径
     * @param {Object} renderData 渲染时传入的数据
     * @returns Promise
     */
    async function _renderFile(filePath, renderData) {
      try {
        const data = await ejs.renderFile(filePath, renderData, {});
        fse.writeFileSync(filePath, data);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }

  /**
   * 启动项目
   */
  async start() {
    // execCommand;
    log.verbose('当前模板', this.templateInfo);
    const { installCommand, startCommand } = this.templateInfo;

    // 获取安装及启动命令
    let [intallCmd, ...intallArgs] = installCommand.split(' ');
    let [startCmd, ...startArgs] = startCommand.split(' ');

    // 校验命令是否在白名单
    if (!_checkCommand(intallCmd)) return log.error('命令不存在', installCommand);
    if (!_checkCommand(startCmd)) return log.error('命令不存在', startCommand);

    // 格式化命令
    intallCmd = _formatCommand(intallCmd);
    startCmd = _formatCommand(startCmd);

    log.verbose('install', intallCmd, intallArgs);
    log.verbose('startCmd', startCmd, startArgs);

    try {
      await this.execCommand(intallCmd, intallArgs);
      await this.execCommand(startCmd, startArgs);
    } catch (error) {
      log.verbose('安装错误', error);
    }

    /**
     * 校验命令是否在白名单内
     * @param {String} command 命令
     * @returns Boolean
     */
    function _checkCommand(command) {
      return WHITE_COMMAND.includes(command);
    }

    /**
     * 格式化命令(兼容 win)
     * @param {String} command 命令
     */
    function _formatCommand(command) {
      return process.platform === 'win32' ? `${command}.cmd` : command;
    }
  }

  /**
   * 执行命令
   * @param {String} cmd 命令
   * @param {String []} args 参数
   */
  async execCommand(cmd, args) {
    return await execPromise(cmd, args, { cwd: process.cwd(), stdio: 'inherit' });
  }
}

function init(argv) {
  try {
    new IninCommand(argv);
  } catch (error) {
    // console.log(log);
    log.error(error.message);
    log.verbose(error);
  }
}

module.exports = init;
