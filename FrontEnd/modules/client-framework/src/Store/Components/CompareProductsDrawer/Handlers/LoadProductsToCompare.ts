import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import { MAX_PRODUCTS_TO_COMPARE } from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerSelectors";
import loadProductInfoList from "@insite/client-framework/Store/Components/ProductInfoList/Handlers/LoadProductInfoList";

interface Parameter {
    id: string;
    productIds: string[];
    includeAttributeTypes?: boolean;
}

type HandlerType = ApiHandlerDiscreteParameter<Parameter, GetProductCollectionApiV2Parameter>;

export const SetProductIdsParameter: HandlerType = props => {
    props.apiParameter = {
        productIds: props.parameter.productIds,
        pageSize: MAX_PRODUCTS_TO_COMPARE,
    };
};

export const CheckIncludeAttributeTypesParameter: HandlerType = props => {
    if (props.parameter.includeAttributeTypes) {
        props.apiParameter.expand = ["attributes"];
        props.apiParameter.includeAttributes = ["includeOnProduct"];
    }
};

export const LoadProducts: HandlerType = props => {
    props.dispatch(
        loadProductInfoList({
            id: props.parameter.id,
            getProductCollectionParameter: props.apiParameter,
        }),
    );
};

export const chain = [SetProductIdsParameter, CheckIncludeAttributeTypesParameter, LoadProducts];

const loadProductsToCompare = createHandlerChainRunner(chain, "LoadProductsToCompare");
export default loadProductsToCompare;
