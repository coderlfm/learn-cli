'use strict';
const axios = require('axios');
const semver = require('semver');
const urlJoin = require('url-join');

const execSync = require('child_process').execSync

/**
 * 获取npm最新包版本 同步方式
 * @param {string} currentVersion 当前版本
 * @param {string} npmName npm包名
 * @returns 
 */
function getNpmVersionSync(currentVersion, npmName) {
  const newVserion = execSync(`npm view ${npmName} version`).toString().trim()
  return semver.gt(newVserion, currentVersion) ? newVserion : null
}

/**
 * 获取 npm 信息
 * @param {string} npmName npm包名
 * @param {string} original 目标地址 npmjs 或者 npm.taobao  
 * @returns 
 */
async function getNpmInfo(npmName, original) {
  return await axios.get(urlJoin(original || 'https://registry.npmjs.org/', npmName))
}

/**
 * 获取npm最新包版本
 * @param {string} currentVersion 当前版本
 * @param {string} npmName npm包名
 * @returns 
 */
async function getNpmVersion(currentVersion, npmName) {

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
  getNpmVersion,
  getNpmVersionSync
};