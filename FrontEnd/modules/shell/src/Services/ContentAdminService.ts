import ContentMode from "@insite/client-framework/Common/ContentMode";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { SettingsModel } from "@insite/client-framework/Services/SettingsService";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { convertToContentAdminEndpoint } from "@insite/shell/Services/ConvertToContentAdminEndpoints";
import {
    get as baseGet,
    post as basePost,
    postVoid as basePostVoid,
    requestJson as baseRequestJson,
} from "@insite/shell/Services/ServiceBase";
import { SelectBrandModel, SelectCategoryModel } from "@insite/shell/Store/PageEditor/PageEditorState";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { LanguageModel, PersonaModel } from "@insite/shell/Store/ShellContext/ShellContextState";

export const get = convertToContentAdminEndpoint(baseGet, "contentAdmin");
export const post = convertToContentAdminEndpoint(basePost, "contentAdmin");
export const postVoid = convertToContentAdminEndpoint(basePostVoid, "contentAdmin");
export const requestJson = convertToContentAdminEndpoint(baseRequestJson, "contentAdmin");

export const getPageStates = (filters: TreeFilterModel[]) =>
    requestJson<PageStateModel[]>(
        "pageStates",
        "POST",
        { "Content-Type": "application/json" },
        filters ? JSON.stringify(filters) : undefined,
    );

export const getTreeFilters = (query: string) => get<TreeFilterCollectionModel>("treeFilters", { query });

// TODO ISC-12644 - This limited response yields a poor UX.
export type SavePageResponseModel = {
    duplicatesFound?: true;
};

export type DeletePageResponseModel = {
    layoutInUse?: true;
};

export const savePage = (page: PageModel, isVariant: boolean) =>
    post<SavePageResponseModel>(`savePage?isVariant=${isVariant}`, page);

export const addPage = (page: PageModel, isVariant: boolean) =>
    post<SavePageResponseModel>(`addPage?isVariant=${isVariant}`, page);

export const makeDefaultVariant = (pageId: string) => post("makeDefaultVariant", pageId);

export const deletePage = (nodeId: string) => post<DeletePageResponseModel>(`deletePage/${nodeId}`);

export const deleteVariant = (nodeId: string, pageId: string) =>
    requestJson(`deleteVariant/${nodeId}/page/${pageId}`, "POST");

export const getCategories = () => get<SelectCategoryModel[]>("categories");

export const getBrands = () => get<SelectBrandModel[]>("brands");

export const getShellContext = () =>
    get<{
        languages: LanguageModel[];
        personas: PersonaModel[];
        defaultPersonaId: string;
        deviceTypes: DeviceType[];
        defaultLanguageId: string;
        currentLanguageId: string;
        websiteId: string;
        cmsType: string;
        homePageId: string;
        mobileHomePageId: string;
        adminClientId: string;
        adminClientSecret: string;
        permissions: PermissionsModel;
        enableMobileCms: boolean;
        settings: SettingsModel;
    }>("shellcontext");

export const updateShellContext = (languageId: string, personaId: string, deviceType: DeviceType) =>
    post(
        `updateshellcontext?languageId=${encodeURIComponent(languageId)}&personaId=${encodeURIComponent(
            personaId,
        )}&deviceType=${encodeURIComponent(deviceType)}`,
    );

export const getReorderingPages = (nodeId?: string) =>
    get<{
        rootNodeId: string;
        pageReorderingModels: PageReorderModel[];
    }>("reorderingPages", { nodeId });

export const saveReorderPages = (pages: PageReorderModel[]) => post<SavePageResponseModel>("saveReorderPages", pages);

export const getPagePublishInfo = async (pageId: string) => {
    const model = await post<PagePublishInfoModel>("getPagePublishInfo", pageId);
    return cleanPagePublishInfoModel(model);
};

export const getPageBulkPublishInfo = async () => {
    const models = await get<PagePublishInfoModel[]>("getPageBulkPublishInfo");
    const result: PagePublishInfo[] = [];
    models.forEach(o => cleanPagePublishInfoModel(o, result));
    return result;
};

export const getPublishedPageVersions = (pageId: string, page: number, pageSize: number) =>
    get<{
        pageVersions: PageVersionInfoModel[];
        totalItemCount: number;
    }>("getPublishedPageVersions", { pageId, page, pageSize });

export const restorePageVersion = (pageVersionId: string) =>
    post<RestorePageVersionModel>("restorePageVersion", pageVersionId);

function cleanPagePublishInfoModel(model: PagePublishInfoModel, result?: PagePublishInfo[]) {
    const realResult = result ?? [];

    model?.unpublishedContexts?.forEach(o => {
        realResult.push({
            ...o,
            pageId: model.pageId,
            name: model.name,
            unpublished: model.unpublished,
            published: model.published,
            isVariant: model.isVariant,
            isDefaultVariant: model.isDefaultVariant,
        });
    });

    return realResult;
}

export const publishPages = (publishInfo: {
    pages: { pageId: string; contexts?: ContentContextModel[] }[];
    futurePublish: boolean;
    publishOn?: Date;
    rollbackOn?: Date;
}) => post<PublishResultModel>("publishPages", publishInfo);

export const switchContentMode = (contentMode: ContentMode) => post("switchContentMode", contentMode);

export const saveTheme = (theme: Partial<BaseTheme>) => postVoid("saveTheme", theme);

export const exportContent = (onlyPublished: boolean) => post<string>(`exportContent?onlyPublished=${onlyPublished}`);

export type ContentContextModel = {
    languageId: string;
    personaId: string;
    deviceType: DeviceType;
};

export type PublishableContentContextModel = ContentContextModel & {
    modifiedOn: string;
    modifiedBy: string;
    publishOn: string;
    futurePublishOn: string;
    rollbackOn: string;
    isWaitingForApproval: boolean;
};

export type PageVersionInfoModel = {
    versionId: string;
    modifiedOn: string;
    publishOn: string;
    modifiedBy: string;
    publishedBy: string;
};

export type PagePublishInfoModel = {
    pageId: string;
    name: string;
    isVariant: boolean;
    isDefaultVariant: boolean;
    unpublishedContexts: PublishableContentContextModel[];
    unpublished?: Omit<PageVersionInfoModel, "publishOn">;
    published?: PageVersionInfoModel;
};

export type PublishedPageVersionsModel = {
    pageVersions: PageVersionInfoModel[];
    page: number;
    totalItemCount: number;
};

export type RestorePageVersionModel = {
    success: boolean;
};

export type PagePublishInfo = PublishableContentContextModel &
    Pick<PagePublishInfoModel, "pageId" | "name" | "unpublished" | "published" | "isVariant" | "isDefaultVariant">;

export type PublishResultModel = {
    success: boolean;
    errorInfos: PublishPageErrorInfo[];
};

export type PublishPageErrorInfo = {
    pageId: string;
    errorMessage: string;
};

export const getPageStateFromDictionaries = (
    pageId: string,
    ...treeNodeModelDictionaries: SafeDictionary<TreeNodeModel[]>[]
) => {
    for (const treeNodeModelDictionary of treeNodeModelDictionaries) {
        for (const parentId in treeNodeModelDictionary) {
            const pageStates = treeNodeModelDictionary[parentId];
            if (!pageStates) {
                continue;
            }
            for (const pageState of pageStates) {
                if (pageState.pageId === pageId) {
                    return pageState;
                }
            }
        }
    }

    return null;
};

export const getPageState = (pageId: string, ...treeNodeModels: TreeNodeModel[][]) => {
    for (const pageStates of treeNodeModels) {
        if (!pageStates) {
            continue;
        }

        for (const pageState of pageStates) {
            if (pageState.pageId === pageId) {
                return pageState;
            }
        }
    }

    return null;
};

export interface TreeFilterCollectionModel {
    filters: TreeFilterModel[];
    totalResults: number;
}

export interface TreeFilterModel {
    key: string;
    type: string;
    value: string;
}

export interface PageStateModel {
    pageId?: string;
    parentNodeId?: string;
    path: string;
    sortOrder: number;
    displayName: string;
    nodeId: string;
    attributes: PageStateModelAttribute[];
    type: string;
    futurePublishOn: string;
    isWaitingForApproval: boolean;
    variantName: string;
    isDefaultVariant: boolean;
    isShared: boolean;
    allowedForPageType: string;
    isDraftPage: boolean;
    neverPublished: boolean;
}

export type PageStateModelAttribute = "NonMatching";

export interface PageReorderModel {
    id: string;
    parentId: string;
    name: string;
    sortOrder: number;
    pageId?: string;
    variantName?: string;
    isVariant: boolean;
}
