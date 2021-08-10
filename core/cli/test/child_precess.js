/* node 子进程 */
const cp = require('child_process');
const path = require('path');
const colors = require('colors')

// 通过 exec 开启子进程，会所有结果执行完成后再一次性返回
// cp.exec('ls|grep test', (err, stdout, stderr) => {
// console.log(err, stdout, stderr);
// })

// const child = cp.execSync('ls')

/*
const child = cp.exec('ls', (err, stdout, stderr) => {
  console.log('callback start ------------');
  console.log(err, stdout, stderr);
  console.log('callback end ------------');
})

child.stdin.on('data', chunk => {
  console.log(colors.green('stdin_data', chunk.toString()));
})

child.stdin.on("close", chunk => {
  console.log(colors.red('stdin_close', chunk.toString()));
})

child.stdout.on('data', chunk => {
  console.log(colors.green('stdout_data', chunk.toString()));
})

child.stdout.on("close", chunk => {
  console.log(colors.red('stdout_close', chunk.toString()));
})

child.stderr.on("data", chunk => {
  console.log(colors.green('stderr_data', chunk.toString()));
})

child.stderr.on("close", chunk => {
  console.log(colors.red('stderr_close', chunk.toString()));
})

child.on('exit', e => {
  console.log(colors.yellow('process_exec', e));
})

child.on('close', e => {
  console.log(colors.yellow('process_close', e));
})

child.on('error', e => {
  console.log(colors.yellow('process_error', e));
})

 */

// execFile
// 只支持将命令传入 文件中，如果需要支持管道符等操作，需要将这些命令下沉到文件中
// ls 本身其实也是一个文件
// cp.execFile('ls', ['-a'], (err, stdout, stderr) => {
// cp.execFile('node', ['-v'], (err, stdout, stderr) => {
//   console.log(err, stdout, stderr);
// })
// console.log('child', child.stdout.toString());



// spawn 返回的是一个流
// const child = cp.spawn('ls', ['-l'])
// const child = cp.spawn('node', ['test.js', '--version'], {
//   stdio: 'inherit'
// })

const child = cp.spawn('cmd.exe', ['node test.js && node --version',], {
  stdio: 'inherit'
})
child.on('error', e => {
  console.log(e);
})
child.on('exit', e => {
  console.log(e);
})




// // 监听成功，会不断监听流的消息
// child.stdout.on('data', (chunk) => {
//   console.log(chunk.toString());
// })

// // 监听失败
// child.stderr.on('data', chunk => {
//   console.log(chunk);
// })


// execSync
// const result = cp.execSync('ls -a')
// console.log(result.toString());

// execFileSync
// const result = cp.execFileSync('ls', ['-a'])
// console.log(result.toString());

// spawnSync
// const result = cp.spawnSync('ls', ['-a'])
// console.log(result.stdout.toString());

