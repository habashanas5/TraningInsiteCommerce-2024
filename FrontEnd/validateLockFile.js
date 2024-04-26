const { lockfileVersion } = require("./package-lock");
if (lockfileVersion !== 1) {
    throw new Error(`Your npm install bumped the package-lock.json to lockfileVersion ${lockfileVersion}. Revert your changes to package-lock.json. You can run npm install --no-save or revert to npm 6.`);
}
