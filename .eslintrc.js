module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint-config-ts', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': [
      'error',
      { prefixWithI: 'always', allowUnderscorePrefix: true }
    ],
    '@typescript-eslint/class-name-casing': [
      'error',
      {
        allowUnderscorePrefix: true
      }
    ],
    'comma-dangle': ['error', 'never']
  }
};
