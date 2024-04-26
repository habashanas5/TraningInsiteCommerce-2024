import isApiError from "@insite/client-framework/Common/isApiError";
import caseInsensitiveSort from "@insite/client-framework/Common/Utilities/caseInsensitiveSort";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
    HasOnError,
    HasOnException,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    GetProductCollectionApiV2Parameter,
    getProductCollectionV2,
    GetRelatedProductCollectionApiV2Parameter,
    getRelatedProductsCollectionV2,
} from "@insite/client-framework/Services/ProductServiceV2";
import sortProductCollections from "@insite/client-framework/Store/Data/Products/Handlers/SortProductCollections";
import { ProductCollectionModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import sortBy from "lodash/sortBy";

type Parameter = (GetProductCollectionApiV2Parameter | GetRelatedProductCollectionApiV2Parameter) &
    HasOnSuccess<ProductModel[]> &
    HasOnError<string>;
type Props = {
    apiParameter: GetProductCollectionApiV2Parameter | GetRelatedProductCollectionApiV2Parameter;
    apiResult: ProductCollectionModel;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Data/Products/BeginLoadProducts",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, onError, ...parameter } = props.parameter;
    props.apiParameter = parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        if ("relationship" in props.apiParameter) {
            props.apiResult = await getRelatedProductsCollectionV2(props.apiParameter);
        } else {
            props.apiResult = await getProductCollectionV2(props.apiParameter);
        }
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            props.parameter.onError?.(error.errorJson.message);
            return false;
        }

        throw error;
    }
};

export const SortFacets: HandlerType = ({ apiResult }) => {
    if (!apiResult) {
        return;
    }

    if (apiResult.brandFacets) {
        apiResult.brandFacets = caseInsensitiveSort(apiResult.brandFacets, "name");
    }

    if (apiResult.productLineFacets) {
        apiResult.productLineFacets = caseInsensitiveSort(apiResult.productLineFacets, "name");
    }

    if (apiResult.priceRange?.priceFacets) {
        apiResult.priceRange.priceFacets = sortBy(apiResult.priceRange.priceFacets, o => o.minimumPrice);
    }

    if (apiResult.categoryFacets) {
        apiResult.categoryFacets = caseInsensitiveSort(apiResult.categoryFacets, "shortDescription");
    }

    if (apiResult.attributeTypeFacets) {
        apiResult.attributeTypeFacets = sortBy(
            apiResult.attributeTypeFacets,
            o => o.sortOrder,
            o => o.nameDisplay,
        );
        apiResult.attributeTypeFacets.forEach(a => {
            if (a.attributeValueFacets) {
                a.attributeValueFacets = sortBy(
                    a.attributeValueFacets,
                    o => o.sortOrder,
                    o => o.valueDisplay,
                );
            }
        });
    }
};

export const SortCollections: HandlerType = async props => {
    await executeAwaitableHandlerChain(sortProductCollections, { products: props.apiResult.products! }, props);
};

export const DispatchCompleteLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Data/Products/CompleteLoadProducts",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult.products!);
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadProducts,
    RequestDataFromApi,
    SortFacets,
    SortCollections,
    DispatchCompleteLoadProducts,
    ExecuteOnSuccessCallback,
];

const loadProducts = createHandlerChainRunner(chain, "LoadProducts");
export default loadProducts;
