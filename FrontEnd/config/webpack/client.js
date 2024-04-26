/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
    output: {
        path: path.resolve(__dirname, "../../wwwroot/dist"),
        filename: "[name].js",
        chunkFilename: "[name]_[contenthash].chunk.js",
        publicPath: "/dist/",
    },
    node: {
        fs: "empty",
    },
};
