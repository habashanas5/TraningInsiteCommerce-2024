import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { isConfigurationCompleted } from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsSelectors";
import cloneDeep from "lodash/cloneDeep";

interface Parameter {
    configSectionId?: string;
    sectionOptionId?: string;
    productId: string;
}

interface Props {
    configurationSelection: SafeDictionary<string>;
    configurationCompleted: boolean;
    productInfo?: ProductInfo;
}

type HandlerType = Handler<Parameter, Props>;

export const CopyCurrentValues: HandlerType = props => {
    const productDetail = props.getState().pages.productDetails;
    props.configurationSelection = cloneDeep(productDetail.configurationSelection);
};

export const SetConfigurationSelection: HandlerType = props => {
    if (!props.parameter.configSectionId) {
        return;
    }

    props.configurationSelection[props.parameter.configSectionId] = props.parameter.sectionOptionId;
};

export const SetConfigurationCompleted: HandlerType = props => {
    props.configurationCompleted = isConfigurationCompleted(props.configurationSelection);
};

export const SetProductInfo: HandlerType = props => {
    const state = props.getState();
    const { productInfosById } = state.pages.productDetails;
    if (!productInfosById) {
        throw new Error("productInfosById was undefined in the productDetailsState");
    }

    props.productInfo = productInfosById[props.parameter.productId];
    if (!props.productInfo) {
        throw new Error(`There was no productInfoById for the id ${props.parameter.productId}`);
    }
};

export const LoadRealTimePricing: HandlerType = props => {
    const {
        productInfo,
        parameter: { productId },
    } = props;
    if (!productInfo || !productId) {
        return;
    }

    const productPriceParameter = {
        ...productInfo,
        configuration: Object.values(props.configurationSelection).filter(o => !!o) as string[],
    };

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [productPriceParameter],
            onSuccess: realTimePricing => {
                const pricing = realTimePricing.realTimePricingResults!.find(
                    o => o.productId === productInfo.productId,
                );
                if (pricing) {
                    props.dispatch({
                        type: "Pages/ProductDetails/CompleteLoadRealTimePricing",
                        pricing,
                    });
                } else {
                    props.dispatch({
                        type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                        productId,
                    });
                }
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                    productId,
                });
            },
            onComplete(realTimePricingProps) {
                if (realTimePricingProps.apiResult) {
                    this.onSuccess?.(realTimePricingProps.apiResult);
                } else if (realTimePricingProps.error) {
                    this.onError?.(realTimePricingProps.error);
                }
            },
        }),
    );
};

export const LoadRealTimeInventory: HandlerType = props => {
    const {
        parameter: { productId },
    } = props;
    if (!productId) {
        return;
    }

    const configurations: { [productId: string]: string[] } = {};
    const configurationIds = Object.values(props.configurationSelection).filter(o => !!o) as string[];
    configurations[productId] = configurationIds;

    props.dispatch(
        loadRealTimeInventory({
            productIds: [productId],
            configurations,
            onComplete: realTimeInventoryProps => {
                const realTimeInventory = realTimeInventoryProps?.apiResult;
                if (realTimeInventory) {
                    props.dispatch({
                        type: "Pages/ProductDetails/CompleteLoadRealTimeInventory",
                        realTimeInventory,
                    });
                }
            },
        }),
    );
};

export const DispatchUpdateConfigurationSelection: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/UpdateConfigurationSelection",
        configurationSelection: props.configurationSelection,
        configurationCompleted: props.configurationCompleted,
    });
};

export const chain = [
    CopyCurrentValues,
    SetConfigurationSelection,
    SetConfigurationCompleted,
    SetProductInfo,
    LoadRealTimePricing,
    LoadRealTimeInventory,
    DispatchUpdateConfigurationSelection,
];

const updateConfigurationSelection = createHandlerChainRunner(chain, "UpdateConfigurationSelection");
export default updateConfigurationSelection;
