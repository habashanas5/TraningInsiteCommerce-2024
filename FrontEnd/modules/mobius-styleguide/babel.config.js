module.exports = {
    presets: [
        [
            "@babel/env",
            {
                modules: false,
                useBuiltIns: "usage",
                corejs: 3,
            },
        ],
        ["@babel/preset-react"],
        ["@babel/preset-typescript"],
    ],

    plugins: [
        [
            "module-resolver",
            {
                root: ["./"],
                alias: {
                    "@insite/mobius": "../mobius/src",
                },
            },
        ],
        "@babel/plugin-proposal-class-properties",
        "babel-plugin-styled-components",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-nullish-coalescing-operator",
    ],
};
