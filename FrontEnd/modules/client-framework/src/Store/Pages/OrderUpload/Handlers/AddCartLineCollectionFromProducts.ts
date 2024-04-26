import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { AddCartLinesApiParameter, addLineCollection } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartLineCollectionModel, CartLineModel, ProductDto } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        products: ProductDto[];
        onSuccess?: () => void;
    },
    AddCartLinesApiParameter,
    CartLineCollectionModel
>;

export const DispatchBeginAddCartLineCollectionFromProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/BeginAddCartLineCollectionFromProducts",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const cartLineCollection: CartLineModel[] = [];
    props.parameter.products.forEach(product => {
        cartLineCollection.push({
            productId: product.id,
            qtyOrdered: product.qtyOrdered,
            unitOfMeasure: product.selectedUnitOfMeasure,
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

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const DispatchCompleteAddCartLineCollectionFromProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/CompleteAddCartLineCollectionFromProducts",
        result: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginAddCartLineCollectionFromProducts,
    PopulateApiParameter,
    SendDataToApi,
    LoadCart,
    DispatchCompleteAddCartLineCollectionFromProducts,
    ExecuteOnSuccessCallback,
];

const addCartLineCollectionFromProducts = createHandlerChainRunner(chain, "AddCartLineCollectionFromProducts");
export default addCartLineCollectionFromProducts;
