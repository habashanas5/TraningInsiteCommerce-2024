import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    sendWishListCopy as sendWishListCopyApi,
    SendWishListCopyApiParameter,
} from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type SendWishListCopyParameter = {
    wishList: WishListModel;
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<SendWishListCopyParameter, SendWishListCopyApiParameter, WishListModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { wishList: props.parameter.wishList };
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await sendWishListCopyApi(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback];

const sendWishListCopy = createHandlerChainRunner(chain, "SendWishListCopy");
export default sendWishListCopy;
