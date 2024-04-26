module.exports = {
    plugins: [["babel-plugin-styled-components", { pure: true }], "@babel/plugin-proposal-class-properties"],
    presets: ["@babel/preset-react", "@babel/preset-env"],
    ignore: ["**/*.test.js"],
    comments: false,
};

module.exports = {
    env: {
        development: {
            plugins: [["babel-plugin-styled-components", { pure: true }], "@babel/plugin-proposal-class-properties"],
            presets: ["@babel/preset-react", "@babel/preset-env"],
            ignore: ["**/*.test.js"],
            comments: false,
        },
        test: {
            plugins: [["babel-plugin-styled-components", { pure: true }], "@babel/plugin-proposal-class-properties"],
            presets: ["@babel/preset-react", "@babel/preset-env"],
            comments: false,
        },
        production: {
            plugins: [["babel-plugin-styled-components", { pure: true }], "@babel/plugin-proposal-class-properties"],
            presets: ["@babel/preset-react", "@babel/preset-env"],
            ignore: ["**/*.test.js"],
            comments: false,
        },
    },
};
