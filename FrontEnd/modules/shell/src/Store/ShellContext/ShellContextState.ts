import ContentMode from "@insite/client-framework/Common/ContentMode";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { SettingsModel } from "@insite/client-framework/Services/SettingsService";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

export interface LanguageModel extends BasicLanguageModel {
    description: string;
}

export interface PersonaModel {
    id: string;
    name: string;
}

export interface ShellContextState {
    websiteId: string;
    cmsType: string;
    currentLanguageId: string;
    defaultLanguageId: string;
    currentPersonaId: string;
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
    languages: LanguageModel[];
    languagesById: Dictionary<LanguageModel | undefined>;
    personas: PersonaModel[];
    personasById: Dictionary<PersonaModel | undefined>;
    deviceTypes: DeviceType[];
    stageMode: DeviceType;
    contentMode: ContentMode;
    homePageId: string;
    mobileHomePageId: string;
    permissions?: PermissionsModel;
    settings: SettingsModel;

    /** When true, the CMS can be switched into mobile mode. */
    enableMobileCms?: boolean;

    /** When true, the CMS is controlling the UI for the mobile app instead of the website. */
    mobileCmsModeActive: boolean;

    /** When true, the product list shows search score data. */
    searchDataModeActive: boolean;
}
