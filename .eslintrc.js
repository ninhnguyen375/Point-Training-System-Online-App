module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-wrap-multilines': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2, {SwitchCase: 1}],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error',
    'no-unused-vars': 'off',
    'no-nested-ternary': 'off',
    // on github
    'object-curly-spacing': [2, 'never'],
    'object-shorthand': [2, 'always'],
    'array-bracket-spacing': [2, 'never'],
    'max-len': [2, 120, {
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreComments': true,
    }],
    'consistent-return': 0,
    'prefer-destructuring': [2, {'array': false, 'object': false}, {'enforceForRenamedProperties': false}],
    'prefer-object-spread': 0, // until node 8 is required
    'prefer-rest-params': 0, // until node 6 is required
    'prefer-spread': 0, // until node 6 is required
    'function-paren-newline': 0,
    'no-plusplus': 1,
    'no-param-reassign': 1,
    'strict': [2, 'safe'],
  },
}
