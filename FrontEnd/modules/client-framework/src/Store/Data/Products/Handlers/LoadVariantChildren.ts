import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import {
    GetProductVariantChildrenApiV2Parameter,
    getVariantChildren,
} from "@insite/client-framework/Services/ProductServiceV2";
import { ProductCollectionModel, ProductModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = { productId: string } & HasOnSuccess<ProductModel[]>;
type Props = {
    apiParameter: GetProductVariantChildrenApiV2Parameter;
    apiResult: ProductCollectionModel;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Data/Products/BeginLoadProducts",
        parameter: {
            productId: props.parameter.productId,
            variantChildren: true,
        },
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        productId: props.parameter.productId,
        pageSize: 500,
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVariantChildren(props.apiParameter);
};

export const DispatchCompleteLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Data/Products/CompleteLoadProducts",
        collection: props.apiResult,
        parameter: {
            productId: props.parameter.productId,
            variantChildren: true,
        },
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult.products!);
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadProducts,
    RequestDataFromApi,
    DispatchCompleteLoadProducts,
    ExecuteOnSuccessCallback,
];

const loadVariantChildren = createHandlerChainRunner(chain, "LoadVariantChildren");
export default loadVariantChildren;
