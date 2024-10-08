module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'react'],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error"],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
      
    ],
    semi: "error",
    "prefer-const": "error",
    eqeqeq: "off",
    "no-unused-vars": "error",
    "indent": ["error", 4, { "SwitchCase": 1 }],
    "no-extra-boolean-cast": 0,
    "react-refresh/only-export-components": "off"
  },
};
