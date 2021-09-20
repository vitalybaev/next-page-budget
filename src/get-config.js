const { lilconfig } = require('lilconfig');
const path = require('path');
const fs = require('fs');
const bytes = require('bytes');
const { NextPageBudgetError } = require("./error");
const { isObject } = require("./utils");

const validateConfig = (configResult) => {
  const { config } = configResult;
  if (config !== Object(config)) {
    throw new NextPageBudgetError('configNotValid', 'Config should be an object');
  }
  if (!('pages' in config) || !isObject(config.pages)) {
    throw new NextPageBudgetError('configNotValid', 'Config must contains pages property of type object');
  }
  Object.entries(config.pages).forEach(([page, rule]) => {
    if (typeof rule === 'string') {
      const sizeInBytes = bytes.parse(rule);
      if (!sizeInBytes || Number.isNaN(sizeInBytes)) {
        throw new NextPageBudgetError('configNotValid', `Couldn't parse size for page ${page}: ${rule}`);
      }

    } else {
      if (!isObject(rule)) {
        throw new NextPageBudgetError('configNotValid', `Rule for page ${page} must be object or string`);
      }

      if (!rule.limit) {
        throw new NextPageBudgetError('configNotValid', `limit property must exists for page ${page}`);
      }
      const sizeInBytes = bytes.parse(rule.limit);
      if (!sizeInBytes || Number.isNaN(sizeInBytes)) {
        throw new NextPageBudgetError('configNotValid', `Couldn't parse size for page ${page}: ${rule.limit}`);
      }
    }
  });
}

const validateNextJsExists = async (directory) => {
  const nextJsDir = path.join(directory, '.next');
  if (!fs.existsSync(nextJsDir)) {
    throw new NextPageBudgetError('noNextJsBuild', `Directory ${nextJsDir} not found`);
  }
  if (!fs.existsSync(path.join(directory, '.next/build-manifest.json'))) {
    throw new NextPageBudgetError('noNextJsBuild', `build-manifest.json not found at ${nextJsDir}`);
  }
  if (!fs.existsSync(path.join(directory, '.next/BUILD_ID'))) {
    throw new NextPageBudgetError('noNextJsBuild', `BUILD_ID not found at ${nextJsDir}`);
  }
}

const isValidCompressionType = (compressionType) => ['none', 'gzip', 'gz', 'brotli', 'br'].includes(compressionType);

const getCompressionType = (configObject, rule) => {
  if (isObject(rule) && 'compression' in rule && isValidCompressionType(rule.compression)) {
    return rule.compression;
  }

  if ('compression' in configObject && isValidCompressionType(configObject.compression)) {
    return configObject.compression;
  }

  return 'gzip';
}

async function getConfig(directory) {
  let explorer = lilconfig('nextPageBudget', {
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

  return result;
}

module.exports = {
  getConfig,
  validateNextJsExists,
  getCompressionType,
}
