'use strict';

const npmlog = require('npmlog');

const log = npmlog;
log.level = process.env.LOG_LEVEL || 'info';
log.addLevel('success', 3000, { bg: 'green' })

module.exports = {
  log
}
