const { getConfig } = require('./get-config');
const { bgRed, black, red, bold } = require('colorette');

module.exports = async (directory = null) => {
  try {
    const dir = directory || process.cwd();
    const config = await getConfig(dir);
  } catch (error) {
    if (error.name === 'NextPageBudgetError') {
      const msg = error.message.replace(/\*([^*]+)\*/g, bold('$1'));
      process.stderr.write(`${bgRed(black(' ERROR '))} ${red(msg)}\n`)
    }
  }
}
