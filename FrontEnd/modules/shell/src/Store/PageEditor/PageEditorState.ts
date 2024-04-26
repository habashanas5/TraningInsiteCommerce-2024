import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { ItemProps } from "@insite/client-framework/Types/PageProps";
import { SavePageResponseModel } from "@insite/shell/Services/ContentAdminService";

export interface ProductSearchModel {
    id: string;
    displayName: string;
    path: string;
}

export interface SelectCategoryModel {
    id: string;
    shortDescription: string;
    parentId?: string;
    displayName: string;
    path: string;
}

export interface SelectBrandModel {
    id: string;
    name: string;
    path: string;
}

export interface SelectBrandsState {
    selectBrands?: SelectBrandModel[];
    selectedBrands?: SelectBrandModel[];
}

export interface CategorySearchModel {
    id: string;
    displayName: string;
    path: string;
}

export interface BrandSearchModel {
    id: string;
    displayName: string;
    path: string;
}

export interface PageEditorState {
    productSearchResults?: ProductSearchModel[];
    categories?: SelectCategoryModel[];
    categorySearchResults?: CategorySearchModel[];
    categoryIndexByParentId?: Dictionary<number[]>;
    categoryIndexById?: Dictionary<number>;
    brands?: SelectBrandModel[];
    brandSearchResults?: BrandSearchModel[];
    selectBrandsState?: SelectBrandsState;
    /** only has a value if we are editing a widget/page */
    editingId?: string;
    isEditingNewPage?: boolean;
    isEditingVariant?: boolean;
    itemBeforeEditing?: ItemProps;
    removeItemIfCanceled?: boolean;
    selectedProductPath?: string;
    selectedCategoryPath?: string;
    selectedBrandPath?: string;
    displayPageTemplateModal: boolean;
    generatedPageTemplate?: string;
    addWidgetData?: AddWidgetData;
    updatedLayoutIds?: Dictionary<boolean>;
}
