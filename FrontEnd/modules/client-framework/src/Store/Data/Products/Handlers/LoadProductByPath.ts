import throwErrorIfTesting from "@insite/client-framework/Common/ThrowErrorIfTesting";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getProductByPath, GetProductByPathApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import sortProductCollections from "@insite/client-framework/Store/Data/Products/Handlers/SortProductCollections";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = {
    path: string;
    addToRecentlyViewed?: boolean;
} & HasOnSuccess<ProductModel>;
type Props = {
    apiParameter: GetProductByPathApiV2Parameter;
    apiResult: ProductModel;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProduct: HandlerType = props => {
    throwErrorIfTesting();

    props.dispatch({
        type: "Data/Products/BeginLoadProduct",
        id: props.parameter.path,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
        expand: ["detail", "specifications", "content", "images", "documents", "attributes", "variantTraits"],
        includeAttributes: ["includeOnProduct"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getProductByPath(props.apiParameter);
};

export const SortCollections: HandlerType = async props => {
    await executeAwaitableHandlerChain(sortProductCollections, { products: [props.apiResult] }, props);
};

export const DispatchCompleteLoadProduct: HandlerType = props => {
    props.dispatch({
        type: "Data/Products/CompleteLoadProduct",
        model: props.apiResult,
        path: props.parameter.path,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    DispatchBeginLoadProduct,
    PopulateApiParameter,
    RequestDataFromApi,
    SortCollections,
    DispatchCompleteLoadProduct,
    ExecuteOnSuccessCallback,
];

const loadProductByPath = createHandlerChainRunner(chain, "LoadProductByPath");
export default loadProductByPath;
