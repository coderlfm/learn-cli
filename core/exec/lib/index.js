'use strict';

module.exports = exec;

const SETTINGS = {
  'init': '@vuejs/cli'
}

function exec(souce, destination, objCmd) {
  const name = objCmd.name();
  const targetPath = process.env.CLI_TARGET_PATH

  console.log('name', name,);
  console.log('targetPath', targetPath);
  // TODO
}
