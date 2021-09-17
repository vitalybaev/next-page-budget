const chokidar = require('chokidar');
const calculate = require('./calculate');

const hasFlag = (flag) => {
  return process.argv.includes(flag);
}

function throttle(fn) {
  let next, running
  // istanbul ignore next
  return () => {
    clearTimeout(next)
    next = setTimeout(async () => {
      await running
      running = fn()
    }, 200)
  }
}

module.exports = async () => {
  await calculate();

  if (hasFlag('--watch')) {
    let watcher = chokidar.watch(['**/*'], {
      ignored: '**/node_modules/**'
    })
    watcher.on('change', throttle(calculate))
  }
}
