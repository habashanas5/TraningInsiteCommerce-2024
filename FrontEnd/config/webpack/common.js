/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BlueprintReplacementPlugin = require("./blueprintReplacementPlugin");
const path = require("path");
const setupEntryFiles = require("./setupEntryFiles");
require("./setupTsconfigPathsFile");
const webpack = require("webpack");
const RemovePlugin = require("remove-files-webpack-plugin");
const semver = require("semver");
const createImportWidgetChunkFile = require("./createImportWidgetChunkFile");

if (semver.lt(process.version, "12.12.0")) {
    throw new Error("Spire requires node 12.12+ to function properly.");
}

createImportWidgetChunkFile();

exports.setupCommonConfig = (isDevBuild, env, target = "ES2017") => {
    let blueprint = env && env.BLUEPRINT && `blueprints/${env.BLUEPRINT}`;
    if (!blueprint) {
        if (isDevBuild) {
            const [, , blueprintName] = process.argv;
            if (blueprintName && blueprintName !== "content-library") {
                blueprint = `blueprints/${blueprintName}`;
            }
        } else {
            blueprint = process.env.BLUEPRINT;
        }
    }

    if (!blueprint) {
        blueprint = "content-library";
    }

    console.log(`Blueprint is ${blueprint}.`);

    setupEntryFiles(isDevBuild, blueprint);

    const removePluginOptions = {
        include: [
            "./modules/client-framework/node_modules",
            "./modules/mobius/node_modules",
            "./modules/server-framework/node_modules",
            "./modules/shell/node_modules",
        ],
        logWarning: false, // otherwise we get extra logging later about these directories not existing
    };

    const commonConfig = {
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.base.json" })],
        },
        plugins: [
            new RemovePlugin({
                watch: removePluginOptions, // npm run start uses watch
                before: removePluginOptions, // npm run build uses before
            }),
            new BlueprintReplacementPlugin(blueprint),
            new webpack.DefinePlugin({
                BUILD_DATE: new Date().getTime(),
                BLUEPRINT_NAME: JSON.stringify(blueprint.replace("blueprints/", "")),
            }),
        ],
        stats: {
            builtAt: false,
            colors: true,
            hash: false,
            modules: false,
            entrypoints: false,
            performance: false,
            warningsFilter: [/Critical dependency: the request of a dependency is an expression/],
        },
        performance: {
            hints: false,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                happyPackMode: true,
                                getCustomTransformers: path.resolve(__dirname, "./transformers.js"),
                                compilerOptions: {
                                    target,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=application/font-woff",
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=application/font-woff",
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=application/octet-stream",
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    use: "file-loader",
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=image/svg+xml",
                },
            ],
        },
    };

    return commonConfig;
};
