import { createFromProduct, ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";
import {
    getProductState,
    getVariantChildrenDataView,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import cloneDeep from "lodash/cloneDeep";

interface Parameter {
    variantTraitId?: string;
    traitValueId?: string;
}

interface Props {
    variantSelection: SafeDictionary<string>;
    variantSelectionCompleted: boolean;
    selectedProductId?: string;
    productInfo?: ProductInfo;
}

type HandlerType = Handler<Parameter, Props>;

export const CopyCurrentValues: HandlerType = props => {
    const { variantSelection } = getProductSelector(props.getState());
    props.variantSelection = cloneDeep(variantSelection);
};

export const SetVariantSelection: HandlerType = props => {
    if (!props.parameter.variantTraitId) {
        return;
    }

    props.variantSelection[props.parameter.variantTraitId] = props.parameter.traitValueId;
};

export const SetVariantSelectionCompleted: HandlerType = props => {
    const selectedVariantTraitIds = Object.keys(props.variantSelection);
    props.variantSelectionCompleted =
        selectedVariantTraitIds.length > 0 &&
        selectedVariantTraitIds.every(traitValueId => props.variantSelection[traitValueId]);
};

export const SelectVariantProduct: HandlerType = props => {
    const state = props.getState();
    const productState = getProductState(state, getProductSelector(state).variantModalProductId);

    if (!props.variantSelectionCompleted) {
        return;
    }

    const variantChildren = getVariantChildrenDataView(state, productState.value!.id).value!;

    for (const variantChild of variantChildren) {
        let matches = true;
        if (!variantChild.childTraitValues) {
            break;
        }
        for (const childTraitValue of variantChild.childTraitValues) {
            if (props.variantSelection[childTraitValue.styleTraitId] !== childTraitValue.id) {
                matches = false;
                break;
            }
        }

        if (matches) {
            props.selectedProductId = variantChild.id;
            return;
        }
    }
};

export const SetProductInfo: HandlerType = async props => {
    if (!props.selectedProductId) {
        return;
    }

    props.productInfo = createFromProduct(getProductState(props.getState(), props.selectedProductId).value!);

    const promise = new Promise(resolve => {
        const { productInfo } = props;
        props.dispatch(
            loadRealTimePricing({
                productPriceParameters: [productInfo!],
                onSuccess: realTimePricing => {
                    const pricing = realTimePricing.realTimePricingResults!.find(
                        o => o.productId === productInfo!.productId,
                    );
                    if (pricing) {
                        productInfo!.pricing = pricing;
                    } else {
                        productInfo!.failedToLoadPricing = true;
                    }
                    resolve();
                },
                onError: () => {
                    productInfo!.failedToLoadPricing = true;
                    resolve();
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
    });

    await promise;
};

export const DispatchUpdateVariantSelection: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/UpdateVariantSelection",
        variantSelection: props.variantSelection,
        variantSelectionCompleted: props.variantSelectionCompleted,
        productInfo: props.productInfo,
    });
};

export const chain = [
    CopyCurrentValues,
    SetVariantSelection,
    SetVariantSelectionCompleted,
    SelectVariantProduct,
    SetProductInfo,
    DispatchUpdateVariantSelection,
];

const updateVariantSelection = createHandlerChainRunner(chain, "UpdateVariantSelection");
export default updateVariantSelection;
