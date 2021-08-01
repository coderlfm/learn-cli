#! /usr/bin/env node

'use strict';
// console.log('hello sunshine cli');
const importlocal = require('import-local')
const { log } = require('@sunshine-cli-dev/utils')
import utils from '../lib/utils.mjs'

if (importlocal(__dirname)) {
  log.info('sunshile cli', '加载本地模块')
} else {
  utils()
  // console.log(process.versions);

  // require('../lib')(process.argv.slice(2))
  // require('../dist')
}
