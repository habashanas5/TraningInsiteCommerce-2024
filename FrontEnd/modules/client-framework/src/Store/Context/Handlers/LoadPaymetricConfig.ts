import {
    ApiHandlerNoParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getPaymetricConfig, PaymetricConfig } from "@insite/client-framework/Services/SettingsService";

type HandlerType = ApiHandlerNoParameter<PaymetricConfig>;

export const GetPaymetricConfig: HandlerType = async props => {
    props.apiResult = await getPaymetricConfig();
};

export const DispatchCompleteLoadPaymetricConfig: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadPaymetricConfig",
        paymetricConfig: props.apiResult,
    });
};

export const chain = [GetPaymetricConfig, DispatchCompleteLoadPaymetricConfig];

const loadPaymetricConfig = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadPaymetricConfig");
export default loadPaymetricConfig;
