import { AnyAction } from "@insite/client-framework/Store/Reducers";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

export const selectProduct = (productPath: string): AnyAction => ({
    type: "Context/CompleteSelectProduct",
    productPath,
});

export const selectCategory = (categoryPath: string): AnyAction => ({
    type: "Context/CompleteSelectCategory",
    categoryPath,
});

export const selectBrand = (brandPath: string): AnyAction => ({
    type: "Context/CompleteSelectBrand",
    brandPath,
});

export const setCMSPermissions = (permissions: PermissionsModel, canChangePage: boolean): AnyAction => ({
    type: "Context/CMSPermissions",
    permissions,
    canChangePage,
});

export const setSearchDataModeActive = (active: boolean): AnyAction => ({
    type: "Context/SetSearchDataModeActive",
    isSearchDataModeActive: active,
});
