'use strict';
const { spawn } = require('child_process');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;

function isObject(o) {
  return Object.prototype.toString.call(0);
}

/**
 * 路径转换，兼容win
 * @param {string} p 路径转换
 * @returns
 */
function formPath(p) {
  if (path.sep !== '/') {
    return p.replace(/\\/g, '/');
  }
  return p;
}

/**
 * 执行命令，兼容 win
 * @param {String} cmd 命令
 * @param {String[]} args 参数
 * @param {*} options
 * @returns
 */
function exec(cmd, args, options) {
  const win32 = process.platform === 'win32';
  if (win32) {
    args.unshift('/c', cmd); // 表示静默执行
    cmd = 'cmd';
  }

  return spawn(cmd, args, options || {});
}

/**
 * 执行命令 promise 形式
 * @param {*} cmd
 * @param {*} args
 * @param {*} options
 */
async function execPromise(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);

    child.on('error', (e) => {
      // console.log('执行错误', e);
      reject(e);
      // log.error('子进程执行命令发生错误', e.message);
      // process.exit(1);
    });

    child.on('exit', (e) => {
      // console.log('执行成功', e);
      resolve(e);
      // log.verbose('子进程执行命令命令执行成功', e);
      // process.exit(e);
    });
  });
}

/**
 * 开启 loading
 * @param {string} msg loading占位字符串
 * @param {string} spinnerString loading 样式
 * @returns spinner 对象
 */
function startSpinner(msg = '', spinnerString = '|/-\\') {
  const spinner = new Spinner(`${msg} %s`);
  spinner.setSpinnerString(spinnerString);
  spinner.start();

  return spinner;
}

/**
 * 睡眠
 * @param {number} delay 延迟时间
 * @returns
 */
function sleep(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports = {
  isObject,
  exec,
  execPromise,
  formPath,
  startSpinner,
  sleep,
};
