import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import {
    createHandlerChainRunner,
    Handler,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { AddCartLinesApiParameter, addLineCollection } from "@insite/client-framework/Services/CartService";
import { CartLineCollectionModel, CartLineModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = {
    productInfos: ProductInfo[];
} & HasOnSuccess<CartLineCollectionModel>;

type Props = {
    apiParameter: AddCartLinesApiParameter;
    apiResult: CartLineCollectionModel;
};

type HandlerType = Handler<Parameter, Props>;

export const PopulateApiParameter: HandlerType = props => {
    const cartLineCollection: CartLineModel[] = [];
    props.parameter.productInfos.forEach(o => {
        cartLineCollection.push({
            productId: o.productId,
            qtyOrdered: o.qtyOrdered,
            unitOfMeasure: o.unitOfMeasure,
        } as CartLineModel);
    });

    cartLineCollection.forEach(line => {
        const parsedQty = line.qtyOrdered ? parseFloat(line.qtyOrdered.toString()) : 1;
        line.qtyOrdered = parsedQty > 0 ? parsedQty : 1;
    });

    props.apiParameter = {
        cartLineCollection: {
            cartLines: cartLineCollection,
        },
        cartId: API_URL_CURRENT_FRAGMENT,
    } as AddCartLinesApiParameter;
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await addLineCollection(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback];

const addCartLines = createHandlerChainRunner(chain, "AddCartLines");
export default addCartLines;
