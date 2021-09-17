const { lilconfig } = require('lilconfig');
const {NextPageBudgetError} = require("./error");

const validateConfig = (configResult) => {
  const { config } = configResult;
  if (config !== Object(config)) {
    throw new NextPageBudgetError('configNotValid', 'Config should be an object');
  }
  if (!('pages' in config) || !Array.isArray(config.pages)) {
    throw new NextPageBudgetError('configNotValid', 'Config must contains pages property of type array');
  }
}

async function getConfig(directory) {
  let explorer = lilconfig('next-page-budget', {
    searchPlaces: [
      'package.json',
      '.next-page-budget.json',
      '.next-page-budget',
      '.next-page-budget.js',
      '.next-page-budget.cjs'
    ],
  })
  let result = await explorer.search(directory);

  if (!result) {
    throw new NextPageBudgetError('noConfig');
  }

  validateConfig(result);

  console.log('result', result);
}

module.exports = {
  getConfig,
}
