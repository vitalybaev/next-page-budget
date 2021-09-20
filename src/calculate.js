const { getConfig, validateNextJsExists, getCompressionType} = require('./get-config');
const { bgRed, black, red, bold, yellow, green} = require('colorette');
const { table } = require('table');
const fs = require('fs');
const path = require('path');
const bytes = require('bytes');
const gzipSize = require('gzip-size');
const brotliSize = require('brotli-size');
const micromatch = require('micromatch');
const {getSizeOfStringInBytes, uniqueArray} = require("./utils");

const WARNING_THRESHOLD_PERCENT = 5;

const calculateRule = async (dir, nextJsPage, chunks, limit, compression) => {
  const chunksDataPromise = uniqueArray(chunks).filter(modulePath => modulePath.endsWith('.js'))
    .map((modulePath) => {
      return fs.promises.readFile(path.join(dir, '.next', modulePath), 'utf8');
    });
  const modulesDataResult = await Promise.allSettled(chunksDataPromise);
  let modulesData = modulesDataResult
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
    .join('\n');

  await fs.promises.writeFile('/Users/vitalybaev/Desktop/check-compression.txt', modulesData);

  let sizeInBytes;

  if (['gzip', 'gz'].includes(compression)) {
    sizeInBytes = gzipSize.sync(modulesData);
  } else if (['brotli', 'br'].includes(compression)) {
    sizeInBytes = brotliSize.sync(modulesData);
  } else {
    sizeInBytes = getSizeOfStringInBytes(modulesData);
  }

  return {
    page: nextJsPage,
    limit,
    size: sizeInBytes,
  };
}

module.exports = async (directory = null) => {
  try {
    const dir = directory || process.cwd();
    await validateNextJsExists(dir);
    const config = await getConfig(dir);
    const nextJsBuildManifest = JSON.parse(await fs.promises.readFile(path.join(dir, '.next', 'build-manifest.json'), 'utf8'));

    const calculateQueue = [];

    const appChunks = [];

    if (nextJsBuildManifest.pages['\/_app']) {
      appChunks.push(...nextJsBuildManifest.pages['/_app']);
    }

    Object.entries(nextJsBuildManifest.pages).forEach(([nextJsPage, chunks]) => {
      let applied = false;

      // Check for rule match in the config
      Object.entries(config.config.pages).forEach(([pagePattern, rule]) => {
        if (!applied && micromatch.isMatch(nextJsPage, pagePattern)) {
          applied = true;

          const sizeInBytes = bytes.parse(typeof rule === "string" ? rule : rule.limit);
          const compression = getCompressionType(config.config);

          calculateQueue.push(calculateRule(dir, nextJsPage, [...appChunks, ...chunks], sizeInBytes, compression));
        }
      });
    });

    const results = await Promise.all(calculateQueue);

    const isOk = !results.some(item => item.limit < item.size);

    const formattedData = [
      [bold('Page'), bold('Limit'), bold('Result')],
    ];

    results.forEach((item) => {
      let result = '';
      if (item.size > item.limit) {
        result = red(bytes(item.size));
      } else {
        const percent = (1 - item.size / item.limit) * 100;
        if (percent < WARNING_THRESHOLD_PERCENT) {
          result = yellow(bytes(item.size));
        } else {
          result = green(bytes(item.size));
        }
      }

      formattedData.push([
        item.page,
        bytes(item.limit),
        result,
      ]);
    })

    console.log(table(formattedData));

    if (!isOk) {
      process.stderr.write(`${bgRed(black(' ERROR '))} ${red('Some pages don\'t fit their limit')}\n`)
      process.exit(1);
    }
  } catch (error) {
    if (error.name === 'NextPageBudgetError') {
      const msg = error.message.replace(/\*([^*]+)\*/g, bold('$1'));
      process.stderr.write(`${bgRed(black(' ERROR '))} ${red(msg)}\n`)
    }
  }
}
