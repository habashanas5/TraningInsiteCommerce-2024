import { emptyGuid, newGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";
import logger from "@insite/client-framework/Logger";
import { getNodeIdForPageName } from "@insite/client-framework/Services/ContentService";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { TemplateInfo } from "@insite/client-framework/Types/SiteGenerationModel";
import { existsAsync, getAppDataPath, getBlueprintAppDataPath } from "@insite/server-framework/FileHelper";
import { getAutoUpdateData, getSiteGenerationData, saveInitialPages } from "@insite/server-framework/InternalService";
import { GenerateDataResponse } from "@insite/server-framework/PageRenderer";
import { getPageCreators, PageCreator } from "@insite/server-framework/SiteGeneration/PageCreators";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import { createHash } from "crypto";
import { promises, readFile } from "fs";
import { promisify } from "util";

// Mobile pages/widgets aren't immediately loaded by client-framework so they're not included in the storefront bundle.
// Instead, they're added at shell startup (for the shell front end), shell-storefront connection, and here.
addPagesFromContext(require.context("../../client-framework/src/Internal/Pages", true, /\.tsx$/));
addWidgetsFromContext(require.context("../../client-framework/src/Internal/Widgets", true, /\.tsx$/));

// the new bundle splitting doesn't include all widgets in the bundle, but we want them for site generation
addWidgetsFromContext(require.context("../../content-library/src/Widgets", true, /\.tsx$/));

const readFileAsync = promisify(readFile);

export async function generateSiteIfNeeded(): Promise<GenerateDataResponse | undefined> {
    const siteGenerationData = await getSiteGenerationData();
    if (siteGenerationData.cmsType === "Classic") {
        return { websiteIsClassic: true };
    }

    const pageGenerationSettings: PageGenerationSettings = { ...siteGenerationData, pages: [] };
    const { pageTypeToNodeId } = pageGenerationSettings;

    const pageCreators = await getPageCreators();
    for (const pageCreator of pageCreators) {
        const existingNodeId = pageTypeToNodeId[pageCreator.type.toLowerCase()];
        if (existingNodeId && !pageCreator.autoUpdate) {
            continue;
        }

        let parentId: string | undefined = emptyGuid;
        if (pageCreator.parentType) {
            parentId = pageTypeToNodeId[pageCreator.parentType.toLowerCase()];
            if (!parentId) {
                logOrThrow(
                    `The pageCreator for ${pageCreator.type} specified a parentType of ${pageCreator.parentType} but that page was not found.`,
                );
                continue;
            }
        }

        await addPage(pageCreator, parentId, 0, pageGenerationSettings);
    }

    const { pages } = pageGenerationSettings;

    if (pages.length === 0) {
        return;
    }

    let pagesString = JSON.stringify(pages);

    const typeRegex = /nodeIdForType\('([a-zA-Z 0-9]+)'\)/g;
    let match = typeRegex.exec(pagesString);
    while (match != null) {
        const fullThing = match[0];
        const pageType = match[1];
        const nodeId = pageTypeToNodeId[pageType.toLowerCase()];
        if (typeof nodeId === "undefined") {
            logOrThrow(`A page template specified ${fullThing} but there was no page found for the type ${pageType}.`);
            return;
        }
        pagesString = pagesString.replace(fullThing, nodeId);

        match = typeRegex.exec(pagesString);
    }

    const nameToGuidMap: SafeDictionary<string> = {};
    for (const page of pages) {
        nameToGuidMap[page.name] = page.nodeId;
    }

    const nameRegex = /nodeIdFor\('([a-zA-Z 0-9]+)'\)/g;
    match = nameRegex.exec(pagesString);
    while (match != null) {
        const fullThing = match[0];
        const pageName = match[1];
        let pageKey = nameToGuidMap[pageName];
        if (typeof pageKey === "undefined") {
            pageKey = await getNodeIdForPageName(pageName);
            if (pageKey === emptyGuid) {
                logOrThrow(
                    `A page template specified ${fullThing} but there was no page found for the name ${pageName}`,
                );
                return;
            }
        }
        pagesString = pagesString.replace(fullThing, pageKey);

        match = nameRegex.exec(pagesString);
    }

    await saveInitialPages(JSON.parse(pagesString));
}

interface PageGenerationSettings {
    pages: PageModel[];
    defaultLanguage: BasicLanguageModel;
    defaultPersonaId: string;
    websiteId: string;
    pageTypeToNodeId: SafeDictionary<string>;
}

async function addPage(
    pageCreator: PageCreator,
    parentId: string,
    sortOrder: number,
    pageGenerationSettings: PageGenerationSettings,
) {
    const pageModel = await setupPage(pageCreator, parentId, sortOrder, pageGenerationSettings);
    if (!pageModel) {
        return;
    }
    await addChildPages(pageCreator, pageModel, pageGenerationSettings);
}

async function addChildPages(
    pageCreator: PageCreator,
    parentPageModel: PageModel,
    pageGenerationSettings: PageGenerationSettings,
) {
    if (!pageCreator.pages) {
        return;
    }

    let childSortOrder = 0;
    for (const page of pageCreator.pages) {
        await addPage(page, parentPageModel.nodeId, childSortOrder, pageGenerationSettings);
        childSortOrder = childSortOrder + 1;
    }
}

export async function getTemplatePathsForPageType(pageType: string) {
    const directoryPathsToCheck = [
        `${getBlueprintAppDataPath()}/PageTemplates/${pageType}/`,
        `${getAppDataPath()}/PageTemplates/${BLUEPRINT_NAME}/${pageType}/`,
        `${getAppDataPath()}/PageTemplates/BuiltIn/${pageType}/`,
    ];

    const paths: TemplateInfo[] = [];
    for (const directoryPath of directoryPathsToCheck) {
        if (await existsAsync(directoryPath)) {
            const files = await promises.readdir(directoryPath);
            files.forEach(file => {
                paths.push({
                    fullPath: directoryPath + file,
                    name: file.split(".")[0],
                });
            });
        }
    }

    paths.sort((a, b) => a.name.localeCompare(b.name));

    return paths;
}

export function getTemplatePathForPageType(pageType: string) {
    return getTemplatePath(`${pageType}/Standard.json`);
}

async function getTemplatePath(template: string) {
    const filePathsToCheck = [
        `${getBlueprintAppDataPath()}/PageTemplates/${template}`,
        `${getAppDataPath()}/PageTemplates/${BLUEPRINT_NAME}/${template}`,
        `${getAppDataPath()}/PageTemplates/BuiltIn/${template}`,
    ];

    for (const potentialFilePath of filePathsToCheck) {
        if (await existsAsync(potentialFilePath)) {
            return {
                templatePath: potentialFilePath,
                checkedFilePaths: filePathsToCheck,
            };
        }
    }

    return {
        checkedFilePaths: filePathsToCheck,
    };
}

async function setupPage(
    pageCreator: PageCreator,
    parentNodeId: string,
    sortOrder: number,
    pageGenerationSettings: PageGenerationSettings,
): Promise<PageModel | undefined> {
    const template = pageCreator.template ?? `${pageCreator.type}/Standard.json`;
    const { templatePath, checkedFilePaths } = await getTemplatePath(template);

    if (!templatePath) {
        logOrThrow(
            `The pageCreator for ${
                pageCreator.type
            } had a template of ${template} which could not be found at any of the following paths \n${checkedFilePaths.join(
                "\n",
            )}`,
        );
        return;
    }
    let pageModel;
    try {
        const text = await readFileAsync(templatePath, "utf8");
        pageModel = JSON.parse(text);
        const hash = createHash("sha256");
        hash.update(text);
        pageModel.templateHash = hash.digest("hex");
    } catch (ex) {
        logOrThrow(`There was a failure parsing the json at ${templatePath} - ${ex.message}`);
        return;
    }
    if (pageCreator.type !== pageModel.type) {
        logOrThrow(
            `The pageCreator with the type of ${pageCreator.type} used a template at ${template}. That template was for a page type of ${pageModel.type} so the page was not created.`,
        );
        return;
    }

    const { pages, defaultLanguage, defaultPersonaId, websiteId, pageTypeToNodeId } = pageGenerationSettings;
    let nodeId;
    let pageId;

    if (pageCreator.autoUpdate) {
        nodeId = pageTypeToNodeId[pageModel.type.toLowerCase()];
        if (nodeId) {
            const autoUpdateData = await getAutoUpdateData(nodeId);
            if (autoUpdateData?.templateHash === pageModel.templateHash) {
                return;
            }
            pageId = autoUpdateData?.pageId;
        }
    }

    setupPageModel(
        pageModel,
        pageCreator.name,
        pageCreator.urlSegment,
        parentNodeId,
        sortOrder,
        defaultLanguage,
        defaultPersonaId,
        defaultPersonaId,
        websiteId,
        false,
        nodeId,
        pageId,
    );

    if (pageCreator.type === "Page" && pageCreator.excludeFromNavigation) {
        pageModel.generalFields["excludeFromNavigation"] = true;
    }

    pages.push(pageModel);
    pageTypeToNodeId[pageModel.type.toLowerCase()] = pageModel.nodeId;

    return pageModel;
}

const logOrThrow = (message: string) => {
    if (!IS_PRODUCTION) {
        throw new Error(message);
    }
    logger.error(message);
};
