import ContentMode, {
    contentModeCookieName,
    contentModeSignatureCookieName,
    isMobileAppCookieName,
    isSiteInShellCookieName,
} from "@insite/client-framework/Common/ContentMode";
import { getCookie, removeCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SettingsModel } from "@insite/client-framework/Services/SettingsService";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { adminAccessTokenName } from "@insite/shell/Services/AccessTokenService";
import { ShellContextState } from "@insite/shell/Store/ShellContext/ShellContextState";
import { Draft } from "immer";

const initialState: ShellContextState = {
    languages: [],
    languagesById: {},
    personas: [],
    personasById: {},
    deviceTypes: [],
    currentLanguageId: emptyGuid,
    defaultLanguageId: emptyGuid,
    currentPersonaId: emptyGuid,
    defaultPersonaId: emptyGuid,
    currentDeviceType: "Desktop",
    websiteId: emptyGuid,
    stageMode: getCookie(isMobileAppCookieName) === "true" ? "Phone" : "Desktop",
    contentMode: getStoredContentMode(),
    homePageId: emptyGuid,
    mobileHomePageId: emptyGuid,
    settings: {} as SettingsModel,
    cmsType: "",
    searchDataModeActive: false,
    mobileCmsModeActive: getCookie(isMobileAppCookieName) === "true",
};

function getStoredContentMode() {
    let contentMode = "Viewing";
    // we can't retrieve a cookie when the state is initialized during SSR but we don't support SSR for the shell so we don't need to.
    if (IS_SERVER_SIDE) {
        return contentMode as ContentMode;
    }

    const storedContentMode = getCookie(contentModeCookieName);
    if (
        storedContentMode &&
        (storedContentMode === "Viewing" || storedContentMode === "Editing" || storedContentMode === "Reviewing")
    ) {
        contentMode = storedContentMode;
    }
    return contentMode as ContentMode;
}

const reducer = {
    "ShellContext/CompleteLoadShellContext": (
        draft: Draft<ShellContextState>,
        action: Pick<
            ShellContextState,
            | "languages"
            | "personas"
            | "deviceTypes"
            | "defaultLanguageId"
            | "currentLanguageId"
            | "defaultPersonaId"
            | "websiteId"
            | "cmsType"
            | "homePageId"
            | "mobileHomePageId"
            | "enableMobileCms"
            | "settings"
        >,
    ) => {
        draft.languages = action.languages;
        draft.personas = action.personas;
        draft.deviceTypes = action.deviceTypes;
        draft.defaultLanguageId = action.defaultLanguageId;
        draft.currentLanguageId = action.currentLanguageId;
        draft.currentPersonaId = action.defaultPersonaId;
        draft.defaultPersonaId = action.defaultPersonaId;
        draft.websiteId = action.websiteId;
        draft.cmsType = action.cmsType;
        draft.homePageId = action.homePageId;
        draft.mobileHomePageId = action.mobileHomePageId;
        draft.enableMobileCms = action.enableMobileCms;
        draft.settings = action.settings;

        const languagesById: ShellContextState["languagesById"] = {};
        const personasById: ShellContextState["personasById"] = {};

        for (const language of action.languages) {
            languagesById[language.id] = language;
        }

        for (const persona of action.personas) {
            personasById[persona.id] = persona;
        }

        draft.languagesById = languagesById;
        draft.personasById = personasById;
    },

    "Data/Pages/CompleteChangeContext": (
        draft: Draft<ShellContextState>,
        action: {
            languageId: string;
            personaId: string;
            deviceType: DeviceType;
            defaultLanguageId: string;
            permissions: PermissionsModel;
        },
    ) => {
        draft.currentLanguageId = action.languageId;
        draft.currentPersonaId = action.personaId;
        draft.currentDeviceType = action.deviceType;
        if (action.permissions) {
            draft.permissions = action.permissions;
        }
    },

    "ShellContext/ChangeStageMode": (draft: Draft<ShellContextState>, action: Pick<ShellContextState, "stageMode">) => {
        draft.stageMode = action.stageMode;
    },

    "ShellContext/LogOut": (draft: Draft<ShellContextState>) => {
        clearCookiesAndStorage();
    },

    "ShellContext/ToggleMobileCmsMode": (draft: Draft<ShellContextState>) => {
        if (draft.mobileCmsModeActive) {
            removeCookie(isMobileAppCookieName);
            draft.mobileCmsModeActive = false;
            draft.stageMode = "Desktop";
        } else {
            setCookie(isMobileAppCookieName, "true");
            draft.mobileCmsModeActive = true;
            draft.stageMode = "Phone";
        }
    },

    "ShellContext/SetContentMode": (draft: Draft<ShellContextState>, action: { contentMode: ContentMode }) => {
        draft.contentMode = action.contentMode;
    },

    "ShellContext/ToggleSearchDataModeActive": (draft: Draft<ShellContextState>) => {
        draft.searchDataModeActive = !draft.searchDataModeActive;

        sendToSite({ type: "SearchDataModeActive", active: draft.searchDataModeActive });
    },
};

export const clearCookiesAndStorage = () => {
    removeCookie(isSiteInShellCookieName);
    removeCookie(contentModeCookieName);
    removeCookie(contentModeSignatureCookieName);
    removeCookie(adminAccessTokenName);
    window.localStorage.setItem(adminAccessTokenName, "");
};

export default createTypedReducerWithImmer(initialState, reducer);
