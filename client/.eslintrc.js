module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  plugins: [
    'vue', // required to lint *.vue files
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'warn',
    'max-len': 'off',
    'global-require': 'off',
    'no-plusplus': 'off',
    'radix': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'no-useless-return': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },

};
