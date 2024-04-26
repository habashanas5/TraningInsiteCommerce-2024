import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

export function canAddToCart(state: ApplicationState, product: ProductModel, productInfo?: ProductInfo) {
    if (!product) {
        return false;
    }

    const { allowBackOrder } = getSettingsCollection(state).productSettings;
    const availability =
        productInfo?.inventory?.inventoryAvailabilityDtos?.find(
            o => o.unitOfMeasure.toLowerCase() === (productInfo?.unitOfMeasure?.toLowerCase() || ""),
        )?.availability || undefined;
    return (
        product.canAddToCart ||
        ((state.pages.productDetails.configurationCompleted || state.pages.productDetails.variantSelectionCompleted) &&
            (allowBackOrder || (availability && availability.messageType !== 2)) &&
            !product.canConfigure)
    );
}

export function getSelectedImage(state: ApplicationState, product: ProductModel | undefined) {
    const { selectedImageIndex } = state.pages.productDetails;
    if (!product || !product.images || product.images.length <= selectedImageIndex) {
        return;
    }

    return product.images[selectedImageIndex];
}

export function isConfigurationCompleted(configurationSelection: SafeDictionary<string>) {
    const selectedConfigSectionIds = Object.keys(configurationSelection);
    return (
        selectedConfigSectionIds.length > 0 &&
        selectedConfigSectionIds.every(configSectionId => configurationSelection[configSectionId])
    );
}
