const assetsSuffix = 'svg|png|css|scss';

export default {
  singleQuote: true,
  tabWidth: 2,
  semi: true,
  printWidth: 100,
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
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
