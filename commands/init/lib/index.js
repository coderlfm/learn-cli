'use strict';

const Command = require('@sunshine-cli-dev/command')
const log = require('@sunshine-cli-dev/log')

module.exports = init;

class IninCommand extends Command {
  init() {
    this.projectName = this._argv;
    this.force = this._cmd.force;
    console.log('init');
    console.log(this.projectName, this.force);
  }

  exec() {
    console.log('exec');
  }
}

function init(argv) {
  try {
    new IninCommand(argv);

  } catch (error) {
    // console.log(log);
    log.error(error.message)
    log.verbose(error)
  }
}
