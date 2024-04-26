import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import {
    getTokenExConfig,
    GetTokenExConfigApiParameter,
    TokenExConfig,
} from "@insite/client-framework/Services/SettingsService";

type HandlerType = ApiHandlerDiscreteParameter<
    { token?: string; isECheck?: boolean },
    GetTokenExConfigApiParameter,
    TokenExConfig
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const GetTokenExConfig: HandlerType = async props => {
    props.apiResult = await getTokenExConfig(props.apiParameter);
};

export const DispatchCompleteLoadTokenExConfig: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadTokenExConfig",
        tokenExConfig: props.apiResult,
        token: props.parameter.token,
    });
};

export const chain = [PopulateApiParameter, GetTokenExConfig, DispatchCompleteLoadTokenExConfig];

const loadTokenExConfig = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadTokenExConfig");
export default loadTokenExConfig;
