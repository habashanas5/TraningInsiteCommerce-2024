import throwErrorIfTesting from "@insite/client-framework/Common/ThrowErrorIfTesting";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    getProductById,
    GetProductByIdApiV2Parameter,
    GetProductVariantChildApiV2Parameter,
    getVariantChild,
} from "@insite/client-framework/Services/ProductServiceV2";
import sortProductCollections from "@insite/client-framework/Store/Data/Products/Handlers/SortProductCollections";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = GetProductVariantChildApiV2Parameter & HasOnSuccess<ProductModel>;
type Props = {
    apiParameter: GetProductVariantChildApiV2Parameter;
    apiResult: ProductModel;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProduct: HandlerType = props => {
    throwErrorIfTesting();

    props.dispatch({
        type: "Data/Products/BeginLoadProduct",
        id: props.parameter.id,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVariantChild(props.apiParameter);
};

export const SortCollections: HandlerType = async props => {
    await executeAwaitableHandlerChain(sortProductCollections, { products: [props.apiResult] }, props);
};

export const DispatchCompleteLoadProduct: HandlerType = props => {
    props.dispatch({
        type: "Data/Products/CompleteLoadProduct",
        model: props.apiResult,
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

const loadVariantChild = createHandlerChainRunner(chain, "LoadVariantChild");
export default loadVariantChild;
