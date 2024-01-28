module.exports = {
    extends: [
        "../base.config.js",
    ],
    env: {
        browser: true,
        'jest/globals': true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
  },
  globals: {
        JSX: "readonly",
    },
    plugins: [
        "react",
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
        "react/react-in-jsx-scope": "off",
        "react/jsx-props-no-spreading": "off",
        "react/jsx-no-constructed-context-values": "off",
        "react/function-component-definition": "off",
        "import/extensions": ["error", "never", { 
            "svg": "always",
        }],
        "no-underscore-dangle": ["error", {"allow": ["_id"]}],
        "jsx-a11y/label-has-associated-control": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".d.ts", ".ts", ".tsx"],
                paths: ["src"]
            }
        }
    }
}
