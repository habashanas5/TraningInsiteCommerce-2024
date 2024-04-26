/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const { setupCommonConfig } = require("./common");
const commonClientConfig = require("./client");
const commonProdConfig = require("./commonProd");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const RemovePlugin = require("remove-files-webpack-plugin");

module.exports = env => {
    const commonConfig = setupCommonConfig(false, env);

    const clientConfig = merge(commonConfig, commonClientConfig, commonProdConfig, {
        entry: {
            shell: "./modules/shell/Entry.ts",
            public: "./modules/client-framework/Entry.ts",
        },
        plugins: [
            new RemovePlugin({
                before: {
                    root: ".",
                    test: [
                        {
                            folder: "./wwwroot/dist",
                            method: () => true,
                            recursive: true,
                        },
                    ],
                },
            }),
            new webpack.DefinePlugin({
                IS_PRODUCTION: true,
                IS_SERVER_SIDE: false,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                openAnalyzer: false,
                reportFilename: "webpack-bundle-analyzer.html",
            }),
        ],
    });

    return clientConfig;
};
