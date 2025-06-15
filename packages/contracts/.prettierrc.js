const assetsSuffix = 'svg|png|css|scss';

module.exports = {
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  overrides: [
    {
      files: '*.sol',
      options: {
        singleQuote: false,
        plugins: ['prettier-plugin-solidity'],
      },
    },
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      options: {
        importOrder: [
          `^(?!(@\/)|(\\.)|(\\..)[a-z@]).(?!.*\\.(${assetsSuffix})$)`, // All imports from node_modules
          `^@\/(?!.*\\.(${assetsSuffix})$)`, // All imports starts with "@/"
          `^~\/(?!.*\\.(${assetsSuffix})$)`, // All imports starts with "~/"
          `^\\\..(?!.*\\.(${assetsSuffix})$)|^\\\.$`, // All imports starts with "."
          `^(?!(@\/)|(\\.)|(\\..)[a-z@]).*\\.(${assetsSuffix})$`, // All asserts imports from node_modules
          `^@\/.*\\\.(${assetsSuffix})$`, // All assets imports starts with "@/"
          `^~\/.*\\\.(${assetsSuffix})$`, // All assets imports starts with "~/"
          `\\\.(${assetsSuffix})$`, // All assets imports starts with "."
        ],
        semi: true,
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
        plugins: ['@trivago/prettier-plugin-sort-imports'],
      },
    },
  ],
};
