const path = require('path')

export default async function () {
  console.log('utils', path.resolve('.'));
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('请求结果', 123);

}