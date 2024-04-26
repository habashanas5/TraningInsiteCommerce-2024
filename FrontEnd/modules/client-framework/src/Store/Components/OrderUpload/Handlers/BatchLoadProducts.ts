import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    HandlerWithResult,
} from "@insite/client-framework/HandlerCreator";
import { batchGetProducts, BatchGetProductsApiParameter } from "@insite/client-framework/Services/ProductService";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import {
    OrderUploadRowError,
    UploadedItem,
} from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadState";
import { ProductDto, RealTimeInventoryModel } from "@insite/client-framework/Types/ApiModels";

export const enum UploadError {
    None,
    NotEnough,
    ConfigurableProduct,
    StyledProduct,
    Unavailable,
    InvalidUnit,
    NotFound,
    OutOfStock,
}

export interface BatchLoadProductsParameter extends BatchGetProductsApiParameter {
    firstRowHeading: boolean;
    checkInventory: boolean;
}

export interface BatchLoadProductsResult {
    apiParameter: BatchGetProductsApiParameter;
    apiResult: (ProductDto | null)[];
    products: ProductDto[];
    rowErrors: OrderUploadRowError[];
}

type HandlerType = HandlerWithResult<BatchLoadProductsParameter, BatchLoadProductsResult>;

export const DispatchBeginBatchLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/BeginBatchLoadProducts",
    });
};

export const InitializeResult: HandlerType = props => {
    props.result = {
        apiParameter: { extendedNames: [] },
        apiResult: [],
        products: [],
        rowErrors: [],
    };
};

export const PopulateApiParameter: HandlerType = props => {
    props.result.apiParameter.extendedNames = props.parameter.extendedNames;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.result.apiResult = await batchGetProducts(props.result.apiParameter);
};

export const LoadRealTimeInventory: HandlerType = async ({ result: { apiResult }, dispatch, getState }) => {
    const products = apiResult.filter(p => !!p) as ProductDto[];
    if (!products.length) {
        return;
    }

    const realTimeInventory = await executeAwaitableHandlerChain<
        Parameters<typeof loadRealTimeInventory>[0],
        RealTimeInventoryModel
    >(
        loadRealTimeInventory,
        {
            productIds: products.map(o => o.id),
        },
        { dispatch, getState },
    );

    realTimeInventory.realTimeInventoryResults?.forEach(inventory => {
        products
            .filter(p => p.id === inventory.productId)
            .forEach(product => {
                product.qtyOnHand = inventory.qtyOnHand;

                const inventoryAvailability = inventory.inventoryAvailabilityDtos?.find(
                    o => o.unitOfMeasure === product.unitOfMeasure,
                );
                product.availability = inventoryAvailability?.availability || {
                    messageType: 0,
                    message: "",
                    requiresRealTimeInventory: false,
                };

                product.productUnitOfMeasures?.forEach(productUoM => {
                    const inventoryAvailability = inventory.inventoryAvailabilityDtos?.find(
                        o => o.unitOfMeasure === productUoM.unitOfMeasure,
                    );
                    productUoM.availability = inventoryAvailability?.availability || {
                        messageType: 0,
                        message: "",
                        requiresRealTimeInventory: false,
                    };
                });
            });
    });
};

export const ProcessProducts: HandlerType = props => {
    const orderUploadState = props.getState().components.orderUpload;
    const products = props.result.apiResult;
    if (orderUploadState.uploadCancelled) {
        return false;
    }

    for (let i = 0; i < products.length; i++) {
        const item = orderUploadState.uploadedItems[i];
        const index = props.parameter.firstRowHeading ? i + 2 : i + 1;
        const product = products[i];
        if (product) {
            const error = validateProduct(product, props.parameter.checkInventory);
            if (error === UploadError.None) {
                product.qtyOrdered = !item.qtyOrdered ? 1 : item.qtyOrdered;
                const isInvalidUnitOfMeasure = setProductUnitOfMeasure(product, item, index, props.result.rowErrors);
                if (!isInvalidUnitOfMeasure) {
                    addProductToList(product, item, index, props.result, props.parameter.checkInventory);
                }
            } else {
                props.result.rowErrors.push(mapRowError(index, error, item.name, product));
            }
        } else {
            props.result.rowErrors.push(
                mapRowError(index, UploadError.NotFound, item.name, {
                    qtyOrdered: item.qtyOrdered,
                    unitOfMeasureDisplay: item.unitOfMeasure,
                } as ProductDto),
            );
        }
    }
};

const validateProduct = (product: ProductDto, checkInventory: boolean) => {
    if (product.canConfigure || (product.isConfigured && !product.isFixedConfiguration)) {
        return UploadError.ConfigurableProduct;
    }

    if (product.isStyleProductParent) {
        return UploadError.StyledProduct;
    }

    if (checkInventory && product.qtyOnHand === 0 && product.trackInventory && !product.canBackOrder) {
        return UploadError.OutOfStock;
    }

    if (!product.canAddToCart) {
        return UploadError.Unavailable;
    }

    return UploadError.None;
};

const setProductUnitOfMeasure = (
    product: ProductDto,
    item: UploadedItem,
    index: number,
    rowErrors: OrderUploadRowError[],
) => {
    const uoms = getProductUnitOfMeasures(product, item);
    if (uoms.length > 0) {
        const um = uoms[0];
        product.selectedUnitOfMeasure = um.unitOfMeasure;
        product.selectedUnitOfMeasureDisplay = um.unitOfMeasureDisplay;
        product.unitOfMeasure = um.unitOfMeasure;
        product.unitOfMeasureDisplay = um.unitOfMeasureDisplay;

        return false;
    }

    if (item.unitOfMeasure) {
        const errorProduct = mapRowError(index, UploadError.InvalidUnit, item.name, product);
        errorProduct.umRequested = item.unitOfMeasure;
        rowErrors.push(errorProduct);

        return true;
    }

    return false;
};

const addProductToList = (
    product: ProductDto,
    item: UploadedItem,
    index: number,
    result: BatchLoadProductsResult,
    checkInventory: boolean,
) => {
    const baseUnitOfMeasure = getBaseUnitOfMeasure(product);
    const currentUnitOfMeasure = getCurrentUnitOfMeasure(product);
    if (
        checkInventory &&
        product.trackInventory &&
        !product.canBackOrder &&
        !product.quoteRequired &&
        baseUnitOfMeasure &&
        currentUnitOfMeasure &&
        product.qtyOrdered * baseUnitOfMeasure.qtyPerBaseUnitOfMeasure >
            product.qtyOnHand * currentUnitOfMeasure.qtyPerBaseUnitOfMeasure
    ) {
        const rowError = mapRowError(index, UploadError.NotEnough, item.name, product);
        result.rowErrors.push(rowError);
    }

    result.products.push(product);
};

const getBaseUnitOfMeasure = (product: ProductDto) => {
    const defaultUnitOfMeasure = getDefaultProductUnitOfMeasureDto();
    let baseUnitOfMeasure = product.productUnitOfMeasures?.filter(u => u.isDefault)[0];
    if (!baseUnitOfMeasure) {
        baseUnitOfMeasure = defaultUnitOfMeasure;
    }

    return baseUnitOfMeasure;
};

const getCurrentUnitOfMeasure = (product: ProductDto) => {
    const defaultUnitOfMeasure = getDefaultProductUnitOfMeasureDto();
    let currentUnitOfMeasure = product.productUnitOfMeasures?.filter(u => u.unitOfMeasure === product.unitOfMeasure)[0];
    if (!currentUnitOfMeasure) {
        currentUnitOfMeasure = defaultUnitOfMeasure;
    }

    return currentUnitOfMeasure;
};

const getDefaultProductUnitOfMeasureDto = () => {
    return {
        productUnitOfMeasureId: "",
        unitOfMeasure: "",
        unitOfMeasureDisplay: "",
        description: "",
        qtyPerBaseUnitOfMeasure: 1,
        roundingRule: "",
        isDefault: false,
        availability: null,
    };
};

const mapRowError = (index: number, error: UploadError, name: string, product: ProductDto): OrderUploadRowError => {
    return {
        index,
        error,
        name,
        qtyRequested: product.qtyOrdered,
        umRequested: product.unitOfMeasureDisplay,
        qtyOnHand: product.qtyOnHand,
    };
};

const getProductUnitOfMeasures = (product: ProductDto, item: UploadedItem) => {
    const lowerCaseItemUm = item.unitOfMeasure ? item.unitOfMeasure.toLowerCase() : "";

    return lowerCaseItemUm && product.productUnitOfMeasures
        ? product.productUnitOfMeasures.filter(
              u =>
                  u.unitOfMeasure.toLowerCase() === lowerCaseItemUm ||
                  u.unitOfMeasureDisplay.toLowerCase() === lowerCaseItemUm ||
                  u.description.toLowerCase() === lowerCaseItemUm,
          )
        : [];
};

export const DispatchCompleteBatchLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/CompleteBatchLoadProducts",
        result: props.result,
    });
};

export const chain = [
    DispatchBeginBatchLoadProducts,
    InitializeResult,
    PopulateApiParameter,
    RequestDataFromApi,
    LoadRealTimeInventory,
    ProcessProducts,
    DispatchCompleteBatchLoadProducts,
];

const batchLoadProducts = createHandlerChainRunner(chain, "BatchLoadProducts");
export default batchLoadProducts;
