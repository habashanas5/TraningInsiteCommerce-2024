import { Dictionary } from "@insite/client-framework/Common/Types";
import { Session } from "@insite/client-framework/Services/SessionService";
import { PaymetricConfig, SettingsModel, TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import { Website } from "@insite/client-framework/Services/WebsiteService";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

export default interface ContextState {
    session: Session;
    isSessionLoaded: boolean;
    isSessionLoading?: boolean;
    punchOutSessionId?: string;
    website: Website;
    isWebsiteLoaded: boolean;
    isWebsiteLoading?: boolean;
    settings: SettingsModel;
    areSettingsLoaded: boolean;
    areSettingsLoading?: boolean;
    tokenExConfigs: Dictionary<TokenExConfig>;
    isSigningIn: boolean;
    selectedBrandPath?: string;
    selectedProductPath?: string;
    selectedCategoryPath?: string;
    permissions?: PermissionsModel;
    isErrorModalOpen?: boolean;
    isUnauthorizedError?: boolean;
    canChangePage?: boolean;
    accessToken?: string;
    addingProductToCart?: boolean;
    isSearchDataModeActive: boolean;
    paymetricConfig?: PaymetricConfig;
}
