'use strict';
const { spawn } = require('child_process')
const path = require('path')

function isObject(o) {
  return Object.prototype.toString.call(0)
}

/**
 * 路径转换，兼容win
 * @param {string} p 路径转换
 * @returns
 */
function formPath(p) {
  if (path.sep !== "/") {
    return p.replace(/\\/g, '/')
  }
  return p
}

/**
 * 执行命令，兼容 win
 * @param {*} cmd
 * @param {*} args
 * @param {*} options
 * @returns
 */
function exec(cmd, args, options) {
  const win32 = process.platform === 'win32'
  if (win32) {
    args.unshift('/c', cmd,);  // 表示静默执行
    cmd = 'cmd';
  }

  return spawn(cmd, args, options || {})
}

module.exports = {
  isObject,
  exec,
  formPath,
}
