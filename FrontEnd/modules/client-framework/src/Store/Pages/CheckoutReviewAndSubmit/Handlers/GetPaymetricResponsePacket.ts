import {
    ApiHandler,
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
} from "@insite/client-framework/HandlerCreator";
import {
    getPaymetricResponsePacket as getPaymetricResponsePacketApi,
    GetPaymetricResponsePacketApiParameter,
    PaymetricResponseApiResult,
} from "@insite/client-framework/Services/CartService";

type HandlerType = ApiHandlerDiscreteParameter<
    GetPaymetricResponsePacketApiParameter & HasOnError<string>,
    GetPaymetricResponsePacketApiParameter,
    PaymetricResponseApiResult
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const GetPaymetricResponsePacket: HandlerType = async props => {
    const result = await getPaymetricResponsePacketApi(props.apiParameter);
    if (!result.success) {
        if (!props.parameter.onError) {
            throw new Error(result.message);
        }

        props.parameter.onError(result.message);
        return false;
    }

    props.apiResult = result;
};

export const chain = [PopulateApiParameter, GetPaymetricResponsePacket];

const getPaymetricResponsePacket = createHandlerChainRunner(chain, "GetPaymetricResponsePacket");
export default getPaymetricResponsePacket;
