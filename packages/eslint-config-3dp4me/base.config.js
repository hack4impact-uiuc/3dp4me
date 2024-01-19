module.exports = {
    env: {
        es2021: true,
        'jest/globals': true,
    },
    extends: [
        "turbo",
        "prettier",
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
    },
    plugins: [
        "json-format",
        '@typescript-eslint',
        'import',
        'unused-imports',
        'simple-import-sort',
        'prettier',
        'jest',
    ],
    settings: {
        "json/ignore-files": [
            "**/package.json",
            "**/package-lock.json"
        ]
    },
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        '@typescript-eslint/no-unused-vars': 'off',
        'no-continue': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        "import/extensions": "off",
        'no-plusplus': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'unused-imports/no-unused-imports': 'error',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'no-use-before-define': 'off',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'no-underscore-dangle': 'warn',
        'prettier/prettier': [
            "error",
            {
                printWidth: 100,
                tabWidth: 4,
                trailingComma: 'es5',
                singleQuote: true,
                semi: false,
                endOfLine: 'auto',
            },
        ],
        ...require('eslint-config-prettier').rules,
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
    },
    globals: {
        BufferEncoding: true
    }
}
