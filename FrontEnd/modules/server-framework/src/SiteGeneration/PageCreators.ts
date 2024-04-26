import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import logger from "@insite/client-framework/Logger";
import {
    existsAsync,
    getAppDataPath,
    getBlueprintAppDataPath,
    getFilesRecursively,
} from "@insite/server-framework/FileHelper";
import { Request, Response } from "express";
import { readFile } from "fs";
import { relative } from "path";
import { promisify } from "util";

const readFileAsync = promisify(readFile);

export interface PageCreator {
    type: string;
    name: string;
    template: string;
    urlSegment: string;
    excludeFromNavigation?: boolean;
    pages?: PageCreator[];
    parentType: string;
    autoUpdate?: boolean;
}

let autoUpdatedPageTypes: string[] | undefined;

export async function getAutoUpdatedPageTypes(request: Request, response: Response) {
    if (!autoUpdatedPageTypes) {
        await getPageCreators();
    }

    response.json({
        autoUpdatedPageTypes,
    });
}

export async function getPageCreators() {
    autoUpdatedPageTypes = [];
    const pageCreatorsByParent: Dictionary<PageCreator[]> = {};
    await loadPageCreators(`${getBlueprintAppDataPath()}/PageCreators`, pageCreatorsByParent);
    await loadPageCreators(`${getAppDataPath()}/PageCreators/${BLUEPRINT_NAME}`, pageCreatorsByParent);
    await loadPageCreators(`${getAppDataPath()}/PageCreators/BuiltIn`, pageCreatorsByParent);

    const types: string[] = [];
    types.push("");

    const addChildTypes = (pages: PageCreator[] | undefined) => {
        if (!pages) {
            return;
        }
        for (const page of pages) {
            types.push(page.type);
            addChildTypes(page.pages);
        }
    };

    const pageCreators = [];
    while (types && types.length > 0) {
        const parentType = types.shift() as string;
        const thePageCreators = pageCreatorsByParent[parentType];
        if (!thePageCreators) {
            continue;
        }
        for (const pageCreator of thePageCreators) {
            if (pageCreator.autoUpdate) {
                autoUpdatedPageTypes.push(pageCreator.type);
            }
            pageCreators.push(pageCreator);
            types.push(pageCreator.type);
            addChildTypes(pageCreator.pages);
        }
    }

    return pageCreators;
}

export async function loadPageCreators(pageCreatorsPath: string, pageCreatorsByParent: SafeDictionary<PageCreator[]>) {
    if (!(await existsAsync(pageCreatorsPath))) {
        return;
    }

    for await (const filePath of getFilesRecursively(pageCreatorsPath)) {
        const file = relative(pageCreatorsPath, filePath).replace("\\", "/"); // Normalize directory separator to Unix format.;

        if (!filePath.endsWith(".json")) {
            logOrThrow(`The file at ${filePath} did not end with .json and it needs to.`);
        }
        let pageCreator;
        try {
            pageCreator = JSON.parse(await readFileAsync(filePath, "UTF8")) as PageCreator;
        } catch (ex) {
            logOrThrow(`There was a failure parsing the json at ${filePath} - ${ex.message}`);
            continue;
        }

        if (!pageCreator.type) {
            pageCreator.type = file.replace(".json", "");
        }

        if (!pageCreator.name) {
            logOrThrow(`The pageCreator at ${filePath} did not contain a value for "name"`);
            continue;
        }
        if (pageCreator.parentType === pageCreator.type) {
            logOrThrow(
                `The pageCreator at ${filePath} had a "parentType" of "${pageCreator.parentType}" which matches the type it is trying to create.`,
            );
        }
        if (
            !pageCreator.parentType &&
            pageCreator.type !== "HomePage" &&
            pageCreator.type !== "Header" &&
            pageCreator.type !== "Footer" &&
            !pageCreator.type.startsWith("Mobile/") &&
            pageCreator.type !== "RobotsTxtPage"
        ) {
            logOrThrow(`The pageCreator at ${filePath} did not contain a value for "parentType"`);
            continue;
        }

        const parentType = pageCreator.parentType ?? "";
        let pageCreatorsByParentType = pageCreatorsByParent[parentType];
        if (!pageCreatorsByParentType) {
            pageCreatorsByParent[parentType] = pageCreatorsByParentType = [];
        }

        pageCreatorsByParentType.push(pageCreator);
    }
}

const logOrThrow = (message: string) => {
    if (!IS_PRODUCTION) {
        throw new Error(message);
    }
    logger.error(message);
};
