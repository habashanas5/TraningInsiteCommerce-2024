import { createFromProduct, ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import throwErrorIfTesting from "@insite/client-framework/Common/ThrowErrorIfTesting";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { getIsWebCrawler } from "@insite/client-framework/Common/WebCrawler";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
} from "@insite/client-framework/HandlerCreator";
import { getProductByPath } from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { recentlyViewedGetProductCollectionParameter } from "@insite/client-framework/Store/Components/ProductCarousel/Handlers/LoadCarouselProducts";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadProductByPath from "@insite/client-framework/Store/Data/Products/Handlers/LoadProductByPath";
import loadVariantChildren from "@insite/client-framework/Store/Data/Products/Handlers/LoadVariantChildren";
import {
    getProductState,
    getProductStateByPath,
    getVariantChildrenDataView,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import updateVariantSelection from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/UpdateVariantSelection";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = {
    path: string;
    styledOption?: string;
};
type Props = {
    product?: ProductModel;
    productInfosById?: SafeDictionary<ProductInfo>;
    variantChildren?: ProductModel[];
    variantChildrenProductInfos?: ProductInfo[];
    variantSelection?: SafeDictionary<string>;
    pricingLoaded?: true;
    inventoryLoaded?: true;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProduct: HandlerType = props => {
    throwErrorIfTesting();

    props.dispatch({
        type: "Pages/ProductDetails/BeginLoadProduct",
        path: props.parameter.path,
        styledOption: props.parameter.styledOption,
    });
};

export const LoadExistingProduct: HandlerType = props => {
    if (!props.parameter.path) {
        props.dispatch({
            type: "Pages/ProductDetails/CancelLoadProduct",
        });
        return false;
    }

    props.product = getProductStateByPath(props.getState(), props.parameter.path).value;
};

export const LoadProductIfNeeded: HandlerType = async props => {
    // if variantTypeId is not null this has variantTraits, and we need those loaded fully for this handler chain to work correctly
    if (props.product && props.product.variantTypeId === null) {
        if (
            !props.product.detail ||
            !props.product.content ||
            !props.product.images ||
            !props.product.documents ||
            !props.product.specifications ||
            !props.product.attributeTypes ||
            !props.product.variantTraits
        ) {
            // we don't want to wait for this if we already partially have the product, because then we can't show the partially loaded product page
            props.dispatch(
                loadProductByPath({
                    ...props.parameter,
                    addToRecentlyViewed: true,
                    onComplete: productProps => {
                        const configuration = productProps?.apiResult?.detail?.configuration;
                        if (configuration) {
                            props.dispatch({
                                type: "Pages/ProductDetails/InitConfigurationSelection",
                                configuration,
                            });
                        }

                        props.dispatch({
                            type: "Data/Products/ReplaceDataView",
                            parameter: recentlyViewedGetProductCollectionParameter,
                            dataView: {},
                        });
                    },
                }),
            );
        } else {
            getProductByPath({ ...props.parameter, addToRecentlyViewed: true, expand: ["attributes"] }).then(result => {
                props.dispatch({
                    type: "Data/Products/CompleteLoadProduct",
                    model: result,
                });
            });
        }

        return;
    }

    props.product = await executeAwaitableHandlerChain(
        loadProductByPath,
        { ...props.parameter, addToRecentlyViewed: true },
        props,
    );
};

export const RequestVariantChildrenFromApi: HandlerType = async props => {
    if (!props.product?.variantTraits || props.product.variantTraits.length === 0) {
        return;
    }

    props.variantChildren = getVariantChildrenDataView(props.getState(), props.product.id).value;
    if (!props.variantChildren) {
        props.variantChildren = await executeAwaitableHandlerChain(
            loadVariantChildren,
            { productId: props.product.id },
            props,
        );
    }
};

export const SetupVariantSelection: HandlerType = props => {
    props.variantSelection = getVariantSelection(props.product, props.variantChildren, props.parameter.styledOption);
};

function getVariantSelection(product?: ProductModel, variantChildren?: ProductModel[], styledOption?: string) {
    const variantSelection: SafeDictionary<string> = {};
    if (!product?.isVariantParent || !variantChildren) {
        return variantSelection;
    }

    if (styledOption) {
        const variantChild = variantChildren.find(o => o.productNumber.toLowerCase() === styledOption.toLowerCase());
        variantChild?.childTraitValues?.forEach(o => {
            variantSelection[o.styleTraitId] = o.id;
        });

        if (Object.keys(variantSelection).length > 0) {
            return variantSelection;
        }
    }

    product.variantTraits?.forEach(variantTrait => {
        const defaultVariantValue = variantTrait.traitValues?.find(traitValue => traitValue.isDefault);
        variantSelection[variantTrait.id] = defaultVariantValue?.id ?? "";
    });

    return variantSelection;
}

export const SetUnitOfMeasureAndQtyOrdered: HandlerType = props => {
    if (!props.product) {
        return;
    }

    const productInfos = [createFromProduct(props.product)];
    if (props.variantChildren) {
        productInfos.push(...props.variantChildren.map(createFromProduct));
    }

    props.productInfosById = productInfos.reduce((map, productInfo) => {
        map[productInfo.productId] = productInfo;
        return map;
    }, {} as SafeDictionary<ProductInfo>);
};

export const DispatchCompleteLoadProduct: HandlerType = props => {
    if (!props.product) {
        return;
    }

    props.dispatch({
        type: "Pages/ProductDetails/CompleteLoadProduct",
        productInfosById: props.productInfosById ?? {},
        variantSelection: props.variantSelection ?? {},
        selectedProductId: Object.keys(props.variantSelection as any).length ? undefined : props.product.id,
        configuration: props.product.detail?.configuration,
    });
};

export const LoadRealTimePrices: HandlerType = async props => {
    if (!props.product || !props.productInfosById) {
        return;
    }

    const productInfo = props.productInfosById[props.product.id];
    if (!productInfo) {
        return;
    }
    const { productId } = productInfo;

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [productInfo],
            onComplete: pricingProps => {
                if (pricingProps.apiResult) {
                    const pricing = pricingProps.apiResult.realTimePricingResults!.find(o => o.productId === productId);
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
                } else if (pricingProps.error) {
                    props.dispatch({
                        type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                        productId,
                    });
                }

                props.pricingLoaded = true;
            },
        }),
    );

    if (getSettingsCollection(props.getState()).productSettings.inventoryIncludedWithPricing) {
        await waitFor(() => !!props.pricingLoaded);
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    if (!props.product || getIsWebCrawler()) {
        return;
    }

    props.dispatch(
        loadRealTimeInventory({
            productIds: [props.product.id, ...(props.variantChildren?.map(o => o.id) ?? [])],
            onComplete: realTimeInventoryProps => {
                const realTimeInventory = realTimeInventoryProps?.apiResult;

                if (realTimeInventoryProps?.error) {
                    if (props.product) {
                        props.dispatch({
                            type: "Pages/ProductDetails/FailedLoadRealTimeInventory",
                            productId: props.product.id,
                        });
                    }
                } else if (realTimeInventory) {
                    if (realTimeInventory.realTimeInventoryResults && props.variantChildren && props.product) {
                        const discontinued: SafeDictionary<boolean> = {};
                        for (const result of realTimeInventory.realTimeInventoryResults) {
                            if (!result.qtyOnHand) {
                                discontinued[result.productId] = true;
                            }
                        }
                        const initialCount = props.variantChildren.length;
                        props.variantChildren = props.variantChildren.filter(
                            o => !o.isDiscontinued || (o.isDiscontinued && !discontinued[o.id]),
                        );

                        if (initialCount !== props.variantChildren.length) {
                            const variantChildrenDataView = getVariantChildrenDataView(
                                props.getState(),
                                props.product.id,
                            );
                            const { value, ...otherProps } = variantChildrenDataView;
                            props.dispatch({
                                type: "Data/Products/ReplaceDataView",
                                parameter: {
                                    productId: props.product.id,
                                    variantChildren: true,
                                },
                                dataView: {
                                    value: props.variantChildren,
                                    ...otherProps,
                                },
                            });

                            const productInfo = createFromProduct(
                                getProductState(props.getState(), props.product.id).value ?? props.product,
                            );

                            props.dispatch({
                                type: "Pages/ProductDetails/UpdateVariantSelection",
                                variantSelection: getVariantSelection(
                                    props.product,
                                    props.variantChildren,
                                    props.parameter.styledOption,
                                ),
                                variantSelectionCompleted: false,
                                selectedProductInfo: productInfo,
                            });
                        }
                    }

                    props.dispatch({
                        type: "Pages/ProductDetails/CompleteLoadRealTimeInventory",
                        realTimeInventory,
                    });
                }

                props.inventoryLoaded = true;
            },
        }),
    );
};

export const InitVariantProduct: HandlerType = async props => {
    if (!props.product || !props.product.variantTypeId) {
        return;
    }
    const checkData = () => {
        return !!props.pricingLoaded && !!props.inventoryLoaded;
    };

    await waitFor(checkData);

    props.dispatch(updateVariantSelection({ productId: props.product.id }));
};

export const chain = [
    DispatchBeginLoadProduct,
    LoadExistingProduct,
    LoadProductIfNeeded,
    RequestVariantChildrenFromApi,
    SetupVariantSelection,
    SetUnitOfMeasureAndQtyOrdered,
    DispatchCompleteLoadProduct,
    LoadRealTimePrices,
    LoadRealTimeInventory,
    InitVariantProduct,
];

const displayProduct = createHandlerChainRunner(chain, "DisplayProduct");
export default displayProduct;
