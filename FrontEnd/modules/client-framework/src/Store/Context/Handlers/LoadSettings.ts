import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getSettings, GetSettingsApiParameter, SettingsModel } from "@insite/client-framework/Services/SettingsService";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetSettingsApiParameter, SettingsModel>;

export const DispatchBeginLoadSettings: HandlerType = props => {
    props.dispatch({
        type: "Context/BeginLoadSettings",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {};
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getSettings(props.apiParameter);
};

export const DispatchCompleteLoadSettings: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSettings",
        settings: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadSettings, RequestDataFromApi, DispatchCompleteLoadSettings];

const loadSettings = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadSettings");
export default loadSettings;
