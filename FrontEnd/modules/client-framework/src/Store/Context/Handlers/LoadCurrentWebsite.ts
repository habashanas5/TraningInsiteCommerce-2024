import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import {
    getCurrentWebsite,
    GetCurrentWebsiteApiParameter,
    Website,
} from "@insite/client-framework/Services/WebsiteService";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetCurrentWebsiteApiParameter, Website>;

export const DispatchBeginLoadCurrentWebsite: HandlerType = props => {
    props.dispatch({
        type: "Context/BeginLoadWebsite",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        expand: ["languages", "currencies"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getCurrentWebsite(props.apiParameter);
};

export const DispatchCompleteLoadCurrentWebsite: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadWebsite",
        website: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadCurrentWebsite,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadCurrentWebsite,
];

const loadCurrentWebsite = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentWebsite");
export default loadCurrentWebsite;
