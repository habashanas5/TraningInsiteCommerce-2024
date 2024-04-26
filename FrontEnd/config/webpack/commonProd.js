/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const LicenseWebpackPlugin = require("license-webpack-plugin").LicenseWebpackPlugin;
// Note: Changes to this list requires approval from legal
const PackageInformation = require("./packageInformation").PackageInformation;
const allowedLicenses = require("./allowedLicenseTypes");
const path = require("path");

module.exports = {
    mode: "production",
    plugins: [
        // ForkTsCheckerWebpackPlugin requires "sync" mode when used with webpack-dev-server, too slow for development.
        // In async mode, webpack-dev-server doesn't report errors.
        // The IDE should still report any errors in open files and the production build checks everything.
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tsconfig: "tsconfig.base.json",
            useTypescriptIncrementalApi: false,
        }),
        new LicenseWebpackPlugin({
            perChunkOutput: false,
            // to stop all the missing license text warnings....
            licenseTemplateDir: path.resolve(__dirname, "./default-license-texts"),
            outputFilename: "licenses.json",
            licenseTypeOverrides: {
                // domutils license is not recognized correctly, override here. Hopefully it never changes.
                domutils: "BSD-2-Clause",
            },
            unacceptableLicenseTest: licenseType => {
                // Note: This list requires approval from legal. Likely more licenses may also be added
                return !allowedLicenses.includes(licenseType);
            },
            modulesDirectories: [path.resolve(__dirname, "../../node_modules")],
            renderLicenses: modules => {
                console.log(`Licenses discovered: ${modules.length}`);
                const mapped = modules
                    .sort((left, right) => {
                        return left.name < right.name ? -1 : 1;
                    })
                    .map(module => new PackageInformation(module));

                return JSON.stringify(mapped);
            },
        }),
    ],
    devtool: "source-map",
};
