import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unicorn from "eslint-plugin-unicorn";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // --- Project-wide hygiene, on top of eslint-config-next's defaults ---
  {
    rules: {
      "eqeqeq": ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",

      "react/self-closing-comp": "error",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],

      // Import hygiene: external deps, then internal @/ imports, alphabetized,
      // with a blank line between groups — the style already used by hand
      // throughout the codebase, now enforced/auto-fixable.
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // Named exports everywhere by default — see the override below for the
      // Next.js files (pages, layouts, route handlers, config) that require
      // a default export by framework convention.
      "import/no-default-export": "error",

      // This project targets the App Router only — the Pages Router APIs
      // are a different (and here, wrong) navigation model. See CLAUDE.md:
      // "This is NOT the Next.js you know."
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/router",
              message:
                "This project uses the App Router — import from 'next/navigation' instead.",
            },
            {
              name: "react-redux",
              importNames: ["useDispatch", "useSelector", "useStore"],
              message:
                "Use the typed hooks from '@/lib/store/hooks' (useAppDispatch/useAppSelector/useAppStore) instead of the raw react-redux hooks — see CLAUDE.md's Redux Toolkit mandate.",
            },
          ],
        },
      ],
    },
  },

  // Next.js requires a default export from these files by framework
  // convention; everywhere else the rule above stands.
  {
    files: [
      "src/app/**/{page,layout,loading,error,not-found,template,default,global-error}.{ts,tsx}",
      "src/app/**/route.ts",
      "src/middleware.ts",
      "next.config.ts",
      "postcss.config.mjs",
      "eslint.config.mjs",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },

  // The typed Redux hooks module is the one legitimate place to import the
  // raw react-redux hooks — it exists specifically to wrap them.
  {
    files: ["src/lib/store/hooks.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },

  // MVVM mandate (see CLAUDE.md "Mandated architecture"): Model/ViewModel
  // layers own state and business logic and must not render JSX — rendering
  // belongs to View components only.
  {
    files: [
      "src/**/model/**/*.{ts,tsx}",
      "src/**/viewmodel/**/*.{ts,tsx}",
      "src/**/*.slice.ts",
      "src/**/*-api.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXElement, JSXFragment",
          message:
            "Model/ViewModel files must not contain JSX — keep rendering in View components (see CLAUDE.md's MVVM mandate).",
        },
      ],
    },
  },

  // Filename casing consistency (kebab-case), matching the convention
  // already used by every file in this repo.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
