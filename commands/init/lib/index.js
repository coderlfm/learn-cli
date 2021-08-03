'use strict';

const Command = require('@sunshine-cli-dev/command')
const log = require('@sunshine-cli-dev/log')

module.exports = init;

class IninCommand extends Command {

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
