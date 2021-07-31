'use strict';
const npmlog = require('npmlog');

function add(number1, number2) {
    return number1 + number2;
}

const log = npmlog;

log.addLevel('success', 3000, { bg: 'green' })

module.exports = {
    add,
    log
}