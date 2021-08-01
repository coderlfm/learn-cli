'use strict';
const axios = require('axios');
const semver = require('semver');
const urlJoin = require('url-join');

function getNpmVersionSync(npmName){
  
}

async function getNpmInfo(npmName, original) {
  return await axios.get(urlJoin(original || 'https://registry.npmjs.org/', npmName))
}

async function getNpmVersion(currentVersion, npmName) {
  currentVersion = '16.10.10';
  npmName = 'react';

  try {
    const { data } = await getNpmInfo(npmName)
    const releaseVersion = getSemverVersion(currentVersion, data.versions)
    return releaseVersion.length ? releaseVersion[0] : null
    
  } catch (error) {
    return Promise.reject(error.message)
  }

}

/**
 * 筛选高于当前版本号的数组
 * @param {string} currentVersion 当前版本
 * @param {string[]} npmInfo npm所有版本
 * @returns 高于当前版本的版本号数组
 */
function getSemverVersion(currentVersion, versions) {
  return Object.keys(versions)
    .filter(verion => semver.satisfies(verion, `>${currentVersion}`))   //　只筛选出高版本
    .sort((a, b) => semver.gt(b, a) ? 1 : -1)                           //  按版本倒序
}


module.exports = {
  getNpmVersion
};