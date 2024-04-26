import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import {
    ExternalProviderLinkCollectionModel,
    getExternalProviders,
} from "@insite/client-framework/Services/IdentityService";

type HandlerType = HandlerWithResult<{}, ExternalProviderLinkCollectionModel>;

export const RequestDataFromApi: HandlerType = async props => {
    props.result = await getExternalProviders();
};

export const DispatchCompleteLoadExternalProviders: HandlerType = props => {
    props.dispatch({
        type: "Pages/SignIn/CompleteLoadExternalProviders",
        externalProviders: props.result?.externalProviders,
    });
};

export const chain = [RequestDataFromApi, DispatchCompleteLoadExternalProviders];

const loadExternalProviders = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadExternalProviders");
export default loadExternalProviders;
