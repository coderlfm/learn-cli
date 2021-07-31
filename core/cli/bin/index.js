#! /usr/bin/env node

'use strict';
// console.log('hello sunshine cli');
const importlocal = require('import-local')
const { log } = require('@sunshine-cli-dev/utils')

if (importlocal(__dirname)) {
  log.info('sunshile cli', '加载本地模块')
} else (
  require('../lib')(process.argv.slice(2))
)
