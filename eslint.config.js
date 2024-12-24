import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",
        },
        rules: {
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "no-extra-boolean-cast": 0,
            "indent": ["error", 4, { "SwitchCase": 1 }],
            semi: "error",
            "prefer-const": "error",
            eqeqeq: "off",
        },
        ignores: ["dist/**/*"]
    },
];