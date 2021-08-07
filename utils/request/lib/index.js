'use strict';
const axios = require('axios');

const BASE_URL = process.env.SUNSHILE_CLI_BASE_URL ?? ''

function request() {
  axios.crate({
    baseURL: BASE_URL,
    timeout: 10000,
  })
}

module.exports = request;
