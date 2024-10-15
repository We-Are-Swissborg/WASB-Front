import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
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
    },
];