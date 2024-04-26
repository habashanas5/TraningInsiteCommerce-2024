/* eslint-disable @typescript-eslint/no-var-requires,global-require */
const express = require("express");
const compression = require("compression");
const domain = require("domain");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

module.exports = function startServer(options) {
    const app = express();
    if (options.enableCompression) {
        app.use(compression());
    }

    app.disable("etag");
    app.disable("x-powered-by");

    if (options.setupExtraMiddleware) {
        options.setupExtraMiddleware(app);
    }

    app.use(express.static("wwwroot"));
    app.use(
        cookieParser(undefined, {
            // on the .net site we use HttpUtility.UrlEncode which encodes ' ' as '+'
            decode: value => decodeURIComponent(value.replace(/\+/g, " ")),
        }),
    );

    // The items below are forwarded via Api.ts.  The raw parser is needed to support POST requests.
    const rawParser = bodyParser.raw({ type: "*/*", limit: "10mb" });
    app.all("/email*", rawParser);
    app.all("/api*", rawParser);
    app.all("/identity*", rawParser);
    app.all("/admin*", rawParser);
    app.all("/ckfinder*", rawParser);
    app.post("/.spire/shareEntity", bodyParser.json());

    app.use((request, response, next) => {
        // required for siteGeneration
        global.__basedir = __dirname;

        const createdDomain = domain.create();
        createdDomain.add(app);

        if (options.setupDomain) {
            options.setupDomain(createdDomain, response);
        }

        return createdDomain.run(() => {
            try {
                return options
                    .getServer(response)(request, response, domain)
                    .catch(error => {
                        next(error);
                    });
            } catch (e) {
                next(e);
            }
        });
    });

    options.finishSetup(app);
};
