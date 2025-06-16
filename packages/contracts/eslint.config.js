const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        task: 'readonly',
        ethers: 'readonly',
        network: 'readonly',
        artifacts: 'readonly',
        web3: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
    ignores: ['node_modules/', 'artifacts/', 'cache/', 'coverage/', 'typechain/'],
  },
  {
    files: ['.prettierrc.js'],
    rules: {
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['scripts/**/*.js', 'hardhat.config.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
