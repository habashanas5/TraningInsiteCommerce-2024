/* eslint-disable @typescript-eslint/no-var-requires,no-console */ // Node, at the time of writing, doesn't support `import`.
const timerName = "Startup time";
console.time(timerName);
console.log("Starting.");

process.env.isDevBuild = true;
process.traceDeprecation = true;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // Disables certificate validation.

const fs = require("fs");
const path = require("path");

if (!fs.existsSync("./config/settings.js")) {
    fs.copyFileSync(path.resolve(__dirname, "./config/settings-base.js"), "./config/settings.js");
}

const settings = require("./config/settings");

if (!process.env.ISC_API_URL) {
    process.env.ISC_API_URL = settings.apiUrl;
}

if (!process.env.ISC_API_URL.startsWith("http")) {
    console.warn("ISC_API_URL doesn't start with `http`, prefixing with `http://`.");
    process.env.ISC_API_URL = `http://${process.env.ISC_API_URL}`;
} else if (process.env.ISC_API_URL.startsWith("https")) {
    // When HTTPS is used to connect to ISC, cookies may get the Secure attribute.
    // The browser will drop cookies with the Secure attribute when received over an unencrypted (http) connection.
    // We're not using encryption with Node (at the time of writing), so this warning should be taken seriously.
    console.warn("ISC_API_URL starts with `https`, which may cause authorization cookies to be dropped.");
}

if (!process.env.BUILD_INFO) {
    process.env.BUILD_INFO = "Development";
}

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./config/webpack/dev");

const compiler = webpack(webpackConfig);

const stats = {
    builtAt: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    entrypoints: false,
    timings: false,
    version: false,
    warningsFilter: [/Critical dependency: the request of a dependency is an expression/],
};

const clientCompiler = compiler.compilers.find(compiler => compiler.name === "client");
const clientWebpackDevMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientCompiler.options.output.publicPath,
    stats,
});

const serverCompiler = compiler.compilers.find(compiler => compiler.name === "server");
const serverWebpackDevMiddleware = webpackDevMiddleware(serverCompiler, {
    stats,
    serverSideRender: true,
});

let serverHash = "";
let server = null;

const Module = require("module");

let serverOutputPath;

const options = {
    setupExtraMiddleware: app => {
        app.use(clientWebpackDevMiddleware);
        app.use(serverWebpackDevMiddleware);
        app.use(webpackHotMiddleware(clientCompiler));
        app.use(webpackHotMiddleware(serverCompiler));
    },
    getServer: response => {
        if (serverHash !== response.locals.webpackStats.hash) {
            if (!serverOutputPath) {
                serverOutputPath = response.locals.webpackStats.toJson().outputPath;
            }

            const memoryServer = new Module();

            memoryServer._compile(response.locals.fs.readFileSync(`${serverOutputPath}/server.js`, "utf8"), "");
            server = memoryServer.exports.server;
            serverHash = response.locals.webpackStats.hash;
        }
        return server;
    },
    finishSetup: app => {
        clientWebpackDevMiddleware.waitUntilValid(() =>
            serverWebpackDevMiddleware.waitUntilValid(() => {
                const [, , , port] = process.argv;
                const thePort = port || 3000;
                app.listen(thePort, () => {
                    console.log(`Startup complete, listening on port ${thePort}.`);
                    console.timeEnd(timerName);
                });
            }),
        );
    },
};

require("./start")(options);
