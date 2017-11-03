const {exec} = require('child_process')

module.exports = url => {
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`)
      break;
    case 'win32':
      exec(`start ${url}`)
      break;
    default:
      break;
  }
}

//使用node自带模块child_process自动打开url
