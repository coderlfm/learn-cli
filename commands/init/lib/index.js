'use strict';

module.exports = exec;

function exec(souce, destination, objCmd) {
    console.log('exec');
    console.log('targetPath', process.env.CLI_TARGET_PATH);
}
