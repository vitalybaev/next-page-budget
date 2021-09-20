const MESSAGES = {
  noConfig: () => 'Create Next Page Budget config in *package.json*',
  configNotValid: (message) => `Config validation error: ${message}`,
  noNextJsBuild: (message) => `No Next.js build in the directory: ${message}. Make sure that you've built Next.js production bundle via next build`,
}

class NextPageBudgetError extends Error {
  constructor(type, ...args) {
    super(MESSAGES[type](...args))
    this.name = 'NextPageBudgetError';
  }
}

module.exports = {
  NextPageBudgetError,
}
