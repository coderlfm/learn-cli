const path = require('path')
const os = require('os');


// console.log(path.resolve(''));

// console.log(path.dirname('C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules'));

// console.log(['a', 'b'].join('\x00'))

// console.log(typeof 16822n);
// console.log(16822 & 61440);


// console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));

// console.log(os.type());
// console.log(path.sep);

// console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
// console.log(!!path.relative('E:\\learn\\learn-cli\\sunshine-cli\\packages\\core\\lib\\node_modules'
//   , 'E:\\learn\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js'
// ).startsWith('..'));

// console.log(
//   path.relative(
//     'E:\\learn\\learn-cli\\sunshine-cli\\packages\\core\\lib\\node_modules',
//     'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js'
//   ));
console.log(
  path.relative(
    'C:\\learn\\learn-cli\\sunshine-cli\\node_modules',
    'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js'
  ));
// console.log(path.isAbsolute('E:\\learn\\learn-cli\\sunshine-cli\\packages\\core\\lib\\node_modules'));

// console.log(path.relative('E:\\learn\\learn-cli\\sunshine-cli\\packages\\core\\lib\\node_modules'
//   , 'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js'
// ).startsWith('..'));

// const filenameInLocalNodeModules = !path.relative(
//   'E:\\learn\\learn-cli\\sunshine-cli\\packages\\core\\lib\\node_modules',
//   'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js'
// ).startsWith('..')

// const filenameInLocalNodeModules = path.relative(
//   'E:\\learn\\learn-cli\\sunshine-cli\\packages\\core\\lib\\node_modules',
//   'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js'
// )

// const localFile = 'E:\\learn\\learn-cli\\sunshine-cli\\node_modules\\lerna\\cli.js';
// const localName = 'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna\\cli.js';

// !filenameInLocalNodeModules && localFile && path.relative(localFile, localName) !== '' && '加载'
// console.log(!filenameInLocalNodeModules, localFile, path.relative(localFile, localName) !== '');