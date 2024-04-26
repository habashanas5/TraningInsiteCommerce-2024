module.exports = {
    // this model is used to match NuGet tool format output for simplicity
    PackageInformation: class {
        constructor(module) {
            this.PackageName = module.name;
            this.PackageVersion = module.packageJson.version;
            this.PackageUrl = module.packageJson.homepage;
            this.Description = module.packageJson.description;
            this.LicenseUrl = module.packageJson.repository ? module.packageJson.repository.url : null;
            this.LicenseType = module.licenseId;
        }
    },
};
