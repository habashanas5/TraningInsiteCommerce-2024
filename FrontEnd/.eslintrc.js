const path = require("path");

// Run via `node node_modules/eslint/bin/eslint.js . --ext .ts,.tsx`
// Use an ESLint extension for your IDE of choice to see errors in the editor.
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react-hooks", "ordered-imports", "spire"],
    extends: [
        "airbnb",
        "airbnb/hooks",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
    ],
    settings: {
        react: {
            pragma: "React",
            version: "16.10",
        },
    },
    rules: {
        // Note that most of the ones that are forced "off" but should be "error" are enabled with the rule sets list above.
        // Items can be removed from this list if they no longer need to be globally suppressed.
        "@typescript-eslint/consistent-type-assertions": "off", // Should be "error"; inconsistent pattern used.
        "@typescript-eslint/explicit-function-return-type": "off", // Should be "off"; saves a lot of code to let TypeScript infer returns.
        "@typescript-eslint/member-delimiter-style": "off", // Should be "error"; cosmetic but arguably valid.
        "@typescript-eslint/no-empty-function": "off", // Should be "error"; Empty functions are wasteful.
        "@typescript-eslint/no-empty-interface": "off", // Should be "error"; empty interfaces suggest an architectural problem.
        "@typescript-eslint/no-explicit-any": "off", // Should be "error"; would be often suppressed, but may find some legitimate issues.
        "@typescript-eslint/no-non-null-assertion": "off", // Should be "error"; non-null assertions are risky and should be discouraged.
        "@typescript-eslint/no-this-alias": "off", // Should be "error"; suggests a structural issue.
        "@typescript-eslint/no-unused-vars": "off", // Should be "error"; could potentially find bugs about forgotten parameters.
        "@typescript-eslint/no-unused-expressions": "off", // Should be "error", affected syntax is wasteful and maybe should use `?.`.
        "@typescript-eslint/no-use-before-define": "off", // Should be "error"; cosmetic but sensible for better conceptual flow.
        "@typescript-eslint/semi": "off", // handled by prettier
        "@typescript-eslint/triple-slash-reference": "off", // Should be "error"; will be suppressed occasionally but discourages legacy syntax.
        "@typescript-eslint/type-annotation-spacing": "off", // Should be "error"; inconsistent code style.
        "arrow-body-style": "off", // Should be "error"; unnecessary complexity.
        "arrow-parens": "off", // Should be customized; we generally don't use unnecessary parentheses in our C# arrow functions.
        "consistent-return": "off", // handled by TS
        curly: ["warn", "all"],
        "default-case": "off", // handled by TS
        "dot-notation": "off", // Should be "error"; unnecessary complexity.
        "func-names": "off", // Should be configured for our needs.
        "function-call-argument-newline": "off", // handled by prettier
        "function-paren-newline": "off", // handled by prettier
        "guard-for-in": "off", // Should be "error"; potential source of bugs.
        "implicit-arrow-linebreak": "off", // handled by prettier
        "import/first": "off", // Should be "error"; keeps imports in the appropriate place.
        "import/export": "off", // handled by ordered-imports
        "import/extensions": "off", // Requires special configuration or customization to be usable.
        "import/named": "off", // handled by TS
        "import/no-cycle": "off", // Should be "error"; Incredibly slow and does not seem to work with typescript.
        "import/no-duplicates": "off", // slow, and basically the same as no-duplicate-imports
        "import/no-extraneous-dependencies": "off", // the way this is built doesn't require our package.json to be perfect.
        "import/no-mutable-exports": "off", // Should be "error"; may be occasional exceptions but this can lead to erratic behavior by consumers.
        "import/no-named-as-default": "off", // handled by TS
        "import/no-named-as-default-member": "off", // handled by TS
        "import/no-self-import": "off", // expensive and highly unlikely
        "import/no-unresolved": "off", // handled by TS
        "import/no-useless-path-segments": "off", // handled by TS
        "import/order": "off", // Should be "error"; inconsistent import ordering makes reading the list harder than necessary.
        "import/prefer-default-export": "off", // Should be "error"; not using a default export where appropriate makes things slightly harder to use.
        indent: "off", // handled by prettier
        "jsx-a11y/accessible-emoji": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/anchor-is-valid": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/click-events-have-key-events": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/control-has-associated-label": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/html-has-lang": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/iframe-has-title": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/label-has-associated-control": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/mouse-events-have-key-events": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/no-noninteractive-element-interactions": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/no-static-element-interactions": "off", // Should be "error"; accessibility issue.
        "keyword-spacing": "off", // handled by prettier
        "linebreak-style": "off", // handled by prettier
        "lines-between-class-members": "off", // Debatable, may be usable if customizable for packed fields but spaced functions.
        "max-classes-per-file": "off", // Debatable.
        "max-len": "off", //handled by prettier
        "no-alert": "error", // We shouldn't be using alerts
        "no-await-in-loop": "off", // Should be "off"; this isn't done unintentionally.
        "no-confusing-arrow": "off", // Debatable.
        "no-continue": "off", // Should be "off"; we"re comfortable using `continue`.
        "no-console": "warn",
        "no-loop-func": "off", // Should be "error; complicated code organization.
        "no-multi-assign": "off", // Debatable.
        "no-multi-spaces": "off", // handled by prettier
        "no-mixed-operators": "error",
        "no-nested-ternary": "off", // Should be "error"; code written this way is hard to read.
        "no-param-reassign": "off", // Should be "off" or customized (if feasible);  our reducer+immer pattern requires it.
        "no-plusplus": "off", // Arguably should be "off"; if semi-colons are required we"re not exposed to ++"s quirks.
        "no-restricted-syntax": "off", // Should be "off"; too restrictive.  Maybe customizable to something tolerable.
        "no-shadow": "off", // Should be "error"; can make code confusing to read.
        "no-underscore-dangle": "off", // Should be "error"; bad naming pattern.  May occasionally need to be suppressed for 3rd party APIs.
        "no-unused-expressions": "off", // Doesn't support `?.` (at the time this comment was written); @typescript-eslint/no-unused-expressions works.
        "no-useless-escape": "off", // Should be "error"; unnecessary syntax.
        "no-var": "error",
        "one-var": "error",
        "object-curly-newline": "off", // handled by prettier
        "object-property-newline": "off", // handled by prettier
        "operator-assignment": "off", // Should be "error"; unnecessary syntax.  Might occasionally be suppressed in edge cases.
        "operator-linebreak": "off", // should be ["error", "before"] but conflicts with prettier
        "ordered-imports/ordered-imports": [
            "warn",
            {
                "declaration-ordering": ["source", "case-insensitive"],
                "specifier-ordering": "case-insensitive",
            },
        ],
        "padded-blocks": "off", // handled by prettier
        "prefer-destructuring": "off", // Should be "error"; destructuring is break-even-or-better than direct access for minification.
        "react/no-danger": "error",
        "react/button-has-type": "off", // Debatable, probably "off" is fine as it should be well-understood what happens with an implicit type.
        "react/default-props-match-prop-types": "off", // does not apply to TS
        "react/destructuring-assignment": "off", // Should be "error";  destructuring is break-even-or-better than direct access for minification.
        "react/display-name": "off", // slow and we don't use createReactClass
        "react/jsx-boolean-value": "off", // Should be "error"; ={true} on a boolean is unnecessary.
        "react/jsx-closing-bracket-location": "off", // handled by prettier
        "react/jsx-closing-tag-location": "off", // handled by prettier
        "react/jsx-curly-spacing": "off", // handled by prettier
        "react/jsx-curly-newline": "off", // handled by prettier
        "react/jsx-curly-brace-presence": ["error", "never"],
        "react/jsx-filename-extension": "off", // handled by TS
        "react/jsx-first-prop-new-line": "off", // handled by prettier
        "react/jsx-indent": "off", // handled by prettier
        "react/jsx-indent-props": "off", // handled by prettier
        "react/jsx-no-bind": "off", // Should be "error"; Slow and doesn't appear to work
        "react/jsx-max-props-per-line": "off", // handled by prettier
        "react/jsx-one-expression-per-line": "off", // handled by prettier
        "react/jsx-props-no-multi-spaces": "off", // handled by prettier
        "react/jsx-props-no-spreading": "off", // Should be "error"; leads to confusing code
        "react/jsx-tag-spacing": "off", // handled by prettier
        "react/jsx-wrap-multilines": "off", // handled by prettier
        "react/no-access-state-in-setstate": "off", // Should be "error"; potential source of bugs.
        "react/no-deprecated": "off", // slow and if we move to react 17 we can clean these up
        "react/no-redundant-should-component-update": "off", // handled by TS
        "react/no-string-refs": "off", // handled by TS
        "react/no-this-in-sfc": "off", // handled by TS
        "react/no-typos": "off", // handled by TS
        "react/no-unescaped-entities": "off", // Debatable--probably should be off since unescaped entities are safe and have cleaner code.
        "react/no-unknown-property": "off", // handled by TS
        "react/no-unused-prop-types": "off", // Should be "error"; Slow and doesn't seem to work
        "react/no-unused-state": "off", // Should be "error"; potential source of bugs.
        "react/prop-types": "off", // handled by TS
        "react/prefer-es6-class": "off", // handled by TS
        "react/prefer-stateless-function": "off", // Should be "error"; Very slow and can be enforced via code reviews
        "react/require-default-props": "off", // handled by TS
        "react/require-render-return": "off", // slow and will be obvious
        "react/self-closing-comp": "off", // Should be "error"; wasteful React syntax.
        "react/sort-comp": "off", // Should be "error"; non-standard React component format.
        "react/state-in-constructor": "off", // Should be "error"; non-standard React component format.
        "react/static-property-placement": "off", // Should be "error"; non-standard React component format.
        "react/void-dom-elements-no-children": "off", // slow and will be obvious
        "react-hooks/rules-of-hooks": "off", // Should be "error"; indicates hooks aren't being used correctly.
        "react-hooks/exhaustive-deps": "off", // Should be "error"; indicates hooks aren't being used correctly.
        "require-atomic-updates": "off", // Ideally would be "error", but would get triggered frequently by our front-end handler chain design.
        "require-await": "error", // This isn't enabled by any rule sets so we force it on here to reduce waste in the JS bundle.
        semi: "off", // handled by prettier
        "spire/avoid-dynamic-translate": "error",
        "spire/export-chain": "error",
        "spire/export-styles": "error",
        "spire/fenced-imports": ["error", { failRelativeImports: true }],
        "spire/restrict-lodash-import": "warn",
        "spire/avoid-dynamic-translate": [
            "error",
            {
                generateTranslations: false,
                ignoreDir: [
                    "/modules/blueprints",
                    "/modules/blueprints-shell",
                    "/modules/mobius",
                    "/modules/mobius-styleguide",
                    "/modules/server-framework",
                    "/modules/shell",
                    "/modules/shell-public",
                    "/modules/spire-linter",
                    "/modules/test",
                ],
                translationsLocation: path.resolve(__dirname, "wwwroot/AppData"),
            },
        ],
        "vars-on-top": "off", // Conflicts with the general ban on `var`.
    },
};

// https://github.com/typescript-eslint/typescript-eslint/issues/389
// TODO figure out how to run prettier separately
