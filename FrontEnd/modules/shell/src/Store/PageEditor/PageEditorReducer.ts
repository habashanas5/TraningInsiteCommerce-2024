import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SavePageResponseModel } from "@insite/shell/Services/ContentAdminService";
import {
    BrandSearchModel,
    CategorySearchModel,
    PageEditorState,
    ProductSearchModel,
    SelectBrandModel,
    SelectCategoryModel,
} from "@insite/shell/Store/PageEditor/PageEditorState";
import { Draft } from "immer";

const initialState: PageEditorState = {
    displayPageTemplateModal: false,
};

const reducer = {
    "PageEditor/LayoutUpdated": (draft: Draft<PageEditorState>, { id }: { id: string }) => {
        if (!draft.updatedLayoutIds) {
            draft.updatedLayoutIds = {};
        }
        draft.updatedLayoutIds[id] = true;
    },

    "PageEditor/LayoutUpdatedReset": (draft: Draft<PageEditorState>) => {
        delete draft.updatedLayoutIds;
    },

    "PageEditor/OpenPageTemplateModal": (
        draft: Draft<PageEditorState>,
        { generatedPageTemplate }: { generatedPageTemplate: string },
    ) => {
        draft.displayPageTemplateModal = true;
        draft.generatedPageTemplate = generatedPageTemplate;
    },

    "PageEditor/ClosePageTemplateModel": (draft: Draft<PageEditorState>) => {
        draft.displayPageTemplateModal = false;
        draft.generatedPageTemplate = undefined;
    },

    "PageEditor/EditItem": (
        draft: Draft<PageEditorState>,
        action: {
            item: PageProps | WidgetProps;
            id: string;
            removeIfCanceled?: boolean;
            isNewPage?: boolean;
            isVariant?: boolean;
        },
    ) => {
        draft.itemBeforeEditing = action.item;
        draft.editingId = action.id;
        draft.isEditingNewPage = action.isNewPage;
        draft.isEditingVariant = action.isVariant;
        draft.removeItemIfCanceled = action.removeIfCanceled;
    },

    "PageEditor/DoneEditingItem": (draft: Draft<PageEditorState>) => {
        delete draft.editingId;
        delete draft.isEditingNewPage;
        delete draft.isEditingVariant;
    },

    "PageEditor/CancelEditingItem": (draft: Draft<PageEditorState>) => {
        delete draft.editingId;
        delete draft.itemBeforeEditing;
        delete draft.isEditingNewPage;
        delete draft.isEditingVariant;
    },

    "PageEditor/SelectProduct": (draft: Draft<PageEditorState>, action: { productPath: string }) => {
        draft.selectedProductPath = action.productPath;
    },

    "PageEditor/SelectCategory": (draft: Draft<PageEditorState>, action: { categoryPath: string }) => {
        draft.selectedCategoryPath = action.categoryPath;
    },

    "PageEditor/SelectBrand": (draft: Draft<PageEditorState>, action: { brandPath: string }) => {
        draft.selectedBrandPath = action.brandPath;
    },

    "PageEditor/CompleteProductSearch": (
        draft: Draft<PageEditorState>,
        action: { productSearchResults: ProductSearchModel[] },
    ) => {
        draft.productSearchResults = action.productSearchResults;
    },

    "PageEditor/CompleteLoadBrands": (draft: Draft<PageEditorState>, action: { brands: SelectBrandModel[] }) => {
        draft.brands = action.brands;
    },

    "PageEditor/CompleteBrandSearch": (
        draft: Draft<PageEditorState>,
        action: { brandSearchResults: BrandSearchModel[] },
    ) => {
        draft.brandSearchResults = action.brandSearchResults;
    },

    "PageEditor/CompleteLoadSelectBrands": (draft: Draft<PageEditorState>, action: { brands: SelectBrandModel[] }) => {
        draft.selectBrandsState = {
            ...draft.selectBrandsState,
            selectBrands: action.brands,
        };
    },

    "PageEditor/CompleteLoadSelectedBrands": (
        draft: Draft<PageEditorState>,
        action: { brands: SelectBrandModel[] },
    ) => {
        draft.selectBrandsState = {
            ...draft.selectBrandsState,
            selectedBrands: action.brands,
        };
    },

    "PageEditor/CompleteCategorySearch": (
        draft: Draft<PageEditorState>,
        action: { categorySearchResults: CategorySearchModel[] },
    ) => {
        draft.categorySearchResults = action.categorySearchResults;
    },

    "PageEditor/CompleteLoadCategories": (
        draft: Draft<PageEditorState>,
        action: { categories: SelectCategoryModel[] },
    ) => {
        draft.categories = action.categories;
        draft.categoryIndexByParentId = {};
        draft.categoryIndexById = {};
        for (let x = 0; x < action.categories.length; x += 1) {
            draft.categoryIndexById[action.categories[x].id] = x;
            const parentId = action.categories[x].parentId ?? emptyGuid;
            if (typeof draft.categoryIndexByParentId[parentId] === "undefined") {
                draft.categoryIndexByParentId[parentId] = [];
            }

            draft.categoryIndexByParentId[parentId].push(x);
        }

        for (let x = 0; x < draft.categories.length; x += 1) {
            const category = draft.categories[x];
            let parentId = category.parentId;
            let displayName = category.shortDescription;
            while (parentId) {
                const parent = draft.categories[draft.categoryIndexById[parentId]];
                displayName = `${parent.shortDescription} - ${displayName}`;
                parentId = parent.parentId;
            }

            category.displayName = displayName;
        }
    },

    "PageEditor/UpdateAddWidgetData": (draft: Draft<PageEditorState>, action: { data?: AddWidgetData }) => {
        draft.addWidgetData = action.data;
    },

    "PageEditor/ClearModelSelection": (draft: Draft<PageEditorState>) => {
        delete draft.productSearchResults;
        delete draft.categorySearchResults;
        delete draft.brandSearchResults;
        delete draft.selectedBrandPath;
        delete draft.selectedCategoryPath;
        delete draft.selectedProductPath;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
