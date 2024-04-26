import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { getContentByVersionPath } from "@insite/client-framework/Services/ContentService";
import { Session } from "@insite/client-framework/Services/SessionService";
import { PaymetricConfig, SettingsModel, TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import { Website } from "@insite/client-framework/Services/WebsiteService";
import ContextState from "@insite/client-framework/Store/Context/ContextState";
import { LanguageModel, PersonaModel } from "@insite/client-framework/Types/ApiModels";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { Draft } from "immer";
import assign from "lodash/assign";

const initialState: ContextState = {
    website: {} as Website,
    isWebsiteLoaded: false,
    session: {} as Session,
    isSessionLoaded: false,
    settings: {} as SettingsModel,
    areSettingsLoaded: false,
    tokenExConfigs: {},
    isSigningIn: false,
    isErrorModalOpen: false,
    isUnauthorizedError: false,
    isSearchDataModeActive: false,
};

const forcedContext = (() => {
    if (typeof window === "undefined" || window.location.pathname !== getContentByVersionPath) {
        return;
    }

    const forcedContext = parseQueryString<{
        languageId: string;
        deviceType?: DeviceType;
        personaId?: string;
    }>(window.location.search);

    return forcedContext;
})();

const reducer = {
    "Context/BeginLoadWebsite": (draft: Draft<ContextState>) => {
        draft.isWebsiteLoaded = false;
        draft.isWebsiteLoading = true;
    },
    "Context/CompleteLoadWebsite": (draft: Draft<ContextState>, action: { website: Website }) => {
        draft.website = action.website;
        draft.isWebsiteLoaded = true;
        draft.isWebsiteLoading = false;
    },
    "Context/BeginLoadSession": (draft: Draft<ContextState>) => {
        draft.isSessionLoaded = false;
        draft.isSessionLoading = true;
    },
    "Context/CompleteLoadSession": (draft: Draft<ContextState>, action: { session: Session }) => {
        if (forcedContext) {
            action.session.language = { id: forcedContext.languageId } as LanguageModel;
            action.session.deviceType = forcedContext.deviceType ?? "";
            action.session.personas = [{ id: forcedContext.personaId } as PersonaModel];
        }
        assign(draft.session, action.session);
        draft.isSessionLoaded = true;
        draft.isSessionLoading = false;
    },
    "Context/BeginLoadSettings": (draft: Draft<ContextState>) => {
        draft.areSettingsLoading = true;
        draft.areSettingsLoaded = false;
    },
    "Context/CompleteLoadSettings": (draft: Draft<ContextState>, action: { settings: SettingsModel }) => {
        draft.settings = action.settings;
        draft.areSettingsLoaded = true;
        draft.areSettingsLoading = false;
    },

    "Context/CompleteLoadTokenExConfig": (
        draft: Draft<ContextState>,
        action: { tokenExConfig: TokenExConfig; token?: string },
    ) => {
        draft.tokenExConfigs[action.token ? action.token : ""] = action.tokenExConfig;
    },
    "Context/BeginSignIn": (draft: Draft<ContextState>) => {
        draft.isSigningIn = true;
    },
    "Context/CompleteSignIn": (draft: Draft<ContextState>, action: { accessToken?: string }) => {
        draft.isSigningIn = false;
        draft.accessToken = action.accessToken;
    },
    "Context/CompleteSelectProduct": (draft: Draft<ContextState>, action: { productPath: string }) => {
        draft.selectedProductPath = action.productPath;
    },
    "Context/CompleteSelectCategory": (draft: Draft<ContextState>, action: { categoryPath: string }) => {
        draft.selectedCategoryPath = action.categoryPath;
    },
    "Context/CompleteSelectBrand": (draft: Draft<ContextState>, action: { brandPath: string }) => {
        draft.selectedBrandPath = action.brandPath;
    },
    "Context/CMSPermissions": (
        draft: Draft<ContextState>,
        action: { permissions: PermissionsModel; canChangePage: boolean },
    ) => {
        draft.permissions = action.permissions;
        draft.canChangePage = action.canChangePage;
    },
    "Context/SetErrorModalIsOpen": (draft: Draft<ContextState>, action: { isErrorModalOpen: boolean }) => {
        draft.isErrorModalOpen = action.isErrorModalOpen;
        draft.isUnauthorizedError = false;
    },
    "Context/SetErrorModalIsOpenAndUnauthorized": (
        draft: Draft<ContextState>,
        action: { isErrorModalOpen: boolean; isUnauthorizedError: boolean },
    ) => {
        draft.isErrorModalOpen = action.isErrorModalOpen;
        draft.isUnauthorizedError = action.isUnauthorizedError;
    },
    "Context/BeginAddingProductToCart": (draft: Draft<ContextState>) => {
        draft.addingProductToCart = true;
    },
    "Context/CompleteAddingProductToCart": (draft: Draft<ContextState>) => {
        draft.addingProductToCart = false;
    },
    "Context/SetIsPunchOutSessionId": (draft: Draft<ContextState>, action: { punchOutSessionId?: string }) => {
        draft.punchOutSessionId = action.punchOutSessionId;
    },
    "Context/SetSearchDataModeActive": (draft: Draft<ContextState>, action: { isSearchDataModeActive: boolean }) => {
        draft.isSearchDataModeActive = action.isSearchDataModeActive;
    },
    "Context/CompleteLoadPaymetricConfig": (
        draft: Draft<ContextState>,
        action: { paymetricConfig: PaymetricConfig },
    ) => {
        draft.paymetricConfig = action.paymetricConfig;
    },
    "Context/DeleteSession": (draft: Draft<ContextState>) => {
        draft.session = {} as Session;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
