import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { Category } from "@insite/client-framework/Services/CategoryService";
import {
    GetProductCollectionApiV2Parameter,
    GetRelatedProductCollectionApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import loadProductInfoList from "@insite/client-framework/Store/Components/ProductInfoList/Handlers/LoadProductInfoList";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { BrandModel } from "@insite/client-framework/Types/ApiModels";

interface Parameter {
    carouselId: string;
    carouselType: string;
    relatedProductType: string;
    seedWithManuallyAssigned: string;
    displayProductsFrom: string;
    selectedCategoryIds: string[];
    numberOfProductsToDisplay: number;
    isProductDetailsPage: boolean;
    productId?: string;
    isProductListPage: boolean;
    category?: Category;
    isBrandDetailsPage: boolean;
    brand?: BrandModel;
}

interface Props {
    getProductCollectionParameter?: GetProductCollectionApiV2Parameter | GetRelatedProductCollectionApiV2Parameter;
    extraProductCollectionParameter?: GetProductCollectionApiV2Parameter | GetRelatedProductCollectionApiV2Parameter;
}

type HandlerType = Handler<Parameter, Props>;

export const recentlyViewedGetProductCollectionParameter:
    | GetProductCollectionApiV2Parameter
    | GetRelatedProductCollectionApiV2Parameter = {
    filter: "recentlyViewed",
    pageSize: 999,
};

export const LoadRecentlyViewed: HandlerType = props => {
    const {
        parameter: { carouselType, isProductDetailsPage, productId },
    } = props;
    if (carouselType !== "recentlyViewed" || (isProductDetailsPage && !productId)) {
        return;
    }

    props.getProductCollectionParameter = recentlyViewedGetProductCollectionParameter;
};

export const LoadCrossSells: HandlerType = props => {
    const {
        parameter: { carouselType },
    } = props;
    if (carouselType !== "crossSells") {
        return;
    }

    props.getProductCollectionParameter = { filter: "siteCrosssells", pageSize: 999 };
};

export const LoadRelatedProducts: HandlerType = props => {
    const {
        parameter: { carouselType, relatedProductType, productId },
    } = props;
    if (carouselType !== "relatedProducts" || !productId || !relatedProductType) {
        return;
    }

    props.getProductCollectionParameter = { productId, relationship: relatedProductType, pageSize: 999 };
};

export const LoadCustomersAlsoPurchased: HandlerType = props => {
    const {
        parameter: {
            carouselType,
            numberOfProductsToDisplay,
            seedWithManuallyAssigned,
            isProductDetailsPage,
            productId,
        },
        getState,
    } = props;

    if (carouselType !== "customersAlsoPurchased") {
        return;
    }

    if (!getSettingsCollection(getState()).websiteSettings.enableDynamicRecommendations) {
        return;
    }

    if (isProductDetailsPage) {
        if (!productId) {
            return;
        }

        props.getProductCollectionParameter = {
            pageSize: numberOfProductsToDisplay,
            filter: "alsoPurchased",
        };

        if (seedWithManuallyAssigned) {
            props.extraProductCollectionParameter = {
                productId,
                pageSize: numberOfProductsToDisplay,
                relationship: seedWithManuallyAssigned,
            };
        }
    } else {
        props.getProductCollectionParameter = {
            cartId: API_URL_CURRENT_FRAGMENT,
            pageSize: numberOfProductsToDisplay,
            filter: "alsoPurchased",
        };
    }
};

export const LoadTopSellers: HandlerType = props => {
    const {
        parameter: {
            carouselType,
            numberOfProductsToDisplay,
            displayProductsFrom,
            selectedCategoryIds,
            isProductListPage,
            category,
            isBrandDetailsPage,
            brand,
        },
        getState,
    } = props;

    if (carouselType !== "topSellers") {
        return;
    }

    const state = getState();
    if (!getSettingsCollection(state).websiteSettings.enableDynamicRecommendations) {
        return;
    }

    const brandIds = isBrandDetailsPage && brand ? [brand.id] : [];

    let topSellersCategoryIds: string[] | undefined;
    let topSellersPersonaIds: string[] | undefined;
    if (displayProductsFrom === "allCategories") {
        topSellersCategoryIds = isProductListPage && category ? [category.id] : undefined;
    } else if (displayProductsFrom === "selectedCategories") {
        topSellersCategoryIds = selectedCategoryIds || [];
    } else if (displayProductsFrom === "customerSegments") {
        topSellersPersonaIds = state.context.session.personas?.map(o => o.id);
    }

    if (isProductListPage && (!topSellersCategoryIds || topSellersCategoryIds.length === 0) && brandIds.length === 0) {
        return;
    }

    props.getProductCollectionParameter = {
        topSellersCategoryIds,
        topSellersPersonaIds,
        pageSize: numberOfProductsToDisplay,
        brandIds,
        makeBrandUrls: brandIds.length > 0,
        filter: "topSellers",
    };
};

export const LoadFeaturedCategory: HandlerType = props => {
    const {
        parameter: { carouselType, isProductListPage, category },
    } = props;

    if (carouselType !== "featuredCategory") {
        return;
    }

    if (!isProductListPage || !category) {
        return;
    }

    props.getProductCollectionParameter = { categoryId: category.id, pageSize: 3 };
};

export const LoadProducts: HandlerType = props => {
    if (!props.getProductCollectionParameter) {
        return;
    }

    const extraProductOptions = props.extraProductCollectionParameter
        ? {
              getProductCollectionParameter: props.extraProductCollectionParameter,
              numberOfProductsToDisplay: props.parameter.numberOfProductsToDisplay,
          }
        : undefined;

    const isRecentlyViewedOnPDP =
        props.parameter.carouselType === "recentlyViewed" && props.parameter.isProductDetailsPage;

    props.dispatch(
        loadProductInfoList({
            id: props.parameter.carouselId,
            getProductCollectionParameter: props.getProductCollectionParameter,
            extraProductOptions,
            excludeProductId: isRecentlyViewedOnPDP ? props.parameter.productId : undefined,
            forceLoad: isRecentlyViewedOnPDP,
        }),
    );
};

export const chain = [
    LoadRecentlyViewed,
    LoadCrossSells,
    LoadRelatedProducts,
    LoadCustomersAlsoPurchased,
    LoadTopSellers,
    LoadFeaturedCategory,
    LoadProducts,
];

const loadCarouselProducts = createHandlerChainRunner(chain, "LoadCarouselProducts");
export default loadCarouselProducts;
