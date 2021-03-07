module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:prettier/recommended",
    ],
    rules: {
        "prettier/prettier": "error",
        "import/order": [
            1,
            {
                "newlines-between": "always",
                alphabetize: { order: "asc" },
            },
        ],
        "sort-imports": [1, { ignoreDeclarationSort: true }],
        "import/no-cycle": 2,
    },
};
