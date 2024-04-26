import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import loadProductInfoList from "@insite/client-framework/Store/Components/ProductInfoList/Handlers/LoadProductInfoList";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

interface Parameter {
    widgetId: string;
    purchaseType: string;
}

interface Props {
    getProductCollectionParameter?: GetProductCollectionApiV2Parameter;
    products?: ProductModel[];
    productInfos?: ProductInfo[];
}

type HandlerType = Handler<Parameter, Props>;

export const LoadRecentlyPurchased: HandlerType = props => {
    if (props.parameter.purchaseType !== "recently") {
        return;
    }

    props.getProductCollectionParameter = { filter: "recentlyPurchased" };
};

export const LoadFrequentlyPurchased: HandlerType = props => {
    if (props.parameter.purchaseType !== "frequently") {
        return;
    }

    props.getProductCollectionParameter = { filter: "frequentlyPurchased" };
};

export const LoadProducts: HandlerType = props => {
    const {
        getProductCollectionParameter,
        dispatch,
        parameter: { widgetId: id },
    } = props;
    if (!getProductCollectionParameter) {
        return false;
    }

    dispatch(
        loadProductInfoList({
            getProductCollectionParameter,
            id,
        }),
    );
};

export const chain = [LoadRecentlyPurchased, LoadFrequentlyPurchased, LoadProducts];

const loadPurchasedProducts = createHandlerChainRunner(chain, "LoadPurchasedProducts");
export default loadPurchasedProducts;
