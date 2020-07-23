module.exports = {
    settings: {
        react: {
            version: "detect"
        }
    },
    env: {
        browser: true,
        es6: true
    },
    extends: [
        "plugin:react/recommended",
        // "standard",
        "plugin:cypress/recommended"
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["react"],
    rules: {
        "react/no-unescaped-entities": 0,
        quotes: ["error", "double"]
    },
    ignorePatterns: [
        "node_modules/",
        "build/",
        "cypress/plugins",
        "cypress/support"
    ]
};
