// because production is different than dev, these have to be functions to make sure __basedir is available
import { constants, promises } from "fs";
import { resolve } from "path";

export const getAppDataPath = () => `${(global as any).__basedir}/wwwroot/AppData`;

export const getBlueprintAppDataPath = () =>
    `${(global as any).__basedir}/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData`;

export async function existsAsync(filePath: string) {
    try {
        await promises.access(filePath, constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

// Improved from https://stackoverflow.com/a/45130990
export async function* getFilesRecursively(directory: string): AsyncGenerator<string, void> {
    for await (const entry of await promises.opendir(directory)) {
        const resolved = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            yield* getFilesRecursively(resolved);
        } else {
            yield resolved;
        }
    }
}
