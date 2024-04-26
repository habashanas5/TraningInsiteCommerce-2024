import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    getAccountShipToCollection,
    GetAccountShipToCollectionApiParameter,
} from "@insite/client-framework/Services/AccountService";
import { AccountShipToCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetAccountShipToCollectionApiParameter, AccountShipToCollectionModel>;

export const DispatchBeginLoadAccountShipToCollection: HandlerType = props => {
    props.dispatch({
        type: "Data/AccountShipTos/BeginLoadAccountShipToCollection",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getAccountShipToCollection(props.apiParameter);
};

export const DispatchCompleteLoadAccountShipToCollection: HandlerType = props => {
    props.dispatch({
        type: "Data/AccountShipTos/CompleteLoadAccountShipToCollection",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadAccountShipToCollection,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadAccountShipToCollection,
];

const loadAccountShipToCollection = createHandlerChainRunner(chain, "loadAccountShipToCollection");
export default loadAccountShipToCollection;
