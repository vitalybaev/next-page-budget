const MESSAGES = {
  noConfig: () => 'Create Next Page Budget config in *package.json*',
  configNotValid: (message) => `Config validation error: ${message}`,
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
