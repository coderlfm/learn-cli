'use strict';
const npmlog = require('npmlog');

function add(number1, number2) {
    return number1 + number2;
}

const log = npmlog;
log.level = process.env.LOG_LEVEL || 'info';
log.addLevel('success', 3000, { bg: 'green' })

module.exports = {
    add,
    log
}