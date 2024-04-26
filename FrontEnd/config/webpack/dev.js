/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const webpack = require("webpack");
const { setupCommonConfig } = require("./common");
const commonServerConfig = require("./server");
const commonClientConfig = require("./client");

const clientConfig = merge(setupCommonConfig(true), commonClientConfig, {
    name: "client",
    mode: "development",
    entry: {
        shell: ["webpack-hot-middleware/client?path=/__webpack_hmr", "./modules/shell/Entry.ts"],
        public: ["webpack-hot-middleware/client?path=/__webpack_hmr", "./modules/client-framework/Entry.ts"],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            IS_PRODUCTION: false,
            IS_SERVER_SIDE: false,
        }),
    ],
    devtool: "inline-source-map", // slowest build/slowest rebuild but shows proper source, eval-cheap-source-map is only like 2 seconds faster and gives us transpiled code
});

// TODO ISC-13725 - Node 14 supports ES2020 syntax, such as `?.` and `??`; using it will reduce the amount of compiler-generated code in the JS bundle.
const serverConfig = merge(setupCommonConfig(true, undefined, "ES2019"), commonServerConfig, {
    name: "server",
    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            IS_PRODUCTION: false,
            IS_SERVER_SIDE: true,
        }),
    ],
    devtool: "eval-cheap-source-map", // fast build/faster rebuild - line numbers slightly off because they are from transpiled source. inline-source-map wasn't working
});

module.exports = [clientConfig, serverConfig];
