const readline = require('readline');

// 基本使用
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('请输入：', answer => {
  console.log(answer);
  rl.close();
})
